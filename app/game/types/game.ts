export type Screen =
  | "map"
  | "battle"
  | "reward"
  | "event"
  | "camp"
  | "summary";

export type Element = "physical" | "heat" | "electric" | "cryo" | "nature";
export type NodeType = "battle" | "elite" | "event" | "camp" | "boss";
export type SkillKind = "attack" | "battle-skill" | "link-skill" | "ultimate";
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
  | "protective-arts";
export type EnemyStatus = "originium-crystal" | "electric-attachment" | "shock";

export type Operator = {
  id: string;
  name: string;
  role: string;
  className: OperatorClass;
  element: Element;
  image: string;
  maxHp: number;
  attack: number;
  normalAttackIcon: string;
  battleSkillName: string;
  battleSkillIcon: string;
  battleSkillDescription: string;
  linkSkillName: string;
  linkSkillIcon: string;
  linkSkillDescription: string;
  ultimateName: string;
  ultimateIcon: string;
  ultimateDescription: string;
  skillMechanic: SkillMechanic;
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
};

export type Enemy = {
  id: string;
  name: string;
  image?: string;
  maxHp: number;
  attack: number;
  intent: string;
  elite?: boolean;
  boss?: boolean;
};

export type BattleEnemy = Enemy & {
  hp: number;
  statuses: EnemyStatus[];
};

export type Relic = {
  id: string;
  name: string;
  description: string;
  icon: string;
  effect: "max-hp" | "attack" | "heal" | "sp";
  value: number;
};

export type GameEventChoice = {
  id: string;
  label: string;
  description: string;
  hpCost?: number;
  heal?: number;
  credits?: number;
  relicId?: string;
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
};

export type BattleState = {
  enemies: BattleEnemy[];
  turn: number;
  log: string[];
};

export type RunState = {
  screen: Screen;
  party: PartyMember[];
  relics: Relic[];
  visitedNodes: string[];
  availableNodes: string[];
  currentNodeId?: string;
  pendingRelicIds: string[];
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
  performAction: (operatorId: string, kind: SkillKind) => void;
  claimRelic: (relicId: string) => void;
  resolveEvent: (choiceId: string) => void;
  rest: (mode: "heal" | "train") => void;
  continueToMap: () => void;
};
