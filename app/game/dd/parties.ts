// DD 프리셋 조합 파티 — 시트(공략 빌드) 채용파티 기준. 규칙 #7: 채용파티는 메인딜러만 표기.
// 예외: 장방이·로시 조합은 사용자 지정 교체(시트 아님). 시뮬 검증상 시트 구성보다 우위 —
//   장방이 일반 90→98% 정예 53→83% 보스 43→64% / 로시 일반 99→100% 정예 79→100% 보스 58→100%.
// 시트 구조: 채용파티 4열=파티 슬롯(1~4번), 세로=그 슬롯 대체픽(윗칸 빈칸=위 슬롯 고정).
// 장비는 gear.ts OP_RECOMMENDED_SET(시트 장비셋)가 자동 적용 — 여기선 구성원·슬롯 유동만 정의.
export type PartyArchetype = "arts" | "break" | "crit"; // 아츠 폭딜 / 물리 불균형 / 치명 딜
export type PresetParty = {
  id: string;
  name: string;
  members: string[]; // 슬롯 1~4번 주픽(members[0]=메인 딜러)
  element: "physical" | "heat" | "electric" | "cryo" | "nature"; // 조합 주력 속성
  archetype: PartyArchetype; // 운영 축
  desc: string;
  note?: string; // 돌파 요구·운영 팁
  alternates?: { role: string; ids: string[]; note?: string }[]; // 유동 슬롯의 대체픽(주픽 포함, 세로 순서)
};

export const ARCHETYPE_LABEL: Record<PartyArchetype, string> = { arts: "아츠 폭딜", break: "물리 불균형", crit: "치명 딜" };

// 정렬: 시트 채용파티 앵커 행 순서(레바테인→엠버→이본→라스트→장방이→아비웨나→로시→미브).
// 약칭: 레=레바테인 울=울가 아델=아델리아 카=카뮤 아케=아케쿠리 안=안탈 질=질베르타 펠=펠리카
//  엠=엠버 포=포그 미=미브 천=진천우 관=관리자 판=판 이=이본 탕=탕탕 자=자이히 에=에스텔라
//  라=라스트 장=장방이 앜=아크라이트 알=알레쉬 웨=아비웨나 로=로시 여=여풍
export const PRESET_PARTIES: PresetParty[] = [
  {
    id: "laevatain",
    name: "레바테인 조합",
    members: ["laevatain", "wulfgard", "arcane", "camu"],
    element: "heat",
    archetype: "arts",
    desc: "레바테인 열기 폭딜 — 울가 연소 서브딜 · 결 자연 부착/취약 · 카뮤 뱅가드",
    note: "4돌 기준",
    alternates: [
      { role: "3번 서포터", ids: ["arcane", "ardelia", "gilberta"], note: "결 / 아델리아 / 질베르타(몹몰이)" },
      { role: "4번 뱅가드", ids: ["camu", "akekuri", "antal"], note: "카뮤 / 아케쿠리 / 안탈" },
    ],
  },
  {
    id: "ember",
    name: "엠버 조합",
    members: ["ember", "pogranichnik", "mifu", "chenqianyu"],
    element: "physical",
    archetype: "break",
    desc: "엠버 탱 + 물리 불균형 — 포그·미브(관리자/판) 방불 셋업 → 진천우 강타",
    note: "1,3,4,5돌",
    alternates: [{ role: "3번 방불", ids: ["mifu", "endministrator", "dapan"], note: "미브 / 관리자 / 판" }],
  },
  {
    id: "yvonne",
    name: "이본 조합",
    members: ["yvonne", "tangtang", "xaihi", "arcane"],
    element: "cryo",
    archetype: "arts",
    desc: "이본 냉기 치명 — 탕탕 서브딜 · 자이히 냉기 증폭 · 결/질베/펠 유동",
    note: "1돌",
    alternates: [{ role: "4번 유동", ids: ["arcane", "gilberta", "perlica", "estella"], note: "결 / 질베르타 / 펠리카 / 에스텔라" }],
  },
  {
    id: "lastrite",
    name: "라스트 라이트 조합",
    members: ["lastrite", "xaihi", "tangtang", "arcane"],
    element: "cryo",
    archetype: "arts",
    desc: "라스트 라이트 냉기 누킹 — 자이히 냉기 증폭 · 탕탕 서브딜 · 결/질베/펠 유동",
    note: "1,3,4,5돌 (혹은 탕탕 채용)",
    alternates: [{ role: "4번 유동", ids: ["arcane", "gilberta", "perlica", "akekuri"], note: "결 / 질베르타 / 펠리카 / 아케쿠리" }],
  },
  {
    id: "zhuangfangyi",
    name: "장방이 조합",
    members: ["zhuangfangyi", "ardelia", "perlica", "arclight"],
    element: "electric",
    archetype: "arts",
    desc: "장방이 전기 딜 — 아델리아 부식·취약 · 펠리카 감전 셋업 · 아크라이트 게이지",
    note: "1,4돌",
    alternates: [
      { role: "2번 서포터", ids: ["ardelia", "alesh", "antal", "avywenna"], note: "아델리아 / 알레쉬 / 안탈 / 아비웨나" },
      { role: "4번 뱅가드", ids: ["arclight", "akekuri"], note: "아크라이트 / 아케쿠리" },
    ],
  },
  {
    id: "avywenna",
    name: "아비웨나 조합",
    members: ["avywenna", "perlica", "gilberta", "akekuri"],
    element: "electric",
    archetype: "arts",
    desc: "아비웨나 썬더랜스 전기 폭딜 — 펠리카 감전 · 질베/아델 서포터 · 아케 등 유동",
    note: "1,2,4,5돌",
    alternates: [
      { role: "3번 서포터", ids: ["gilberta", "ardelia"], note: "질베르타 / 아델리아" },
      { role: "4번 유동", ids: ["akekuri", "antal", "arclight"], note: "아케쿠리 / 안탈 / 아크라이트" },
    ],
  },
  {
    id: "rossi",
    name: "로시 조합",
    members: ["rossi", "tangtang", "gilberta", "perlica"],
    element: "heat",
    archetype: "crit",
    desc: "로시 치명 딜 — 탕탕 서브딜 · 질베 취약 · 펠리카 등 유동",
    note: "1돌",
    alternates: [
      { role: "2번 서브딜", ids: ["tangtang", "wulfgard", "akekuri"], note: "탕탕 / 울가 / 아케쿠리" },
      { role: "4번 유동", ids: ["perlica", "pogranichnik", "mifu", "dapan", "endministrator"], note: "펠리카 / 포그 / 미브 / 판 / 관리자" },
    ],
  },
  {
    id: "arcane",
    name: "결 조합",
    members: ["arcane", "wulfgard", "xaihi", "camu"],
    element: "nature",
    archetype: "arts",
    desc: "결 자연 광역 딜 — 울가 아츠 이상 서브딜 · 자이히 증폭/힐 · 카뮤 뱅가드",
    alternates: [{ role: "4번 뱅가드", ids: ["camu", "akekuri", "antal"], note: "카뮤 / 아케쿠리 / 안탈" }],
  },
  {
    id: "mifu",
    name: "미브 조합",
    members: ["mifu", "chenqianyu", "pogranichnik", "lifeng"],
    element: "physical",
    archetype: "break",
    desc: "미브·진천우·포그 물리 불균형(방불) 셋업 → 여풍/엠버 마무리",
    note: "1돌",
    alternates: [{ role: "4번 유동", ids: ["lifeng", "ember"], note: "여풍 / 엠버" }],
  },
];

export const getPreset = (id: string) => PRESET_PARTIES.find((p) => p.id === id);
