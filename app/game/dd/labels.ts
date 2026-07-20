// 게임 내 표기 명칭 단일 출처. 같은 값이 화면마다 다르게 불리던 것을 여기로 모은다.
//  · all  = 스킬 종류를 가리지 않는 피해 증가(gear.kindDmg.all) — "물리 피해"가 아니다
//  · energy = 전투 시작 시 궁 에너지 가산 / ultEff = 궁극기 충전 효율(별개 값)
import type { DDSkill } from "./combat";

export const DMG_LABEL: Record<string, string> = {
  ult: "궁극 피해", battle: "배틀 피해", link: "연계 피해", attack: "일반 피해",
  all: "모든 스킬 피해", elem: "아츠 피해",
  atkPct: "공격력", hpPct: "생명력", critRate: "치명 확률", critDmg: "치명 피해",
  energy: "궁 에너지", ultEff: "궁충 효율", artsStr: "아츠 강도", vsBroken: "불균형 피해", vsDefBreak: "방어 불능 피해", mainPct: "주요 능력치", subPct: "보조 능력치",
};
// 좁은 칸(전투 칩·스킬 카드)용 축약 — 뜻은 같고 길이만 짧다.
export const DMG_SHORT: Record<string, string> = {
  ult: "궁극", battle: "배틀", link: "연계", attack: "일반",
  all: "전 스킬", elem: "아츠",
  atkPct: "공격력", hpPct: "생명력", critRate: "치명확", critDmg: "치명피",
  energy: "궁에너지", ultEff: "궁충효율", artsStr: "아츠강도", vsBroken: "불균형피해", vsDefBreak: "방불피해", mainPct: "주요능력치", subPct: "보조능력치",
};
export const dmgLabel = (k: string, short = false) => (short ? DMG_SHORT[k] : DMG_LABEL[k]) ?? k;

export const SKILL_KIND_LABEL: Record<DDSkill["kind"], string> = { attack: "기본공격", battle: "배틀스킬", link: "연계스킬", ult: "궁극기" };
export const SKILL_KIND_SHORT: Record<DDSkill["kind"], string> = { attack: "기본", battle: "배틀", link: "연계", ult: "궁극" };
