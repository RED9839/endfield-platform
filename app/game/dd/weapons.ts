// 오퍼레이터 시그니처 무기(엔드필드식) — 실제 무기 타입(위키 헤더 실측) + 6★ 공격력 + 타입 고유효과.
// 개별 무기 수치/패시브는 소스 미공개 → 타입은 실데이터, 효과는 위키 타입 역할(양손검=불균형↑·아츠유닛=아츠·권총=아츠반응·한손검=근접치명·장병기=스킬) 기반 모델.
import type { DDUnit } from "./combat";
import { attrResists, ATTR_AVG, setTimer } from "./combat";
import { weaponSummaries } from "@/data/weapons-summary-data";

export type WeaponType = "sword" | "greatsword" | "polearm" | "handcannon" | "artsunit";
export const WEAPON_KO: Record<WeaponType, string> = { sword: "한손검", greatsword: "양손검", polearm: "장병기", handcannon: "권총", artsunit: "아츠 유닛" };
export const WEAPON_ICON: Record<WeaponType, string> = { sword: "🗡", greatsword: "⚔", polearm: "🔱", handcannon: "🔫", artsunit: "🔮" };
export const WEAPON_EFFECT_KO: Record<WeaponType, string> = {
  sword: "치명 확률 +8%",
  greatsword: "불균형 누적 +25%",
  polearm: "배틀 스킬 피해 +15%",
  handcannon: "전 피해 +10%",
  artsunit: "원소 피해 +12%",
};

// 오퍼별 실제 무기 타입(operator-wikis 헤더 실측)
export const OP_WEAPON: Record<string, WeaponType> = {
  akekuri: "sword", alesh: "sword", arclight: "sword", chenqianyu: "sword", endministrator: "sword", laevatain: "sword", pogranichnik: "sword", rossi: "sword",
  catcher: "greatsword", dapan: "greatsword", ember: "greatsword", lastrite: "greatsword", mifu: "greatsword", snowshine: "greatsword",
  avywenna: "polearm", camu: "polearm", estella: "polearm", lifeng: "polearm",
  fluorite: "handcannon", tangtang: "handcannon", wulfgard: "handcannon", yvonne: "handcannon",
  antal: "artsunit", ardelia: "artsunit", gilberta: "artsunit", perlica: "artsunit", xaihi: "artsunit", zhuangfangyi: "artsunit",
};

// 오퍼별 실제 전무(전용무기) — 커뮤니티 빌드 시트 기준(각 오퍼 첫 추천무기 = 전무, 딜/서폿 분리는 2개).
// code = 주,부옵(지=지능·힘·민=민첩·의=의지·주=주스탯 / 공=공격력·궁=궁극·치=치명·생=생명·열/냉/전/아/물=피해 등).
export type Jeonmu = { name: string; code: string; role?: string };
export const OP_JEONMU: Record<string, Jeonmu[]> = {
  laevatain: [{ name: "용조의 불꽃", code: "지공어" }],
  ember: [{ name: "모범", code: "주공억", role: "딜" }, { name: "과거의 일품", code: "의생효", role: "폿" }],
  wulfgard: [{ name: "클래니벌", code: "주아고" }],
  akekuri: [{ name: "테르밋 커터", code: "의공흐" }],
  camu: [{ name: "붉게 물든 가호", code: "민열흐" }],
  yvonne: [{ name: "예술의 폭군", code: "지치골" }],
  lastrite: [{ name: "헤라펜거", code: "힘공방" }],
  tangtang: [{ name: "반항", code: "민공방" }],
  snowshine: [{ name: "과거의 일품", code: "의생효" }],
  xaihi: [{ name: "기사도 정신", code: "의생의" }],
  alesh: [{ name: "테르밋 커터", code: "의공흐" }],
  estella: [{ name: "O.B.J. 스파이크", code: "의물고" }],
  zhuangfangyi: [{ name: "고독한 나룻배", code: "의공억" }],
  avywenna: [{ name: "J.E.T.", code: "주공억" }],
  perlica: [{ name: "망각", code: "지아어" }],
  arclight: [{ name: "테르밋 커터", code: "의공흐" }],
  antal: [{ name: "폭발 유닛", code: "주오방" }],
  gilberta: [{ name: "사명의 길", code: "의궁추" }],
  ardelia: [{ name: "바다와 별의 꿈", code: "지치고" }],
  fluorite: [{ name: "O.B.J. 벨로시투스", code: "민궁방" }],
  pogranichnik: [{ name: "테르밋 커터", code: "의공흐" }],
  lifeng: [{ name: "산의 지배자", code: "민물효" }],
  endministrator: [{ name: "장대한 염원", code: "민공고" }],
  rossi: [{ name: "늑대의 혈흔", code: "민치골" }],
  chenqianyu: [{ name: "부요", code: "주치어" }],
  dapan: [{ name: "모범", code: "주공억" }],
  catcher: [{ name: "과거의 일품", code: "의생효" }],
  mifu: [{ name: "적영", code: "힘공기" }],
};
export const jeonmuOf = (id: string): Jeonmu[] => OP_JEONMU[id] ?? [];

