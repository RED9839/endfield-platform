import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import ArtsAttachmentStackIcon from "@/app/components/combat/ArtsAttachmentStackIcon";
import PhysicalDefenseBreakStackIcon from "@/app/components/combat/PhysicalDefenseBreakStackIcon";
import { resolveCycleStates } from "@/lib/combat/cycle-state";
import { operatorDetails } from "@/data/operators-detail-data";
import { weaponDetails } from "@/data/weapons-detail-data";
import DeleteOperatorSettingButton from "@/app/components/settings/DeleteOperatorSettingButton";
import OperatorSettingLikeButton from "@/app/components/settings/OperatorSettingLikeButton";
import ReadonlySettingEditor from "@/app/components/settings/ReadonlySettingEditor";

type SlotKey = "main" | "member1" | "member2" | "member3";

type SlotSetting = {
  operatorSlug?: string;
  form?: any;
};

const SLOT_ORDER: SlotKey[] = ["main", "member1", "member2", "member3"];

const slotLabelMap: Record<SlotKey, string> = {
  main: "메인",
  member1: "파티원 1",
  member2: "파티원 2",
  member3: "파티원 3",
};

function normalizeSlot(slot: any): SlotSetting | null {
  const operatorSlug = String(
    slot?.operatorSlug ?? slot?.form?.operatorSlug ?? "",
  ).trim();
  const form = slot?.form ?? null;

  if (!operatorSlug || !form) return null;

  return {
    operatorSlug,
    form: {
      ...form,
      operatorSlug,
    },
  };
}

function normalizeSlots(value: unknown): Record<SlotKey, SlotSetting | null> {
  const slots = (value ?? {}) as Record<string, any>;

  const hasNewPartySlots =
    Boolean(
      slots.member1?.operatorSlug ||
        slots.member1?.form?.operatorSlug ||
        slots.menber1?.operatorSlug ||
        slots.menber1?.form?.operatorSlug,
    ) ||
    Boolean(
      slots.member2?.operatorSlug ||
        slots.member2?.form?.operatorSlug ||
        slots.menber2?.operatorSlug ||
        slots.menber2?.form?.operatorSlug,
    ) ||
    Boolean(
      slots.member3?.operatorSlug ||
        slots.member3?.form?.operatorSlug ||
        slots.menber3?.operatorSlug ||
        slots.menber3?.form?.operatorSlug,
    );

  if (hasNewPartySlots) {
    return {
      main: normalizeSlot(slots.main),
      member1: normalizeSlot(slots.member1 ?? slots.menber1),
      member2: normalizeSlot(slots.member2 ?? slots.menber2),
      member3: normalizeSlot(slots.member3 ?? slots.menber3),
    };
  }

  return {
    main: normalizeSlot(slots.main),
    member1: normalizeSlot(slots.member2 ?? slots.menber2),
    member2: normalizeSlot(slots.member3 ?? slots.menber3),
    member3: normalizeSlot(slots.member4 ?? slots.menber4),
  };
}

function isSlotKey(value: unknown): value is SlotKey {
  return (
    value === "main" ||
    value === "member1" ||
    value === "member2" ||
    value === "member3"
  );
}

function getOperator(slug?: string) {
  if (!slug) return null;
  return operatorDetails.find((operator: any) => operator.slug === slug) as any;
}

function getWeapon(slug?: string) {
  if (!slug) return null;
  return weaponDetails.find((weapon: any) => weapon.slug === slug) as any;
}

function getOperatorImage(operator: any) {
  return (
    operator?.avatar ??
    operator?.image ??
    `/operators/${operator?.slug}/avatar.webp`
  );
}

function getWeaponImage(weapon: any) {
  return weapon?.image ?? weapon?.avatar ?? `/weapons/${weapon?.slug}/avatar.webp`;
}

function getElementIcon(operator: any) {
  const element = operator?.element ?? operator?.elementKey ?? operator?.attribute;
  return element ? `/icons/elements/${element}.webp` : "";
}

async function getCurrentUserId() {
  const session = await auth();

  if (!session?.user?.id) return null;

  const sessionUserId = String(session.user.id).trim();
  const sessionEmail = session.user.email?.trim().toLowerCase();

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { id: sessionUserId },
        ...(sessionEmail
          ? [{ email: { equals: sessionEmail, mode: "insensitive" as const } }]
          : []),
      ],
    },
    select: { id: true },
  });

  return user?.id ?? sessionUserId;
}

