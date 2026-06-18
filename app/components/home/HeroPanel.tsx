import Image from "next/image";
import Link from "next/link";

export type FeaturedOperator = {
  name: string;
  enName: string;
  slug: string;
  href: string;
  heroImage: string;
};

const HERO_PANEL_SIZES =
  "(max-width: 640px) calc(100vw - 24px), (max-width: 1024px) calc(100vw - 32px), (max-width: 1536px) 62vw, 980px";

const PRIMARY = "#ff9a2f";
const CUT = {
  clipPath:
    "polygon(0 0, calc(100% - 13px) 0, 100% 13px, 100% 100%, 13px 100%, 0 calc(100% - 13px))",
};
const CUT_SM = {
  clipPath:
    "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
};

export default function HeroPanel({
  featured,
}: {
  featured: FeaturedOperator;
}) {
  return (
    <section className="relative h-full min-h-0 w-full overflow-hidden border border-ef-line bg-black" style={CUT}>
      <span className="absolute inset-x-0 top-0 z-20 block h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${PRIMARY}, transparent 55%)` }} />
      <Image
        src={featured.heroImage}
        alt={featured.name}
        fill
        priority
        quality={70}
        sizes={HERO_PANEL_SIZES}
        className="object-cover object-[50%_35%]"
      />

      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.88)_0%,rgba(0,0,0,0.62)_35%,rgba(0,0,0,0.18)_70%,transparent_100%)]" />

      <div className="relative z-10 flex h-full flex-col justify-end p-6">
        <div className="max-w-[520px]">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-ef-muted">
            픽업 오퍼레이터
          </p>

          <h2 className="mt-2 text-4xl font-black text-white">
            {featured.name}
          </h2>

          <p className="mt-1 text-sm text-ef-muted">{featured.enName}</p>

          <Link
            href={featured.href}
            className="mt-4 inline-block border border-ef-line bg-ef-card px-5 py-2 text-sm font-bold text-ef-muted transition hover:border-ef-accent/40 hover:text-ef-accent-soft"
            style={CUT_SM}
          >
            상세 보기
          </Link>
        </div>
      </div>
    </section>
  );
}