// 전무 실측 스탯(data/weapons-source 랭크9 + 최대 기초공격력). buff=능력치버프, sub=부가스탯.
export type WeaponStats = { atk: number; buff: string; buffVal: number; sub: string; subVal: number; subFlat?: boolean; uniq: string };
export const OP_WEAPON_STATS: Record<string, WeaponStats> = {
  laevatain: { atk: 510, buff: "int", buffVal: 156, sub: "atk", subVal: 39, uniq: "어둠 · 울부짖는 불길" },
  ember: { atk: 500, buff: "main", buffVal: 132, sub: "atk", subVal: 39, uniq: "억제 · 다층 절단" },
  wulfgard: { atk: 490, buff: "main", buffVal: 132, sub: "arts", subVal: 43.3, uniq: "고통 · 가차 없는 숙청" },
  akekuri: { atk: 490, buff: "wil", buffVal: 156, sub: "atk", subVal: 39, uniq: "흐름 · 고열 방출" },
  camu: { atk: 500, buff: "agi", buffVal: 156, sub: "elem", subVal: 43.3, uniq: "흐름 · 심판" },
  yvonne: { atk: 505, buff: "int", buffVal: 156, sub: "crit", subVal: 19.5, uniq: "골절 · 예술적 폭론" },
  lastrite: { atk: 505, buff: "str", buffVal: 156, sub: "atk", subVal: 39, uniq: "방출 · 사무치는 추위" },
  tangtang: { atk: 505, buff: "agi", buffVal: 156, sub: "atk", subVal: 39, uniq: "방출 · 토벌의 원한" },
  snowshine: { atk: 495, buff: "wil", buffVal: 156, sub: "hp", subVal: 78, uniq: "효율 · 절개 의료법" },
  xaihi: { atk: 485, buff: "wil", buffVal: 156, sub: "hp", subVal: 78, uniq: "의료 · 침식성 광기의 불꽃" },
  alesh: { atk: 490, buff: "wil", buffVal: 156, sub: "atk", subVal: 39, uniq: "흐름 · 고열 방출" },
  estella: { atk: 411, buff: "wil", buffVal: 124, sub: "phys", subVal: 34.7, uniq: "고통 · 빙산을 넘어서" },
  zhuangfangyi: { atk: 510, buff: "wil", buffVal: 156, sub: "atk", subVal: 39, uniq: "억제 · 떠도는 번개" },
  avywenna: { atk: 500, buff: "main", buffVal: 132, sub: "atk", subVal: 39, uniq: "억제 · 천체 물리학" },
  perlica: { atk: 495, buff: "int", buffVal: 156, sub: "arts", subVal: 43.3, uniq: "어둠 · 치욕" },
  arclight: { atk: 490, buff: "wil", buffVal: 156, sub: "atk", subVal: 39, uniq: "흐름 · 고열 방출" },
  antal: { atk: 490, buff: "main", buffVal: 132, sub: "arts", subVal: 78, subFlat: true, uniq: "방출 · 우승자의 위세" },
  gilberta: { atk: 500, buff: "wil", buffVal: 156, sub: "energy", subVal: 46.4, uniq: "추격 · 굴하지 않는 사명" },
  ardelia: { atk: 495, buff: "int", buffVal: 156, sub: "heal", subVal: 46.4, uniq: "고통 · 밀물과 썰물의 속삭임" },
  fluorite: { atk: 411, buff: "agi", buffVal: 124, sub: "energy", subVal: 37.1, uniq: "방출 · 신속한 일격" },
  pogranichnik: { atk: 490, buff: "wil", buffVal: 156, sub: "atk", subVal: 39, uniq: "흐름 · 고열 방출" },
  lifeng: { atk: 500, buff: "agi", buffVal: 156, sub: "phys", subVal: 43.3, uniq: "효율 · 하나 되는 자연" },
  endministrator: { atk: 500, buff: "agi", buffVal: 156, sub: "atk", subVal: 39, uniq: "고통 · 간절한 소망" },
  rossi: { atk: 505, buff: "agi", buffVal: 156, sub: "crit", subVal: 19.5, uniq: "골절 · 군랑의 포식" },
  chenqianyu: { atk: 495, buff: "main", buffVal: 132, sub: "crit", subVal: 19.5, uniq: "어둠 · 청운" },
  dapan: { atk: 500, buff: "main", buffVal: 132, sub: "atk", subVal: 39, uniq: "억제 · 다층 절단" },
  catcher: { atk: 495, buff: "wil", buffVal: 156, sub: "hp", subVal: 78, uniq: "효율 · 절개 의료법" },
  mifu: { atk: 510, buff: "str", buffVal: 156, sub: "atk", subVal: 39, uniq: "기예 · 붉은색의 단절" },
};

