export type Screen =
  | "deployment"
  | "map"
  | "battle"
  | "reward"
  | "promote"
  | "shop"
  | "event"
  | "camp"
  | "challenge"
  | "duplicate"
  | "summary";

export type Element = "physical" | "heat" | "electric" | "cryo" | "nature";
export type NodeType = "battle" | "elite" | "event" | "shop" | "camp" | "boss" | "treasure" | "unknown";
export type SkillKind = "attack" | "battle-skill" | "link-skill" | "ultimate";
export type UnitSide = "party" | "enemy";
export type LinkCondition =
  | "ally-link-damage"
  | "strong-hit"
  | "defense-break"
  | "strong-hit-vs-clean"
  | "ally-hit";
export type LinkTrigger = "ally-link-damage" | "strong-hit" | "ally-hit";
export type OperatorClass =
  | "가드"
  | "디펜더"
  | "서포터"
  | "캐스터"
  | "뱅가드"
  | "스트라이커";
export type SkillMechanic =
  | "originium-crystal"
  | "electric-attachment"
  | "combo-strike"
  | "protective-arts"
  | "corrosion-support";
// 재능(기본 패시브) 아키타입 — 실제 오퍼레이터 재능을 카드 전투 효과로 환산. 모두 전투에서 작동한다.
export type PassiveMechanic =
  | "vs-broken" // 불균형 적에게 주는 피해 증가
  | "vs-status" // 아츠/이상 상태 적에게 주는 피해 증가
  | "crystal-burst" // 오리지늄 결정 부착 적에게 피해 증가
  | "blade-stacks" // 비기본 스킬 명중마다 누적, 다음 피해 증가
  | "flat-power" // 상시 피해 증가(스탯형 재능)
  | "support-heal" // 비기본 스킬 사용 시 파티 회복
  | "guardian-shield" // 비기본 스킬 사용 시 파티 보호막
  | "energy-surge" // 카드로 불균형을 유발하면 에너지 추가 획득
  | "team-amp" // 파티 전체 카드 피해 증가 오라(버퍼·디버퍼)
  | "crit-surge" // 자신 카드의 치명타 확률 증가(폭발 딜러)
  | "essence-collapse"; // 본질 붕괴(관리자): 취약 분쇄(Crush)마다 공격력 누적 → 카드 피해 증가
// 엔드필드 아츠 부착(4원소 이상) + 물리/스태거 상태.
export type EnemyStatus =
  | "combustion" // 연소(열): 매 턴 지속 피해(DoT)
  | "shock" // 감전(전기): 받는 아츠 피해 증가
  | "freeze" // 동결(냉기): 행동 불가 + 물리로 치면 쇄빙(Shatter)
  | "corrosion" // 부식(자연): 저항 감소 — 받는 모든 피해 증가 + DoT
  | "defense-break" // 불균형(스태거): 행동 불가 + 받피증 ×1.3
  | "armor-break"; // 관통(Breach): 취약 소모 결과 — 물리 피해 증폭
export type EnemyMechanic =
  | "none"
  | "armored"
  | "ranged"
  | "sniper"
  | "flame"
  | "acid"
  | "poison"
  | "cold"
  | "shock"
  | "shield"
  | "evasive"
  | "charge"
  | "grab"
  | "self-destruct"
  | "revive"
  | "smoke"
  | "healer"
  | "summoner"
  | "enrage"
  | "rockfall"
  | "bind"
  | "reflect"
  | "boss-shield";

export type RunGearCategory = "armor" | "gloves" | "kit";
export type GearSlot = "armor" | "gloves" | "kit1";
export type RunGearLevel = 10 | 20 | 28 | 36 | 50;
export type RewardTier = "early" | "mid" | "late" | "elite" | "boss";

export type RunGear = {
  slug: string;
  name: string;
  enName: string;
  category: RunGearCategory;
  level: RunGearLevel;
  quality: number;
  setName: string;
  image: string;
  abilityTypes: string[];
  attributeTypes: string[];
  attributeLabel: string;
  combatDescription: string;
};

export type GearLoadout = {
  armor?: RunGear;
  gloves?: RunGear;
  kit1?: RunGear;
};

