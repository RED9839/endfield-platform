import { useEffect } from "react";
import Image from "next/image";
import { BatteryCharging, Link2, Shield } from "lucide-react";

import type {
  BattleState,
  EnemyStatus,
  PartyMember,
  SkillKind,
} from "../types/game";

function HealthBar({ value, max }: { value: number; max: number }) {
  const width = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="h-1.5 overflow-hidden rounded-full bg-black/70">
      <div
        className="h-full rounded-full bg-gradient-to-r from-red-600 to-orange-400 transition-all"
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

function GaugeBar({ value }: { value: number }) {
  const width = Math.max(0, Math.min(100, value));
  return (
    <div className="h-1 overflow-hidden rounded-full bg-black/70">
      <div
        className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-violet-400 transition-all"
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

function statusLabel(status: EnemyStatus) {
  if (status === "originium-crystal") return "오리지늄 결정";
  if (status === "electric-attachment") return "전기 부착";
  if (status === "corrosion") return "부식";
  return "감전";
}

function ActionIcon({ src }: { src: string }) {
  return (
    <span className="relative h-5 w-5 overflow-hidden rounded bg-black/30">
      <Image src={src} alt="" fill sizes="20px" className="object-contain" />
    </span>
  );
}

export default function BattleScreen({
  party,
  battle,
  sp,
  maxSp,
  cp,
  maxCp,
  onTick,
  onAction,
}: {
  party: PartyMember[];
  battle: BattleState;
  sp: number;
  maxSp: number;
  cp: number;
  maxCp: number;
  onTick: () => void;
  onAction: (operatorId: string, kind: SkillKind) => void;
}) {
  const activePartyMember =
    battle.activeSide === "party"
      ? party.find((member) => member.id === battle.activeUnitId)
      : undefined;
  const activeEnemy =
    battle.activeSide === "enemy"
      ? battle.enemies.find((enemy) => enemy.id === battle.activeUnitId)
      : undefined;
  const activeName = activePartyMember?.name ?? activeEnemy?.name ?? "계산 중";

  useEffect(() => {
    const timer = window.setInterval(onTick, 250);

    return () => window.clearInterval(timer);
  }, [onTick]);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-black tracking-[0.3em] text-red-300/70">
            COMBAT PHASE
          </p>
          <h1 className="mt-1 text-2xl font-black text-white">
            교전 {battle.turn}
          </h1>
          <p className="mt-1 text-xs font-bold text-cyan-100/70">
            현재 행동: {activeName}
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-2 rounded-xl border border-cyan-300/20 bg-cyan-300/[0.06] px-4 py-2 text-cyan-100">
            <BatteryCharging className="h-4 w-4" />
            <span className="text-xs font-black">SP {sp} / {maxSp}</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-violet-300/20 bg-violet-300/[0.06] px-4 py-2 text-violet-100">
            <Link2 className="h-4 w-4" />
            <span className="text-xs font-black">CP {cp} / {maxCp}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
        <div className="overflow-hidden rounded-[26px] border border-white/10 bg-[radial-gradient(circle_at_50%_20%,#182129_0%,#080b0f_48%,#030405_100%)] p-4 sm:p-6">
          <div className="grid min-h-[240px] grid-cols-2 items-end gap-3 sm:grid-cols-4">
            {battle.enemies.map((enemy) => (
              <article
                key={enemy.id}
                className={`relative overflow-hidden rounded-2xl border p-4 ${
                  enemy.hp > 0
                    ? enemy.boss
                      ? "border-orange-400/40 bg-orange-950/20"
                      : "border-red-400/20 bg-red-950/10"
                    : "border-white/5 bg-black/20 opacity-30"
                }`}
              >
                <div className="relative flex h-24 items-center justify-center">
                  {enemy.image ? (
                    <Image
                      src={enemy.image}
                      alt=""
                      fill
                      sizes="160px"
                      className="object-contain drop-shadow-[0_10px_24px_rgba(248,113,113,0.25)]"
                    />
                  ) : (
                    <Shield className="h-16 w-16 text-red-200/20" />
                  )}
                </div>
                <p className="truncate text-sm font-black text-white">{enemy.name}</p>
                <p className="mt-1 text-[10px] text-red-200/60">{enemy.intent}</p>
                {enemy.statuses.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {enemy.statuses.map((status) => (
                      <span
                        key={status}
                        className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-2 py-0.5 text-[9px] font-black text-cyan-100"
                      >
                        {statusLabel(status)}
                      </span>
                    ))}
                  </div>
                )}
                <div className="mt-3">
                  <HealthBar value={enemy.hp} max={enemy.maxHp} />
                  <p className="mt-1 text-right text-[10px] font-bold text-zinc-400">
                    {enemy.hp} / {enemy.maxHp}
                  </p>
                  <div className="mt-2">
                    <GaugeBar value={enemy.actionGauge} />
                    <p className="mt-1 text-right text-[9px] text-cyan-100/40">
                      SPD {enemy.speed} · {Math.floor(enemy.actionGauge)}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="my-5 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {party.map((member) => (
              (() => {
                const isActive = battle.activeSide === "party" && battle.activeUnitId === member.id;
                const disabled = !isActive || member.hp <= 0;
                return (
              <article
                key={member.id}
                className={`overflow-hidden rounded-2xl border bg-black/40 ${
                  isActive ? "border-cyan-300/50 shadow-[0_0_24px_rgba(103,232,249,0.12)]" : "border-white/10"
                } ${
                  member.hp <= 0 ? "pointer-events-none grayscale opacity-35" : ""
                }`}
              >
                <div className="flex items-center gap-3 p-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-zinc-900">
                    <Image
                      src={member.image}
                      alt=""
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-black text-white">{member.name}</p>
                    <p className="text-[10px] font-bold text-yellow-200/60">
                      {member.className} · {member.role}
                    </p>
                    <div className="mt-2">
                      <HealthBar value={member.hp} max={member.maxHp} />
                      <p className="mt-1 text-[9px] text-zinc-500">
                        HP {member.hp}/{member.maxHp}
                        {member.shield > 0 ? ` · 보호 ${member.shield}` : ""}
                      </p>
                      <div className="mt-2">
                        <GaugeBar value={member.actionGauge} />
                        <p className="mt-1 text-[9px] text-cyan-100/40">
                          SPD {member.speed} · {Math.floor(member.actionGauge)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="px-3 pb-3 text-[10px] leading-4 text-zinc-500">
                  {member.battleSkillDescription}
                  <br />
                  궁극기 {member.ultimateCharge}%
                </p>
                <div className="grid grid-cols-4 border-t border-white/8">
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => onAction(member.id, "attack")}
                    className="flex flex-col items-center gap-1 px-1 py-3 text-[9px] font-bold text-zinc-300 transition hover:bg-white/5 hover:text-white"
                  >
                    <ActionIcon src={member.normalAttackIcon} />
                    기본공격
                    <span className="text-[8px] text-zinc-500">SP +1</span>
                  </button>
                  <button
                    type="button"
                    disabled={disabled || sp < member.battleSkillCost}
                    title={member.battleSkillDescription}
                    onClick={() => onAction(member.id, "battle-skill")}
                    className="flex flex-col items-center gap-1 border-x border-white/8 px-1 py-3 text-[9px] font-bold text-cyan-200 transition hover:bg-cyan-300/10 disabled:opacity-25"
                  >
                    <ActionIcon src={member.battleSkillIcon} />
                    배틀스킬
                    <span className="text-[8px] text-cyan-200/50">SP {member.battleSkillCost}</span>
                  </button>
                  <button
                    type="button"
                    disabled={disabled || cp < member.linkSkillCost}
                    title={member.linkSkillDescription}
                    onClick={() => onAction(member.id, "link-skill")}
                    className="flex flex-col items-center gap-1 border-r border-white/8 px-1 py-3 text-[9px] font-bold text-violet-200 transition hover:bg-violet-300/10 disabled:opacity-25"
                  >
                    <ActionIcon src={member.linkSkillIcon} />
                    연계스킬
                    <span className="text-[8px] text-violet-200/50">CP {member.linkSkillCost}</span>
                  </button>
                  <button
                    type="button"
                    disabled={disabled || member.ultimateCharge < 100}
                    title={member.ultimateDescription}
                    onClick={() => onAction(member.id, "ultimate")}
                    className="flex flex-col items-center gap-1 px-1 py-3 text-[9px] font-bold text-yellow-200 transition hover:bg-yellow-300/10 disabled:opacity-25"
                  >
                    <ActionIcon src={member.ultimateIcon} />
                    궁극기
                    <span className="text-[8px] text-yellow-200/50">{member.ultimateCharge}%</span>
                  </button>
                </div>
              </article>
                );
              })()
            ))}
          </div>
        </div>

        <aside className="rounded-[22px] border border-white/10 bg-[#080b0f] p-4">
          <p className="text-[10px] font-black tracking-[0.24em] text-zinc-500">
            NEXT
          </p>
          <div className="mt-4 space-y-2">
            {battle.timeline.map((entry, index) => (
              <div
                key={`${entry.side}-${entry.id}-${index}`}
                className={`flex items-center justify-between rounded-xl border px-3 py-2 text-xs ${
                  index === 0
                    ? "border-cyan-300/25 bg-cyan-300/10 text-cyan-50"
                    : "border-white/8 bg-white/[0.03] text-zinc-400"
                }`}
              >
                <span className="truncate font-black">{entry.name}</span>
                <span className="ml-3 text-[10px] font-bold">
                  {entry.side === "party" ? "아군" : "적"} {Math.floor(entry.gauge)}
                </span>
              </div>
            ))}
          </div>
          <div className="my-5 h-px bg-white/10" />
          <p className="text-[10px] font-black tracking-[0.24em] text-zinc-500">
            BATTLE LOG
          </p>
          <div className="mt-4 space-y-3">
            {battle.log.map((entry, index) => (
              <p
                key={`${entry}-${index}`}
                className={`border-l pl-3 text-xs leading-5 ${
                  index === 0 ? "border-yellow-300 text-zinc-200" : "border-white/10 text-zinc-500"
                }`}
              >
                {entry}
              </p>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
