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
