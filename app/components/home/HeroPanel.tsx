"use client";

import Image from "next/image";
import Link from "next/link";

export type FeaturedOperator = {
  name: string;
  enName: string;
  slug: string;
  href: string;
  heroImage: string;
};

export default function HeroPanel({
  featured,
}: {
  featured: FeaturedOperator;
}) {
  return (
    <section className="relative h-[340px] w-full overflow-hidden rounded-[24px] border border-yellow-500/15 bg-black">
      <Image
        src={featured.heroImage}
        alt={featured.name}
        fill
        priority
        loading="eager"
        sizes="(max-width: 1024px) 100vw, calc(100vw - 260px)"
        className="object-cover object-[50%_35%]"
      />

      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.88)_0%,rgba(0,0,0,0.62)_35%,rgba(0,0,0,0.18)_70%,transparent_100%)]" />

      <div className="relative z-10 flex h-full flex-col justify-end p-6">
        <div className="max-w-[520px]">
          <p className="text-xs tracking-[0.25em] text-yellow-400/80">
            PICK UP OPERATOR
          </p>

          <h2 className="mt-2 text-4xl font-bold text-white">
            {featured.name}
          </h2>

          <p className="mt-1 text-sm text-zinc-300">{featured.enName}</p>

          <Link
            href={`/operators/${featured.slug}`}
            className="mt-4 inline-block rounded-xl border border-yellow-500/25 bg-yellow-500/10 px-5 py-2 text-sm font-medium text-yellow-300 transition hover:bg-yellow-500/20"
          >
            상세 보기
          </Link>
        </div>
      </div>
    </section>
  );
}