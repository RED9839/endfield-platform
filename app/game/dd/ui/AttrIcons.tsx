import { ATTR_ICON, ATTR_KO, ATTR_ORDER } from "../gear";

// 장비 능력치를 인게임처럼 아이콘 + 수치로 표시. 힘·민첩·지능·의지(원작순), 값 0은 생략.
// 표시할 능력치가 없으면 fallback(문자열) 또는 null.
export function AttrIcons({ attrs, size = 14, fallback }: { attrs?: Partial<Record<string, number>>; size?: number; fallback?: string }) {
  const items = attrs ? ATTR_ORDER.filter((k) => (attrs[k] ?? 0) > 0) : [];
  if (!items.length) return fallback ? <>{fallback}</> : null;
  return (
    <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-0.5 align-middle">
      {items.map((k) => (
        <span key={k} className="inline-flex items-center gap-0.5 whitespace-nowrap" title={ATTR_KO[k]}>
          <img src={ATTR_ICON[k]} alt={ATTR_KO[k]} className="inline-block shrink-0 object-contain opacity-90" style={{ width: size, height: size }} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
          <b className="text-ef-ink/80">+{Math.round(attrs![k]!)}</b>
        </span>
      ))}
    </span>
  );
}
