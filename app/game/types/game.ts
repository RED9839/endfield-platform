export type Screen =
  | "map"
  | "battle"
  | "reward"
  | "event"
  | "camp"
  | "summary";

export type Element = "physical" | "heat" | "electric" | "cryo" | "nature";
export type NodeType = "battle" | "elite" | "event" | "camp" | "boss";
export type SkillKind = "attack" | "skill" | "guard";

export type Operator = {
  id: string;
  name: string;
  role: string;
  element: Element;
  image: string;
  maxHp: number;
  attack: number;
  skillName: string;
  skillPower: number;
  skillCost: number;
};

export type PartyMember = Operator & {
  hp: number;
  shield: number;
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