// 무기 시리즈 스킬(3번째=고유효과) — 무기별 개별 consolidated 효과(상시+조건부 반영).
// 같은 시리즈명이어도 무기마다 값·효과 다름 → 무기 단위로 실측 기반 매핑. dmgKind: all(물리)/arts/elem(오퍼속성)/battle(배틀·궁).
// flat=상시 피해%/유틸(실측), trig=조건부 트리거(이벤트 발동). trig.on: ult/battle/link/anomaly/crush/physBreak/launch/heal.
type WeaponTrig = { on: string; tgt: "self" | "team"; k: "all" | "arts" | "elem" | "attack" | "atk"; val: number; max?: number };
type WeaponFx = { atk?: number; crit?: number; dmg?: number; dmgKind?: "all" | "arts" | "elem" | "battle"; vsBroken?: number; teamAtk?: number; teamArts?: number; heal?: number; energy?: number; trig?: WeaponTrig };
export const OP_WEAPON_EFFECTS: Record<string, WeaponFx> = {
  laevatain: { dmg: 0.448, dmgKind: "elem", trig: { on: "ult", tgt: "self", k: "all", val: 0.7 } },     // 어둠: 열기 + 궁 후 평타 +210%
  ember: { dmg: 0.28, dmgKind: "all", trig: { on: "battle", tgt: "self", k: "all", val: 0.28, max: 0.84 } }, // 억제: 물리 + 배틀/궁 명중 물리 3스택
  wulfgard: { dmg: 0.336, dmgKind: "arts", trig: { on: "battle", tgt: "self", k: "arts", val: 0.28 } },   // 고통: 아츠 + 아츠이상 소모 취약
  akekuri: { atk: 0.28, trig: { on: "battle", tgt: "team", k: "atk", val: 0.14, max: 0.28 } },             // 흐름: 공격 + 게이지 후 팀 공격
  camu: { energy: 0.504, trig: { on: "battle", tgt: "team", k: "atk", val: 0.168 } },                      // 흐름: 궁충 + 스킬 후 팀 공격
  yvonne: { dmg: 0.448, dmgKind: "elem", trig: { on: "battle", tgt: "self", k: "elem", val: 0.392, max: 1.176 } }, // 골절: 냉기 + 치명 후 냉기 3스택
  lastrite: { dmg: 0.56, dmgKind: "battle", trig: { on: "battle", tgt: "self", k: "elem", val: 0.56 } },   // 방출: 스킬 + 냉기 조건
  tangtang: { dmg: 0.448, dmgKind: "elem", trig: { on: "battle", tgt: "self", k: "elem", val: 0.56 } },    // 방출: 냉기 + 냉기 부착
  snowshine: { heal: 0.35 },                                                                                // 효율: 치유 + 비호 피격 추가회복
  xaihi: { heal: 0.28, trig: { on: "battle", tgt: "team", k: "atk", val: 0.252 } },                          // 의료: 치유 + 치유 후 팀 공격
  alesh: { atk: 0.28, trig: { on: "battle", tgt: "team", k: "atk", val: 0.14, max: 0.28 } },               // 흐름
  estella: { dmg: 0.224, dmgKind: "elem", trig: { on: "battle", tgt: "self", k: "atk", val: 0.336 } },    // 고통: 냉기/동결적 + 동결소모 공격
  zhuangfangyi: { dmg: 0.448, dmgKind: "elem", trig: { on: "battle", tgt: "self", k: "elem", val: 0.56 } }, // 억제: 전기 + 아츠이상소모 전기
  avywenna: { dmg: 0.336, dmgKind: "arts", trig: { on: "battle", tgt: "self", k: "arts", val: 0.336 } },   // 억제: 아츠 + 배틀/연계 아츠
  perlica: { crit: 0.14, trig: { on: "ult", tgt: "self", k: "arts", val: 0.672 } },                        // 어둠: 치명 + 궁/연계 후 아츠
  arclight: { atk: 0.28, trig: { on: "battle", tgt: "team", k: "atk", val: 0.14, max: 0.28 } },            // 흐름
  antal: { atk: 0.06, trig: { on: "battle", tgt: "team", k: "arts", val: 0.252 } }, // +보조 능력치 근사                                  // 방출: 아츠폭발 시 팀 아츠취약
  gilberta: { dmg: 0.448, dmgKind: "elem", trig: { on: "link", tgt: "team", k: "arts", val: 0.336 } },   // 추격: 자연 + 띄우기 후 팀 아츠
  ardelia: { atk: 0.09, trig: { on: "link", tgt: "team", k: "arts", val: 0.28 } }, // +보조 능력치 근사                                 // 고통: 부식 소모 아츠취약(팀)
  fluorite: { atk: 0.14, trig: { on: "battle", tgt: "self", k: "arts", val: 0.14, max: 0.56 } },          // 방출: 공격 + 아츠소모 자연 스택
  pogranichnik: { atk: 0.28, trig: { on: "battle", tgt: "team", k: "atk", val: 0.14, max: 0.28 } },        // 흐름
  lifeng: { vsBroken: 0.56, trig: { on: "battle", tgt: "self", k: "all", val: 0.2 } },                  // 효율: 방불 적 + 방불부여 능력치
  endministrator: { dmg: 0.4, dmgKind: "all", trig: { on: "battle", tgt: "self", k: "all", val: 0.35, max: 0.7 } }, // +오리지늄 아츠 강도(물리이상)                   // 고통: 오리지늄 + 결정/동결 후 물리
  rossi: { atk: 0.448, trig: { on: "battle", tgt: "self", k: "all", val: 0.14, max: 0.45 } },              // 골절: 공격 + 치명 후 물리/열기 스택
  chenqianyu: { dmg: 0.42, dmgKind: "battle", vsBroken: 0.98 },                                            // 어둠: 배틀/궁 물리 + 불균형 적 +98%
  dapan: { dmg: 0.28, dmgKind: "all", trig: { on: "battle", tgt: "self", k: "all", val: 0.28, max: 0.84 } }, // 억제 (모범)
  catcher: { heal: 0.35 },                                                                                  // 효율
  mifu: { dmg: 0.448, dmgKind: "all", trig: { on: "battle", tgt: "self", k: "all", val: 0.252, max: 0.5 } }, // 기예: 물리 + 물리취약/강타 물리
};

