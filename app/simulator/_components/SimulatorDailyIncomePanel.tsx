"use client";

import Image from "next/image";

export type DailyIncomeItem = {
  name: string;
  icon?: string;
  daily: number;
  lacking?: number;
  days?: number | null;
};

export default function SimulatorDailyIncomePanel({
  items,
  onChangeDaily,
}: {
  items: DailyIncomeItem[];
  onChangeDaily: (name: string, value: number) => void;
}) {
  if (!items.length) {
    return <div className="text-sm text-zinc-500">입력할 재화가 없습니다.</div>;
  }

  return (
    <div className="grid gap-3">
      {items.map((item) => (
        <div key={item.name} className="rounded-2xl border border-yellow-500/10 bg-[#090d14] p-4">
          <div className="flex items-center gap-3">
            <div className="relative h-11 w-11 overflow-hidden rounded-xl bg-black">
              {item.icon ? (
                <Image src={item.icon} alt={item.name} fill className="object-contain p-1" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-zinc-500">?</div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-white">{item.name}</div>
              <div className="mt-1 text-xs text-zinc-500">
                부족 {Math.max(0, Number(item.lacking ?? 0)).toLocaleString()}개
                {item.days === null
                  ? " · 일수 계산 불가"
                  : ` · ${Math.max(0, Number(item.days ?? 0)).toLocaleString()}일`}
              </div>
            </div>

            <input
              type="number"
              min={0}
              value={item.daily}
              onChange={(e) => onChangeDaily(item.name, Number(e.target.value) || 0)}
              className="h-11 w-[140px] rounded-2xl border border-yellow-500/15 bg-black px-4 text-right text-yellow-300 outline-none"
              placeholder="하루 획득량"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
