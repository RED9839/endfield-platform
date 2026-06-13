"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  BatteryCharging,
  Crosshair,
  Package,
  Link2,
  Shield,
  Sparkles,
  Swords,
  X,
  Zap,
} from "lucide-react";

import { getActiveThreePieceSets, getEquippedGears } from "../data/game-gears";
import type {
  BattleEnemy,
  BattleState,
  EnemyStatus,
  PartyMember,
  SkillKind,
} from "../types/game";

const ARTS_ATTACHMENT_STATUSES: EnemyStatus[] = [
  "originium-crystal",
  "electric-attachment",
  "corrosion",
];

const operatorFullArt: Record<string, string> = {
  endministrator: "/operators/endministrator/full1.webp",
  perlica: "/operators/perlica/full.webp",
  chenqianyu: "/operators/chenqianyu/full.webp",
  ardelia: "/operators/ardelia/full.webp",
};

function operatorArt(member: PartyMember) {
  return operatorFullArt[member.id] ?? member.image;
}

function HealthBar({
  value,
  max,
  tone = "ally",
}: {
  value: number;
  max: number;
  tone?: "ally" | "enemy";
}) {
  const width = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="h-2 overflow-hidden rounded-full bg-black/70 ring-1 ring-white/8">
      <div
        className={`h-full rounded-full transition-all ${
          tone === "enemy"
            ? "bg-gradient-to-r from-red-600 to-orange-400"
            : "bg-gradient-to-r from-emerald-400 to-lime-300"
        }`}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

function ActionGauge({ value, enemy = false }: { value: number; enemy?: boolean }) {
  const width = Math.max(0, Math.min(100, value));
  return (
    <div className="h-1.5 overflow-hidden rounded-full bg-black/60">
      <div
        className={enemy ? "h-full bg-red-400" : "h-full bg-cyan-300"}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

function statusLabel(status: EnemyStatus) {
  if (status === "originium-crystal") return "오리지늄 결정";
  if (status === "electric-attachment") return "전기 부착";
  if (status === "corrosion") return "부식";
  if (status === "defense-break") return "방어 불능";
  return "감전";
}

function hasArtsAttachment(enemy: BattleEnemy) {
  return enemy.statuses.some((status) => ARTS_ATTACHMENT_STATUSES.includes(status));
}

function canUseLinkSkill(member: PartyMember, battle: BattleState, target?: BattleEnemy) {
  const linkTarget =
    target ??
    (battle.linkWindow?.targetEnemyId
      ? battle.enemies.find(
          (enemy) => enemy.id === battle.linkWindow?.targetEnemyId && enemy.hp > 0,
        )
      : battle.enemies.find((enemy) => enemy.hp > 0));
  if (!linkTarget) return false;

  if (member.linkCondition === "ally-link-damage") {
    return (
      battle.linkWindow?.trigger === "ally-link-damage" &&
      battle.linkWindow.sourceOperatorId !== member.id
    );
  }
  if (member.linkCondition === "strong-hit") {
    return battle.linkWindow?.trigger === "strong-hit";
  }
  if (member.linkCondition === "defense-break") {
    return linkTarget.statuses.includes("defense-break");
  }
  if (member.linkCondition === "strong-hit-vs-clean") {
    return (
      battle.linkWindow?.trigger === "strong-hit" &&
      !linkTarget.statuses.includes("defense-break") &&
      !hasArtsAttachment(linkTarget)
    );
  }
  return battle.linkWindow?.trigger === "ally-hit";
}

function EnemyUnit({
  enemy,
  selected,
  onSelect,
}: {
  enemy: BattleEnemy;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      disabled={enemy.hp <= 0}
      onClick={onSelect}
      className={`group relative flex h-[310px] min-w-0 flex-col justify-end rounded-[30px] border px-3 pb-4 transition ${
        enemy.hp <= 0
          ? "border-white/5 opacity-25 grayscale"
          : selected
            ? "border-yellow-300/80 bg-yellow-300/[0.06] shadow-[0_0_42px_rgba(250,204,21,0.2)]"
            : "border-transparent hover:border-red-200/35 hover:bg-red-300/[0.035]"
      }`}
    >
      {selected && enemy.hp > 0 && (
        <div className="absolute left-1/2 top-1 z-20 -translate-x-1/2">
          <span className="flex items-center gap-1 rounded-full border border-yellow-200/60 bg-black/80 px-3 py-1 text-[10px] font-black text-yellow-100">
            <Crosshair className="h-3 w-3" /> TARGET
          </span>
          <span className="mx-auto block h-5 w-px bg-yellow-300/70" />
        </div>
      )}

      <div className="absolute inset-x-0 top-4 h-[215px]">
        {enemy.image ? (
          <Image
            src={enemy.image}
            alt=""
            fill
            sizes="260px"
            className={`object-contain drop-shadow-[0_18px_24px_rgba(0,0,0,0.7)] transition ${
              selected ? "scale-110" : "group-hover:scale-105"
            }`}
          />
        ) : (
          <Shield className="mx-auto mt-16 h-20 w-20 text-red-100/20" />
        )}
      </div>

      <div className="relative z-10 rounded-2xl border border-white/10 bg-black/78 p-3 text-left backdrop-blur-md">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-black text-white">{enemy.name}</p>
            <p className="text-[9px] font-black tracking-[0.18em] text-red-200/50">
              {enemy.boss ? "BOSS" : enemy.elite ? "ELITE" : "ENEMY"} · SPD {enemy.speed}
            </p>
          </div>
          <span className="rounded-md bg-red-500/80 px-2 py-1 text-[9px] font-black">
            {enemy.hp}/{enemy.maxHp}
          </span>
        </div>
        <div className="mt-2">
          <HealthBar value={enemy.hp} max={enemy.maxHp} tone="enemy" />
          <div className="mt-1.5">
            <ActionGauge value={enemy.actionGauge} enemy />
          </div>
        </div>
        {enemy.statuses.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {enemy.statuses.map((status) => (
              <span
                key={status}
                className="rounded-full border border-cyan-200/20 bg-cyan-300/10 px-2 py-0.5 text-[8px] font-black text-cyan-100"
              >
                {statusLabel(status)}
              </span>
            ))}
          </div>
        )}
      </div>
    </button>
  );
}

function PartyUnit({
  member,
  active,
  index,
  onSelect,
}: {
  member: PartyMember;
  active: boolean;
  index: number;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`relative h-[350px] min-w-0 transition ${
        member.hp <= 0 ? "opacity-25 grayscale" : active ? "scale-105" : "opacity-80"
      } hover:brightness-110`}
      style={{ transform: `translateY(${index % 2 === 0 ? 8 : -8}px)` }}
    >
      <Image
        src={operatorArt(member)}
        alt=""
        fill
        sizes="240px"
        className="object-contain object-bottom drop-shadow-[0_18px_24px_rgba(0,0,0,0.75)]"
        priority
      />
      {active && (
        <div className="absolute inset-x-4 bottom-1 h-8 rounded-[50%] bg-cyan-300/20 blur-lg" />
      )}
      <div className="absolute inset-x-1 bottom-0 rounded-xl border border-white/10 bg-black/78 px-3 py-2 backdrop-blur-md">
        <div className="mb-1 flex items-center justify-between gap-2">
          <p className="truncate text-xs font-black text-white">{member.name}</p>
          <span className="text-[9px] font-black text-cyan-100/65">SPD {member.speed}</span>
        </div>
        <HealthBar value={member.hp} max={member.maxHp} />
        <div className="mt-1.5">
          <ActionGauge value={member.actionGauge} />
        </div>
      </div>
    </button>
  );
}

function SkillButton({
  label,
  name,
  icon,
  cost,
  tone,
  disabled,
  onClick,
}: {
  label: string;
  name: string;
  icon: string;
  cost: string;
  tone: "normal" | "battle" | "link" | "ultimate";
  disabled: boolean;
  onClick: () => void;
}) {
  const tones = {
    normal: "border-white/20 from-zinc-800 to-zinc-950 text-white",
    battle: "border-cyan-300/35 from-cyan-900 to-slate-950 text-cyan-100",
    link: "border-violet-300/35 from-violet-900 to-slate-950 text-violet-100",
    ultimate: "border-yellow-300/40 from-amber-800 to-zinc-950 text-yellow-100",
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`group relative h-[116px] min-w-0 overflow-hidden rounded-2xl border bg-gradient-to-br p-3 text-left shadow-xl transition hover:-translate-y-2 hover:brightness-125 disabled:translate-y-0 disabled:opacity-25 ${tones[tone]}`}
    >
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/8 blur-2xl" />
      <div className="flex items-start justify-between gap-2">
        <span className="relative h-12 w-12 overflow-hidden rounded-xl border border-white/15 bg-black/40">
          <Image src={icon} alt="" fill sizes="48px" className="object-contain p-1" />
        </span>
        <span className="rounded-full border border-current/20 bg-black/35 px-2 py-1 text-[9px] font-black">
          {cost}
        </span>
      </div>
      <p className="mt-2 text-[9px] font-black tracking-[0.18em] opacity-55">{label}</p>
      <p className="truncate text-sm font-black">{name}</p>
    </button>
  );
}