export type Operator = {
  id: string;
  name: string;
  role: string;
  className: OperatorClass;
  element: Element;
  image: string;
  maxHp: number;
  attack: number;
  defense: number;
  evasion: number;
  speed: number;
  normalAttackName: string;
  normalAttackIcon: string;
  normalAttackDescription: string;
  battleSkillName: string;
  battleSkillIcon: string;
  battleSkillDescription: string;
  linkSkillName: string;
  linkSkillIcon: string;
  linkSkillDescription: string;
  linkCondition: LinkCondition;
  ultimateName: string;
  ultimateIcon: string;
  ultimateDescription: string;
  skillMechanic: SkillMechanic;
  passiveName: string;
  passiveIcon?: string;
  passiveDescription: string;
  passiveMechanic: PassiveMechanic;
  artsAttachment?: string;
  battleSkillPower: number;
  battleSkillCost: number;
  linkSkillPower: number;
  linkSkillCost: number;
  ultimatePower: number;
  // 엔드필드 전투 공식: 치명타 확률(0~1, 기본 0.05) / 치명타 피해(추가 배율, 기본 0.5 = +50%)
  critRate: number;
  critDamage: number;
  // 물리 방어불능 스택 역할: build=스택 적립 / consume=스택 소모. (물리 오퍼만)
  physBreak?: "build" | "consume";
  // 물리 이상 세분화(엔드필드): 띄우기·넘어뜨리기=스택 적립+CC, 강타=전소모 대량딜, 갑옷파괴=전소모+받피증.
  //  미지정 시 physBreak로 추론(build→launch, consume→crush).
  physAnomaly?: "launch" | "knockdown" | "crush" | "armor-break";
  // 연타(連打): 이 오퍼가 스킬 사용 시 파티에 연타 1스택 부여 → 다음 배틀/궁극 카드 피해 증가.
  grantsMultiHit?: boolean;
  // 카드 타겟 설정(컨셉): 배틀/연계 스킬이 광역인지. (궁극은 기본 광역)
  battleAoe?: boolean;
  linkAoe?: boolean;
  ultSingle?: boolean; // 단일 타겟 궁극(예외)
};

export type PartyMember = Operator & {
  hp: number;
  shield: number;
  ultimateCharge: number;
  actionGauge: number;
  passiveStacks: number;
  gear: GearLoadout;
};

export type Enemy = {
  id: string;
  name: string;
  image?: string;
  maxHp: number;
  attack: number;
  defense: number;
  speed: number;
  range: number;
  weight: number;
  staggerHp: number;
  intent: string;
  faction?: string;
  tier?: string;
  traits: string[];
  mechanics: EnemyMechanic[];
  elite?: boolean;
  boss?: boolean;
};

export type BattleEnemy = Enemy & {
  hp: number;
  statuses: EnemyStatus[];
  // 카드 템포: 플레이어가 카드를 actionEvery장 사용할 때마다 1회 행동한다.
  // actionGauge = 마지막 행동 이후 누적된 카드 수.
  actionGauge: number;
  actionEvery: number;
  revived?: boolean;
  // 불균형(스태거) 게이지: stagger가 staggerHp에 도달하면 불균형(defense-break) 상태가 되고,
  // breakTurns 만큼 행동 불가 + 받는 피해 ×1.3. 회복 시 stagger=0.
  stagger: number;
  breakTurns?: number;
  // 방어불능 스택(물리 전용, 0~4): 물리 오퍼가 누적→소모하면 '갑옷 파괴'(armor-break) 부여.
  physBreakStacks: number;
  armorBreakTurns?: number;
  // 카드 전투: 다음 적 행동 예고(텔레그래프)
  telegraph?: { kind: "attack" | "attack-all" | "buff" | "stunned"; damage: number; label: string };
};

export type TimelineEntry = {
  id: string;
  name: string;
  side: UnitSide;
  gauge: number;
};

export type GameEventChoice = {
  id: string;
  label: string;
  description: string;
  hpCost?: number;
  heal?: number;
  credits?: number;
  gearSlug?: string;
  gearReward?: boolean;
  relicReward?: boolean; // 유물 획득
  potionReward?: boolean; // 포션 획득
  promote?: number; // 정예화 토큰 획득(카드 강화 기회)
  duplicate?: boolean; // 복제: 습득 카드 3장 중 1장 복제(정예화 잠금)
};

export type GameEvent = {
  id: string;
  title: string;
  description: string;
  faction?: number; // 해당 세력(필드)에서만 등장(미지정=중립, 모든 세력)
  rare?: boolean; // 희귀 이벤트: 일반 로테이션 제외, 낮은 확률로만 등장
  choices: GameEventChoice[];
};

export type MapNode = {
  id: string;
  chapter: number; // 0부터: 밸리IV변경 → 밸리IV전선 → 아겔로스 → 무릉
  floor: number;
  column: number;
  type: NodeType;
  title: string;
  subtitle: string;
  next: string[];
  enemyIds?: string[];
  rewardTier?: RewardTier;
};

// 카드 덱빌더(슬더스/카제나식 수집형):
// 시작 덱은 기본 카드(공격/방어)뿐. 전투 보상으로 오퍼 스킬/전술 카드를 '습득'해 덱에 추가하고, 캠프에서 '강화'.
// DeckCard = 보유 카드 1장(영구 uid). src로 출처를 구분해 전투 시 실제 Card로 변환한다.
export type DeckCard = {
  uid: string; // 영구 고유 id
  src: "basic" | "operator" | "tactical";
  ref: string; // basic: 카드 키 / operator: operatorId / tactical: tacticalId
  kind?: SkillKind | "util"; // operator일 때 스킬 종류('util'=직군 유틸 카드)
  eliteLevel?: 0 | 1 | 2; // 정예화 단계(0=기본, 1차, 2차) — 위력·불균형치 강화
  copyLocked?: boolean; // 복제본: 복제 시점 상태로 고정, 정예화 영구 불가
};

