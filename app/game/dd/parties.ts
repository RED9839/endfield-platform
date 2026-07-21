// DD 프리셋 조합 파티 — 시트(공략 빌드) 채용파티 기준. 규칙 #7: 채용파티는 메인딜러만 표기.
// 예외: 장방이·로시 조합은 사용자 지정 교체(시트 아님). 시뮬 검증상 시트 구성보다 우위 —
//   장방이 일반 90→98% 정예 53→83% 보스 43→64% / 로시 일반 99→100% 정예 79→100% 보스 58→100%.
// 시트 구조: 채용파티 4열=파티 슬롯(1~4번), 세로=그 슬롯 대체픽(윗칸 빈칸=위 슬롯 고정).
// 장비는 gear.ts OP_RECOMMENDED_SET(시트 장비셋)가 자동 적용 — 여기선 구성원·슬롯 유동만 정의.
export type PartyArchetype = "arts" | "break" | "crit"; // 아츠 폭딜 / 물리 불균형 / 치명 딜
export type PresetParty = {
  id: string;
  name: string;
  members: string[]; // 슬롯 1~4번 배치 순서 그대로(전열=1번). 던전은 이 순서를 바꾸지 않는다.
  main: string;      // 메인딜러(메인 컨트롤 오퍼레이터) — 1번 슬롯과 다를 수 있다(탱이 전열)
  element: "physical" | "heat" | "electric" | "cryo" | "nature"; // 조합 주력 속성
  archetype: PartyArchetype; // 운영 축
  desc: string;
  note?: string; // 돌파 요구·운영 팁
  alternates?: { role: string; ids: string[]; note?: string }[]; // 유동 슬롯의 대체픽(주픽 포함, 세로 순서)
};

export const ARCHETYPE_LABEL: Record<PartyArchetype, string> = { arts: "아츠 폭딜", break: "물리 불균형", crit: "치명 딜" };

// 정렬: 시트 채용파티 앵커 행 순서(레바테인→엠버→이본→라스트→장방이→로시→미브).
// 아비웨나 조합은 제외 — 시뮬상 보스전 0%·정예 71%로 다른 조합과 격차가 커 추천에서 뺐다.
// (아비웨나 자체는 장방이 조합 2번 슬롯 대체픽으로 남아 있다)
// 약칭: 레=레바테인 울=울가 아델=아델리아 카=카뮤 아케=아케쿠리 안=안탈 질=질베르타 펠=펠리카
//  엠=엠버 포=포그 미=미브 천=진천우 관=관리자 판=판 이=이본 탕=탕탕 자=자이히 에=에스텔라
//  라=라스트 장=장방이 앜=아크라이트 알=알레쉬 웨=아비웨나 로=로시 여=여풍
export const PRESET_PARTIES: PresetParty[] = [
  {
    id: "laevatain",
    name: "레바테인 조합",
    members: ["camu", "laevatain", "wulfgard", "arcane"],
    main: "laevatain",
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
    main: "ember",
    element: "physical",
    archetype: "break",
    desc: "엠버 탱 + 물리 불균형 — 포그·미브(관리자/판) 방어 불능 셋업 → 진천우 강타",
    note: "1,3,4,5돌",
    alternates: [{ role: "3번 방어 불능", ids: ["mifu", "endministrator", "dapan"], note: "미브 / 관리자 / 판" }],
  },
  {
    id: "yvonne",
    name: "이본 조합",
    members: ["yvonne", "tangtang", "xaihi", "arcane"],
    main: "yvonne",
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
    main: "lastrite",
    element: "cryo",
    archetype: "arts",
    desc: "라스트 라이트 냉기 누킹 — 자이히 냉기 증폭 · 탕탕 서브딜 · 결/질베/펠 유동",
    note: "1,3,4,5돌 (혹은 탕탕 채용)",
    alternates: [{ role: "4번 유동", ids: ["arcane", "gilberta", "perlica", "akekuri"], note: "결 / 질베르타 / 펠리카 / 아케쿠리" }],
  },
  {
    id: "zhuangfangyi",
    name: "장방이 조합",
    members: ["arclight", "zhuangfangyi", "arcane", "perlica"],
    main: "zhuangfangyi",
    element: "electric",
    archetype: "arts",
    desc: "장방이 전기 딜 — 결 자연 부착 공급 · 펠리카 감전 셋업 · 아크라이트 게이지",
    note: "1,4돌",
    alternates: [
      // 2번은 '아츠 부착을 꾸준히 까는 역할'이 핵심. 감전이 소모할 부착이 없으면 파티 전체가 평타로 전락한다.
      // 시뮬 검증: 결 25168 / 아비웨나 5032 / 알레쉬 5014 / 아델리아 3907 / 안탈 3657 (팀DPS)
      { role: "2번 서포터", ids: ["arcane", "avywenna", "alesh", "ardelia"], note: "결 / 아비웨나 / 알레쉬 / 아델리아" },
      { role: "4번 뱅가드", ids: ["arclight", "akekuri"], note: "아크라이트 / 아케쿠리" },
    ],
  },
  {
    id: "rossi",
    name: "로시 조합",
    members: ["rossi", "tangtang", "gilberta", "perlica"],
    main: "rossi",
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
    members: ["camu", "arcane", "wulfgard", "xaihi"],
    main: "arcane",
    element: "nature",
    archetype: "arts",
    desc: "결 자연 광역 딜 — 울가 아츠 이상 서브딜 · 자이히 증폭/힐 · 카뮤 뱅가드",
    alternates: [{ role: "4번 뱅가드", ids: ["camu", "akekuri", "antal"], note: "카뮤 / 아케쿠리 / 안탈" }],
  },
  {
    id: "mifu",
    name: "미브 조합",
    members: ["pogranichnik", "mifu", "lifeng", "chenqianyu"],
    main: "mifu",
    element: "physical",
    archetype: "break",
    desc: "미브·진천우·포그 방어 불능 셋업 → 불균형 유발 후 여풍/엠버 마무리",
    note: "1돌",
    alternates: [{ role: "4번 유동", ids: ["lifeng", "ember"], note: "여풍 / 엠버" }],
  },
];

export const getPreset = (id: string) => PRESET_PARTIES.find((p) => p.id === id);
