export type Screen =
  | "map"
  | "battle"
  | "reward"
  | "event"
  | "camp"
  | "summary";

export type Element = "physical" | "heat" | "electric" | "cryo" | "nature";
export type NodeType = "battle" | "elite" | "event" | "shop" | "camp" | "boss";
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
export type PassiveMechanic =
  | "essence-collapse"
  | "obliteration-protocol"
  | "blade-cut"
  | "dolly-shadow"
  | "protective-vanguard";
export type EnemyStatus =
  | "originium-crystal"
  | "electric-attachment"
  | "shock"
  | "corrosion"
  | "defense-break";

export type RunGearCategory = "armor" | "gloves" | "kit";
export type GearSlot = "armor" | "gloves" | "kit1" | "kit2";
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
  kit2?: RunGear;
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
  speed: number;
  intent: string;
  elite?: boolean;
  boss?: boolean;
};

export type BattleEnemy = Enemy & {
  hp: number;
  statuses: EnemyStatus[];
  actionGauge: number;
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
};

export type GameEvent = {
  id: string;
  title: string;
  description: string;
  choices: GameEventChoice[];
};

export type MapNode = {
  id: string;
  floor: number;
  column: number;
  type: NodeType;
  title: string;
  subtitle: string;
  next: string[];
  enemyIds?: string[];
  rewardTier?: RewardTier;
};

export type BattleState = {
  enemies: BattleEnemy[];
  activeUnitId?: string;
  activeSide?: UnitSide;
  linkWindow?: {
    trigger: LinkTrigger;
    sourceOperatorId?: string;
    targetEnemyId?: string;
  };
  timeline: TimelineEntry[];
  turn: number;
  log: string[];
};

export type RunState = {
  screen: Screen;
  party: PartyMember[];
  collectedGears: RunGear[];
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
};

export type RunActions = {
  startRun: () => void;
  abandonRun: () => void;
  enterNode: (nodeId: string) => void;
  tickBattle: () => void;
  performAction: (operatorId: string, kind: SkillKind) => void;
  equipRewardGear: (gearSlug: string, operatorId: string) => void;
  resolveEvent: (choiceId: string) => void;
  rest: (mode: "heal" | "train") => void;
  continueToMap: () => void;
};