const SUB_KO: Record<string, string> = { atk: "공격력", crit: "치명 확률", hp: "최대 생명력", heal: "치유 효율", energy: "궁충 효율", arts: "아츠 피해", elem: "원소 피해", phys: "물리 피해", skill: "스킬 피해", vsbroken: "방불 적 피해", other: "특수" };
export const weaponEffectText = (id: string): string => { const w = OP_WEAPON_STATS[id]; if (!w) return ""; return `${SUB_KO[w.sub] ?? w.sub} +${w.subVal}${w.subFlat ? "" : "%"}`; };

// 밸런스 스케일(DD 모델은 오퍼 공격 ~110 → 무기 실측 500대를 스케일). 부가/버프는 실값의 일부만 반영해 밸런스 완충.
const W_ATK_SCALE = 0.06;   // 기초공격력 → 오퍼 공격 가산(500×0.06≈30)
const W_BUFF_SCALE = 0.4;   // 능력치 버프 → attrs 가산(156×0.4≈62)
const W_SUB_SCALE = 0.5;    // 부가스탯 % → DD 반영 비율(39%→~20%)
const W_SER_SCALE = 0.286;  // 시리즈 rank4(식각완료 9/9/4) × 밸런스 완충 (rank9×0.571=rank4)

// 무기 적용 — createBattle에서 applyGear 직후 호출. 실측 기초공격력 + 능력치 버프 + 부가스탯.
export function applyWeapon(u: DDUnit): WeaponType | null {
  const t = OP_WEAPON[u.id];
  const w = OP_WEAPON_STATS[u.id];
  if (!t || !w) return t ?? null;
  // 1) 기초공격력(스케일 가산)
  u.attack = Math.round(u.attack + w.atk * W_ATK_SCALE);
  // 2) 능력치 버프 → attrs (+저항/회복 재계산). "main"=주요 능력치(최고 스탯).
  if (u.attrs) {
    const b0 = u.attrs;
    const mainKey = (["str", "agi", "int", "wil"] as const).reduce((a, b) => (b0[b] > b0[a] ? b : a), "str");
    const key = (w.buff === "main" ? mainKey : w.buff) as "str" | "agi" | "int" | "wil";
    const added = Math.round(w.buffVal * W_BUFF_SCALE);
    // 주요 능력치 보너스(엔드필드 공식): 공격력 × (1 + 주요×0.005 + 보조×0.002). 주요 능력치 증가분만큼 공격 상승.
    if (key === mainKey) {
      const s = [b0.str, b0.agi, b0.int, b0.wil].sort((a, b) => b - a);
      const oldB = 1 + s[0] * 0.005 + s[1] * 0.002;
      const newB = 1 + (s[0] + added) * 0.005 + s[1] * 0.002;
      u.attack = Math.round(u.attack * (newB / oldB));
    }
    u.attrs = { ...b0, [key]: b0[key] + added };
    u.resist = attrResists(u.gearGrade, u.attrs);
    u.healRecv = +(u.attrs.wil / ATTR_AVG).toFixed(2);
  }
  // 3) 부가스탯(실값 × 완충)
  const v = (w.subVal / 100) * W_SUB_SCALE;
  const g = u.gear;
  if (w.sub === "atk") u.attack = Math.round(u.attack * (1 + v));
  else if (w.sub === "crit") u.critRate += v;
  else if (w.sub === "hp") { const h = Math.round(u.maxHp * v); u.maxHp += h; u.hp += h; }
  else if (g && (w.sub === "arts" || w.sub === "elem")) g.elemDmg.all = (g.elemDmg.all ?? 0) + (w.subFlat ? 0.1 : v);
  else if (g && w.sub === "phys") g.kindDmg.all = (g.kindDmg.all ?? 0) + v;
  else if (w.sub === "heal") u.healRecv = +((u.healRecv ?? 1) * (1 + v)).toFixed(2);
  else if (w.sub === "energy") u.ultCharge = Math.min(u.ultCost, u.ultCharge + u.ultCost * v);
  // 4) 시리즈 스킬(무기별 고유효과) — 상시 + 조건부를 consolidated 반영. 팀 버프는 applyWeaponTeam.
  const fx = OP_WEAPON_EFFECTS[u.id];
  if (fx) {
    const sc = W_SER_SCALE;
    if (fx.atk) u.attack = Math.round(u.attack * (1 + fx.atk * sc));
    if (fx.crit) u.critRate += fx.crit * sc;
    if (fx.dmg && g) {
      const dv = fx.dmg * sc;
      if (fx.dmgKind === "arts") g.elemDmg.all = (g.elemDmg.all ?? 0) + dv;
      else if (fx.dmgKind === "elem") { if (u.opElement && u.opElement !== "physical") g.elemDmg[u.opElement] = (g.elemDmg[u.opElement] ?? 0) + dv; else g.kindDmg.all = (g.kindDmg.all ?? 0) + dv; }
      else if (fx.dmgKind === "battle") { g.kindDmg.battle = (g.kindDmg.battle ?? 0) + dv; g.kindDmg.ult = (g.kindDmg.ult ?? 0) + dv; }
      else g.kindDmg.all = (g.kindDmg.all ?? 0) + dv;
    }
    if (fx.vsBroken && g) g.vsBroken += fx.vsBroken * sc;
    if (fx.heal) u.healRecv = +((u.healRecv ?? 1) * (1 + fx.heal * sc)).toFixed(2);
    if (fx.energy) u.ultCharge = Math.min(u.ultCost, u.ultCharge + u.ultCost * fx.energy * sc);
  }
  return t;
}

