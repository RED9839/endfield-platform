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

function getOperatorFull(operator: OperatorLike | null) {
  if (!operator) return "/operators/lastrite/full.webp";
  if (operator.fullImage) return operator.fullImage;
  return `/operators/${operator.slug}/full.webp`;
}

export default function OperatorHighlightPanel({
  operator,
  title,
  description,
  href,
}: OperatorHighlightPanelProps) {
  if (!operator) {
    return (
      <section className="relative overflow-hidden rounded-[22px] border border-yellow-500/12 bg-[#05070b] p-5">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(250,204,21,0.03),transparent_20%)]" />

        <div className="relative mb-4 border-b border-yellow-500/12 pb-3">
          <p className="text-[11px] tracking-[0.28em] text-yellow-400/65">
            OPERATOR
          </p>
          <h2 className="mt-1 text-base font-semibold tracking-wide text-white">
            {title}
          </h2>
        </div>

        <div className="relative rounded-[18px] border border-yellow-500/12 bg-[#090d14] p-5 text-sm text-zinc-400">
          표시할 추천 오퍼레이터가 없습니다.
        </div>
      </section>
    );
  }

  const avatarSrc = getOperatorAvatar(operator);
  const fullSrc = getOperatorFull(operator);
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
    <section className="relative overflow-hidden rounded-[22px] border border-yellow-500/12 bg-[#05070b] p-5">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(250,204,21,0.03),transparent_20%)]" />

      <div className="relative mb-4 border-b border-yellow-500/12 pb-3">
        <p className="text-[11px] tracking-[0.28em] text-yellow-400/65">
          OPERATOR
        </p>
        <h2 className="mt-1 text-base font-semibold tracking-wide text-white">
          {title}
        </h2>
      </div>

      <div className="relative overflow-hidden rounded-[20px] border border-yellow-500/12 bg-[#090d14]">
        <div className="absolute inset-0">
          <Image
            src={fullSrc}
            alt={operator.name}
            fill
            sizes="(max-width: 1280px) 100vw, 70vw"
            className="object-cover object-center opacity-25"
          />
        </div>

        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.82)_0%,rgba(0,0,0,0.60)_40%,rgba(0,0,0,0.28)_100%)]" />

        <div className="relative z-10 flex flex-col gap-5 p-5 md:flex-row md:items-center md:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-yellow-500/15 bg-black">
              <Image
                src={avatarSrc}
                alt={operator.name}
                fill
                sizes="96px"
                className="object-cover object-center"
              />
            </div>

            <div className="min-w-0">
              <p className="truncate text-2xl font-bold text-white">
                {operator.name}
              </p>

              <p className="mt-1 truncate text-sm uppercase tracking-[0.18em] text-zinc-300">
                {operator.enName ?? operator.slug}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {rarityLabel ? (
                  <span className="rounded-full border border-yellow-500/20 bg-yellow-500/10 px-2.5 py-1 text-xs font-medium text-yellow-300">
                    {rarityLabel}
                  </span>
                ) : null}

                {classLabel ? (
                  <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-zinc-200">
                    {classLabel}
                  </span>
                ) : null}

                {elementLabel ? (
                  <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-zinc-200">
                    {elementLabel}
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          <div className="max-w-xl">
            <p className="text-sm leading-7 text-zinc-200/80">{description}</p>

            <div className="mt-4">
              <Link
                href={`${href}/${operator.slug}`.replace(/\/{2,}/g, "/")}
                className="inline-flex rounded-xl border border-yellow-500/35 bg-yellow-500/12 px-5 py-3 text-sm font-semibold text-yellow-200 transition hover:border-yellow-400/50 hover:bg-yellow-500/20 hover:text-white"
              >
                상세 보기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
