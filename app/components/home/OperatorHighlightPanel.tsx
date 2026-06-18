import Image from "next/image";
import Link from "next/link";

type OperatorLike = {
  slug: string;
  name: string;
  enName?: string;
  avatar?: string;
  fullImage?: string;
  rarity?: number;
  class?: string;
  element?: string;
};

export type OperatorHighlightPanelProps = {
  operator: OperatorLike | null;
  title: string;
  description: string;
  href: string;
};

const PRIMARY = "#ff9a2f";
const ACCENT = "#ffd24a";
const CUT = {
  clipPath:
    "polygon(0 0, calc(100% - 13px) 0, 100% 13px, 100% 100%, 13px 100%, 0 calc(100% - 13px))",
};
const CUT_SM = {
  clipPath:
    "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
};

const rarityLabelMap: Record<number, string> = {
  6: "6★",
  5: "5★",
  4: "4★",
};

const classLabelMap: Record<string, string> = {
  striker: "스트라이커",
  guard: "가드",
  defender: "디펜더",
  caster: "캐스터",
  supporter: "서포터",
  vanguard: "뱅가드",
};

const elementLabelMap: Record<string, string> = {
  heat: "열기",
  cryo: "냉기",
  electric: "전기",
  nature: "자연",
  physical: "물리",
};

function getOperatorAvatar(operator: OperatorLike | null) {
  if (!operator) return "/operators/lastrite/avatar.webp";
  if (operator.avatar) return operator.avatar;
  return `/operators/${operator.slug}/avatar.webp`;
}

export default function OperatorHighlightPanel({
  operator,
  title,
  description,
  href,
}: OperatorHighlightPanelProps) {
  if (!operator) {
    return (
      <section className="relative overflow-hidden border border-ef-line bg-ef-card2 p-5" style={CUT}>
        <span className="absolute inset-x-0 top-0 block h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${PRIMARY}, transparent 55%)` }} />

        <div className="relative mb-4 flex items-center gap-2 border-b border-ef-line pb-3">
          <span className="h-7 w-1" style={{ background: PRIMARY }} />
          <div>
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.28em] text-ef-muted">
              OPERATOR
            </p>
            <h2 className="mt-1 text-base font-black tracking-tight text-white">
              {title}
            </h2>
          </div>
        </div>

        <div className="relative border border-ef-line bg-ef-card p-5 text-sm text-ef-muted" style={CUT_SM}>
          표시할 추천 오퍼레이터가 없습니다.
        </div>
      </section>
    );
  }

  const avatarSrc = getOperatorAvatar(operator);
  const rarityLabel = operator.rarity
    ? (rarityLabelMap[operator.rarity] ?? `${operator.rarity}★`)
    : null;
  const classLabel = operator.class
    ? (classLabelMap[operator.class] ?? operator.class)
    : null;
  const elementLabel = operator.element
    ? (elementLabelMap[operator.element] ?? operator.element)
    : null;

  return (
    <section
      className="relative overflow-hidden border border-ef-line bg-ef-card2 p-5"
      style={{
        ...CUT,
        contentVisibility: "auto",
        containIntrinsicSize: "420px",
      }}
    >
      <span className="absolute inset-x-0 top-0 block h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${PRIMARY}, transparent 55%)` }} />

      <div className="relative mb-4 flex items-center gap-2 border-b border-ef-line pb-3">
        <span className="h-7 w-1" style={{ background: PRIMARY }} />
        <div>
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.28em] text-ef-muted">
            OPERATOR
          </p>
          <h2 className="mt-1 text-base font-black tracking-tight text-white">
            {title}
          </h2>
        </div>
      </div>

      <div className="relative overflow-hidden border border-ef-line bg-ef-card" style={CUT}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_50%,rgba(250,204,21,0.12),transparent_32%),linear-gradient(90deg,rgba(0,0,0,0.82)_0%,rgba(0,0,0,0.60)_40%,rgba(0,0,0,0.28)_100%)]" />

        <div className="relative z-10 flex flex-col gap-5 p-5 md:flex-row md:items-center md:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden border border-ef-line bg-black" style={CUT_SM}>
              <Image
                src={avatarSrc}
                alt={operator.name}
                fill
                quality={70}
                sizes="96px"
                className="object-cover object-center"
              />
            </div>

            <div className="min-w-0">
              <p className="truncate text-2xl font-black text-white">
                {operator.name}
              </p>

              <p className="mt-1 truncate font-mono text-sm uppercase tracking-[0.18em] text-ef-muted">
                {operator.enName ?? operator.slug}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {rarityLabel ? (
                  <span className="border px-2.5 py-1 font-mono text-xs font-bold uppercase tracking-wide" style={{ ...CUT_SM, borderColor: `${PRIMARY}66`, background: `${PRIMARY}1a`, color: PRIMARY }}>
                    {rarityLabel}
                  </span>
                ) : null}

                {classLabel ? (
                  <span className="border border-ef-line bg-ef-card2 px-2.5 py-1 font-mono text-xs font-bold uppercase tracking-wide text-ef-muted" style={CUT_SM}>
                    {classLabel}
                  </span>
                ) : null}

                {elementLabel ? (
                  <span className="border border-ef-line bg-ef-card2 px-2.5 py-1 font-mono text-xs font-bold uppercase tracking-wide text-ef-muted" style={CUT_SM}>
                    {elementLabel}
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          <div className="max-w-xl">
            <p className="text-sm leading-7 text-ef-muted">{description}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href={`${href}/${operator.slug}`.replace(/\/{2,}/g, "/")}
                className="inline-flex px-5 py-3 text-sm font-black text-black transition hover:brightness-110"
                style={{ ...CUT_SM, background: ACCENT }}
              >
                상세 보기
              </Link>
              <Link
                href={`/settings?operators=${encodeURIComponent(operator.slug)}`}
                className="inline-flex border border-ef-line bg-ef-card px-5 py-3 text-sm font-bold text-ef-muted transition hover:border-ef-accent/40 hover:text-ef-accent-soft"
                style={CUT_SM}
              >
                추천 세팅 보기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