export default async function OperatorSettingDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ slot?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const currentUserId = await getCurrentUserId();

  const found = await prisma.userOperatorSetting.findUnique({
    where: { id },
  });

  if (!found) notFound();

  const isPartySlotSwitch = Boolean(query?.slot);

  const setting = isPartySlotSwitch
    ? found
    : await prisma.userOperatorSetting.update({
        where: { id },
        data: {
          viewCount: {
            increment: 1,
          },
        },
      });

  const slots = normalizeSlots(setting.slots);
  const cycle = Array.isArray((setting as any).cycle) ? (setting as any).cycle : [];

  const registeredSlots = SLOT_ORDER.map(
    (slotKey) => [slotKey, slots[slotKey]] as [SlotKey, SlotSetting | null],
  ).filter(([, slot]) => Boolean(slot?.operatorSlug && slot?.form));

  const fallbackSlotKey = registeredSlots[0]?.[0] ?? "main";

  const selectedSlotKey =
    isSlotKey(query?.slot) && slots[query.slot]?.operatorSlug && slots[query.slot]?.form
      ? query.slot
      : fallbackSlotKey;

  const selectedSlot = slots[selectedSlotKey];

  if (!selectedSlot?.form) {
    return (
      <main className="min-h-screen bg-[var(--background)] px-3 py-3 text-white sm:px-4 md:px-6 md:py-5">
        <div className="panel mx-auto max-w-[1840px] rounded-[20px] p-6 text-center text-sm font-bold text-zinc-500 sm:rounded-[24px] sm:p-10">
          등록된 세팅 정보가 없습니다.
        </div>
      </main>
    );
  }

  const isOwner = Boolean(
    currentUserId &&
      setting.userId &&
      String(currentUserId).trim() === String(setting.userId).trim(),
  );

  const liked = currentUserId
    ? Boolean(
        await prisma.userOperatorSettingLike.findUnique({
          where: {
            userId_settingId: {
              userId: currentUserId,
              settingId: setting.id,
            },
          },
          select: { id: true },
        }),
      )
    : false;

  const partyForms = registeredSlots
    .filter(([slotKey]) => slotKey !== selectedSlotKey)
    .map(([, slot]) => slot?.form)
    .filter(Boolean)
    .filter((form, index, forms) => {
      const slug = String(form?.operatorSlug ?? "");
      return (
        Boolean(slug) &&
        forms.findIndex((item) => String(item?.operatorSlug ?? "") === slug) === index
      );
    });

  return (
    <main className="min-h-screen bg-[var(--background)] px-3 py-3 text-white sm:px-4 md:px-6 md:py-5">
      <div className="mx-auto max-w-[1840px]">
        <header className="panel mb-3 rounded-[20px] p-4 sm:mb-5 sm:rounded-[24px]">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
            <div className="min-w-0">
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className={[
                    "inline-flex h-7 w-[50px] shrink-0 items-center justify-center rounded-lg border text-[11px] font-black sm:w-[54px] sm:text-xs",
                    setting.type === "solo"
                      ? "border-yellow-300/40 bg-yellow-300/15 text-yellow-200"
                      : "border-sky-300/40 bg-sky-300/15 text-sky-200",
                  ].join(" ")}
                >
                  {setting.type === "solo" ? "솔로" : "파티"}
                </span>

                <h1 className="min-w-0 truncate text-xl font-black tracking-tight text-[var(--yellow-text)] sm:text-3xl md:text-4xl">
                  {setting.title}
                </h1>
              </div>

              <p className="mt-2 line-clamp-2 max-w-5xl text-xs font-semibold leading-5 text-zinc-200 sm:text-sm sm:leading-6 lg:pl-[62px]">
                {setting.description || "등록된 설명이 없습니다."}
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px] font-black sm:gap-2 sm:text-xs lg:pl-[62px]">
                <span className="max-w-full truncate text-white">
                  {setting.nickname || "닉네임 없음"}
                </span>
                <span className="text-zinc-600">|</span>
                <span className="text-[var(--yellow-text)]">
                  추천수 {Number(setting.likeCount ?? 0).toLocaleString()}
                </span>
                <span className="text-zinc-600">|</span>
                <span className="text-[var(--yellow-text)]">
                  조회수 {Number(setting.viewCount ?? 0).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap justify-end gap-2 lg:min-w-[220px]">
              {isOwner ? (
                <>
                  <Link
                    href={`/settings/party?edit=${setting.id}`}
                    className="inline-flex h-9 min-w-[56px] items-center justify-center rounded-xl border border-[var(--yellow-border-soft)] bg-black px-3 text-xs font-black text-zinc-200 transition hover:bg-[var(--card-bg-hover)] hover:text-[var(--yellow-text)] sm:h-10 sm:min-w-[64px] sm:px-4 sm:text-sm"
                  >
                    수정
                  </Link>

                  <div className="[&_button]:inline-flex [&_button]:h-9 [&_button]:min-w-[56px] [&_button]:items-center [&_button]:justify-center [&_button]:rounded-xl [&_button]:px-3 [&_button]:py-0 [&_button]:text-xs sm:[&_button]:h-10 sm:[&_button]:min-w-[64px] sm:[&_button]:px-4 sm:[&_button]:text-sm">
                    <DeleteOperatorSettingButton id={setting.id} />
                  </div>
                </>
              ) : null}

              <OperatorSettingLikeButton
                settingId={setting.id}
                initialLiked={liked}
                initialLikeCount={Number(setting.likeCount ?? 0)}
              />

              <Link
                href="/settings"
                className="inline-flex h-9 min-w-[56px] items-center justify-center rounded-xl border border-[var(--yellow-border-soft)] bg-black px-3 text-xs font-black text-zinc-200 transition hover:bg-[var(--card-bg-hover)] hover:text-[var(--yellow-text)] sm:h-10 sm:min-w-[64px] sm:px-4 sm:text-sm"
              >
                목록
              </Link>
            </div>
          </div>
        </header>

        <nav className="sticky top-2 z-30 mb-3 rounded-[18px] border border-yellow-500/15 bg-black/90 p-2 backdrop-blur lg:hidden">
          <div className="flex gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {registeredSlots.length > 1 ? (
              <a
                href="#party"
                className="shrink-0 rounded-xl border border-yellow-500/15 bg-[#05070b] px-3 py-2 text-xs font-black text-zinc-300 transition hover:border-yellow-400/40 hover:text-yellow-200"
              >
                파티원
              </a>
            ) : null}

            {cycle.length > 0 ? (
              <a
                href="#cycle"
                className="shrink-0 rounded-xl border border-yellow-500/15 bg-[#05070b] px-3 py-2 text-xs font-black text-zinc-300 transition hover:border-yellow-400/40 hover:text-yellow-200"
              >
                사이클
              </a>
            ) : null}

            <a
              href="#operator-panel"
              className="shrink-0 rounded-xl border border-yellow-500/15 bg-[#05070b] px-3 py-2 text-xs font-black text-zinc-300 transition hover:border-yellow-400/40 hover:text-yellow-200"
            >
              오퍼레이터
            </a>

            <a
              href="#weapon-panel"
              className="shrink-0 rounded-xl border border-yellow-500/15 bg-[#05070b] px-3 py-2 text-xs font-black text-zinc-300 transition hover:border-yellow-400/40 hover:text-yellow-200"
            >
              무기
            </a>

            <a
              href="#gear-panel"
              className="shrink-0 rounded-xl border border-yellow-500/15 bg-[#05070b] px-3 py-2 text-xs font-black text-zinc-300 transition hover:border-yellow-400/40 hover:text-yellow-200"
            >
              장비
            </a>

            <a
              href="#final-stat-panel"
              className="shrink-0 rounded-xl border border-yellow-500/15 bg-[#05070b] px-3 py-2 text-xs font-black text-zinc-300 transition hover:border-yellow-400/40 hover:text-yellow-200"
            >
              최종 스탯
            </a>
          </div>
        </nav>

        {registeredSlots.length > 1 ? (
          <PartyMemberPanel
            settingId={setting.id}
            selectedSlotKey={selectedSlotKey}
            registeredSlots={registeredSlots}
          />
        ) : null}

        {cycle.length > 0 ? <CycleViewPanel cycle={cycle} /> : null}

        <section id="setting-detail" className="relative scroll-mt-24">
          <style>
            {`
              html {
                scroll-behavior: smooth;
              }

              .readonly-setting-editor nav {
                display: none !important;
              }

              .readonly-setting-editor #operator-panel,
              .readonly-setting-editor #weapon-panel,
              .readonly-setting-editor #gear-panel,
              .readonly-setting-editor #final-stat-panel {
                scroll-margin-top: 96px;
              }
            `}
          </style>

          <ReadonlySettingEditor
            key={`${setting.id}-${selectedSlotKey}-${selectedSlot.form.operatorSlug}`}
            form={selectedSlot.form}
            partyForms={partyForms}
          />
        </section>
      </div>
    </main>
  );
}

