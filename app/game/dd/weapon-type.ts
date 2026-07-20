// 무기 타입 리프 모듈 — 임포트 없음(roster ↔ weapons 순환 회피).
// 타입 배정은 operator-wikis 헤더 실측. (속도는 오퍼 고유 민첩 기반 — roster.ts applyAttrs)

export type WeaponType = "sword" | "greatsword" | "polearm" | "handcannon" | "artsunit";

export const WEAPON_KO: Record<WeaponType, string> = { sword: "한손검", greatsword: "양손검", polearm: "장병기", handcannon: "권총", artsunit: "아츠 유닛" };
export const WEAPON_ICON: Record<WeaponType, string> = { sword: "🗡", greatsword: "⚔", polearm: "🔱", handcannon: "🔫", artsunit: "🔮" };

// 오퍼별 실제 무기 타입(operator-wikis 헤더 실측)
export const OP_WEAPON: Record<string, WeaponType> = {
  akekuri: "sword", alesh: "sword", arclight: "sword", chenqianyu: "sword", endministrator: "sword", laevatain: "sword", pogranichnik: "sword", rossi: "sword",
  catcher: "greatsword", dapan: "greatsword", ember: "greatsword", lastrite: "greatsword", mifu: "greatsword", snowshine: "greatsword",
  avywenna: "polearm", camu: "polearm", estella: "polearm", lifeng: "polearm",
  fluorite: "handcannon", tangtang: "handcannon", wulfgard: "handcannon", yvonne: "handcannon",
  antal: "artsunit", ardelia: "artsunit", arcane: "artsunit", gilberta: "artsunit", perlica: "artsunit", xaihi: "artsunit", zhuangfangyi: "artsunit",
};