export type CardTarget = "enemy" | "all-enemies" | "party";
export type Card = {
  uid: string; // 인스턴스 고유 id
  operatorId: string;
  operatorName: string;
  element: Element;
  kind: SkillKind; // attack | battle-skill | link-skill | ultimate
  cost: number; // 에너지 소모
  power: number; // 기본 피해(오퍼 스탯 기반)
  stagger: number; // 불균형치(적 불균형 게이지 누적량)
  name: string;
  icon: string;
  description: string; // 실제 스킬 설명(툴팁)
  effectLine: string; // 카드용 간결 효과 요약
  target: CardTarget;
  // 비피해/특수 효과: 실드·회복·에너지·드로우 / 셋업(아츠 부착)·버프(피해 증가)·대응(적 행동 지연)
  effect?: "shield" | "heal" | "energy" | "draw" | "setup" | "buff" | "delay";
  tactical?: boolean; // 전술 카드(오퍼 무관, 중립 효과)
  eliteLevel?: number; // 정예화 단계(0/1/2) — 표시·강화 판정용
  copyLocked?: boolean; // 복제본(정예화 불가) — 표시용
};

export type BattleState = {
  enemies: BattleEnemy[];
  hand: Card[];
  drawPile: Card[];
  discardPile: Card[];
  energy: number;
  maxEnergy: number;
  turn: number;
  log: string[];
  // 소비 아이템 전투 버프(이번 전투 한정)
  dmgBuffPct?: number; // 카드 피해 +비율
  critBuff?: number; // 치명타 확률 +
  partyRegen?: { amount: number; turns: number }; // 매 턴 파티 지속 회복
  multiHit?: number; // 연타 스택(0~4): 다음 배틀 스킬 +30~75% / 궁극 +20~50% 후 소모
};

export type RunState = {
  screen: Screen;
  factionIndex: number; // 이번 런의 카오스(세력) 인덱스
  party: PartyMember[];
  collectedGears: RunGear[];
  deck: DeckCard[]; // 보유 덱(기본 카드로 시작 → 습득/강화로 성장)
  deckSeq: number; // 카드 uid 발급 카운터
  cardsRemoved: number; // 상점 카드 삭제 누적(삭제 비용 상승용)
  relics: string[]; // 보유 유물 id (상시 패시브)
  potions: string[]; // 보유 포션 id (전투 중 소비)
  pendingCardOffers: string[]; // 전투 보상 카드 습득 선택지(세력 드래프트 토큰)
  pendingRelic?: string; // 엘리트/보스 유물 드랍(표시용)
  pendingPromotes?: number; // 정예/보스 처치 보상: 카드 정예화 가능 횟수(하이리스크 하이리턴)
  pendingDuplicate?: string[]; // 필드보스 보상: 복제 후보 3장(덱 카드 uid). 1장 골라 복제(정예화 잠금)
  repairUsed?: boolean; // 정비소(상점) 1회 무료 휴식/강화 사용 여부
  shopRelics: string[]; // 상점 유물 매물
  shopPotions: string[]; // 상점 포션 매물
  visitedNodes: string[];
  availableNodes: string[];
  currentNodeId?: string;
  pendingGearSlugs: string[];
  credits: number;
  sp: number;
  maxSp: number;
  cp: number;
  maxCp: number;
  battlesWon: number;
  battle?: BattleState;
  eventId?: string;
  result?: "victory" | "defeat" | "abandoned";
  // 보스 점수 도전 모드: 저장 덱으로 보스를 처치 턴수로 도전.
  challengeBossId?: string; // 진행 중인 도전 보스(없으면 일반 런)
  challengeTurns?: number; // 처치 턴수(결과)
  challengeBest?: number; // 해당 보스 최고 기록
  challengeNewRecord?: boolean; // 이번에 신기록 갱신
};

export type RunActions = {
  startRun: () => void;
  confirmDeployment: (operatorIds: string[]) => void;
  abandonRun: () => void;
  enterNode: (nodeId: string) => void;
  playCard: (uid: string, targetEnemyId?: string) => void;
  endTurn: () => void;
  equipRewardGear: (gearSlug: string, operatorId: string) => void;
  buyGear: (gearSlug: string, operatorId: string) => void;
  removeCard: (uid: string) => void;
  takeCardOffer: (token: string) => void;
  skipCardOffer: () => void;
  usePotion: (potionId: string, targetEnemyId?: string) => void;
  buyRelic: (relicId: string) => void;
  buyPotion: (potionId: string) => void;
  upgradeCard: (uid: string) => void;
  promoteCard: (uid: string) => void;
  skipPromote: () => void;
  duplicateCard: (uid: string) => void; // 후보 중 1장 복제
  skipDuplicate: () => void;
  repairRest: () => void;
  repairUpgrade: (uid: string) => void;
  saveDeck: () => boolean; // 현재 덱을 도전용으로 저장
  openChallenge: () => void; // 보스 선택 화면
  startChallenge: (bossId: string) => void; // 저장 덱으로 보스 도전 시작
  exitChallenge: () => void; // 도전 화면 → 배치로
  skipReward: () => void;
  resolveEvent: (choiceId: string) => void;
  rest: (mode: "heal" | "train") => void;
  continueToMap: () => void;
};