function PartyMemberPanel({
  settingId,
  selectedSlotKey,
  registeredSlots,
}: {
  settingId: string;
  selectedSlotKey: SlotKey;
  registeredSlots: [SlotKey, SlotSetting | null][];
}) {
  return (
    <section id="party" className="panel mb-3 scroll-mt-24 rounded-[18px] p-2.5 sm:p-3">
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {registeredSlots.map(([slotKey, slot]) => {
          const operator = getOperator(slot?.operatorSlug);
          const weapon = getWeapon(slot?.form?.weaponSlug);
          const active = slotKey === selectedSlotKey;

          if (!operator) return null;

          return (
            <Link
              key={slotKey}
              href={`/settings/${settingId}?slot=${slotKey}`}
              className={[
                "group grid min-h-[66px] grid-cols-[48px_minmax(0,1fr)_48px] items-center gap-2 overflow-hidden rounded-[14px] border bg-black/55 p-2 transition sm:min-h-[70px] sm:grid-cols-[52px_minmax(0,1fr)_52px]",
                active
                  ? "border-yellow-400/60 shadow-[0_0_18px_rgba(255,210,74,0.16)]"
                  : "border-white/10 hover:border-yellow-400/35 hover:bg-black/75",
              ].join(" ")}
            >
              <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-black sm:h-[52px] sm:w-[52px]">
                <Image
                  src={getOperatorImage(operator)}
                  alt={operator.name}
                  fill
                  sizes="52px"
                  className="object-cover object-top transition group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                {getElementIcon(operator) ? (
                  <Image
                    src={getElementIcon(operator)}
                    alt="속성"
                    width={18}
                    height={18}
                    className="absolute left-1 top-1 object-contain"
                  />
                ) : null}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span
                    className={[
                      "rounded-md border px-1.5 py-0.5 text-[10px] font-black",
                      active
                        ? "border-yellow-300/40 bg-yellow-300/15 text-yellow-200"
                        : "border-white/15 bg-white/5 text-zinc-300",
                    ].join(" ")}
                  >
                    {slotLabelMap[slotKey]}
                  </span>

                  {active ? (
                    <span className="rounded-md border border-yellow-300/30 bg-yellow-300/10 px-1.5 py-0.5 text-[10px] font-black text-yellow-200">
                      선택중
                    </span>
                  ) : null}
                </div>

                <h3 className="mt-1 truncate text-sm font-black text-white">
                  {operator.name}
                </h3>
                <p className="truncate text-[11px] font-bold text-zinc-500">
                  {operator.enName}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center justify-self-end overflow-hidden rounded-xl border border-white/10 bg-black sm:h-[52px] sm:w-[52px]">
                {weapon ? (
                  <Image
                    src={getWeaponImage(weapon)}
                    alt={weapon.name}
                    width={46}
                    height={46}
                    className="object-contain p-1"
                  />
                ) : (
                  <span className="text-[10px] font-black text-zinc-600">무기</span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function CycleViewPanel({ cycle }: { cycle: any[] }) {
  if (!cycle.length) return null;

  return (
    <section id="cycle" className="panel mb-3 scroll-mt-24 rounded-[18px] p-3 sm:p-4">
      <h2 className="mb-3 text-lg font-black text-[var(--yellow-text)] sm:mb-4 sm:text-xl">
        운용 사이클
      </h2>

      <div className="flex max-w-full flex-wrap items-center gap-2 overflow-hidden sm:gap-3">
        {resolveCycleStates(cycle).map(({ step, artsState, physicalState }, index: number) => (
          <div key={step.id ?? index} className="flex min-w-0 items-center gap-2">
            <CycleViewIcon
              step={step}
              artsState={artsState}
              physicalState={physicalState}
            />

            {index < cycle.length - 1 ? (
              <span className="text-sm font-black text-yellow-300 sm:text-base">
                →
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

function CycleViewIcon({
  step,
  artsState,
  physicalState,
}: {
  step: any;
  artsState: { element: any; stacks: number } | null;
  physicalState: { defenseBreakStacks: number } | null;
}) {
  const skillIcon =
    typeof step?.skillIcon === "string" && step.skillIcon.trim()
      ? step.skillIcon
      : "/icons/placeholder.webp";

  const operatorIcon =
    typeof step?.operatorIcon === "string" && step.operatorIcon.trim()
      ? step.operatorIcon
      : "/operators/rossi/avatar.webp";

  const element = String(step?.element ?? "physical");

  const skillVariant = step?.skillVariant ?? step?.variant ?? "normal";
  const skillKey = step?.skillKey ?? step?.type ?? "";

  const skillLabel =
    skillVariant === "charged"
      ? "강공"
      : skillVariant === "plunge"
        ? "낙공"
        : skillKey === "battleSkill"
          ? "배틀"
          : skillKey === "comboSkill"
            ? "연계"
            : skillKey === "ultimate"
              ? "궁극기"
              : step?.skillLabel ?? "";

  return (
    <span
      className="flex shrink-0 items-center gap-1.5"
      title={`${step?.operatorName ?? "오퍼레이터"} - ${step?.skillName ?? "스킬"}`}
    >
      <span
        className={`relative flex h-[86px] w-[72px] flex-col items-center justify-start overflow-hidden rounded-xl border-2 bg-black pb-1 sm:h-[94px] sm:w-20 ${getElementBorderClass(
        element,
      )}`}
      >
        <span className="relative block h-[60px] w-full sm:h-[68px]">
          <Image
            src={skillIcon}
            alt={step?.skillName ?? "스킬"}
            fill
            sizes="(min-width: 640px) 80px, 72px"
            className="object-contain p-2"
          />
        </span>

        {skillLabel ? (
          <span
            className={[
              "z-20 max-w-[calc(100%-0.5rem)] truncate rounded px-1 py-0.5 text-[9px] font-black shadow-[0_0_8px_rgba(0,0,0,0.65)] sm:text-[10px]",
              getElementLabelClass(element),
            ].join(" ")}
          >
            {skillLabel}
          </span>
        ) : null}

        <span className="absolute bottom-1 right-1 z-20 h-6 w-6 overflow-hidden rounded-full border border-black bg-black sm:h-7 sm:w-7">
          <Image
            src={operatorIcon}
            alt={step?.operatorName ?? "오퍼레이터"}
            fill
            sizes="(min-width: 640px) 28px, 24px"
            className="object-cover"
          />
        </span>
      </span>

      <span className="flex flex-col items-center gap-0.5">
      {artsState ? (
        <ArtsAttachmentStackIcon
          element={artsState.element}
          stacks={artsState.stacks}
          size="sm"
        />
      ) : null}
      {physicalState ? (
        <PhysicalDefenseBreakStackIcon
          stacks={physicalState.defenseBreakStacks}
          size="sm"
        />
      ) : null}
      </span>
    </span>
  );
}

function getElementLabelClass(element: string) {
  switch (element) {
    case "heat":
      return "bg-red-500/90 text-white";
    case "electric":
      return "bg-yellow-400/90 text-black";
    case "cryo":
      return "bg-cyan-500/90 text-white";
    case "nature":
      return "bg-green-500/90 text-white";
    case "physical":
    default:
      return "bg-zinc-500/90 text-white";
  }
}

function getElementBorderClass(element: string) {
  switch (element) {
    case "heat":
      return "border-red-400/80";
    case "electric":
      return "border-yellow-300/80";
    case "cryo":
      return "border-cyan-300/80";
    case "nature":
      return "border-green-400/80";
    case "physical":
    default:
      return "border-zinc-300/70";
  }
}
