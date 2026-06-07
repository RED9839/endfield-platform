import type { ReactNode } from "react";

export default function EditorPanel({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[18px] border border-yellow-500/15 bg-[#070a0f] p-3 shadow-[0_0_24px_rgba(250,204,21,0.025)] sm:rounded-[20px] sm:p-4">
      <h2 className="mb-3 text-base font-black text-[#ffdc70] sm:mb-4 sm:text-lg">
        {title}
      </h2>
      {children}
    </section>
  );
}
