import type { ReactNode } from "react";

const PRIMARY = "#ff9a2f";
const CUT = {
  clipPath:
    "polygon(0 0, calc(100% - 13px) 0, 100% 13px, 100% 100%, 13px 100%, 0 calc(100% - 13px))",
};

export default function EditorPanel({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border border-ef-line bg-ef-card2 p-3 sm:p-4" style={CUT}>
      <div className="mb-3 flex items-center gap-2 sm:mb-4">
        <span className="h-4 w-1" style={{ background: PRIMARY }} />
        <h2 className="break-keep text-base font-black tracking-tight text-white sm:text-lg">
          {title}
        </h2>
        <span className="ml-2 hidden h-px flex-1 bg-gradient-to-r from-ef-line to-transparent sm:block" />
      </div>
      {children}
    </section>
  );
}
