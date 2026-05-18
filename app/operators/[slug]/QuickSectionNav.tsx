"use client";

type SectionLink = {
  href: string;
  label: string;
};

type Props = {
  links: SectionLink[];
};

export default function QuickSectionNav({ links }: Props) {
  function handleMove(href: string) {
    const targetId = href.replace("#", "");
    const target = document.getElementById(targetId);

    document.querySelectorAll("details[id]").forEach((item) => {
      const detail = item as HTMLDetailsElement;
      detail.open = detail.id === targetId;
    });

    window.history.replaceState(null, "", href);

    if (target) {
      setTimeout(() => {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 40);
    }
  }

  return (
    <nav className="sticky top-2 z-30 mb-3 rounded-[18px] border border-yellow-500/15 bg-black/90 p-2 backdrop-blur lg:top-5 lg:mb-5">
      <div className="flex gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {links.map((item) => (
          <button
            key={item.href}
            type="button"
            onClick={() => handleMove(item.href)}
            className="shrink-0 rounded-xl border border-yellow-500/15 bg-[#05070b] px-3 py-2 text-xs font-black text-zinc-300 transition hover:border-yellow-400/40 hover:text-yellow-200 sm:text-sm"
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
}