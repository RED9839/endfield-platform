// 무기 타입 리프 모듈 — 임포트 없음(roster ↔ weapons 순환 회피).
// 타입 배정은 operator-wikis 헤더 실측. 속도는 턴제 각색: 원작에 속도 개념이 없어
// 무기 무게를 행동 빈도 축으로 삼는다(능력치 4종은 공격력으로만 흘러 서로 대등).

export type WeaponType = "sword" | "greatsword" | "polearm" | "handcannon" | "artsunit";

export const WEAPON_KO: Record<WeaponType, string> = { sword: "한손검", greatsword: "양손검", polearm: "장병기", handcannon: "권총", artsunit: "아츠 유닛" };
export const WEAPON_ICON: Record<WeaponType, string> = { sword: "🗡", greatsword: "⚔", polearm: "🔱", handcannon: "🔫", artsunit: "🔮" };

// 오퍼별 실제 무기 타입(operator-wikis 헤더 실측)
export const OP_WEAPON: Record<string, WeaponType> = {
  akekuri: "sword", alesh: "sword", arclight: "sword", chenqianyu: "sword", endministrator: "sword", laevatain: "sword", pogranichnik: "sword", rossi: "sword",
  catcher: "greatsword", dapan: "greatsword", ember: "greatsword", lastrite: "greatsword", mifu: "greatsword", snowshine: "greatsword",
  avywenna: "polearm", camu: "polearm", estella: "polearm", lifeng: "polearm",
  fluorite: "handcannon", tangtang: "handcannon", wulfgard: "handcannon", yvonne: "handcannon",
  antal: "artsunit", ardelia: "artsunit", gilberta: "artsunit", perlica: "artsunit", xaihi: "artsunit", zhuangfangyi: "artsunit",
};

// 무기 무게 → 속도. 적 속도 32~78 사이에 오퍼를 배치한다.
export const WEAPON_SPEED: Record<WeaponType, number> = { sword: 72, handcannon: 70, artsunit: 62, polearm: 58, greatsword: 48 };

export const speedOf = (id: string): number => WEAPON_SPEED[OP_WEAPON[id]] ?? 60;
