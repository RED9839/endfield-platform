import type { GameEvent } from "../types/game";

// 세력(필드)별 테마 이벤트. faction: 0 광석수 · 1 아겔로이 · 2 무릉 조석 · 3 본크러셔 · 4 청파채. 미지정=중립.
export const events: GameEvent[] = [
  // ===== 중립(모든 필드) =====
  {
    id: "silent-conveyor",
    title: "멈춰 선 운송선",
    description: "오염 지대 한가운데서 무인 운송선이 낮은 신호음을 반복한다. 적재함은 잠겨 있지만 아직 전력이 남아 있다.",
    choices: [
      { id: "force-open", label: "강제로 개방한다", description: "파티가 8 피해를 받고 90 크레딧을 얻습니다.", hpCost: 8, credits: 90 },
      { id: "reroute", label: "전력을 우회한다", description: "전술 장비 보상 후보를 확인합니다.", gearReward: true },
    ],
  },
  {
    id: "field-medic",
    title: "떠돌이 의료팀",
    description: "철수 중인 의료팀이 당신의 신분을 확인한다. 남은 약품은 많지 않지만 거래할 의향은 있어 보인다.",
    choices: [
      { id: "treatment", label: "응급 처치를 받는다", description: "모든 오퍼레이터가 22 회복합니다.", heal: 22 },
      { id: "supply", label: "비상 약품을 받는다", description: "포션 하나를 얻습니다.", potionReward: true },
    ],
  },

  // ===== 희귀 이벤트(낮은 확률) =====
  {
    id: "echo-resonance",
    title: "메아리의 잔향",
    description: "공명하는 오리지늄 결정 군락이 당신의 기억을 비춘다. 손에 익은 한 수가 또렷이 되살아나려 한다 — 그 순간을 그대로 박제할 수 있을 것 같다.",
    rare: true,
    choices: [
      { id: "echo-copy", label: "잔향을 붙잡는다", description: "습득 카드 3장 중 1장을 복제합니다(복제본은 정예화 불가).", duplicate: true },
      { id: "echo-let-go", label: "흘려보낸다", description: "20 회복합니다.", heal: 20 },
    ],
  },

  // ===== 0 · 탈로스 광석수(야생/감염수) =====
  {
    id: "wild-nest",
    title: "광석수 둥지",
    description: "거대 광석수의 둥지가 비어 있다. 둥지 안쪽에 오리지늄 결정이 박혀 있지만, 주인이 언제 돌아올지 모른다.",
    faction: 0,
    choices: [
      { id: "raid", label: "결정을 캐낸다", description: "파티가 10 피해를 받고 110 크레딧 + 장비를 얻습니다.", hpCost: 10, credits: 110, gearReward: true },
      { id: "leave", label: "조용히 물러난다", description: "안전하게 25 회복합니다.", heal: 25 },
    ],
  },
  {
    id: "infected-spring",
    title: "감염된 샘",
    description: "오리지늄에 오염된 샘이 흐릿하게 빛난다. 정제하면 약이 되지만, 그냥 마시면 무슨 일이 일어날지 모른다.",
    faction: 0,
    choices: [
      { id: "purify", label: "정제해 마신다", description: "모든 오퍼레이터가 30 회복합니다.", heal: 30 },
      { id: "harvest", label: "오염 결정을 채취한다", description: "6 피해를 받고 유물을 얻습니다.", hpCost: 6, relicReward: true },
    ],
  },

  // ===== 1 · 아겔로이(구조체) =====
  {
    id: "dormant-anchor",
    title: "휴면 앵커",
    description: "활성화되지 않은 아겔로스 앵커가 땅에 박혀 있다. 해체하면 부품을 얻겠지만, 깨우면 위험하다.",
    faction: 1,
    choices: [
      { id: "dismantle", label: "신중히 해체한다", description: "장비 보상 후보를 확인합니다.", gearReward: true },
      { id: "overload", label: "코어를 과부하시킨다", description: "8 피해를 받고 130 크레딧을 얻습니다.", hpCost: 8, credits: 130 },
    ],
  },
  {
    id: "aggelos-wreck",
    title: "아겔로스 잔해",
    description: "파괴된 구조체의 헤일로가 아직 미약하게 회전한다. 잔해에서 정제된 오리지늄 부품을 회수할 수 있다.",
    faction: 1,
    choices: [
      { id: "salvage", label: "부품을 회수한다", description: "95 크레딧을 얻습니다.", credits: 95 },
      { id: "study", label: "헤일로 구조를 분석한다", description: "유물을 얻습니다.", relicReward: true },
    ],
  },

  // ===== 2 · 무릉 조석(침식/물) =====
  {
    id: "corrosion-pool",
    title: "침식의 웅덩이",
    description: "검은 침식액이 고인 웅덩이가 길을 가로막는다. 가로지르면 빠르지만, 부식을 각오해야 한다.",
    faction: 2,
    choices: [
      { id: "wade", label: "가로질러 건넌다", description: "파티가 12 피해를 받고 140 크레딧을 얻습니다.", hpCost: 12, credits: 140 },
      { id: "around", label: "돌아서 우회한다", description: "안전하게 18 회복합니다.", heal: 18 },
    ],
  },
  {
    id: "tide-shrine",
    title: "조석의 사당",
    description: "무릉의 옛 사당이 조수에 잠겨 있다. 물에 떠다니는 공물 상자에서 무언가를 건질 수 있을 것 같다.",
    faction: 2,
    choices: [
      { id: "offering", label: "공물을 거둔다", description: "장비를 얻습니다.", gearReward: true },
      { id: "pray", label: "사당에서 정비한다", description: "28 회복하고 포션을 얻습니다.", heal: 28, potionReward: true },
    ],
  },

  // ===== 3 · 변경 본크러셔(무법/방화) =====
  {
    id: "raider-camp",
    title: "버려진 약탈 캠프",
    description: "본크러셔가 급히 떠난 약탈 캠프. 전리품이 흩어져 있지만, 함정과 잔당이 남아 있을 수 있다.",
    faction: 3,
    choices: [
      { id: "loot", label: "전리품을 챙긴다", description: "9 피해를 받고 120 크레딧 + 장비를 얻습니다.", hpCost: 9, credits: 120, gearReward: true },
      { id: "careful", label: "함정을 살피며 회수한다", description: "60 크레딧을 얻습니다.", credits: 60 },
    ],
  },
  {
    id: "hell-furnace",
    title: "지옥의 용광로",
    description: "본크러셔가 세운 '지옥의 용광로'가 아직 타오른다. 헤이즈파이어 연기를 들이마시면 환각 속에 힘을 얻는다지만...",
    faction: 3,
    choices: [
      { id: "inhale", label: "연기를 들이마신다", description: "10 피해를 받고 카드 정예화 1회를 얻습니다.", hpCost: 10, promote: 1 },
      { id: "douse", label: "용광로를 끈다", description: "유물을 얻습니다.", relicReward: true },
    ],
  },

  // ===== 4 · 청파채(녹림 무법) =====
  {
    id: "stockade-checkpoint",
    title: "청파채 검문소",
    description: "녹림 무법자들이 사설 검문소를 세웠다. 통행료를 내거나, 실력으로 뚫고 지나가야 한다.",
    faction: 4,
    choices: [
      { id: "toll", label: "통행료를 낸다", description: "안전하게 지나가고 16 회복합니다.", heal: 16 },
      { id: "fight-through", label: "돌파한다", description: "10 피해를 받고 130 크레딧을 얻습니다.", hpCost: 10, credits: 130 },
    ],
  },
  {
    id: "greenwood-hermit",
    title: "녹림 사부의 은거지",
    description: "청파채의 노련한 무술 사부가 산속에 은거해 있다. 한 수 청하면 깨달음을 얻을지도 모른다.",
    faction: 4,
    choices: [
      { id: "train", label: "수련을 청한다", description: "8 피해를 받고 카드 정예화 1회를 얻습니다.", hpCost: 8, promote: 1 },
      { id: "rest", label: "객으로 머문다", description: "32 회복합니다.", heal: 32 },
    ],
  },
];