function OperatorDetail({ member }: { member: PartyMember }) {
  const gears = getEquippedGears(member.gear);
  const sets = getActiveThreePieceSets(member.gear);
  const stats = [
    ["HP", `${member.hp}/${member.maxHp}`],
    ["ATK", member.attack],
    ["DEF", member.defense],
    ["SPD", member.speed],
    ["EVA", `${member.evasion}%`],
    ["ULT", `${member.ultimateCharge}%`],
  ];

  return (
    <>
      <div className="flex items-center gap-4">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-cyan-200/20 bg-black/50">
          <Image src={member.image} alt="" fill sizes="80px" className="object-cover" />
        </div>
        <div className="min-w-0">
          <p className="text-[9px] font-black tracking-[0.24em] text-cyan-200/50">
            OPERATOR DATA
          </p>
          <h3 className="truncate text-2xl font-black text-white">{member.name}</h3>
          <p className="text-xs font-bold text-zinc-500">
            {member.className} · {member.role}
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2">
        {stats.map(([label, value]) => (
          <div key={label} className="rounded-xl border border-white/8 bg-white/[0.04] px-3 py-2">
            <p className="text-[8px] font-black tracking-[0.16em] text-zinc-600">{label}</p>
            <p className="mt-1 text-sm font-black text-zinc-100">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-violet-300/15 bg-violet-300/[0.055] p-4">
        <div className="flex items-center gap-2">
          {member.passiveIcon && (
            <span className="relative h-10 w-10 overflow-hidden rounded-xl bg-black/40">
              <Image src={member.passiveIcon} alt="" fill sizes="40px" className="object-contain" />
            </span>
          )}
          <div>
            <p className="text-[9px] font-black tracking-[0.18em] text-violet-200/50">PASSIVE</p>
            <p className="text-sm font-black text-violet-50">{member.passiveName}</p>
          </div>
        </div>
        <p className="mt-3 text-xs leading-5 text-zinc-400">{member.passiveDescription}</p>
        {member.passiveStacks > 0 && (
          <p className="mt-2 text-[10px] font-black text-violet-200">
            현재 스택 {member.passiveStacks}
          </p>
        )}
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between">
          <p className="text-[9px] font-black tracking-[0.2em] text-zinc-500">EQUIPMENT</p>
          <Package className="h-4 w-4 text-zinc-600" />
        </div>
        <div className="mt-2 grid grid-cols-4 gap-2">
          {[member.gear.armor, member.gear.gloves, member.gear.kit1, member.gear.kit2].map(
            (gear, index) => (
              <div
                key={gear?.slug ?? `empty-${index}`}
                className="relative h-16 overflow-hidden rounded-xl border border-white/8 bg-black/35"
                title={gear?.name ?? "빈 장비 슬롯"}
              >
                {gear ? (
                  <>
                    <Image src={gear.image} alt="" fill sizes="64px" className="object-contain p-2" />
                    <span className="absolute bottom-1 right-1 rounded bg-black/75 px-1 text-[8px] font-black text-yellow-100">
                      Q{gear.quality}
                    </span>
                  </>
                ) : (
                  <span className="flex h-full items-center justify-center text-lg font-black text-zinc-800">-</span>
                )}
              </div>
            ),
          )}
        </div>
        <p className="mt-2 text-[10px] font-bold text-zinc-600">
          장착 {gears.length}/4 {sets.length > 0 ? `· 활성 세트 ${sets.join(", ")}` : ""}
        </p>
      </div>
    </>
  );
}

function EnemyDetail({ enemy }: { enemy: BattleEnemy }) {
  const stats = [
    ["HP", `${enemy.hp}/${enemy.maxHp}`],
    ["ATK", enemy.attack],
    ["DEF", enemy.defense],
    ["SPD", enemy.speed],
    ["RANGE", enemy.range],
    ["WEIGHT", enemy.weight],
  ];

  return (
    <>
      <div className="flex items-center gap-4">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-red-200/20 bg-black/50">
          {enemy.image ? (
            <Image src={enemy.image} alt="" fill sizes="96px" className="object-contain p-1" />
          ) : (
            <Shield className="m-6 h-12 w-12 text-red-100/20" />
          )}
        </div>
        <div className="min-w-0">
          <p className="text-[9px] font-black tracking-[0.24em] text-red-200/50">ENEMY DATA</p>
          <h3 className="truncate text-2xl font-black text-white">{enemy.name}</h3>
          <p className="text-xs font-bold text-zinc-500">
            {enemy.faction ?? "Unknown"} · {enemy.tier ?? "Normal"}
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2">
        {stats.map(([label, value]) => (
          <div key={label} className="rounded-xl border border-white/8 bg-white/[0.04] px-3 py-2">
            <p className="text-[8px] font-black tracking-[0.16em] text-zinc-600">{label}</p>
            <p className="mt-1 text-sm font-black text-zinc-100">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <p className="text-[9px] font-black tracking-[0.2em] text-red-200/50">COMBAT SKILLS</p>
        <div className="mt-2 space-y-2">
          {enemy.traits.length > 0 ? (
            enemy.traits.map((trait, index) => (
              <div key={`${enemy.id}-trait-${index}`} className="rounded-xl border border-red-200/10 bg-red-300/[0.045] p-3">
                <p className="text-[9px] font-black text-red-200/55">SKILL {index + 1}</p>
                <p className="mt-1 text-xs leading-5 text-zinc-300">{trait}</p>
              </div>
            ))
          ) : (
            <p className="rounded-xl border border-white/8 bg-white/[0.035] p-3 text-xs text-zinc-500">
              특수 전투 스킬 없음
            </p>
          )}
        </div>
      </div>

      <div className="mt-4">
        <p className="text-[9px] font-black tracking-[0.2em] text-zinc-500">MECHANICS</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {enemy.mechanics.map((mechanic) => (
            <span
              key={mechanic}
              className="rounded-full border border-red-200/15 bg-red-300/[0.06] px-2.5 py-1 text-[9px] font-black uppercase text-red-100/75"
            >
              {mechanic.replaceAll("-", " ")}
            </span>
          ))}
        </div>
        {enemy.statuses.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {enemy.statuses.map((status) => (
              <span
                key={status}
                className="rounded-full border border-cyan-200/15 bg-cyan-300/[0.06] px-2.5 py-1 text-[9px] font-black text-cyan-100"
              >
                {statusLabel(status)}
              </span>
            ))}
          </div>
        )}
      </div>
    </>
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
  onAction: (operatorId: string, kind: SkillKind, targetEnemyId?: string) => void;
}) {
  const livingEnemies = battle.enemies.filter((enemy) => enemy.hp > 0);
  const [selectedEnemyId, setSelectedEnemyId] = useState(livingEnemies[0]?.id);
  const [detailSelection, setDetailSelection] = useState<
    { side: "party" | "enemy"; id: string } | undefined
  >();
  const activeMember =
    battle.activeSide === "party"
      ? party.find((member) => member.id === battle.activeUnitId)
      : undefined;
  const activeEnemy =
    battle.activeSide === "enemy"
      ? battle.enemies.find((enemy) => enemy.id === battle.activeUnitId)
      : undefined;

  useEffect(() => {
    const timer = window.setInterval(onTick, 250);
    return () => window.clearInterval(timer);
  }, [onTick]);

  useEffect(() => {
    if (!livingEnemies.some((enemy) => enemy.id === selectedEnemyId)) {
      setSelectedEnemyId(livingEnemies[0]?.id);
    }
  }, [livingEnemies, selectedEnemyId]);

  const selectedEnemy =
    battle.enemies.find((enemy) => enemy.id === selectedEnemyId && enemy.hp > 0) ??
    livingEnemies[0];
  const detailMember =
    detailSelection?.side === "party"
      ? party.find((member) => member.id === detailSelection.id)
      : undefined;
  const detailEnemy =
    detailSelection?.side === "enemy"
      ? battle.enemies.find((enemy) => enemy.id === detailSelection.id)
      : undefined;
  const timeline = useMemo(() => battle.timeline.slice(0, 8), [battle.timeline]);
  const canAct = Boolean(activeMember && selectedEnemy);
  const linkReady = activeMember
    ? canUseLinkSkill(activeMember, battle, selectedEnemy)
    : false;

  const act = (kind: SkillKind) => {
    if (!activeMember || !selectedEnemy) return;
    onAction(activeMember.id, kind, selectedEnemy.id);
  };

  return (
    <section className="relative min-h-[calc(100vh-64px)] overflow-hidden bg-[#05080b] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_52%_18%,rgba(56,189,248,0.16),transparent_30%),linear-gradient(180deg,#152833_0%,#0b151c_45%,#040608_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-[44%] bg-[linear-gradient(180deg,transparent,rgba(2,8,12,0.2)),repeating-linear-gradient(90deg,rgba(255,255,255,0.035)_0,rgba(255,255,255,0.035)_1px,transparent_1px,transparent_84px)]" />
      <div className="absolute inset-x-0 bottom-[31%] h-px bg-gradient-to-r from-transparent via-cyan-100/18 to-transparent" />

      <div className="relative mx-auto flex min-h-[calc(100vh-64px)] max-w-[1800px] flex-col px-4 py-4 sm:px-7">
        <header className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-black tracking-[0.38em] text-cyan-100/45">
              FIELD COMBAT
            </p>
            <h1 className="mt-1 text-3xl font-black">교전 {battle.turn}</h1>
            <p className="mt-1 text-xs font-bold text-zinc-400">
              {activeMember
                ? `${activeMember.name} 행동 선택`
                : activeEnemy
                  ? `${activeEnemy.name} 행동 중`
                  : "행동 순서 계산 중"}
            </p>
          </div>
          <div className="flex gap-2">
            <div className="flex items-center gap-2 rounded-xl border border-cyan-300/20 bg-black/45 px-4 py-2">
              <BatteryCharging className="h-4 w-4 text-cyan-300" />
              <span className="text-xs font-black">SP {sp}/{maxSp}</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-violet-300/20 bg-black/45 px-4 py-2">
              <Link2 className="h-4 w-4 text-violet-300" />
              <span className="text-xs font-black">CP {cp}/{maxCp}</span>
            </div>
          </div>
        </header>

        <div className="mt-3 grid flex-1 gap-3 xl:grid-cols-[90px_minmax(0,1fr)]">
          <aside className="hidden rounded-2xl border border-white/8 bg-black/35 p-2 xl:block">
            <p className="mb-3 text-center text-[9px] font-black tracking-[0.2em] text-zinc-500">
              TURN
            </p>
            <div className="space-y-2">
              {timeline.map((entry, index) => (
                <div
                  key={`${entry.side}-${entry.id}-${index}`}
                  className={`relative overflow-hidden rounded-xl border p-1.5 ${
                    index === 0
                      ? entry.side === "enemy"
                        ? "border-red-300/50 bg-red-400/14"
                        : "border-cyan-300/50 bg-cyan-300/14"
                      : "border-white/8 bg-white/[0.035]"
                  }`}
                >
                  <div className="relative mx-auto h-11 w-11 overflow-hidden rounded-lg bg-black/50">
                    {entry.side === "party" ? (
                      <Image
                        src={party.find((member) => member.id === entry.id)?.image ?? party[0].image}
                        alt=""
                        fill
                        sizes="44px"
                        className="object-cover"
                      />
                    ) : (
                      battle.enemies.find((enemy) => enemy.id === entry.id)?.image && (
                        <Image
                          src={battle.enemies.find((enemy) => enemy.id === entry.id)?.image ?? ""}
                          alt=""
                          fill
                          sizes="44px"
                          className="object-contain"
                        />
                      )
                    )}
                  </div>
                  <p className="mt-1 truncate text-center text-[8px] font-black text-white/65">
                    {Math.floor(entry.gauge)}
                  </p>
                </div>
              ))}
            </div>
          </aside>

          <div className="flex min-w-0 flex-col">
            <div className="grid min-h-[430px] flex-1 items-end gap-5 lg:grid-cols-[minmax(360px,0.9fr)_minmax(480px,1.1fr)]">
              <div className="grid grid-cols-4 items-end gap-1">
                {party.map((member, index) => (
                  <PartyUnit
                    key={member.id}
                    member={member}
                    index={index}
                    active={battle.activeSide === "party" && battle.activeUnitId === member.id}
                    onSelect={() => setDetailSelection({ side: "party", id: member.id })}
                  />
                ))}
              </div>

              <div className={`grid items-end gap-3 ${
                battle.enemies.length >= 4 ? "grid-cols-4" : battle.enemies.length === 3 ? "grid-cols-3" : "grid-cols-2"
              }`}>
                {battle.enemies.map((enemy) => (
                  <EnemyUnit
                    key={enemy.id}
                    enemy={enemy}
                    selected={enemy.id === selectedEnemy?.id}
                    onSelect={() => {
                      setSelectedEnemyId(enemy.id);
                      setDetailSelection({ side: "enemy", id: enemy.id });
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="mt-2 grid gap-3 lg:grid-cols-[310px_minmax(0,1fr)_260px]">
              <div className="relative min-h-[150px] overflow-hidden rounded-[26px] border border-cyan-200/15 bg-black/65">
                {activeMember ? (
                  <>
                    <div className="absolute bottom-0 left-0 h-full w-36">
                      <Image
                        src={operatorArt(activeMember)}
                        alt=""
                        fill
                        sizes="144px"
                        className="object-contain object-bottom"
                      />
                    </div>
                    <div className="ml-32 p-4">
                      <p className="text-[9px] font-black tracking-[0.2em] text-cyan-200/50">
                        ACTIVE OPERATOR
                      </p>
                      <p className="mt-1 text-xl font-black">{activeMember.name}</p>
                      <p className="mt-1 text-xs font-bold text-zinc-500">
                        {activeMember.className} · {activeMember.role}
                      </p>
                      <div className="mt-3">
                        <HealthBar value={activeMember.hp} max={activeMember.maxHp} />
                        <p className="mt-1 text-[10px] font-black text-zinc-400">
                          HP {activeMember.hp}/{activeMember.maxHp} · 궁극기 {activeMember.ultimateCharge}%
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex h-full items-center justify-center text-sm font-black text-zinc-500">
                    적 행동 처리 중
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <SkillButton
                  label="기본공격"
                  name={activeMember?.normalAttackName ?? "-"}
                  icon={activeMember?.normalAttackIcon ?? party[0].normalAttackIcon}
                  cost="SP +1"
                  tone="normal"
                  disabled={!canAct}
                  onClick={() => act("attack")}
                />
                <SkillButton
                  label="배틀스킬"
                  name={activeMember?.battleSkillName ?? "-"}
                  icon={activeMember?.battleSkillIcon ?? party[0].battleSkillIcon}
                  cost={`SP ${activeMember?.battleSkillCost ?? 0}`}
                  tone="battle"
                  disabled={!canAct || !activeMember || sp < activeMember.battleSkillCost}
                  onClick={() => act("battle-skill")}
                />
                <SkillButton
                  label="연계스킬"
                  name={activeMember?.linkSkillName ?? "-"}
                  icon={activeMember?.linkSkillIcon ?? party[0].linkSkillIcon}
                  cost={`CP ${activeMember?.linkSkillCost ?? 0}`}
                  tone="link"
                  disabled={
                    !canAct ||
                    !activeMember ||
                    cp < activeMember.linkSkillCost ||
                    !linkReady
                  }
                  onClick={() => act("link-skill")}
                />
                <SkillButton
                  label="궁극기"
                  name={activeMember?.ultimateName ?? "-"}
                  icon={activeMember?.ultimateIcon ?? party[0].ultimateIcon}
                  cost={`${activeMember?.ultimateCharge ?? 0}%`}
                  tone="ultimate"
                  disabled={!canAct || !activeMember || activeMember.ultimateCharge < 100}
                  onClick={() => act("ultimate")}
                />
              </div>

              <div className="rounded-[24px] border border-white/10 bg-black/60 p-4">
                <div className="flex items-center gap-2">
                  <Crosshair className="h-4 w-4 text-yellow-300" />
                  <p className="text-[9px] font-black tracking-[0.2em] text-zinc-500">
                    SELECTED TARGET
                  </p>
                </div>
                <p className="mt-2 truncate text-lg font-black text-white">
                  {selectedEnemy?.name ?? "대상 없음"}
                </p>
                <p className="mt-1 text-[10px] font-bold text-red-200/50">
                  적을 클릭해서 공격 대상을 변경
                </p>
                {selectedEnemy && (
                  <div className="mt-3">
                    <HealthBar
                      value={selectedEnemy.hp}
                      max={selectedEnemy.maxHp}
                      tone="enemy"
                    />
                    <div className="mt-2 flex items-center justify-between text-[10px] font-black text-zinc-400">
                      <span>HP {selectedEnemy.hp}/{selectedEnemy.maxHp}</span>
                      <span className="flex items-center gap-1">
                        <Zap className="h-3 w-3" /> {selectedEnemy.speed}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-3 flex min-h-10 items-center gap-3 overflow-hidden rounded-xl border border-white/8 bg-black/48 px-4">
              <Sparkles className="h-4 w-4 shrink-0 text-yellow-300/60" />
              <p className="truncate text-xs font-bold text-zinc-400">
                {battle.log[0] ?? "전투가 시작되었습니다."}
              </p>
              <Swords className="ml-auto h-4 w-4 shrink-0 text-white/20" />
            </div>
          </div>
        </div>
      </div>

      {(detailMember || detailEnemy) && (
        <aside className="absolute bottom-24 right-4 z-50 max-h-[72vh] w-[min(430px,calc(100vw-32px))] overflow-y-auto rounded-[28px] border border-white/12 bg-[#080b0f]/96 p-5 shadow-[0_28px_90px_rgba(0,0,0,0.65)] backdrop-blur-xl sm:right-7">
          <button
            type="button"
            onClick={() => setDetailSelection(undefined)}
            className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/45 text-zinc-400 transition hover:text-white"
            aria-label="상세 정보 닫기"
          >
            <X className="h-4 w-4" />
          </button>
          {detailMember ? <OperatorDetail member={detailMember} /> : detailEnemy ? <EnemyDetail enemy={detailEnemy} /> : null}
        </aside>
      )}

      <div className="absolute bottom-4 right-4 z-50 flex items-center gap-2 rounded-2xl border border-white/12 bg-black/80 p-2 shadow-[0_16px_50px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:right-7">
        {party.map((member) => {
          const active = battle.activeSide === "party" && battle.activeUnitId === member.id;
          const selected =
            detailSelection?.side === "party" && detailSelection.id === member.id;
          return (
            <button
              key={member.id}
              type="button"
              onClick={() => setDetailSelection({ side: "party", id: member.id })}
              className={`relative h-12 w-12 overflow-hidden rounded-xl border transition hover:-translate-y-1 ${
                selected
                  ? "border-yellow-300 shadow-[0_0_18px_rgba(250,204,21,0.35)]"
                  : active
                    ? "border-cyan-300 shadow-[0_0_18px_rgba(103,232,249,0.28)]"
                    : "border-white/12"
              } ${member.hp <= 0 ? "grayscale opacity-35" : ""}`}
              title={`${member.name} 상세 정보`}
            >
              <Image src={member.image} alt="" fill sizes="48px" className="object-cover" />
              <span
                className="absolute inset-x-0 bottom-0 bg-emerald-400/90"
                style={{
                  height: `${Math.max(0, member.hp / member.maxHp) * 4}px`,
                }}
              />
              {active && (
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_8px_#67e8f9]" />
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
