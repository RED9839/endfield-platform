import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

type RateLimitStore = Map<string, RateLimitEntry>;

const globalForRateLimit = globalThis as typeof globalThis & {
  operatorSettingsRateLimits?: RateLimitStore;
  operatorSettingsRateLimitLastPrune?: number;
};

const store =
  globalForRateLimit.operatorSettingsRateLimits ??
  new Map<string, RateLimitEntry>();

globalForRateLimit.operatorSettingsRateLimits = store;

const PRUNE_INTERVAL_MS = 60_000;

function pruneExpiredEntries(now: number) {
  const lastPrune = globalForRateLimit.operatorSettingsRateLimitLastPrune ?? 0;
  if (now - lastPrune < PRUNE_INTERVAL_MS) return;

  globalForRateLimit.operatorSettingsRateLimitLastPrune = now;

  for (const [key, entry] of store) {
    if (entry.resetAt <= now) {
      store.delete(key);
    }
  }
}

export function getRequestIdentifier(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const firstForwardedAddress = forwardedFor?.split(",")[0]?.trim();

  return (
    firstForwardedAddress ||
    request.headers.get("x-real-ip")?.trim() ||
    "unknown"
  );
}

export function consumeRateLimit({
  scope,
  identifier,
  limit,
  windowMs,
  now = Date.now(),
}: {
  scope: string;
  identifier: string;
  limit: number;
  windowMs: number;
  now?: number;
}) {
  pruneExpiredEntries(now);

  const key = `${scope}:${identifier}`;
  const current = store.get(key);

  if (!current || current.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: Math.max(0, limit - 1), retryAfter: 0 };
  }

  if (current.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }

  current.count += 1;
  return {
    allowed: true,
    remaining: Math.max(0, limit - current.count),
    retryAfter: 0,
  };
}

// --- 공유 저장소(Redis) 기반 분산 레이트리밋 ---
// 여러 인스턴스로 수평 확장돼도 카운터가 공유되도록 Upstash Redis를 사용한다.
// UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN 가 모두 설정돼 있으면 Redis를,
// 없으면(로컬·테스트·단일 인스턴스) 위의 인메모리 구현으로 폴백한다.

type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfter: number;
};

const globalForRedis = globalThis as typeof globalThis & {
  upstashRedis?: Redis;
  upstashLimiters?: Map<string, Ratelimit>;
};

function getRedis(): Redis | null {
  if (
    !process.env.UPSTASH_REDIS_REST_URL ||
    !process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    return null;
  }

  globalForRedis.upstashRedis ??= Redis.fromEnv();
  return globalForRedis.upstashRedis;
}

// limit/windowMs 조합마다 Ratelimit 인스턴스를 재사용한다.
function getRedisLimiter(limit: number, windowMs: number): Ratelimit | null {
  const redis = getRedis();
  if (!redis) return null;

  const limiters = (globalForRedis.upstashLimiters ??= new Map());
  const seconds = Math.max(1, Math.round(windowMs / 1000));
  const key = `${limit}:${seconds}`;

  const existing = limiters.get(key);
  if (existing) return existing;

  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(limit, `${seconds} s` as `${number} s`),
    prefix: "rl",
    analytics: false,
  });

  limiters.set(key, limiter);
  return limiter;
}

export async function enforceRateLimit(options: {
  scope: string;
  identifier: string;
  limit: number;
  windowMs: number;
}): Promise<RateLimitResult> {
  const limiter = getRedisLimiter(options.limit, options.windowMs);

  // Redis 미구성 → 기존 인메모리 구현으로 폴백.
  if (!limiter) {
    return consumeRateLimit(options);
  }

  try {
    const { success, remaining, reset } = await limiter.limit(
      `${options.scope}:${options.identifier}`,
    );

    return {
      allowed: success,
      remaining: Math.max(0, remaining),
      retryAfter: success
        ? 0
        : Math.max(1, Math.ceil((reset - Date.now()) / 1000)),
    };
  } catch {
    // Redis 장애 시 요청을 막지 않도록 인메모리로 폴백한다.
    return consumeRateLimit(options);
  }
}