const W_TRIG_SCALE = 0.286; // 시리즈 조건부 rank4 × 완충

// 무기 시리즈 조건부 트리거 — act()에서 스킬 종류(battle/link/ult)로 호출. 발동 시 self/team amp·공격 버프(3턴).
export function weaponTrigger(self: DDUnit, event: string, allies?: DDUnit[]): void {
  const t = OP_WEAPON_EFFECTS[self.id]?.trig;
  if (!t || t.on !== event) return;
  const v = t.val * W_TRIG_SCALE;
  const cap = (t.max ?? t.val) * W_TRIG_SCALE;
  const apply = (u: DDUnit) => {
    if (t.k === "atk") { u.atkBuff = Math.min((u.atkBuff || 0) + v, 0.6); setTimer(u, "atkBuff", 3); }
    else { const key = t.k === "elem" ? (u.opElement && u.opElement !== "physical" ? u.opElement : "all") : (t.k as "all" | "arts"); u.amp[key] = Math.min((u.amp[key] || 0) + v, cap); setTimer(u, "amp:" + key, 3); }
  };
  if (t.tgt === "team" && allies) allies.forEach(apply); else apply(self);
}

// 무기 팀 버프(흐름·의료 팀 공격 / 추격·고통 팀 아츠) — createBattle에서 applyWeapon 후 1회 호출.
export function applyWeaponTeam(allies: DDUnit[]): void {
  let teamAtk = 0, teamArts = 0;
  for (const u of allies) { const fx = OP_WEAPON_EFFECTS[u.id]; if (fx) { teamAtk += fx.teamAtk ?? 0; teamArts += fx.teamArts ?? 0; } }
  if (teamAtk <= 0 && teamArts <= 0) return;
  for (const u of allies) {
    if (teamAtk > 0) u.attack = Math.round(u.attack * (1 + teamAtk * W_SER_SCALE));
    if (teamArts > 0 && u.gear) u.gear.elemDmg.all = (u.gear.elemDmg.all ?? 0) + teamArts * W_SER_SCALE;
  }
}

export const weaponOf = (id: string): WeaponType | null => OP_WEAPON[id] ?? null;
// 전무 실제 무기 이미지(public/weapons). 전무 이름 → weaponSummaries 매칭.
const WEAPON_IMG: Record<string, string> = Object.fromEntries(weaponSummaries.map((w) => [w.name, w.image]));
export const weaponImage = (id: string): string => { const j = OP_JEONMU[id]?.[0]; return (j && WEAPON_IMG[j.name]) || ""; };
// 전무 이름(시트 실측). 딜/폿 분리(엠버)는 "딜:모범 / 폿:과거의 일품".
export const weaponName = (id: string): string | null => {
  const j = OP_JEONMU[id];
  if (!j?.length) { const t = OP_WEAPON[id]; return t ? `${WEAPON_KO[t]} · 6★` : null; }
  return j.map((w) => (w.role ? `${w.role}:${w.name}` : w.name)).join(" / ");
};
