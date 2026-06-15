import type { ButtonHTMLAttributes } from "react";

import { cn } from "./cn";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md";

const variantClass: Record<Variant, string> = {
  primary: "bg-ef-accent text-black hover:brightness-110",
  secondary:
    "border border-ef-line bg-ef-card2 text-ef-ink hover:border-ef-accent/40 hover:text-ef-accent-soft",
  ghost: "text-ef-muted hover:bg-white/5 hover:text-ef-ink",
  danger:
    "border border-ef-danger/30 bg-ef-danger/10 text-ef-danger hover:bg-ef-danger/20",
};

// 기본(md)은 모바일 터치 타깃 44px 보장. sm은 보조/칩 용도.
const sizeClass: Record<Size, string> = {
  sm: "min-h-9 px-3 text-xs",
  md: "min-h-11 px-4 text-sm",
};

type EndfieldButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  block?: boolean;
};

export function EndfieldButton({
  variant = "primary",
  size = "md",
  block = false,
  className,
  type = "button",
  ...props
}: EndfieldButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-black transition disabled:cursor-not-allowed disabled:opacity-50",
        variantClass[variant],
        sizeClass[size],
        block && "w-full",
        className,
      )}
      {...props}
    />
  );
}
