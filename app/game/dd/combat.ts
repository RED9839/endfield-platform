// ===== 다키스트 던전류 전투 엔진 (엔드필드 리뉴얼) =====
import { weaponTrigger } from "./weapons";
// 카드/드로우 없음. 속도 기반 턴 순서 + 고정 스킬킷 + 포지션(전열/후열) + 스킬 사용 요구사항(usage gate).
// 명일방주: 엔드필드 전투 시스템 wiki 정합. 액션 레이어만 DD류, 메커니즘은 원작.

export type DDStatus = "stun" | "combustion" | "corrosion" | "crystal" | "armor-break" | "shock" | "wing";
export type Element = "heat" | "electric" | "cryo" | "nature"; // 열기·전기·냉기·자연
export type DDClass = "guard" | "caster" | "striker" | "vanguard" | "defender" | "supporter"; // 직군 6종
export const ELEMENTS: Element[] = ["heat", "electric", "cryo", "nature"];
const EL_NAME: Record<Element, string> = { heat: "열기", electric: "전기", cryo: "냉기", nature: "자연" };

export type DDUnit = {
  id: string;
  name: string;
  side: "ally" | "enemy";
  cls?: DDClass; // 직군
  pos: number; // 1=전열 … 4=후열
  hp: number;
  maxHp: number;
  speed: number; // 행동 게이지(ATB) 충전 속도(오퍼 고유 민첩 — roster.ts applyAttrs)
  atb: number;   // 행동 게이지 0~100. 속도만큼 차고 100이면 행동, 초과분 이월.
  attack: number;
  opElement?: "physical" | Element; // 오퍼 주력 속성(장비 부품 속성 피해 보너스용)
  defense: number; // 방어력 → 받는 모든 피해 ×(100/(def+100)). 기본 0(장비로 증가)
  resist: Record<"physical" | Element, number>; // 속성별 저항(물리/열기/전기/냉기/자연, 0~1=1%↓, 음수=약점). 위키 저항표 정합
  // 물리 이상
  physBreak: number; // 방어 불능 스택(표식) 0~4. 자체 효과 없음 — 강타/갑옷파괴로 소모, 띄우기/넘어뜨리기 효과 발동
  // 불균형치(stagger): 가득 차면 불균형 상태 → 행동 불가 + 받는 피해 +30% + 처형 가능
  stagger: number;
  staggerMax: number; // 0이면 불균형 없음(아군 등)
  staggered: boolean;
  staggerTimer: number; // 불균형 지속 라운드
  statuses: DDStatus[];
  dot: number; // 매 라운드 시작 지속 피해(연소 등)
  regen?: number; // 매 라운드 시작 지속 회복(시트론/야침 재생 전술 아이템)
  regenTurns?: number; // 재생 잔여 라운드
  multiHit: number; // 연타 스택: 다음 배틀/궁극 피해 강화(강타엔 미적용)
  ultCharge: number; // 궁극 게이지
  ultCost: number;
  atkBuff: number; // 공격력 증가(관리자 본질 붕괴 등) 0.30=+30%
  critRate: number; // 치명타 확률(기본 0.05). 기댓값 ×(1+치확×치피)로 적용
  critDmg: number; // 치명타 피해(기본 0.50)
  // 아츠 이상
  arts: Record<Element, number>; // 속성별 부착 스택 0~4(따로 계산)
  frozen: number; // 동결 잔여 스택(쇄빙 대기) 0=미동결
  // 버프/디버프 (위계: all ⊃ physical|arts ⊃ 속성)
  amp: Partial<Record<DmgKey, number>>; // 증폭(입히는 피해↑), 중첩 가능(합연산)
  vuln: Partial<Record<DmgKey, number>>; // 취약 효과(원문 1.8) — 텍스트에 '취약'이 명시된 것만
  resShred: number;       // 부식 저항 감소(원문 1.12) — 저항 '포인트'를 깎는다. 취약과 달리 저항 버킷. 상한 0.24=24포인트
  recv: Partial<Record<DmgKey, number>>; // 받는 대미지 증가(원문 1.9) — 감전/갑옷파괴/자이히 재능 등 '취약'이 아닌 받는 피해↑
  weakenMul: number; // 허약(공격력↓, 곱연산). 1=영향없음
  protection: number; // 비호(받는 피해↓), 중첩 불가(최고값). 0.3=-30%
  shield: number; // 보호막(보호): 피해 흡수
  speedMod: number; // 가속(+)/감속(-): 턴 순서 보정
  timers: Record<string, number>; // 효과키 → 잔여 턴(1턴=5초). 라운드 시작 감쇠, 재적용 시 리셋
  effectSrc: Record<string, EffectSrc>; // 효과키 → 출처(누가·무엇으로 걸었나). setTimer 시 SRC_CTX로 기록
  linkCd: number; // 연계 스킬 쿨타임(잔여 턴)
  rampAtk?: number; // 진천우 칼날 베기: 스킬 명중마다 공격력 누적(스택당 값, 최대 5스택)
  stance: number; // 미브 청파 삼형 스탠스(0=단운 / 1=추형 / 2=개천)
  ironOath: number; // 포그 철의 서약(적에 부여, 물리이상/포그연계가 1씩 소모 → 교란/최후의 승부)
  gaugeRecovered: number; // 포그 생존의 깃발 누적 게이지(80마다 사기 격양)
  gearGrade: number; // 장비 등급(힘/민첩/지능/의지 통합 치환값, 명함 ~60). 스탯 비례 재능이 이걸 참조
  attrs?: { str: number; agi: number; int: number; wil: number }; // 실제 능력치(endfield.wiki.gg 실측). 원작 공식대로 주/부옵이면 공격력으로만 흐른다(4종 대등) + 힘→체력. 속도는 무기 타입.
  // 패널 능력치(원작 표기값) — 장비/무기 능력치를 밸런스 축소 없이 그대로 합산.
  // 결의 진결 폼 판정처럼 "원작 화면에 뜨는 수치"가 기준인 곳에만 쓴다(피해 계산은 attrs 사용).
  panelAttrs?: { str: number; agi: number; int: number; wil: number };
  strMul?: number;   // 일반 공격 피해 배율(레바테인 「어둠 · 울부짖는 불길」 궁 후 +120% 등). 평시 1
  battleAmp?: number; // 배틀 스킬 한정 증폭(장방이 「억제 · 떠도는 번개」). 0.32=+32%
  skillAttrMul?: number; // 지능 → 스킬(배틀/연계/궁) 피해 배율
  wilMul?: number;   // 의지 → 유틸·궁극기 게이지 배율
  healRecv?: number; // 의지 → 받는 회복량 배율(1.0 기준). 회복 시 곱연산
  procCount: number; // 제너릭 재능 카운터(아크라이트 황무지의 방랑자 등)
  chainStep?: number;    // 스킬 연계 체인에서 이 오퍼가 맡은 단계(예약 시 기록, 발동 시 소비)
  pendingLink?: DDSkill; // 예약된 연계 — 조건이 열리면 ATB 우선으로 끼어든 뒤 자기 차례에 이 연계를 발동
  pendingLinkAtb?: number; // 연계 예약 직전 ATB — 연계 발동 후 복원해 정규 턴을 뺏지 않음(원래 턴 + 연계 턴)
  selfDestruct?: number; // 적 자폭(화염원석충): 사망 시 광역 아군 피해(배율) + 취약 부착
  shell?: number;        // 적 방어 형태(0~1 피해 감소): 은신/웅크림. 강타·갑옷파괴·불균형으로 해제
  shellBroken?: boolean; // 방어 형태 해제됨(약점 노출)
  revive?: boolean;      // 부활(잔영): 사망 시 1회 재생(HP 50%) + 이후 강화
  revived?: boolean;     // 부활 사용됨
  pull?: boolean;        // 끌어당김(결정아겔로스): 후열 딜러를 강제 타격 + 취약
  summon?: boolean;      // 소환(삼미아겔로스 돌기둥 등): 전투 중 부하 추가
  dotBurst?: boolean;    // 지속+폭발(본 크러셔 사수): 명중 시 지속 피해 부여 후 폭발
  unstoppable?: boolean; // 끊기 저항(본 크러셔 파괴자): 불균형 지속 단축(공세 계속)
  teleport?: boolean;    // 순간이동(본 크러셔 염술사)/회피(침투자): 근접 공격 회피 확률
  stun?: boolean;        // 속박·기절(단운수·형상아겔로스): 명중 아군 확률 행동 불가
  slow?: boolean;        // 감속(모방아겔로스·겁운객): 명중 아군 ATB 속도 저하
  heal?: boolean;        // 치유(겁운객): 자기 턴에 아군[적] 최저 체력 회복
  buff?: boolean;        // 동료 강화(굴절아겔로스): 자기 턴에 다른 적 공격력 강화
  charge?: boolean;      // 차징(프릭·레이커비스트 등): 한 턴 강공 예고 → 다음 턴 강타. 예고 중 불균형시키면 캔슬+추가 불균형
  charging?: number;     // 차징 상태(런타임): >0이면 강공 예고 중(남은 턴)
  poiseKnot?: boolean;   // 불균형 지점(정예/보스): 불균형 게이지 중간을 넘으면 1회 짧은 중단
  poiseBroken?: boolean; // 불균형 지점 이미 돌파함(1회만)
  attachEl?: Element;    // 적 공격의 아츠 부착 속성(수정아겔로스 냉기 등): 명중 아군에 부착
  iceStack?: number; // 이본 「아이스 슈터」 변신 중 평타 누적(치확 +3%/스택, 최대 10)
  isMain?: boolean;  // 파티 메인딜러(편성 첫 오퍼 = 공략 시트 채용파티의 주인). 공유 게이지 우선권.
  shockLv?: number;    // 감전 이상 레벨(1~4). 장방이 「뇌정의 부름」이 '소모한 감전 이상 레벨+1'만큼 청뢰검을 만든다
  summonedBy?: string; // 이 유닛을 소환한 본체(소환체 전멸 판정용)
  phaseIdx?: number;   // 보스 현재 페이즈(0=1페이즈). 전환 시 증가
  guardIds?: string[]; // 이 본체를 지키는 부위(전부 죽어야 본체가 피격 대상이 된다)
  invuln?: boolean;    // 페이즈 기믹 무적(트리아겔로스 소환 중)
  didosUsed?: number;  // 자이히 디도스 지원 결정체가 쓴 치유 횟수(원문 최대 2회) — 연계 「스트레스 테스트」 조건
  zfyUsedFree?: boolean; // 장방이 천리의 경지: 첫 배틀 무소모를 이미 썼는가
  utilMult: number;  // 스킬 단조 유틸 배율(취약·증폭·회복·게이지·지속) × 의지. M0=1.0
  utilBase?: number; // 의지 곱하기 전 스킬 단조 유틸 배율(재계산 기준값)
  killPriority?: number; // 아군 자동 타겟 처치 우선(적 한정): 3=지원(치유/증폭) 2=원거리 1=전열
  lanceN?: number;   // 아비웨나 썬더랜스(적에게 누적, 가로채기로 소모) — 일반
  lanceBig?: number; // 아비웨나 강력 썬더랜스(적에게 누적) — 강력(전기 부착)
  artsImmune?: number; // 아츠 부착 확률 면역(아크라이트 만물의 지혜 0.5 = 50% 무효)
  artsStr?: number;    // 오리지늄 아츠 강도(열작업/펄스 세트 +30) — 물리/아츠 이상 피해 ×(1+강도/100)
  artsStrBase?: number; // 무기 시리즈의 일시적 아츠 강도 버프(미브) 만료 시 되돌릴 상시값
  linkCdMul?: number;  // 연계 쿨타임 배율(청파/개척 세트 0.85) — act()에서 linkCd에 곱
  ultEffMul?: number;  // 궁극기 충전 효율 배율(장비 부옵) — 배틀/연계 궁충에 곱
  cryoImmune?: boolean; // 냉기 부착 면역(에스텔라 이유 있는 게으름 — 동결 불가)
  gear?: GearBonus; // 장착 세트 효과(2부위 발동, gear.ts applyGear가 세팅). 데미지·불균형 배율에 가산
  gearSets?: string[]; // 활성 세트명(조건부 발동 효과 트리거용 — 연소 후 열기+·연계 후 배틀+ 등)
};

// 장비 세트 전투 배율(gear.ts에서 계산해 유닛에 부착). 즉시 효과(치명·보호막·회복·게이지)는 applyGear가 스탯에 직접 반영.
export type GearBonus = {
  kindDmg: Partial<Record<DDSkill["kind"] | "all", number>>; // 스킬 종류별 피해 %
  elemDmg: Partial<Record<Element | "all", number>>;         // 아츠 피해 %
  vsBroken: number;   // 불균형(staggered) 적 추가 피해 % — 게이지가 차 행동 불가가 된 상태
  vsDefBreak: number; // 방어 불능(physBreak) 적 추가 피해 % — 물리 이상 표식. 불균형과 별개 기제다
  healGuard: number;  // 생체 보조: 치유한 대상이 받는 피해 감소 %
  anomalyHit: number; // 검술사: 물리 이상 부여 후 공격력 N배 추가 물리
  dmgReduce: number;  // 받는 모든 피해 감소 %(생체 보조 접속기·위기 탈출 식별 패널)
  vsVuln: number;   // 취약 적 추가 피해 %
  vsArts: number;   // 아츠 부착 적 추가 피해 %
  staggerMul: number;    // 불균형 누적 증가 %
  breakEnergy: boolean;  // 불균형 돌파 시 궁 충전
  selfHpHighPhys: number; // 자신 HP 50%↑ 시 물리 피해 %(순행 전달자)
  selfHpHighArts: number; // 자신 HP 50%↑ 시 아츠 피해 %(침식 차단)
  selfHpLowReduce: number; // 자신 HP 50%↓ 시 받는 피해 감소 %(중장갑 전달자)
  onKillHeal: number;     // 적 처치 시 자신 회복(maxHp %)(통합형 중갑)
  onKillAtk: number;      // 적 처치 시 자신 공격력 증가(통합형 경갑)
};

export type DmgKey = "all" | "physical" | Element | "arts"; // 피해 위계 키

export type TargetMode = "single-front" | "single-lowhp" | "row" | "all" | "self";

export type DDSkill = {
  id: string;
  name: string;
  kind: "attack" | "battle" | "link" | "ult"; // 일반공격·배틀·연계·궁극
  fromPos: number[]; // 사용 가능 위치(전열/후열 제약)
  target: TargetMode;
  targetRanks?: number[]; // 명중 가능한 적 랭크(생략 시 전체)
  power: number; // 공격력 배율(스킬 발동 피해). 다단히트면 hits 합과 일치.
  hits?: number[]; // 다단히트 단별 배율(소스 레벨표). 표시 전용 — 총 피해는 power로 계산하고 로그에서 이 비율로 쪼갠다.
  element?: "physical" | Element; // 피해 속성(생략 시 물리)
  staggerVal?: number; // 불균형치(생략 시 배틀/연계 10, 궁 25)
  attach?: Element; // 아츠 부착(→ 폭발/이상 트리거)
  anomaly?: "launch" | "knockdown" | "crush" | "armor-break"; // 물리 이상
  selfPhysBonus?: number; // 띄우기/넘어뜨리기마다 추가 물리(공격력×배수) — 여풍 복마
  powerOf?: (self: DDUnit) => number; // 시전자 상태로 배율이 갈리는 스킬(결 진결 폼) — 없으면 power 사용
  requires?: (target: DDUnit | undefined, self: DDUnit, state: DDState) => boolean; // 사용 요구(usage gate)
  requiresText?: string;
  grants?: string; // 이 스킬이 만드는 상태(다른 스킬의 requiresText와 매칭) — AI 셋업 우선순위용
  cooldown?: number; // 연계 쿨타임(턴, 생략 시 기본 3)
  gaugeCost?: number; // 스킬 게이지 소모(생략 시 100). 미브 추형/개천=50
  gaugeRefund?: number; // 게이지 반환(미브 단운=50)
  gaugeGain?: number; // 사용 시 스킬 게이지 회복(포그 보름달/궁 — 뱅가드 수급)
  gaugeOnConsume?: number[]; // 방불 N스택 소모 시 게이지 회복(포그 전선분쇄, 인덱스 0~3=1~4스택)
  grantsIronOath?: number; // 적에 철의 서약 N포인트 부여(포그 궁)
  shockBonus?: { power: number; gauge: number }; // 감전 적에 추가 전기타 + 게이지(아크라이트 질풍 섬광)
  forceShock?: boolean; // 강제 감전 부여(아크라이트 궁: 전기 부착 소모→감전)
  forceFreeze?: boolean; // 냉기 부착 적 → 냉기 소모 + 강제 동결 + 게이지(알레쉬 비정규 루어)
  freezeZone?: number; // 빙설 지대: 부착 무관 직접 동결 N스택 + 지속 냉기(스노우샤인 살얼음 추위)
  burnShockConsume?: number; // 연소/감전 상태 소모 → 추가 열기타 + 게이지(울프가드 탄흔의 열기). 소모 시 부착 생략
  forceBurn?: boolean; // 강제 연소 부여(울프가드 늑대의 분노) + 불타는 송곳니
  cryoNuke?: number; // 냉기 부착 전부 소모 → 스택 비례 누킹 + 저체온증 냉기 취약 + 강제 정지(라스트 라이트 겨울 포식자). 값=스택당 배율
  lanceRecover?: boolean; // 설치된 썬더랜스 전부 회수 → 투창 수 비례 중복 전기타 + 강력 투창 전기 부착(아비웨나 가로채기)
  crushAmp?: number; // 강타 payoff 추가 배율(판 조미료 뿌리기 추가 강타 피해 +10% = 1.1)
  iceBomb?: boolean; // 냉기/자연 부착 전부 소모 → 강제 동결 + 스택 비례 냉기 + 궁충(이본 얼음 폭탄·β형)
  lure?: { power: number; gauge: number }; // 진귀한 린수(알레쉬 연계): 확률로 강화 피해 + 게이지
  grantsMultiHit?: number; // 사용 후 자신에게 연타 부여(아케쿠리 궁 몰입의 시간 — 연타 소모 후 부여)
  requiresStance?: number; // 미브 스탠스 요구(추형≥1, 개천≥2)
  setStanceTo?: number; // 사용 후 스탠스 설정
  stanceFromCrush?: boolean; // 강타로 방불 3+ 소모 시 스탠스 2(미브 추형)
  vsWeak?: number; // 물리취약/불균형 적 추가 피해(미브 냉정 등)
  crystal?: boolean; // 오리지늄 결정 부착(관리자 봉인 시퀀스)
  apply?: (target: DDUnit, self: DDUnit) => void; // 추가 효과(취약·연타 등)
  selfUlt?: boolean; // 궁극(게이지 소모)
  hitsOf?: (self: DDUnit) => number[] | undefined; // 런타임 결정 타수(장방이 청뢰검). 반환 시 hits보다 우선
  note?: string;
};

const MAX_BREAK = 4;
const has = (u: DDUnit, s: DDStatus) => u.statuses.includes(s);
const add = (u: DDUnit, s: DDStatus) => { if (!has(u, s)) u.statuses.push(s); };
const rm = (u: DDUnit, s: DDStatus) => { u.statuses = u.statuses.filter((x) => x !== s); };

// 유효 공격력 배율: 공격력 증가(atkBuff) × 허약(weakenMul). 모든 피해 산출에 공통.
const eb = (u: DDUnit) => (1 + (u.atkBuff || 0)) * (u.weakenMul ?? 1);

// 장비 세트 조건부 발동(원작 그대로·살짝 너프): 이벤트 시 시전자에 amp 버프. 기존 amp 시스템(ampFor)으로 반영.
// 이벤트: anomaly:<el>(아츠 이상 발동) · attach2(아츠 2부착 폭발) · crush(강타/갑옷파괴) · physBreak(띄우기/넘어뜨리기) · link/battle(스킬 사용)
export function gearTrigger(self: DDUnit, event: string, target?: DDUnit): void {
  const gs = self.gearSets; if (!gs || !gs.length) return;
  // 고검의 잔향 원문: 목표가 물리 취약·불균형·오리지늄 결정 상태면 버프가 1.5배.
  const boon = target && ((target.vuln.physical || 0) > 0 || target.staggered || target.statuses.includes("crystal" as never)) ? 1.5 : 1;
  // amp(세트명, 키, 스택당%, 지속턴, 최대누적) — 출처를 장비 세트로 기록. namu 3.1 원문 실측값.
  const amp = (set: string, key: DmgKey, v: number, dur: number, cap = v) => { self.amp[key] = Math.min(cap, (self.amp[key] || 0) + v); const prev = pushSrc({ by: self.name, via: set, kind: "gear" }); setTimer(self, "amp:" + key, dur); popSrc(prev); };
  if (event === "anomaly:heat" && gs.includes("열 작업용")) amp("열 작업용", "heat", 0.5, 2);       // 연소 후 열기 +50%
  if (event === "anomaly:nature" && gs.includes("열 작업용")) amp("열 작업용", "nature", 0.5, 2);    // 부식 후 자연 +50%
  if (event === "anomaly:electric" && gs.includes("펄스식")) amp("펄스식", "electric", 0.5, 2);   // 감전 후 전기 +50%
  if (event === "anomaly:cryo" && gs.includes("펄스식")) amp("펄스식", "cryo", 0.5, 2);           // 동결 후 냉기 +50%
  if ((event === "anomaly:electric" || event === "anomaly:nature") && gs.includes("식양의 흐름")) amp("식양의 흐름", event.slice(8) as DmgKey, 0.15, 5, 0.45); // 소모 시 +15%(최대 3스택)
  if (event === "attach2" && gs.includes("조류의 물결")) amp("조류의 물결", "arts", 0.35, 2);          // 2부착 후 아츠 +35%
  if (event === "crush" && gs.includes("고검의 잔향")) amp("고검의 잔향", "physical", 0.24 * boon, 2, 0.24 * boon); // 강타·갑옷파괴 시 물리 +6%×스택(최대 24%, 조건부 1.5배)
  if (event === "physBreak" && gs.includes("경량 초자연")) amp("경량 초자연", "physical", 0.16, 2, 0.48); // 방어불능 +8%×4 + 4스택 추가 +16%
  if (event === "link" && gs.includes("본 크러셔")) amp("본 크러셔", "all", 0.30, 2);                // 연계 후 다음 배틀 +30%
  if (event === "link" && gs.includes("청파")) amp("청파", "all", 0.20, 2, 0.40);               // 연계 후 모든 스킬 +20%(최대 2스택)
  if (event === "battle" && gs.includes("응룡 50식")) amp("응룡 50식", "all", 0.20, 3, 0.60);        // 배틀 후 다음 연계 +20%(최대 3스택)
}
const skElem = (skill: DDSkill): "physical" | Element => (skill.element && skill.element !== "physical" ? skill.element : "physical");

// 증폭/취약 위계 합산: all + (physical | arts) + 속성. 상위 효과가 하위 포함.
function tierSum(map: Partial<Record<DmgKey, number>> | undefined, elem: "physical" | Element): number {
  if (!map) return 0;
  let x = map.all || 0;
  if (elem === "physical") x += map.physical || 0;
  else x += (map.arts || 0) + (map[elem] || 0);
  return x;
}
export const ampFor = (u: DDUnit, elem: "physical" | Element) => tierSum(u.amp, elem);
export const vulnFor = (u: DDUnit, elem: "physical" | Element) => tierSum(u.vuln, elem);
export const recvFor = (u: DDUnit, elem: "physical" | Element) => tierSum(u.recv, elem);

// 효과 타이머 세팅(재적용 시 리셋). 라운드 시작 시 감쇠 → 0이면 expire.
// 효과 출처(누가·무엇으로). kind: 스킬/무기 시리즈/장비 세트/아이템.
export type EffectSrc = { by: string; via: string; kind: "skill" | "weapon" | "gear" | "item" };
// 현재 효과 적용 컨텍스트 — act()가 스킬 출처로 세팅, gearTrigger/weaponTrigger가 일시 override. setTimer가 이걸 기록.
let SRC_CTX: EffectSrc | null = null;
export function pushSrc(ctx: EffectSrc | null): EffectSrc | null { const prev = SRC_CTX; SRC_CTX = ctx; return prev; }
export function popSrc(prev: EffectSrc | null): void { SRC_CTX = prev; }
export const setTimer = (u: DDUnit, key: string, turns: number) => { u.timers[key] = turns; if (SRC_CTX) u.effectSrc[key] = SRC_CTX; else delete u.effectSrc[key]; };
export function bumpVuln(u: DDUnit, key: DmgKey, val: number, turns = DUR_VULN) {
  u.vuln[key] = Math.max(u.vuln[key] || 0, val);
  setTimer(u, "vuln:" + key, turns);
}
// 받는 대미지 증가(원문 1.9). 취약과 '별개 곱연산 인자'라 버킷을 나눈다.
// 키 내부는 max 누적 — 매턴 재부여되는 감전/갑옷파괴가 무한 증식하는 것을 막기 위한 의도적 편차.
export function bumpRecv(u: DDUnit, key: DmgKey, val: number, turns = DUR_VULN) {
  u.recv[key] = Math.max(u.recv[key] || 0, val);
  setTimer(u, "recv:" + key, turns);
}
// 일반 버프 적용(증폭·허약·비호·보호막·속도). 서포터/디펜더가 사용.
export function applyBuff(u: DDUnit, kind: "amp" | "weaken" | "protection" | "shield" | "speedMod", a: number, b?: number, turns = DUR_BUFF) {
  if (kind === "amp") { const k = (b as unknown as DmgKey) ?? "all"; u.amp[k] = (u.amp[k] || 0) + a; setTimer(u, "amp:" + k, turns); }
  else if (kind === "weaken") { u.weakenMul *= 1 - a; setTimer(u, "weaken", turns); } // 곱연산
  else if (kind === "protection") { u.protection = Math.max(u.protection, a); setTimer(u, "protection", turns); }
  else if (kind === "shield") { u.shield += a; setTimer(u, "shield", turns); }
  else if (kind === "speedMod") { u.speedMod += a; setTimer(u, "speedMod", turns); }
}
function expire(u: DDUnit, key: string): void {
  if (key === "physBreak") u.physBreak = 0;
  else if (key === "atkBuff") u.atkBuff = 0;
  else if (key === "strMul") u.strMul = 1;          // 무기: 궁 후 평타 강화 종료
  else if (key === "battleAmp") u.battleAmp = 0;    // 무기: 배틀 한정 증폭 종료
  else if (key === "artsStrW") u.artsStr = u.artsStrBase ?? 0; // 무기: 아츠 강도 버프 종료
  else if (key === "critRate") u.critRate = BASE_CRIT_RATE;
  else if (key === "critDmg") u.critDmg = BASE_CRIT_DMG;
  else if (key === "stance") u.stance = 0;
  else if (key === "ironOath") u.ironOath = 0;
  else if (key === "dot") { u.dot = 0; rm(u, "combustion"); }
  else if (key === "frozen") { u.frozen = 0; rm(u, "stun"); }
  else if (key === "iceshot") u.iceStack = 0; // 이본 아이스 슈터 변신 종료 → 치확 스택 소멸
  else if (key === "stun") rm(u, "stun"); // 시간 정지(탕탕 궁) 만료
  else if (key === "weaken") u.weakenMul = 1;
  else if (key === "protection") u.protection = 0;
  else if (key === "shield") u.shield = 0;
  else if (key === "speedMod") u.speedMod = 0;
  else if (key.startsWith("arts:")) u.arts[key.slice(5) as Element] = 0;
  else if (key === "resShred") { u.resShred = 0; rm(u, "corrosion"); }
  else if (key.startsWith("vuln:")) { delete u.vuln[key.slice(5) as DmgKey]; if (key === "vuln:all") rm(u, "corrosion"); }
  else if (key.startsWith("recv:")) delete u.recv[key.slice(5) as DmgKey];
  else if (key === "shock") delete u.shockLv;
  else if (key.startsWith("amp:")) delete u.amp[key.slice(4) as DmgKey];
}

// 방어 경감: 방어력(%감소) × 물리/아츠 저항. 받는 측 스탯 적용.
// 원문 1.10 방어 수치 = 100/(방어력+100). 데이터마인 확인: 모든 적 방어력 = 100(attrType 3) → 적은 일률 0.5배.
// 아군 방어력은 장비에서만 나오며 같은 식을 쓴다(원문 예시 100/240 = 방어 140 검증).
export const DEF_K = 100;
export function mitigate(u: DDUnit, dmg: number, elem: "physical" | Element): number {
  let d = dmg * (DEF_K / (u.defense + DEF_K)); // 방어력 경감(DEF_K 클수록 완만)
  // 원문 1.12: 저항 수치 = 1 - (저항 - 저항감소)/100. 부식은 취약이 아니라 저항 포인트를 깎는다 → 저항 높은 적일수록 효과가 크다.
  d *= 1 - (u.resist[elem] - (u.resShred || 0));
  if (u.gear?.dmgReduce) d *= 1 - u.gear.dmgReduce; // 장비 부가옵 "모든 피해 감소"
  if (u.shell && !u.shellBroken && !u.staggered) d *= 1 - u.shell; // 방어 형태(은신·웅크림): 피해 감소. 불균형(강타·갑옷파괴 누적)이면 해제 → 약점 노출(원작 "팔 파괴 시 해제")
  return d;
}

// 피해 적용: 보호막(보호) 우선 흡수 → 체력. 실제 체력 피해 반환.
export function applyDamage(u: DDUnit, dmg: number): number {
  if (u.invuln) return 0; // 페이즈 기믹 무적(트리아겔로스: 소환체가 남아있는 동안 본체 무적)
  let d = Math.max(0, Math.round(dmg));
  if (u.shield > 0) { const ab = Math.min(u.shield, d); u.shield -= ab; d -= ab; }
  u.hp = Math.max(0, u.hp - d);
  return d;
}

// 보스 페이즈 전환. sim이 매 행동 뒤에 호출한다(roster를 직접 import하면 순환이라 provider 주입).
export type PhaseHook = (s: DDState, boss: DDUnit, log: string[]) => void;
let phaseHook: PhaseHook | null = null;
export const setPhaseHook = (f: PhaseHook) => { phaseHook = f; };
export const runPhases = (s: DDState, log: string[]) => {
  if (!phaseHook) return;
  // HP 0도 포함해야 한다 — "페이즈 체력바를 다 깎으면 다음 페이즈"(네파리스·트리아겔로스)가 여기서 걸린다.
  for (const u of [...s.units].filter((x) => x.side === "enemy")) phaseHook(s, u, log);
};

// 회복: 체력 회복(최대 초과 X). 카뮤 혈류 소생(자기 회복 시 열기 증폭) 처리.
export const ATTR_AVG = 116;     // 능력치 평균(힘/민첩/지능/의지 각각)
export const ATTR_BASE = 82;     // 로스터 최저 능력치. 이 선이 ×1.0 — 능력치가 낮다고 페널티를 주지 않는다.
export const ATTR_ALPHA = 0.004; // 기준선 초과 1당 +0.4%
// 능력치 → "+알파" 배율. 기준선(82) 초과분만 보너스 → 항상 ×1.0 이상, 오퍼별로 같은 스탯이 같은 역할만 한다.
export const attrBonus = (v?: number) => (v ? +(1 + Math.max(0, v - ATTR_BASE) * ATTR_ALPHA).toFixed(3) : 1);

// 저항: 장비 능력치(gearGrade)만으로 결정. 오퍼 능력치는 관여하지 않는다.
// 방어력이 이미 피해를 깎으므로(장비 140 → -22%) 저항 기여는 RESIST_K로 눌러 이중 스케일링을 막는다. 장비 풀세트(gearGrade 120) → 약 11%.
const RESIST_K = 0.001;
export function attrResists(gearGrade: number): { physical: number; heat: number; electric: number; cryo: number; nature: number } {
  const rv = +Math.min(0.9, 1 - 1 / (RESIST_K * gearGrade + 1)).toFixed(3);
  return { physical: rv, heat: rv, electric: rv, cryo: rv, nature: rv };
}

// by = 치유를 시전한 오퍼(무기 의료 시리즈 「자신 스킬로 치유한 후」 트리거용). 없으면 트리거 없이 회복만.
export function healUnit(u: DDUnit, amount: number, s: DDState, log: string[], by?: DDUnit): void {
  if (u.hp <= 0) return;
  const before = u.hp;
  u.hp = Math.min(u.maxHp, u.hp + Math.round(amount * (u.healRecv ?? 1))); // 의지 → 받는 회복량
  log.push(`  → ${u.name} 회복 +${u.hp - before}`);
  if (by?.side === "ally") weaponTrigger(by, "heal", living(s, "ally")); // 의료(자이히): 치유 후 팀 공격력+
  // 생체 보조 3피스: 치유한 대상이 받는 모든 피해 감소(원문 -15%, 과치유 시 -30%)
  const hg = by?.gear?.healGuard ?? 0;
  if (hg > 0 && by?.side === "ally") { const over = before + Math.round(amount * (u.healRecv ?? 1)) > u.maxHp; applyBuff(u, "protection", over ? hg * 2 : hg, undefined, 2); }
  if (u.id === "camu") { // 혈류 소생: 자기 회복 시 열기 피해 +4%(최대 5스택=0.20), 팀 25%(0.01)
    u.amp.heat = Math.min(0.2, (u.amp.heat || 0) + 0.04); setTimer(u, "amp:heat", 8);
    for (const a of living(s, "ally")) if (a.id !== "camu") { a.amp.heat = Math.min(0.05, (a.amp.heat || 0) + 0.01); setTimer(a, "amp:heat", 8); }
  }
}

// 정화: 해로운 효과 제거(아군 디버프 해제). 결정/방불 등 표식도 함께 정리.
export function cleanse(u: DDUnit): void {
  u.vuln = {}; u.weakenMul = 1; u.dot = 0; u.frozen = 0; u.physBreak = 0;
  u.statuses = u.statuses.filter((s) => s === "crystal");
  u.arts = { heat: 0, electric: 0, cryo: 0, nature: 0 };
  for (const k of Object.keys(u.timers)) // 디버프 타이머만 제거(버프는 유지)
    if (k.startsWith("vuln:") || k.startsWith("arts:") || ["weaken", "dot", "frozen", "physBreak"].includes(k)) { delete u.timers[k]; delete u.effectSrc[k]; }
}

// 강타/갑옷파괴/연타 계수(스택 1~4) — 전투 시스템 wiki 정합
const CRUSH = [3.0, 4.5, 6.0, 7.5];         // 강타: 방불 전부 소모
const ARMOR = [1.0, 1.5, 2.0, 2.5];         // 갑옷 파괴
const ARMOR_VULN = [0.12, 0.16, 0.2, 0.24]; // 갑옷 파괴 물리취약
const MH_BATTLE = [0.3, 0.45, 0.6, 0.75];   // 연타: 배틀 스킬 강화
const MH_ULT = [0.2, 0.3, 0.4, 0.5];        // 연타: 궁극기 강화
const ANOM = [1.6, 2.4, 3.2, 4.0];          // 아츠 이상(연소/감전/부식) 계수
const BURN_DOT = [0.24, 0.36, 0.48, 0.6];   // 연소 지속피해/초
const SHATTER = [2.4, 3.6, 4.8, 6.0];       // 쇄빙(동결 스택 비례, 물리)
const ELEC_VULN = [0.12, 0.16, 0.2, 0.24];  // 감전 아츠취약
const CORR_SHRED = [0.12, 0.16, 0.2, 0.24]; // 부식 저항 감소

// 스킬랭크 계수: roster/combat의 딜 계수는 나무위키 "스킬랭크1(Lv1)" 기준. 유저 밸런스 기준 = 전투스킬 9레벨·단조 0.
// 나무위키 배율표: 스킬 Lv1~9는 선형(예 변화의 숨결 160→288%), Lv10~12가 단조1~3(→360%=M3). 단조0·Lv9 = Lv1의 ×1.8(288/160).
// (X→Y% 표기의 Y는 Lv12=M3라 ×2.25 — 그건 단조3이므로 틀림). 아군 딜에 일괄 적용 → 단조0/스킬랭크9 재현.
export const SKILL_RANK9 = 1.8;

// 자원 경제(전투 시스템 wiki): 스킬 게이지(파티 공유) + 궁극기 에너지(개인)
export const GAUGE_COST = 100;     // 배틀 스킬 1칸 소모
// 스킬 연계 체인(연출 전용): 아군 행동이 다른 아군의 연계를 불러 이어진 깊이.
// 피해에는 관여하지 않는다 — 밸런스를 건드리지 않고 '이어지는 감각'만 보여주기 위한 카운터다.
export const CHAIN_MAX = 9;
const ANOMALY_WINDOW = 2;  // 아츠 이상/부착 소모·흡수 윈도우 지속(턴). 1이면 그 라운드 안에서만 = 속도 느린 셋업이 빠른 페이오프를 못 살림
export const GAUGE_REGEN = 45;     // 라운드당 자연 회복(≈12.5초/칸)
const BASIC_RECOVER = 18;   // 일반 공격 강력한 일격 → 게이지 회복
const EXEC_RECOVER = 30;    // 처형(불균형 적) → 게이지 추가 회복
export const EXECUTE_MULT = 6;     // 처형 피해 배율(불균형 적 일반 공격)
const ULT_BATTLE = 6.5;     // 배틀 사용 시 아군 전체 궁 충전
const ULT_LINK = 10;        // 연계 사용 시 시전자 궁 충전
const MORALE_STEP = 80;     // 포그 「생존의 깃발」: 팀 게이지 이만큼 회복마다 사기 격양
const MORALE_ATK = 0.06;    // 사기 격양 시 팀 공격력 증가(가산)
const MORALE_CAP = 0.36;    // 사기 격양 누적 상한
const MORALE_DUR = 3;       // 사기 격양 지속(턴)

// 스킬 게이지 회복(파티 공유). 포그 「생존의 깃발」: 80 회복마다 팀 사기 격양(공격력 버프).
function gaugeUp(s: DDState, amt: number): void {
  if (!(amt > 0)) return;
  s.skillGauge = Math.min(s.maxGauge, s.skillGauge + amt);
  if (!s.units.some((u) => u.id === "pogranichnik" && u.hp > 0)) return; // 포그 재능 — 파티에 있을 때만
  s.moraleAccum = (s.moraleAccum || 0) + amt;
  while (s.moraleAccum >= MORALE_STEP) {
    s.moraleAccum -= MORALE_STEP;
    for (const u of living(s, "ally")) { u.atkBuff = Math.min(MORALE_CAP, (u.atkBuff || 0) + MORALE_ATK); setTimer(u, "atkBuff", MORALE_DUR); }
    s.log.push(`  → 포그 「생존의 깃발」 사기 격양! 팀 공격력 +${Math.round(MORALE_ATK * 100)}% (${MORALE_DUR}턴)`);
  }
}
export const BASE_CRIT_RATE = 0.05; // 인게임 기본 치명타 확률
export const BASE_CRIT_DMG = 0.5;   // 인게임 기본 치명타 피해

// 지속시간(턴, 1턴≈5초) — 재적용 시 리셋(갱신형). 위키 초 ÷ 5 환산.
const DUR_BREAK = 4;   // 방어 불능 20초
const DUR_ATTACH = 4;  // 아츠 부착 20초
const DUR_ATKBUFF = 3; // 본질 붕괴 15초
const DUR_VULN = 3;    // 취약/부식 12~24·15초
const DUR_DOT = 2;     // 연소 10초
const DUR_FROZEN = 2;  // 동결 6~9초
const DUR_BUFF = 3;    // 증폭/허약/비호/보호막/속도 일반 버프
const LINK_CD = 3;     // 연계 기본 쿨타임 15~16초
// 일반 공격(모든 오퍼 공통): 게이지 무소모, 강력한 일격으로 게이지 회복, 불균형 적엔 처형.
export const BASIC: DDSkill = { id: "basic", name: "일반 공격", kind: "attack", fromPos: [1, 2, 3, 4], target: "single-front", power: 0.5, element: "physical", staggerVal: 6, gaugeGain: 12 };

// 오리지늄 아츠 강도(원문 3식):
//  ① 이상 피해(강타·연소·동결·쇄빙·아츠폭발·갑옷파괴·감전·부식·띄우기·넘어뜨리기) = +x% 선형
//  ② 부가 효과(갑옷파괴 물리취약 / 감전 아츠취약 / 부식 저항감소) = 2x/(x+300) 체감 [60→33% · 244→89%]
//  ③ 누적 불균형치(띄우기·넘어뜨리기 한정) = +x/2 % 선형 [60→+30% · 244→+122%]
const artsDmg = (u: DDUnit) => 1 + (u.artsStr || 0) / 100;
const artsSub = (u: DDUnit) => { const x = u.artsStr || 0; return 1 + (2 * x) / (x + 300); };
const artsStag = (u: DDUnit) => 1 + (u.artsStr || 0) / 200;
// 원문 2.3 레벨 계수: 아츠 이상·아츠 폭발 = 1+(Lv-1)/196 · 물리 이상 = 1+(Lv-1)/392.
// 본 시뮬은 아군 Lv90 고정(진행도는 정예화/단조로만 표현) → 상수. 일반 스킬 피해엔 적용되지 않는다.
const OP_LEVEL = 90;
const LV_ARTS = 1 + (OP_LEVEL - 1) / 196; // 1.454
const LV_PHYS = 1 + (OP_LEVEL - 1) / 392; // 1.227
const lvCoef = (u: DDUnit, arts: boolean) => (u.side === "ally" ? (arts ? LV_ARTS : LV_PHYS) : 1);

// 동결 적에게 방불/물리 이상 발동 시 쇄빙(동결 소모 → 대량 물리). 공격자 측 추가 피해 반환.
function tryShatter(target: DDUnit, self: DDUnit, log: string[]): number {
  if (target.frozen <= 0) return 0;
  const n = Math.min(4, target.frozen);
  target.frozen = 0; rm(target, "stun");
  log.push(`  → 쇄빙! 동결 ${n}스택 소모 → ${SHATTER[n - 1] * 100}% 물리`);
  // 쇄빙은 위키상 아츠 이상에 포함된다(피해 유형만 물리) → 오리지늄 아츠 강도 1당 피해 +1%.
  return self.attack * eb(self) * artsDmg(self) * lvCoef(self, true) * SHATTER[n - 1];
}

// 카뮤 「사르는 불꽃」 핏빛 날개 — 원문 "목표 처치 시 다른 적으로 이동".
// 날개는 목표 주변을 배회하는 소환물이라 대상이 죽어도 사라지지 않고 다음 적을 따라간다.
// 배회 효과(허약·열기 취약)와 남은 지속시간을 함께 옮긴다. 옮길 적이 없으면 그대로 소멸.
export function moveBloodWing(s: DDState, dead: DDUnit, log: string[]): void {
  if (dead.side !== "enemy" || !has(dead, "wing")) return;
  const left = Math.max(1, dead.timers.wing ?? 1);
  rm(dead, "wing"); delete dead.timers.wing;
  const next = living(s, "enemy").find((e) => e !== dead && !has(e, "wing"));
  if (!next) return;
  add(next, "wing"); setTimer(next, "wing", left);
  applyBuff(next, "weaken", 0.05, undefined, left);
  bumpVuln(next, "heat", 0.05, left);
  log.push(`  🦇 핏빛 날개가 ${next.name}에게 옮겨간다 (배회 ${left}턴)`);
}

// 적이 오퍼레이터에게 거는 아츠 이상(원문 2.6) — 오퍼레이터가 일으키는 것과 **완전히 다르다**.
// 원문: 적 스킬이 [아츠 부착]을 붙이고, 같은 속성이 4스택에 도달하면 아래 효과가 발동한다.
//   연소 = 8초간 매초 최대 체력 2%의 방어 무시 열기 / 감전 = 2초 기절 + 10초간 받는 아츠 피해 20% 증가
//   부식 = 6초 돌진 불가 + 이동속도 20% 감소     / 동결 = 3.5초 행동 불가
// 아츠 폭발도, 대량 피해도 없다. 기존에는 아군에게 applyAttach(플레이어 규칙)를 그대로 써서
// 적의 평타마다 "아츠 폭발 160%"가 터졌다(네파리스 표시 피해 95 뒤에 실피해 800+).
export function applyEnemyArts(target: DDUnit, el: Element, log: string[]): void {
  if (target.side !== "ally") return;
  target.arts[el] = Math.min(4, (target.arts[el] || 0) + 1);
  setTimer(target, "arts:" + el, DUR_ATTACH);
  if (target.arts[el] < 4) return;
  target.arts[el] = 0; delete target.timers["arts:" + el];
  if (el === "heat") { // 연소: 최대 체력 비례 지속 피해(방어 무시)
    target.dot = Math.max(target.dot || 0, Math.round(target.maxHp * 0.02 * 2)); // 8초 ≈ 2턴분/턴
    setTimer(target, "dot", 2); add(target, "combustion");
    log.push(`  ☠ ${target.name} 연소! 최대 체력 비례 지속 피해(방어 무시)`);
  } else if (el === "electric") { // 감전: 짧은 기절 + 받는 아츠 피해 증가
    target.timers.stun = 1; add(target, "stun");
    bumpRecv(target, "arts", 0.2, 2);
    log.push(`  ☠ ${target.name} 감전! 행동 불가(1턴) + 받는 아츠 피해 +20%`);
  } else if (el === "nature") { // 부식: 이동 저하 → 우리 모델의 속도 감소
    target.speedMod = (target.speedMod || 0) - 12; setTimer(target, "speedMod", 2);
    log.push(`  ☠ ${target.name} 부식! 속도 감소`);
  } else { // cryo 동결: 행동 불가
    target.timers.stun = 1; add(target, "stun");
    log.push(`  ☠ ${target.name} 동결! 행동 불가(1턴)`);
  }
}

// 아츠 부착 → 폭발(같은 속성 2+) / 이상(다른 속성 → 전부 소모). 공격자 측 추가 피해 반환.
// wctx: 무기 시리즈 트리거용 문맥(팀 대상 버프의 아군 목록 + "배틀 스킬로 부여" 조건 판정).
export function applyAttach(target: DDUnit, el: Element, self: DDUnit, log: string[], wctx?: { allies?: DDUnit[]; viaBattle?: boolean }): number {
  // 만물의 지혜(아크라이트): 아츠 부착 확률 면역 — 50% 확률로 부착 자체 무효
  if (target.artsImmune && Math.random() < target.artsImmune) { log.push(`  → ${target.name} 아츠 부착 면역(만물의 지혜)`); return 0; }
  // 이유 있는 게으름(에스텔라): 냉기 부착 면역 — 동결/냉기 아츠 무효
  if (el === "cryo" && target.cryoImmune) { log.push(`  → ${target.name} 냉기 면역(이유 있는 게으름)`); return 0; }
  const buff = eb(self) * artsDmg(self) * lvCoef(self, true); // 아츠 강도 +1%/pt · 레벨 계수(아츠)
  const sub = artsSub(self); // 부가 효과: 2x/(x+300) 체감
  const others = ELEMENTS.filter((e) => e !== el && target.arts[e] > 0);
  if (others.length > 0) {
    // 아츠 이상: 모든 부착 소모, 나중 부착(el) 종류로 결정. 이상 레벨 = 소모 스택 수.
    const level = Math.min(4, ELEMENTS.reduce((n, e) => n + target.arts[e], 0) + 1);
    ELEMENTS.forEach((e) => (target.arts[e] = 0));
    gearTrigger(self, "anomaly:" + el); // 열작업용(연소/부식)·펄스식(감전/동결)·식양흐름(감전/부식) 발동 버프
    // 무기: 고통(울프가드「목표가 받는 해당 속성 피해」·에스텔라「동결 소모 후 공격력」·아델리아「부식 소모」)
    //      · 방출(플루오라이트「소모 스택 비례 자연 피해」·탕탕「아츠 취약」) · 억제(장방이「배틀로 이상 소모」)
    if (self.side === "ally") weaponTrigger(self, "anomaly:" + el, wctx?.allies, { target, stacks: level, viaBattle: wctx?.viaBattle });
    if (el === "heat") { // 연소
      target.dot = Math.round(self.attack * buff * BURN_DOT[level - 1]);
      setTimer(target, "dot", DUR_DOT);
      add(target, "combustion"); // 아츠 이상 마커(질베르타 연계 게이트)
      log.push(`  → 연소! ${ANOM[level - 1] * 100}% 열기 + 지속피해 ${target.dot}/라운드`);
      return self.attack * buff * ANOM[level - 1];
    }
    if (el === "electric") { // 감전
      bumpRecv(target, "arts", ELEC_VULN[level - 1] * self.utilMult * sub); // 원문 1.9 받는 아츠 피해 증가(취약 아님)
      add(target, "shock"); target.shockLv = level; // 감전 상태 + 이상 레벨(장방이 청뢰검 산출용)
      log.push(`  → 감전! ${ANOM[level - 1] * 100}% 전기 + 아츠취약 ${ELEC_VULN[level - 1] * 100}%`);
      return self.attack * buff * ANOM[level - 1];
    }
    if (el === "cryo") { // 동결(쇄빙 대기)
      target.frozen = level; add(target, "stun"); setTimer(target, "frozen", DUR_FROZEN);
      log.push(`  → 동결! 130% 냉기 + 빙결(쇄빙 대기, ${level}스택)`);
      return self.attack * buff * 1.3;
    }
    // nature: 부식 — 모든 속성 저항 '포인트' 감소(물리 포함, 상한 24포인트) + 부식 상태(아델리아 소모 마커)
    target.resShred = Math.min(0.24 * sub, (target.resShred || 0) + CORR_SHRED[level - 1] * sub); // 아츠 강도 부가효과
    setTimer(target, "resShred", DUR_VULN);
    add(target, "corrosion");
    log.push(`  → 부식! ${ANOM[level - 1] * 100}% 자연 + 전 속성 저항 감소`);
    return self.attack * buff * ANOM[level - 1];
  }
  // 같은 속성 or 없음 → 부착. 같은 속성 2+ 중첩 시 폭발(미소모).
  target.arts[el] = Math.min(4, target.arts[el] + 1);
  setTimer(target, "arts:" + el, DUR_ATTACH);
  // 무기: 방출(라스트라이트·탕탕「냉기 부착 부여 시」) · 흐름(카뮤「열기 부착 부여 시 팀 열기 피해」)
  //      · 고통(관리자「오리지늄 결정·동결 부여 시」)
  if (self.side === "ally") weaponTrigger(self, "attach:" + el, wctx?.allies, { target, viaBattle: wctx?.viaBattle });
  if (target.arts[el] >= 2) {
    gearTrigger(self, "attach2"); // 조류의 물결: 아츠 2부착 후 아츠 피해+
    log.push(`  → ${EL_NAME[el]} 폭발! 160% ${EL_NAME[el]}`);
    return self.attack * buff * 1.6;
  }
  log.push(`  → ${EL_NAME[el]} 부착 (${target.arts[el]})`);
  return 0;
}

// 물리 이상 처리. 공격자 측 추가 피해(payoff) 반환 + 스택/취약/불균형 부수효과.
// 핵심 규칙: 방불 0인 적엔 이상 효과 미발동 → 방불 1스택만 부여. 방불 있으면 효과 발동.
export function applyAnomaly(skill: DDSkill, target: DDUnit, self: DDUnit, log: string[]): number {
  const a = skill.anomaly;
  if (!a) return 0;
  const buff = eb(self) * artsDmg(self) * lvCoef(self, false); // 아츠 강도 +1%/pt · 레벨 계수(물리)
  const sub = artsSub(self); // 부가 효과: 2x/(x+300) 체감
  const shatter = tryShatter(target, self, log); // 방불/물리 이상이 동결 적 → 쇄빙
  if (a === "launch" || a === "knockdown") {
    const bok = skill.selfPhysBonus ? self.attack * buff * skill.selfPhysBonus : 0; // 여풍 복마: 넘어뜨리기마다 +공격력×배수
    const wasBreak = target.physBreak > 0;
    target.physBreak = Math.min(MAX_BREAK, target.physBreak + 1);
    setTimer(target, "physBreak", DUR_BREAK);
    gearTrigger(self, "physBreak"); // 경량 초자연: 방어 불능 부여 후 물리+
    // 검술사 3피스(원문): 물리 이상 부여 후 공격력 250%만큼 추가 물리 [10 불균형치]. 15초당 1회 → 3턴 쿨.
    const ah = self.gear?.anomalyHit ?? 0;
    if (ah > 0 && (self.timers.swordsmanCd || 0) <= 0 && target.hp > 0) {
      setTimer(self, "swordsmanCd", 3);
      const extra = mitigate(target, self.attack * (1 + (self.atkBuff || 0)) * ah, "physical");
      applyDamage(target, extra); target.stagger = Math.min(target.staggerMax, (target.stagger || 0) + 10);
      log.push(`  → 검술사 세트! 추가 물리 -${Math.round(extra).toLocaleString()} · 불균형 +10`);
    }
    if (self.side === "ally") weaponTrigger(self, "physBreak"); // 효율(리펑): 방어 불능 부여 후 전 피해+
    const label = a === "launch" ? "띄우기" : "넘어뜨리기";
    if (wasBreak) { // 방불 상태 → 120% 물리 + 불균형 10
      const stag = 10 * artsStag(self); // 아츠 강도: 누적 불균형치 +x/2 %(띄우기·넘어뜨리기 한정). 소수 유지 — 반올림하면 오차 누적
      target.stagger += stag;
      log.push(`  → ${label} 발동: +120% 물리 · 불균형 +${Math.round(stag)} (방어 불능 ${target.physBreak})${bok ? " · 복마" : ""}`);
      return shatter + bok + self.attack * buff * 1.2;
    }
    log.push(`  → ${label}: 방어 불능 부여 (방어 불능 ${target.physBreak})${bok ? " · 복마(+물리)" : ""}`);
    return shatter + bok;
  }
  if (a === "crush") {
    if (target.physBreak > 0) {
      const n = Math.min(4, target.physBreak);
      target.physBreak = 0;
      gearTrigger(self, "crush", target); // 고검의 잔향: 강타 후 물리+
      if (self.side === "ally") weaponTrigger(self, "crush"); // 고통(관리자)·기예(미후): 강타 후 전 피해+
      const cAmp = skill.crushAmp ?? 1; // 판 조미료 뿌리기: 추가 강타 피해 +10%
      log.push(`  → 강타! 방어 불능 ${n}스택 소모 → ${Math.round(CRUSH[n - 1] * cAmp * 100)}% 물리`);
      return shatter + self.attack * buff * CRUSH[n - 1] * cAmp;
    }
    target.physBreak = 1; // 방불 없음 → 1스택 부여(자가 빌드는 가능하나 비효율 = 관리자 단점)
    setTimer(target, "physBreak", DUR_BREAK);
    log.push(`  → 강타: 방어 불능 없음 → 1스택 부여`);
    return shatter;
  }
  if (a === "armor-break") {
    if (target.physBreak > 0) {
      const n = Math.min(4, target.physBreak);
      target.physBreak = 0;
      gearTrigger(self, "crush", target); // 고검의 잔향: 갑옷파괴 후 물리+
      bumpRecv(target, "physical", ARMOR_VULN[n - 1] * self.utilMult * sub); // 원문 1.9 받는 물리 피해 증가(취약 아님)
      add(target, "armor-break");
      log.push(`  → 갑옷 파괴! ${n}스택 소모 → ${ARMOR[n - 1] * 100}% 물리 + 물리취약 ${ARMOR_VULN[n - 1] * 100}%`);
      return shatter + self.attack * buff * ARMOR[n - 1];
    }
    target.physBreak = 1;
    setTimer(target, "physBreak", DUR_BREAK);
    log.push(`  → 갑옷 파괴: 방어 불능 없음 → 1스택 부여`);
    return shatter;
  }
  return shatter;
}

// 스킬 발동 피해(공격자 측). 연타는 배틀/궁 base에만 적용(강타 payoff는 제외).
export function baseDamage(skill: DDSkill, self: DDUnit): number {
  // 평타 배율(무기 「궁 후 평타 +120%」 등) vs 스킬 배율. 적은 attrs/무기가 없어 ×1.
  const am = skill.kind === "attack" ? (self.strMul ?? 1) : (self.skillAttrMul ?? 1);
  const bm = skill.kind === "battle" ? 1 + (self.battleAmp ?? 0) : 1; // 무기: 배틀 한정 증폭(장방이)
  let dmg = self.attack * eb(self) * (skill.powerOf?.(self) ?? skill.power) * am * bm;
  if (self.multiHit > 0) {
    const n = Math.min(4, self.multiHit);
    if (skill.kind === "battle") dmg *= 1 + MH_BATTLE[n - 1];
    else if (skill.kind === "ult") dmg *= 1 + MH_ULT[n - 1];
  }
  return dmg;
}

// ===== 연계 연쇄 =====
// 원작 사이클은 "메인이 셋업 → 조건 열린 오퍼가 즉시 연계로 끼어듦"의 연쇄다(레바테인 강평 → 아델리아 연계 → …).
// 우리는 ATB 속도순 독립 턴이라, 셋업이 느리면(레바테인 54 < 카뮤 87) 페이오프가 이미 지나가 창을 못 받아먹었다.
// → 셋업 직후 조건이 열린 아군이 **자기 턴을 앞당겨** 연계를 쓴다. atb를 정상 소모하므로 행동 수는 그대로(DD 경제 유지).
// roster/sim을 직접 import하면 순환(combat→weapons→roster→combat)이라 provider 주입.
export type LinkChain = (s: DDState, self: DDUnit) => { unit: DDUnit; skill: DDSkill } | null;
let linkChainProvider: LinkChain | null = null;
export const setLinkChain = (f: LinkChain | null) => { linkChainProvider = f; };

// anomalyConsumed: 아츠 이상/부착 소모·흡수 윈도우(남은 턴). 0/undefined = 닫힘.
// chaining: 연계 연쇄 재진입 방지(연쇄는 1단까지).
export type DDState = { units: DDUnit[]; round: number; log: string[]; lastLinkAlly?: string; chain?: number; skillGauge: number; maxGauge: number; boss?: boolean; anomalyConsumed?: number; allyHit?: boolean; moraleAccum?: number; forcedTargetId?: string; chaining?: boolean; linkEvents?: Record<string, number>; manualLink?: boolean; chainUsed?: string[] };
// 연계 탐색 — 이 행동으로 조건이 열린 아군의 연계(유닛·스킬). 수동 콤보 UI가 이걸 호출해 아이콘을 띄운다.
export function findLinkChain(s: DDState, self: DDUnit): { unit: DDUnit; skill: DDSkill } | null { return linkChainProvider ? linkChainProvider(s, self) : null; }

// 연계 "이벤트 윈도우": 원작 연계 상당수가 "메인이 ~한 **후**"(이벤트)인데 상태("~인 적")로 구현돼 있었다.
// 상태는 아군이 먼저 소모하면 사라지지만 이벤트는 명중 순간 창을 열어 소모돼도 유지된다. key당 남은 턴.
export function markLinkEvent(s: DDState, key: string, turns = ANOMALY_WINDOW): void { (s.linkEvents ??= {})[key] = turns; }
export const hasLinkEvent = (s: DDState, key: string): boolean => (s.linkEvents?.[key] ?? 0) > 0;

export const living = (s: DDState, side?: "ally" | "enemy") =>
  s.units.filter((u) => u.hp > 0 && (!side || u.side === side));

export function pickTargets(s: DDState, self: DDUnit, skill: DDSkill): DDUnit[] {
  const all = living(s, self.side === "ally" ? "enemy" : "ally");
  // 무적 대상(호위 부위가 남은 본체·소환 중 보스)은 때려도 0이므로 후보에서 뺀다.
  // 전부 무적이면 어쩔 수 없이 원래 목록을 쓴다(교착 방지).
  const targetable = all.filter((u) => !u.invuln);
  const foes = targetable.length ? targetable : all;
  if (skill.target === "self") return [self];
  // 레바테인 황혼 변신 중: 강화 일반공격은 광역(공격 범위 대폭 증가)
  if (self.id === "laevatain" && skill.kind === "attack" && (self.timers.twilight || 0) > 0) return foes;
  // 장방이 천리의 경지 변신 중: 강화 일반공격·배틀(뇌정의 부름) 모두 광역(공격 범위 확대)
  if (self.id === "zhuangfangyi" && (skill.kind === "attack" || skill.kind === "battle") && (self.timers.heavenly || 0) > 0) return foes;
  if (skill.target === "all") return foes;
  if (skill.target === "row") return [...foes].sort((a, b) => a.pos - b.pos).slice(0, 2);
  // 플레이어 지정 타겟(단일 대상 스킬 한정) — 아군 수동 조작
  if (s.forcedTargetId) { const t = foes.find((f) => f.id === s.forcedTargetId); if (t) return [t]; }
  if (skill.target === "single-lowhp") return foes.length ? [foes.reduce((lo, e) => (e.hp < lo.hp ? e : lo), foes[0])] : [];
  // single-front 자동/기본 대상(수동 조준 없을 때·자동 전투): '전열 고정' 제거 → 처치 우선순위
  //  불균형(처형) > 지원 적(치유·증폭) > 저체력% 마무리 > 전열. 무의미한 랜덤성 없이 스마트 포커스.
  if (!foes.length) return [];
  const prio = (e: DDUnit) => (e.staggered ? 4 : 0) + (e.killPriority ?? 1);
  return [[...foes].sort((a, b) => prio(b) - prio(a) || a.hp / a.maxHp - b.hp / b.maxHp || a.pos - b.pos)[0]];
}

// 스킬이 지금 사용 가능한가(위치 + 게이지 + 요구사항)
export function usable(s: DDState, self: DDUnit, skill: DDSkill): boolean {
  // 위치(fromPos) 제약 제거 — 플레이어가 배치를 보거나 바꿀 수 없어 숨은 페널티만 됨. 모든 슬롯에서 전 스킬 사용 가능.
  if (skill.selfUlt && self.ultCharge < self.ultCost) return false;
  // 장방이 천리의 경지: 원문 "**첫 배틀은 게이지/감전 무소모**" → 게이지 부족이어도 통과
  const zfyFree = self.id === "zhuangfangyi" && skill.kind === "battle" && (self.timers.heavenly || 0) > 0 && !self.zfyUsedFree;
  if (skill.kind === "battle" && self.side === "ally" && !zfyFree && s.skillGauge < (skill.gaugeCost ?? GAUGE_COST)) return false; // 스킬 게이지 부족
  if (skill.kind === "link" && self.linkCd > 0) return false; // 연계 쿨타임
  if (skill.requiresStance != null && self.stance < skill.requiresStance) return false; // 미브 스탠스 요구
  const tg = pickTargets(s, self, skill)[0];
  if (skill.requires && !skill.requires(tg, self, s)) return false;
  return true;
}

// 아군 피격 시 방어 트리거 — act()(아군 자해/반사)와 enemyAct()(적 공격) 양쪽에서 호출. self=공격자, t=피격 아군.
export function onAllyHit(s: DDState, self: DDUnit, t: DDUnit, final: number, log: string[]): void {
  if (!(t.side === "ally" && final > 0)) return;
  s.allyHit = true; // 엠버 전선에서의 지원 피격 윈도우
  // 강철에는 강철로(엠버): 피격 시 공격력 +9%, 최대 3스택(=+27%), 2턴
  if (t.id === "ember") { t.atkBuff = Math.min(0.27, (t.atkBuff || 0) + 0.09); setTimer(t, "atkBuff", 2); }
  // 부활의 불씨(레바테인) 원문(3정): "HP 40% 이하 시 **90% 비호 + 매초 최대 HP 5% 회복, 8초**. **120초** 1회."
  // 환산(1턴=5초): 비호 8초 ≈ 2턴 · 회복 5%×8초 = 최대 HP 40%를 2턴에 나눠 = 턴당 20% · 쿨 120초 ≈ 24턴.
  // (기존엔 1회 10% 회복 + 쿨 12턴 — 회복이 1/4인데 쿨은 2배 잦았다)
  if (t.id === "laevatain" && t.hp / t.maxHp <= 0.4 && (t.timers.embersCd || 0) <= 0) {
    applyBuff(t, "protection", 0.9, undefined, 2);
    t.regen = Math.round(t.maxHp * 0.2); t.regenTurns = 2; // 턴당 20% × 2턴 = 40%
    setTimer(t, "embersCd", 24);
    log.push(`  → 부활의 불씨! 90% 비호(2턴) + 재생 ${t.regen}/턴 ×2`);
  }
  // 패링(스노우샤인·카치르): 방패 태세 중 아군 피격 시 반격(공격자=self).
  if (self.side === "enemy") {
    const snow = s.units.find((u) => u.id === "snowshine" && u.hp > 0 && (u.timers.guard || 0) > 0);
    // 원본 반격 배율(Lv1): 스노우샤인 200% 냉기 / 카치르 178% 물리. 기존엔 부착·방불만 넣고 피해가 없었다.
    if (snow) {
      const d = applyDamage(self, mitigate(self, snow.attack * eb(snow) * 2.0, "cryo"));
      log.push(`  → 스노우샤인 반격(패링)! 냉기 -${d.toLocaleString()}`);
      applyAttach(self, "cryo", snow, log); snow.ultCharge = Math.min(snow.ultCost, snow.ultCharge + 10);
    }
    const cat = s.units.find((u) => u.id === "catcher" && u.hp > 0 && (u.timers.guard || 0) > 0);
    if (cat) {
      const d = applyDamage(self, mitigate(self, cat.attack * eb(cat) * 1.78, "physical"));
      self.physBreak = Math.min(MAX_BREAK, self.physBreak + 1); setTimer(self, "physBreak", DUR_BREAK);
      log.push(`  → 카치르 반격(패링)! 물리 -${d.toLocaleString()} · 방어 불능 1스택 (방어 불능 ${self.physBreak})`);
    }

  }
}

// 결 「전략 수립」: 패널 지능 ≥ 의지면 진결·지혜(딜), 의지 > 지능이면 진결·의지(서폿).
// 원작이 "레벨·재능·잠재·장비·무기가 주는 패널 능력치"로 판정하므로 밸런스 축소 전 panelAttrs를 쓴다.
export const arcaneForm = (u: DDUnit): "wisdom" | "will" => {
  const a = u.panelAttrs ?? u.attrs;
  return !a || a.int >= a.wil ? "wisdom" : "will";
};
export const canAct = (u: DDUnit) => u.hp > 0 && !(u.side === "enemy" && (u.staggered || (u.timers.stun || 0) > 0 || u.frozen > 0)); // 불균형/시간 정지/동결 적은 행동 불가

// 한 유닛의 행동 실행
export function act(s: DDState, self: DDUnit, skill: DDSkill): void {
  const log = s.log;
  // 스킬 연계 체인: 예약(chainStep)을 달고 온 행동이면 그 단계를, 아니면 새 체인의 1단으로 본다.
  // 적이 끼어들면 연쇄는 끊긴다 — 아군 행동이 이어질 때만 체인이 자란다.
  if (self.side === "ally") {
    s.chain = self.chainStep ?? 1; delete self.chainStep;
    if (s.chain === 1) s.chainUsed = []; // 새 연쇄 시작 → 참여자 명단 초기화
  } else { s.chain = 1; s.chainUsed = []; }
  // 한 연쇄에 같은 오퍼는 연계 1회. 쿨만 믿으면 쿨 0인 오퍼(아크라이트 쿨 1턴)가 자기 연계로
  // 자기 연계를 계속 열어 연쇄를 독점한다 — 실측 150행동 중 146회가 아크라이트 연계였다.
  if (self.side === "ally" && skill.kind === "link") (s.chainUsed ??= []).push(self.id);
  log.push(`${self.name}[pos${self.pos}] → ${skill.name}${(s.chain ?? 1) > 1 ? `  ⛓ ${s.chain}연쇄` : ""}`);
  SRC_CTX = { by: self.name, via: skill.name, kind: "skill" }; // 이 스킬로 걸리는 효과의 기본 출처(무기/장비 트리거가 일시 override)
  // 자원: 스킬 게이지(파티 공유) 소모 + 궁극기 에너지(개인) 충전 — 위키 정합
  if (self.side === "ally") {
    if (skill.kind === "battle") {
      if (self.id === "zhuangfangyi" && (self.timers.heavenly || 0) > 0 && !self.zfyUsedFree) {
        self.zfyUsedFree = true; // 천리의 경지 첫 배틀 = 게이지 무소모(원문)
        log.push(`  → 천리의 경지! 첫 배틀 게이지 무소모`);
      } else s.skillGauge = Math.max(0, s.skillGauge - (skill.gaugeCost ?? GAUGE_COST)); // 배틀 소모(미브 추형/개천 50)
      if (skill.gaugeRefund) gaugeUp(s, skill.gaugeRefund); // 미브 단운 50 반환
      // 배틀 → 아군 전체 궁 충전(+6.5). 질베르타 전달자의 노래: 가드/캐스터/서포터 궁충 ×1.07
      const gil = s.units.some((u) => u.id === "gilberta" && u.hp > 0);
      for (const u of living(s, "ally")) {
        if (u.id === "lastrite" && self.id !== "lastrite") continue; // 라스트 라이트: 자기 배틀/연계로만 궁 충전(타 아군 배틀 무효)
        // 나무위키: 배틀 시 (소모 게이지/100) × 6.5. 미브 추형/개천(게이지 50)은 절반만 충전된다.
        let g = ULT_BATTLE * ((skill.gaugeCost ?? GAUGE_COST) / GAUGE_COST);
        if (gil && (u.cls === "guard" || u.cls === "caster" || u.cls === "supporter")) g *= 1.07;
        g *= u.ultEffMul ?? 1; // 장비 부옵: 궁극기 충전 효율
        g *= u.wilMul ?? 1;    // 의지 → 궁극기 게이지 속도
        u.ultCharge = Math.min(u.ultCost, u.ultCharge + g);
      }
    } else if (skill.kind === "link") {
      self.ultCharge = Math.min(self.ultCost, self.ultCharge + ULT_LINK * (self.ultEffMul ?? 1) * (self.wilMul ?? 1)); // 연계 → 시전자 +10(궁충 효율·의지 반영)
      s.lastLinkAlly = self.id; // 팀 연계 윈도우(관리자 봉인 게이트)
      let cd = skill.cooldown ?? LINK_CD;
      if (self.id === "zhuangfangyi" && (self.timers.heavenly || 0) > 0) cd = Math.max(1, Math.round(cd / 4)); // 천리의 경지: 연계 쿨 4배(변화의 숨결 연타 → 감전 → 청뢰검 폭증)
      // 연계 쿨타임 진입. 정수 턴에 내림을 걸면 퍼센트 쿨감이 크게 튄다 —
      // x0.85가 쿨 4턴엔 -25%, 3턴엔 -33%, 2턴엔 -50%, 1턴엔 0%가 됐다.
      // 소수로 두고 **초과 대기분(음수)을 다음 쿨에서 차감**해 장기 평균이 실제 배율과 맞게 한다.
      // (쿨 4 x 0.85 = 3.4 -> 4턴/3턴/4턴... 평균 3.4턴 = 정확히 -15%)
      self.linkCd = cd * (self.linkCdMul ?? 1) + Math.min(0, self.linkCd);
    } else if (skill.kind === "ult") {
      self.ultCharge = 0;
    }
  }
  const stg = skill.staggerVal ?? (skill.kind === "ult" ? 25 : 10);

  const elem = skElem(skill);
  const primaryPre = pickTargets(s, self, skill)[0]?.physBreak ?? 0; // 스탠스 판정용(강타 소모 전 방불)
  const primaryTarget = pickTargets(s, self, skill)[0]; // 광역 스킬의 1회성 효과(청뢰검 생성 등) 기준 대상
  let executed = false; // 일반 공격 처형 여부
  let aoeTotal = 0, aoeHits = 0; // 범위기 전체 합산(대상별 합만으로는 총 딜을 알 수 없음)
  for (const t of pickTargets(s, self, skill)) {
    if (t.teleport && !t.staggered && skill.kind !== "ult" && Math.random() < 0.3) { // 순간이동: 불균형이 아니면 일반 피격을 낮은 확률로 회피(궁극기 제외)
      log.push(`  → ${t.name} 순간이동! ${self.name}의 공격을 회피`); continue;
    }
    const preReact = ELEMENTS.reduce((n, e) => n + t.arts[e], 0) + t.frozen; // 아츠 이상/쇄빙 소모 감지용(알레쉬 연계)
    const yvFrozen = t.frozen > 0, yvCryo = t.arts.cryo > 0; // 이본 빙점 판정(소모 전 상태)
    let raw = baseDamage(skill, self); // 시전자 측 원 피해(공격력×증가×허약×배율)
    if (skill.kind === "attack" && t.staggered) { raw *= EXECUTE_MULT; executed = true; log.push(`  → 처형! 불균형 적 대량 물리`); }
    raw += applyAnomaly(skill, t, self, log); // 물리 이상 payoff(+쇄빙, 연타 미적용)
    if (self.id === "estella" && yvFrozen && self.side === "ally") { gaugeUp(s, 15); log.push(`  → 공감! 쇄빙 게이지 반환`); } // 에스텔라: 쇄빙 시 스킬 게이지 반환
    let burnConsumed = false;
    if (skill.burnShockConsume && (has(t, "combustion") || has(t, "shock"))) { // 울프가드: 연소/감전 소모 → 추가타(부착 생략)
      rm(t, "combustion"); rm(t, "shock"); t.dot = 0;
      raw += self.attack * eb(self) * skill.burnShockConsume;
      s.anomalyConsumed = ANOMALY_WINDOW; burnConsumed = true;
      gaugeUp(s, 10); // 절제의 원칙(게이지 반환)
      log.push(`  → 연소/감전 소모! 추가 ${skill.burnShockConsume * 100}% 열기 + 게이지`);
    }
    if (skill.attach && !burnConsumed) { // 아츠 부착→폭발/이상
      raw += applyAttach(t, skill.attach, self, log, { allies: living(s, "ally"), viaBattle: skill.kind === "battle" });
      if (self.id === "wulfgard" && has(t, "combustion")) { self.amp.heat = Math.max(self.amp.heat || 0, 0.3); setTimer(self, "amp:heat", 2); log.push(`  → 불타는 송곳니! 열기 피해 +30%`); }
    }
    // 레바테인 「황혼」 변신 중 평타는 원문상 "3단 평타 열기 부착" — 붙인 열기를 본인 흡수(불꽃의 심장)가
    // 곧바로 걷어가 녹아내린 불꽃이 빠르게 차고 강화 배틀을 연발하는 게 변신 사이클의 핵심.
    if (self.id === "laevatain" && skill.kind === "attack" && (self.timers.twilight || 0) > 0) raw += applyAttach(t, "heat", self, log, { allies: living(s, "ally"), viaBattle: false }); // 변신 평타 — 배틀 아님
    // 결 진결·지혜 핵심 콤보(원문): 배틀 스킬이 「구속」 상태(연계 응룡 4식) 적에게 명중하면
    //   구속을 조기 종료 + 폭발 피해(120%) + 추가 피해(500%) + 자연·냉기 취약 재부여 + 스킬 게이지 30 반환.
    // 지혜 폼이 연계→배틀로 이어붙여 딜과 게이지를 동시에 버는 사이클이라 이게 빠지면 딜폼이 성립하지 않는다.
    if (self.id === "arcane" && skill.kind === "battle" && arcaneForm(self) === "wisdom" && (t.timers.bound || 0) > 0) {
      delete t.timers.bound;
      raw += self.attack * eb(self) * (0.53 + 2.22); // 폭발 120% + 추가 500%(÷225 환산)
      bumpVuln(t, "nature", 0.04, 2); bumpVuln(t, "cryo", 0.04, 2); // 2초간 재부여
      gaugeUp(s, 30); // 스킬 게이지 반환 30
      log.push(`  → 구속 조기 종료! 폭발 + 추가타 · 게이지 +30`);
    }
    if (self.id === "zhuangfangyi") { // 장방이: 청뢰검(procCount) — 연계 강제 감전 / 배틀 감전 소모 → 검 생성 + 뇌격
      if (skill.kind === "link" && t.arts.electric > 0) { // 변화의 숨결: 전기 부착 소모 → 강제 감전(이미 감전이면 레벨↑)
        const n = t.arts.electric; t.arts.electric = 0; delete t.timers["arts:electric"];
        const lvUp = has(t, "shock"); add(t, "shock"); t.shockLv = Math.min(4, (lvUp ? (t.shockLv || 1) + 1 : 1)); gearTrigger(self, "anomaly:electric"); bumpRecv(t, "arts", (lvUp ? 0.16 : 0.12) * self.utilMult);
        // 전용 소모 경로도 아츠 이상 소모다 — 무기 트리거를 applyAttach 경로와 동일하게 쏜다.
        weaponTrigger(self, "anomaly:electric", living(s, "ally"), { target: t, stacks: n, viaBattle: false });
        self.ultCharge = Math.min(self.ultCost, self.ultCharge + (10 + 10 * n) * (self.ultEffMul ?? 1) * (self.wilMul ?? 1)); s.anomalyConsumed = ANOMALY_WINDOW;
        log.push(`  → 변화의 숨결! 전기 ${n}스택 소모 → 강제 감전${lvUp ? "(레벨↑)" : ""}`);
      }
      if (skill.kind === "battle") { // 뇌정의 부름: 감전 소모 → 청뢰검 생성(최대 9) + 청뢰검 수 비례 뇌격(마지막 ×6) + 궁충
        const tw = (self.timers.heavenly || 0) > 0; // 천리의 경지 변신(평타/배틀 광역+강화)
        if (t === primaryTarget) { // 청뢰검 생성·궁충·증폭은 1회만(변신 중 광역이어도)
          let gen = 0;
          // 원문: 감전 소모 시 "소모한 감전 이상 레벨 + 1"자루. 없으면 청뢰검 3 미만일 때만 +1.
          if (has(t, "shock")) { gen = Math.min(5, (t.shockLv || 1) + 1); rm(t, "shock"); delete t.shockLv; }
          else if ((self.procCount || 0) < 3) gen = 1;
          if (tw) gen = Math.max(gen, 3); // 변신 중 강제 3자루
          self.procCount = Math.min(9, (self.procCount || 0) + gen);
          self.ultCharge = Math.min(self.ultCost, self.ultCharge + 6 * self.procCount * (self.ultEffMul ?? 1) * (self.wilMul ?? 1)); // 뇌격당 궁 +6
          self.amp.electric = Math.max(self.amp.electric || 0, 0.18); setTimer(self, "amp:electric", 1); // 천지의 조화
          if (tw) markLinkEvent(s, "zhuangfangyi"); // 변신 배틀 = 마지막 뇌격 전기 부착 행위 → 「변화의 숨결」 연계창 개방(자체수급 사이클)
          log.push(`  → 뇌정의 부름! 청뢰검 ${self.procCount}/9 (생성 ${gen})${tw ? " · 변신 광역 강화" : ""}`);
        }
        const per = tw ? 0.36 : 0.2; // 스킬랭크1 계수(전역 SKILL_RANK9가 ×2.25로 스킬랭크9=45%/81% 반영)
        raw += self.attack * eb(self) * per * (self.procCount + 5); // 청뢰검 비례 뇌격(마지막 ×6) — 모든 대상(변신 시 광역)
        // 원문: 천리의 경지 중 "배틀 … **마지막 뇌격 전기 부착**". 이게 없으면 연계 「변화의 숨결」(전기 부착 적 요구)이
        // 영원히 잠겨 청뢰검 램프가 안 돈다(측정: 연계 0회 · 청뢰검 2.5/9). 레바테인 「황혼」의 부착 누락과 같은 유형.
        if (tw) raw += applyAttach(t, "electric", self, log, { allies: living(s, "ally"), viaBattle: skill.kind === "battle" });
      }
    }
    // 미브 「후회 없는 주먹」(연계): 원문 표 "획득하는 궁극기 에너지 10".
    if (self.id === "mifu" && skill.kind === "link") {
      const ug = 10 * (self.ultEffMul ?? 1) * (self.wilMul ?? 1);
      self.ultCharge = Math.min(self.ultCost, self.ultCharge + ug);
      log.push(`  → 후회 없는 주먹 궁 +${Math.round(ug)}`);
    }
    // 라스트라이트 「세쉬카의 비전」(배틀): 원문 표 "획득하는 궁극기 에너지 16". 궁 「마지막 인사」가
    // "자신의 배틀/연계로만 궁 에너지 획득" 제약이라 이 두 경로가 유일한 수급원(비용 240).
    if (self.id === "lastrite" && skill.kind === "battle") {
      const ug = 16 * (self.ultEffMul ?? 1) * (self.wilMul ?? 1);
      self.ultCharge = Math.min(self.ultCost, self.ultCharge + ug);
      log.push(`  → 세쉬카의 비전 궁 +${Math.round(ug)}`);
    }
    // 알레쉬 재능: "주변 적에게 동결/오리지늄 결정 부착 후 궁 +3. **자기가 동결을 부여**했으면 +6."
    if (self.id === "alesh" && (t.frozen > 0 || has(t, "crystal"))) {
      const own = !!skill.forceFreeze; // 자기 강제 동결로 발동
      const ug = (own ? 6 : 3) * (self.ultEffMul ?? 1) * (self.wilMul ?? 1);
      self.ultCharge = Math.min(self.ultCost, self.ultCharge + ug);
      log.push(`  → 낚시꾼의 감각! 궁 +${Math.round(ug)}${own ? " (자기 동결)" : ""}`);
    }
    // 로시 「그림자가 타오르는 순간」: 2타에 아츠 부착 전부 소모 → 소모 스택당 +80% 물리 + 자신 치확/치피(15초≈3턴).
    // 원문 Lv1 기준: 치확 +15% · 치피 +30% (가산). 예전 구현은 절대값 세팅(0.3/1.0 = M3값)이라 랭크 무관하게 만렙치였음.
    if (self.id === "rossi" && skill.kind === "link") {
      const stacks = Math.min(4, ELEMENTS.reduce((n, e) => n + t.arts[e], 0));
      if (stacks > 0) {
        ELEMENTS.forEach((e) => { t.arts[e] = 0; delete t.timers["arts:" + e]; });
        raw += self.attack * eb(self) * 0.8 * stacks; // 소모 스택당 +80%
        s.anomalyConsumed = ANOMALY_WINDOW;
        log.push(`  → 아츠 ${stacks}스택 소모 → 추가 ${Math.round(80 * stacks)}% 물리`);
      }
      self.critRate += 0.15; self.critDmg += 0.30;
      setTimer(self, "critRate", 3); setTimer(self, "critDmg", 3);
      log.push(`  → 울프팀의 진주! 치확 +15% · 치피 +30% (3턴)`);
    }
    if (skill.iceBomb) { // 이본 얼음 폭탄: 냉기/자연 부착 전부 소모 → 강제 동결 + 스택 비례 냉기 + 궁충
      const stacks = Math.min(4, t.arts.cryo + t.arts.nature);
      if (stacks > 0) {
        t.arts.cryo = 0; t.arts.nature = 0; delete t.timers["arts:cryo"]; delete t.timers["arts:nature"];
        t.frozen = stacks; add(t, "stun"); setTimer(t, "frozen", DUR_FROZEN); gearTrigger(self, "anomaly:cryo"); // 강제 동결(세트 조건 = "동결을 부여한 후")
        raw += self.attack * eb(self) * (0.67 + 0.89 * stacks); // 동결 부여 67% + 스택당 89%
        self.ultCharge = Math.min(self.ultCost, self.ultCharge + (10 + 30 * stacks) * (self.ultEffMul ?? 1) * (self.wilMul ?? 1)); // 궁충(동결 10 + 스택당 30)
        s.anomalyConsumed = ANOMALY_WINDOW;
        log.push(`  → 얼음 폭탄! 냉기/자연 ${stacks}스택 소모 → 강제 동결 + 궁 +${10 + 30 * stacks}`);
      }
    }
    if (self.id === "yvonne" && skill.kind === "ult" && t.frozen > 0) { // 아이스 슈터: 동결 적 추가 냉기 + 동결 소모
      raw += self.attack * eb(self) * 2.67;
      t.frozen = 0; rm(t, "stun"); delete t.timers["frozen"];
      log.push(`  → 동결 소모 추가 냉기(267%)`);
    }
    if (skill.cryoNuke && t.arts.cryo > 0) { // 라스트 라이트 겨울 포식자: 냉기 부착 전부 소모 → 스택 비례 누킹
      const n = Math.min(4, t.arts.cryo);
      raw += self.attack * eb(self) * skill.cryoNuke * n; // 스택당 추가 피해
      bumpVuln(t, "cryo", n * 0.04 * self.utilMult, 3); // 저체온증: 소모 스택 ×4% 냉기 취약(15초≈3턴) · 스킬 단조 유틸
      t.arts.cryo = 0; delete t.timers["arts:cryo"];
      add(t, "stun"); setTimer(t, "stun", 1); // 얼음송곳 강제 정지(다음 1턴)
      s.anomalyConsumed = ANOMALY_WINDOW;
      // 원문 표: 기초 궁 에너지 40 + 소모 스택당 15 (4스택이면 100). 라스트라이트 궁(240)의 주 수급원.
      const ug = (40 + 15 * n) * (self.ultEffMul ?? 1) * (self.wilMul ?? 1);
      self.ultCharge = Math.min(self.ultCost, self.ultCharge + ug);
      log.push(`  → 겨울 포식자! 냉기 ${n}스택 소모 → 스택 누킹 + 냉기 취약 ${n * 4}% + 강제 정지 + 궁 +${Math.round(ug)}`);
    }
    // 레바테인 「불꽃의 심장」 — 원문: "강력한 일격이나 처형이 명중한 후, 레바테인이 **주변 적의** 열기 부착을 흡수.
    // 열기 부착 1스택 흡수마다 녹아내린 불꽃 1스택(최대 4)". 흡수는 **본인의 강평/처형(일반 공격)**에서만 일어난다.
    // 배틀/연계는 원문상 "명중 시 녹아내린 불꽃 1스택"으로 별도 가산.
    if (self.id === "laevatain" && (skill.kind === "attack" || skill.kind === "battle" || skill.kind === "link")) {
      let absorb = 0;
      if (skill.kind === "attack") // 강평/처형만 흡수 — 살아있는 적 전체("주변 적")에서 걷는다
        for (const e of living(s, "enemy")) if (e.arts.heat > 0) { absorb += e.arts.heat; e.arts.heat = 0; delete e.timers["arts:heat"]; }
      const gain = absorb + (skill.kind === "battle" || skill.kind === "link" ? 1 : 0);
      if (absorb > 0) s.anomalyConsumed = ANOMALY_WINDOW; // 카뮤 연계 「영혼의 가시」 조건 = "열기 부착 소모/**흡수** 후" — 레바테인 흡수도 창을 연다
      if (gain > 0) {
        self.procCount = Math.min(4, (self.procCount || 0) + gain);
        log.push(`  → 녹아내린 불꽃 ${self.procCount}/4 (${skill.kind === "attack" ? `강평 흡수 ${absorb}` : skill.kind === "battle" ? "배틀 명중" : "연계 명중"})`);
      }
    }
    // 4스택 배틀 폭발 — 레바테인 본인 배틀에서만
    if (self.id === "laevatain" && skill.kind === "battle") {
      const tw = (self.timers.twilight || 0) > 0; // 황혼 변신 중
      if (tw) raw += self.attack * eb(self) * 0.85; // 궁 중 강화 배틀 1단계(62→147%)
      if (self.procCount >= 4) { // 4스택 배틀 → 강화 폭발 + 강제 연소 + 궁 +100
        raw += self.attack * eb(self) * (tw ? 4.0 : 3.42); // 추가 공격(궁 중 400% / 일반 342%)
        t.dot = Math.round(self.attack * eb(self) * artsDmg(self) * lvCoef(self, true) * 0.5); setTimer(t, "dot", DUR_DOT); add(t, "combustion"); gearTrigger(self, "anomaly:heat"); // 강제 연소(세트 조건 = "연소를 부여한 후")
        self.ultCharge = Math.min(self.ultCost, self.ultCharge + 100 * (self.ultEffMul ?? 1) * (self.wilMul ?? 1)); // 궁 +100
        self.amp.heat = Math.max(self.amp.heat || 0, 0.2); setTimer(self, "amp:heat", 4); // 불꽃의 심장(열기 저항 무시 근사)
        self.procCount = 0;
        log.push(`  → 녹아내린 불꽃 4스택 소모! 강화 폭발${tw ? "(궁 중 400%)" : ""} + 강제 연소 + 궁 +100`);
      }
    }
    if (skill.lanceRecover) { // 아비웨나 가로채기: 대상에게 누적된 썬더랜스(t.lanceN 일반 / t.lanceBig 강력) 전부 회수 → 스택 비례 중복 전기타
      const lances = t.lanceN || 0, big = t.lanceBig || 0;
      if (lances + big > 0) {
        raw += self.attack * eb(self) * (lances * 0.75 + big * 1.92); // 일반 75% / 강력 192% × 투창 수
        if (big > 0) raw += applyAttach(t, "electric", self, log, { allies: living(s, "ally"), viaBattle: skill.kind === "battle" }); // 강력 썬더랜스 전기 부착
        self.ultCharge = Math.min(self.ultCost, self.ultCharge + (self.ultEffMul ?? 1) * (self.wilMul ?? 1) * (lances + big) * 4); // 고효율 배송(회수 명중 궁 +4)
        log.push(`  → 썬더랜스 ${lances + big}개 회수! 중복 전기 폭딜${big ? " + 전기 부착" : ""}`);
        t.lanceN = 0; t.lanceBig = 0; // 대상 스택 소모
      }
    }
    if (skill.forceBurn && t.hp > 0) { // 울프가드 늑대의 분노: 강제 연소 + 불타는 송곳니
      t.dot = Math.round(self.attack * eb(self) * artsDmg(self) * lvCoef(self, true) * 0.36); setTimer(t, "dot", DUR_DOT); add(t, "combustion"); gearTrigger(self, "anomaly:heat"); // 강제 연소 부여 → 세트 발동
      self.amp.heat = Math.max(self.amp.heat || 0, 0.3); setTimer(self, "amp:heat", 2);
      log.push(`  → 강제 연소 + 불타는 송곳니(+30%)`);
    }
    if (skill.crystal && t.hp > 0) { add(t, "crystal"); log.push(`  → 오리지늄 결정 부착`); }
    if (skill.apply) skill.apply(t, self);
    const hadCrystal = has(t, "crystal"); // 현실 정지 판정(소모 전 기준)
    // 오리지늄 결정 소모: 결정 부착 적에게 물리 이상/궁극 → 결정 파괴 추가 물리 + 관리자 본질 붕괴(+30%)
    if (hadCrystal && (skill.anomaly || skill.kind === "ult")) {
      const adm = s.units.find((u) => u.id === "endministrator" && u.hp > 0);
      const src = adm ?? self;
      const coeff = skill.kind === "ult" ? 2.67 : 1.78; // 궁 추가 배율(267%) vs 연계 결정 파괴 배율(178%)
      raw += src.attack * eb(src) * coeff;
      rm(t, "crystal"); s.anomalyConsumed = ANOMALY_WINDOW; // 결정 소모(알레쉬 연계 조건)
      if (adm) { adm.atkBuff = 0.3; setTimer(adm, "atkBuff", DUR_ATKBUFF); } // 본질 붕괴(15초≈3턴)
      log.push(`  → 오리지늄 결정 파괴! (${coeff * 100}%)${adm ? " · 관리자 본질 붕괴(+30%)" : ""}`);
    }
    // 철의 서약 소모: 물리 이상 또는 포그 연계가 적 타격 시, 포그 본인의 철의 서약 1 소모 → 교란/최후의 승부
    if ((skill.anomaly || skill.id === "pg-l") && !skill.grantsIronOath) {
      const pog = s.units.find((u) => u.id === "pogranichnik" && u.hp > 0 && u.ironOath > 0);
      if (pog) {
        pog.ironOath -= 1;
        if (pog.ironOath <= 0) { raw += pog.attack * eb(pog) * 2.0; gaugeUp(s, 40); log.push(`  → 철의 서약 최후의 승부! 대량 물리 + 게이지`); }
        else { raw += pog.attack * eb(pog) * 0.45; gaugeUp(s, 7.5); log.push(`  → 철의 서약 교란(포그 잔여 ${pog.ironOath})`); }
      }
    }
    // 아크라이트: 감전 적에 추가 전기타 + 게이지(질풍 섬광)
    if (skill.shockBonus && has(t, "shock")) {
      raw += self.attack * eb(self) * skill.shockBonus.power;
      gaugeUp(s, skill.shockBonus.gauge);
      log.push(`  → 감전 소모 추가 전기 + 게이지 ${skill.shockBonus.gauge}`);
      // 황무지의 방랑자: 질풍 감전 소모 3회마다 팀 전기 증폭(장비 등급 비례 = 지능 치환, 15초≈3턴, 비중첩)
      if (self.id === "arclight" && ++self.procCount >= 3) {
        self.procCount = 0;
        const amp = self.gearGrade * 0.0008;
        for (const u of living(s, "ally")) { u.amp.electric = amp; setTimer(u, "amp:electric", 3); }
        log.push(`  → 황무지의 방랑자! 팀 전기 피해 +${(amp * 100).toFixed(1)}% (장비등급 ${self.gearGrade})`);
      }
    }
    if (skill.forceShock && t.hp > 0) { add(t, "shock"); t.shockLv = Math.max(1, t.shockLv || 1); gearTrigger(self, "anomaly:electric"); weaponTrigger(self, "anomaly:electric", living(s, "ally"), { target: t, viaBattle: skill.kind === "battle" }); bumpVuln(t, "arts", 0.12 * self.utilMult); log.push(`  → 강제 감전(전기 부착 소모)`); }
    // 알레쉬: 아츠 이상/쇄빙 소모 감지(연계 조건) + 강제 동결 + 진귀한 린수
    if (ELEMENTS.reduce((n, e) => n + t.arts[e], 0) + t.frozen < preReact) s.anomalyConsumed = ANOMALY_WINDOW;
    if (skill.forceFreeze && t.arts.cryo > 0) {
      const n = Math.min(4, t.arts.cryo);
      t.arts.cryo = 0; t.frozen = n; add(t, "stun"); setTimer(t, "frozen", DUR_FROZEN);
      gaugeUp(s, [10, 20, 30, 40][n - 1]);
      self.ultCharge = Math.min(self.ultCost, self.ultCharge + 8 * (self.ultEffMul ?? 1) * (self.wilMul ?? 1)); // 급속 냉동 보존 기술(자기 동결)
      log.push(`  → 강제 동결! 냉기 ${n}스택 소모 + 게이지 + 궁 에너지`);
    }
    if (skill.freezeZone && t.hp > 0) { // 살얼음 추위(스노우샤인): 부착 무관 직접 동결 + 빙설 지대 지속 냉기
      t.frozen = Math.max(t.frozen, skill.freezeZone); add(t, "stun"); setTimer(t, "frozen", DUR_FROZEN);
      t.dot = Math.round(self.attack * eb(self) * 0.29); setTimer(t, "dot", DUR_DOT);
      log.push(`  → 빙설 지대! 강제 동결(${skill.freezeZone}) + 지속 냉기 ${t.dot}/라운드`);
    }
    if (skill.lure) {
      const chance = 0.1 + Math.min(0.3, (self.gearGrade / 10) * 0.005); // 낚시의 달인(지능→장비등급 치환)
      if (Math.random() < chance) { raw += self.attack * eb(self) * (skill.lure.power - skill.power); gaugeUp(s, skill.lure.gauge); log.push(`  → 진귀한 린수! 강화 피해 + 게이지`); }
    }
    // 카뮤 죄를 쫓는 자: 연계가 핏빛 날개 배회 적 명중 시 회복([60+지능×0.3]→장비등급) + 연타
    if (self.id === "camu" && skill.kind === "link" && has(t, "wing")) {
      healUnit(self, 60 + self.gearGrade * 0.3, s, log);
      self.multiHit = Math.min(4, self.multiHit + 1);
      log.push(`  → ${self.name} 연타 획득 (${self.multiHit}스택)`);
    }
    // 레바테인 황혼 변신: 강화 일반공격 ×3(위키 강화 평타 464%/일반 157%≈2.95). 배틀 강화는 흡수 블록에서 처리
    if (self.id === "laevatain" && skill.kind === "attack" && (self.timers.twilight || 0) > 0) raw *= 3;
    if (self.id === "yvonne" && skill.kind === "attack" && (self.timers.iceshot || 0) > 0) raw *= 2.66; // 아이스 슈터 강화 평타(원문 강일 133% vs 평타 50%)
    // 장방이 천리의 경지 변신: 강화 일반공격 ×2.5(궁 중 평타 강화)
    if (self.id === "zhuangfangyi" && skill.kind === "attack" && (self.timers.heavenly || 0) > 0) { raw *= 2.5; markLinkEvent(s, "zhuangfangyi"); } // 변신 강화 평타 = 전기 부착 행위 → 연계창(자체수급)
    // 원작 연계의 공통 트리거: "메인 컨트롤 오퍼레이터가 강력한 일격 피해를 준 다음".
    // 턴제인 우리 모델에선 아군의 평타가 이에 대응한다. 이 창이 없으면 연계가 개전 즉시 열려 있게 된다.
    if (self.side === "ally" && skill.kind === "attack") markLinkEvent(s, "_strike");
    // 「변화의 숨결」 연계 조건(원문) = "메인이 **전기 부착** 적에게 강력한 일격/처형 후".
    //  · 메인 = 조작 중인 오퍼 → 턴제인 우리 모델에선 "평타를 친 아군 누구나"가 대응된다.
    //    (장방이 자신으로 한정하면 펠리카가 부착을 깔아주는 정석 사이클이 통째로 잠긴다)
    //  · 부착과 감전을 모두 인정한다. 부착만 보면 아군이 아츠 이상으로 소모해버려 창이 거의 안 열리고,
    //    감전만 보면 "전기 부착 적을 강타"라는 원문 조건 자체가 빠진다. 감전은 그 부착의 반응 결과다.
    // 자이히 「디도스」 지원 결정체: 원문 "메인이 강력한 일격 시 치유(최대 2회)".
    // 메인 = 조작 중인 오퍼 → 우리 모델에선 평타를 친 아군. 결정체가 살아있는 동안 2회까지 발동한다.
    if (self.side === "ally" && skill.kind === "attack" && t === primaryTarget) {
      const xai = s.units.find((u) => u.id === "xaihi" && u.side === "ally" && u.hp > 0 && (u.timers.didos || 0) > 0);
      if (xai && (xai.didosUsed || 0) < 2) {
        xai.didosUsed = (xai.didosUsed || 0) + 1;
        const hurt = living(s, "ally").filter((a) => a.hp < a.maxHp);
        if (hurt.length) {
          const tgt = hurt.reduce((lo, a) => (a.hp / a.maxHp < lo.hp / lo.maxHp ? a : lo), hurt[0]);
          healUnit(tgt, 144 + xai.gearGrade * 0.34, s, log, xai); // 기초 144 + 의지→장비등급
        } else { // 오버힐 → 그 아군에게 아츠 증폭 9%(25초≈5턴)
          self.amp.arts = (self.amp.arts || 0) + 0.09 * xai.utilMult; setTimer(self, "amp:arts", 5);
          log.push(`  → 디도스 오버힐 → ${self.name} 아츠 증폭 +9%`);
        }
      }
    }
    if (self.side === "ally" && skill.kind === "attack" && (t.arts.electric > 0 || has(t, "shock")) &&
        s.units.some((u) => u.id === "zhuangfangyi" && u.side === "ally" && u.hp > 0)) markLinkEvent(s, "zhuangfangyi");
    // 엠버: 평타 주력 딜러 — 실제 돌진 검술 4단 콤보(≈431% 물리, lv9) 반영. 범용 평타 0.5 → ×8.6≈431%.
    // 불균형 적엔 처형 공격(실 720%) → 추가 배수. 진군(방불 셋업)→경량 초자연 물리 증폭→평타 페이오프.
    if (self.id === "ember" && skill.kind === "attack") raw *= t.staggered ? 14 : 8.6;
    // 글로벌 배율: 치명타 기댓값(시전자) → 증폭(시전자)+취약(대상,위계+부식) → 불균형(+30%) → 현실정지 → 비호
    let cr = self.critRate, cd = self.critDmg;
    if (self.id === "yvonne") { // 이본 「아이스 슈터」 변신 — 원문: 7초간 강화 평타, 평타마다 치확 +3%(최대 10스택=+30%), 만스택 시 치피 +60%
      if ((self.timers.iceshot || 0) > 0) {
        const st = Math.min(10, self.iceStack || 0);
        cr += 0.03 * st;                 // 평타 누적 치확(최대 +30%)
        if (st >= 10) cd += 0.6;         // 만스택 시 치피 +60%
      }
      if (yvFrozen) cd += 0.4; else if (yvCryo) cd += 0.2; // 빙점(냉기 적 치피 +20%·동결 +40%)
    }
    let dmg = raw * (1 + cr * cd); // 치명타 기댓값(RNG 대신)
    const vMul = self.id === "lastrite" && skill.kind === "ult" ? 1.5 : 1; // 라스트 라이트 저온 취성(궁 냉기/아츠 취약 1.5배 간주)
    // 원문 1.5·1.8·1.9: 증폭 · 취약 · 받는 대미지 증가는 서로 별개의 곱연산 인자다(합치면 안 됨).
    dmg *= (1 + ampFor(self, elem)) * (1 + vulnFor(t, elem) * vMul) * (1 + recvFor(t, elem) * vMul);
    if (self.gear) { // 장비 세트 배율: 스킬 종류·아츠 + 조건부(불균형/취약/아츠 부착 적)
      const g = self.gear;
      // 원문 1.3: 일반 공격은 '스킬'이 아니다 — 모든 스킬 피해(all)는 배틀/연계/궁에만 붙는다.
      let gb = (g.kindDmg[skill.kind] || 0) + (skill.kind === "attack" ? 0 : g.kindDmg.all || 0);
      if (elem !== "physical") gb += g.elemDmg[elem] || 0;
      gb += g.elemDmg.all || 0;
      if (t.staggered) gb += g.vsBroken;
      if (t.physBreak > 0) gb += g.vsDefBreak; // 방어 불능 표식이 붙은 적(여풍 전무 「강철의 여운」)
      if ((t.vuln.all || 0) > 0 || (t.resShred || 0) > 0 || (t.vuln.physical || 0) > 0 || ELEMENTS.some((e) => (t.vuln[e] || 0) > 0)) gb += g.vsVuln;
      if (ELEMENTS.some((e) => t.arts[e] > 0)) gb += g.vsArts;
      if (self.hp / self.maxHp > 0.5) gb += elem === "physical" ? g.selfHpHighPhys : g.selfHpHighArts; // 전달자: 고체력 시 물리/아츠 피해+
      dmg *= 1 + gb;
    }
    if (t.staggered) dmg *= 1.3;
    if (self.id === "perlica" && t.staggered) dmg *= 1.3; // 펠리카 오블리터레이션 프로토콜(불균형 적 추가 +30%)
    if (self.id === "fluorite" && (t.speedMod || 0) < 0) dmg *= 1.2; // 플루라이트 몰락의 조력자(감속 적 +20%)
    if (hadCrystal && elem === "physical") dmg *= 1.2; // 관리자 현실 정지(물리 한정)
    if (skill.vsWeak && (vulnFor(t, "physical") > 0 || t.staggered)) dmg *= 1 + skill.vsWeak; // 미브 냉정(물취/불균형 적)
    dmg *= 1 - (t.protection || 0); // 비호
    if (t.gear?.selfHpLowReduce && t.hp / t.maxHp < 0.5) dmg *= 1 - t.gear.selfHpLowReduce; // 중장갑 전달자: 저체력 시 받는 피해 감소
    dmg = mitigate(t, dmg, elem); // 방어력 + 물리/아츠 저항
    // 차지 끊기(원작 2.2.2·2.2.1): 배틀·연계·궁으로 차징 중인 적을 때리면 강공 중단 + 대량 불균형치("패턴 끊기"가 최대 누적원). 일반 공격은 불가.
    if ((t.charging ?? 0) > 0 && skill.kind !== "attack") {
      t.charging = 0;
      t.stagger = Math.min(t.staggerMax, (t.stagger || 0) + Math.round(t.staggerMax * 0.6) + (self.id === "chenqianyu" ? 10 : 0)); // 진천우 「흐름 끊기」: 차지 끊기에 +10
      log.push(`  ✂ ${t.name} 차징 차단! 대량 불균형 (강력 공격 무산)`);
    }
    // 불균형치 적립 → 임계 도달 시 불균형 상태(검술사 세트 등 stagger 배율 반영)
    if (t.staggerMax > 0) {
      t.stagger += stg * (1 + (self.gear?.staggerMul || 0));
      // 불균형 지점(정예/보스): 게이지 절반을 넘으면 1회 짧은 중단 + 불균형치 회복(다시 쌓아야 완전 불균형)
      if (t.poiseKnot && !t.poiseBroken && !t.staggered && t.stagger >= t.staggerMax * 0.5) {
        t.poiseBroken = true; t.timers.stun = 1; if (!t.statuses.includes("stun")) t.statuses.push("stun");
        t.stagger = 0; // 1턴 중단 후 불균형치 회복
        log.push(`  ◈ ${t.name} 불균형 지점 돌파! 행동 잠시 중단 (불균형치 회복)`);
      }
      if (!t.staggered && t.stagger >= t.staggerMax && t.unstoppable) {
        // 끊기 저항: 불균형 임계 도달해도 불균형 없이 공세 지속(치우 다미르 등)
        t.stagger = Math.round(t.staggerMax * 0.5);
        log.push(`  → ${t.name} 끊기 저항! 공세를 멈추지 않는다`);
      } else if (!t.staggered && t.stagger >= t.staggerMax) {
        t.staggered = true; t.staggerTimer = 1; t.stagger = t.staggerMax;
        log.push(`  ⚡ ${t.name} 불균형 상태! 행동 불가 + 받는 피해 +30%`);
        if (self.gear?.breakEnergy) self.ultCharge = Math.min(self.ultCost, self.ultCharge + 10); // 재앙 방호: 불균형 돌파 시 궁 충전
      }
    }
    // 장방이 「뇌정의 부름」(변신 전 단일): 원문 "근처 청뢰검 **유도** 뇌격" — 뇌격은 검이 스스로 적을 쫓는다.
    // 대상이 도중에 죽으면 남은 뇌격은 옆의 적에게 넘어간다(변신 중엔 이미 광역이라 이월 개념이 없다).
    // 단별로 쪼개 순차 적용하고, 사망 시점 이후의 몫만 다음 적에게 그 적의 경감으로 다시 계산해 넣는다.
    const homing = self.id === "zhuangfangyi" && skill.kind === "battle" && (self.timers.heavenly || 0) <= 0 && t.hp > 0;
    let final: number;
    let homingSplit = false; // 유도 이월로 단별 로그를 이미 찍었는가(아래 공용 다단 표시 스킵)
    if (homing) {
      const hs0 = skill.hitsOf?.(self) ?? [1];
      const tot0 = hs0.reduce((a, b) => a + b, 0);
      const mitT = Math.max(1e-9, mitigate(t, 1, elem)); // 이월분을 경감 전 값으로 되돌리기 위한 계수
      let planned = 0, dealtT = 0, spill = 0, landed = 0;
      const shots: number[] = [];
      for (let i = 0; i < hs0.length; i++) {
        const share = i === hs0.length - 1 ? dmg - planned : (dmg * hs0[i]) / tot0;
        planned += share;
        if (t.hp > 0) { const d = applyDamage(t, share); dealtT += d; shots.push(d); landed++; }
        else spill += share / mitT; // 이미 죽었다 → 이 뇌격은 다른 적을 쫓는다
      }
      final = dealtT;
      if (spill > 0) {
        // 실제로 꽂힌 타수만 찍는다(총합을 다시 쪼개면 죽은 적이 전 타를 맞은 것처럼 보인다)
        if (landed > 1) shots.forEach((d, i) => log.push(`    ${i + 1}단 -${d.toLocaleString()}`));
        homingSplit = true;
        const next = living(s, "enemy").find((e) => e !== t);
        if (next) {
          const d2 = applyDamage(next, mitigate(next, spill, elem));
          next.stagger = Math.min(next.staggerMax, (next.stagger || 0) + stg);
          log.push(`  ⚡ 청뢰검 유도! ${t.name} 처치 → 남은 ${hs0.length - landed}뇌격이 ${next.name}에게 -${d2.toLocaleString()}`);
        } else log.push(`  ⚡ 남은 ${hs0.length - landed}뇌격 — 쫓을 적이 없다`);
      }
    } else final = applyDamage(t, dmg); // 보호막(보호) 흡수 → 체력
    // 다단히트: 단별 개별 피해를 먼저 찍고 마지막에 종합 합계. 총합은 final 그대로(반올림 오차는 막타가 흡수).
    // 타수가 런타임에 정해지는 스킬(장방이 뇌정의 부름 = 청뢰검 수만큼 뇌격, 마지막 ×6)은 여기서 배열을 만든다.
    const dynHits = skill.hitsOf?.(self);
    const hitArr = dynHits ?? skill.hits;
    if (!homingSplit && hitArr && hitArr.length > 1 && final > 0) {
      const hs = hitArr, tot = hs.reduce((a, b) => a + b, 0);
      let acc = 0;
      hs.forEach((h, i) => {
        const d = i === hs.length - 1 ? final - acc : Math.round((final * h) / tot);
        acc += d;
        log.push(`    ${i === hs.length - 1 && hs.length > 2 && hs[i] > hs[0] ? "막타" : `${i + 1}단`} -${d.toLocaleString()}`);
      });
      log.push(`    ═ ${hs.length}단 합계 -${final.toLocaleString()}`); // 다단 종합 데미지
    }
    log.push(`  ${t.name} -${final} (HP ${t.hp}/${t.maxHp})`);
    // 레바테인 「불꽃의 심장」 원문: "주변의 적이 처치될 때, 열기 부착도 함께 흡수됩니다."
    if (t.side === "enemy" && t.hp <= 0) moveBloodWing(s, t, log); // 핏빛 날개는 대상이 죽으면 다음 적으로
    if (t.side === "enemy" && t.hp <= 0 && t.arts.heat > 0) {
      const lae = s.units.find((u) => u.id === "laevatain" && u.side === "ally" && u.hp > 0);
      if (lae) {
        lae.procCount = Math.min(4, (lae.procCount || 0) + t.arts.heat);
        log.push(`  → 녹아내린 불꽃 ${lae.procCount}/4 (처치 흡수 ${t.arts.heat})`);
        t.arts.heat = 0; delete t.timers["arts:heat"];
      }
    }
    if (self.id === "rossi" && final > 0 && skill.kind !== "attack" && self.hp < self.maxHp) healUnit(self, Math.round(self.maxHp * 0.025), s, log); // 로시 끓어오르는 피: 스킬 치명 시 자기 회복(딜탱, 근사)
    // 펠리카 「순환 프로토콜」: 스킬 명중 시 양옆(인접) 적으로 전기 튕김(50% 전이)
    if (self.id === "perlica" && skill.kind !== "attack" && final > 0) {
      for (const adj of living(s, "enemy")) {
        if (adj !== t && Math.abs(adj.pos - t.pos) === 1) {
          const bd = applyDamage(adj, mitigate(adj, dmg * 0.5, "electric"));
          if (bd > 0) log.push(`  ↔ 순환 프로토콜 튕김! ${adj.name} -${bd}`);
        }
      }
    }
    if (t.hp === 0) {
      // 부활(잔영): 사망 시 1회 재생(HP 50%) + 공격 강화 — 원작 "부활 후 공격 범위↑·자폭"을 강화로 근사
      if (t.side === "enemy" && t.revive && !t.revived) {
        t.revived = true; t.hp = Math.round(t.maxHp * 0.5); t.atkBuff = (t.atkBuff || 0) + 0.25; setTimer(t, "atkBuff", 99);
        log.push(`  ↻ ${t.name} 부활! HP 50% 재생 + 공격 강화`);
      } else {
      log.push(`  ✗ ${t.name} 격파!`);
      if (self.gear?.onKillHeal) healUnit(self, Math.round(self.maxHp * self.gear.onKillHeal), s, log); // 통합형 중갑: 처치 시 회복
      if (self.gear?.onKillAtk) { self.atkBuff = Math.min(0.6, (self.atkBuff || 0) + self.gear.onKillAtk); setTimer(self, "atkBuff", 3); } // 통합형 경갑: 처치 시 공격력+
      // 자폭(화염원석충): 사망 시 광역 아군 피해 + 열기 취약(원작 "자폭 → 불안정 화합물 → 재피격 시 폭발"을 취약으로 근사)
      if (t.side === "enemy" && t.selfDestruct) {
        const boom = t.attack * t.selfDestruct;
        for (const a of living(s, "ally")) { const d = applyDamage(a, mitigate(a, boom, "heat")); bumpVuln(a, "heat", 0.15); setTimer(a, "vuln:heat", 2); log.push(`  💥 ${t.name} 자폭! ${a.name} -${d} + 열기 취약`); }
      }
      }
    }
    onAllyHit(s, self, t, final, log); // 아군 피격 트리거(엠버 강철·레바테인 불씨·디펜더 패링) — 적 공격(enemyAct)에서도 호출
    if (final > 0) { aoeTotal += final; aoeHits++; }
  }
  if (aoeHits > 1) log.push(`  ═ 합계 -${aoeTotal.toLocaleString()} (${aoeHits}체)`); // 범위기 총 딜
  // 엠버(디펜더): 전진의 결의(배틀·연계 시 50% 비호) · 전선에서의 지원 치유 · 다시 불타오르는 맹세 팀 보호막
  if (self.id === "ember") {
    if (skill.kind === "battle" || skill.kind === "link") applyBuff(self, "protection", 0.5, undefined, 1); // 전진의 결의(시전 중 비호)
    if (skill.kind === "link") { // 전선에서의 지원: 최저 체력% 아군 치유(기초 300 + 의지→장비등급 ×0.7)
      const hurt = living(s, "ally").filter((a) => a.hp < a.maxHp);
      const tgt = hurt.length ? hurt.reduce((lo, a) => (a.hp / a.maxHp < lo.hp / lo.maxHp ? a : lo), hurt[0]) : self;
      healUnit(tgt, 300 + self.gearGrade * 0.7, s, log, self);
    }
    if (skill.kind === "ult") { // 다시 불타오르는 맹세: 팀 전체 보호막(엠버 최대 생명력 18%, 10초≈2턴)
      const sh = Math.round(self.maxHp * 0.18);
      for (const a of living(s, "ally")) applyBuff(a, "shield", sh, undefined, 2);
      log.push(`  → 팀 보호막 +${sh} (최대 생명력 18%)`);
    }
  }
  // 미브 「분노」: 연계 후 최대 HP 30% 보호막(2턴) — 12턴 쿨. 원작 "연계 후 보호막 + 방해 저항"
  if (self.id === "mifu" && skill.kind === "link" && (self.timers.mifuRage ?? 0) <= 0) {
    const sh = Math.round(self.maxHp * 0.3);
    applyBuff(self, "shield", sh, undefined, 2);
    self.timers.mifuRage = 12;
    log.push(`  → 미브 분노! 보호막 +${sh} (최대 HP 30%, 2턴)`);
  }
  // 스노우샤인(디펜더): 포화성 방어(비호+반격 태세) · 극지 구조(저체력 치유, 의지→장비등급)
  if (self.id === "snowshine") {
    if (skill.kind === "battle") { // 포화성 방어: 자신+주변 90% 비호 + 반격 태세(이번 라운드 피격 시 냉기 부착)
      for (const a of living(s, "ally")) applyBuff(a, "protection", 0.9, undefined, 1);
      setTimer(self, "guard", 1);
      log.push(`  → 포화성 방어! 90% 비호 + 반격 태세`);
    }
    if (skill.kind === "link") { // 극지 구조: 아군 대량 치유(96+장비등급×0.22), 극지 생존(55% 이하 +25%)
      const base = 96 + self.gearGrade * 0.22;
      for (const a of living(s, "ally")) healUnit(a, base * (a.hp / a.maxHp <= 0.55 ? 1.25 : 1), s, log, self);
    }
  }
  // 카치르(디펜더): 강력한 저지(비호+반격 방불 태세) · 실시간 억제(보호막, 방어력→장비등급)
  if (self.id === "catcher") {
    if (skill.kind === "battle") { // 강력한 저지: 자신+주변 90% 비호 + 반격 태세(피격 시 방어 불능)
      for (const a of living(s, "ally")) applyBuff(a, "protection", 0.9, undefined, 1);
      setTimer(self, "guard", 1);
      log.push(`  → 강력한 저지! 90% 비호 + 반격 태세`);
    }
    if (skill.kind === "link") { // 실시간 억제: 자신+아군 보호막(360 + 강인한 방어선 방어력→장비등급 ×2.25)
      const sh = Math.round(360 + self.gearGrade * 2.25);
      for (const a of living(s, "ally")) applyBuff(a, "shield", sh, undefined, 2);
      log.push(`  → 실시간 억제 보호막 +${sh} (방어력 비례)`);
    }
  }
  // 아델리아(서포터): 친구의 그림자 — 배틀/궁 명중 시 돌리 그림자 → 최저 체력% 아군 치유(의지→장비등급)
  if (self.id === "ardelia" && (skill.kind === "battle" || skill.kind === "ult")) {
    const heal = (90 + self.gearGrade * 0.75) * (skill.kind === "ult" ? 0.5 : 1); // 궁은 확률 생성 근사(절반)
    const hurt = living(s, "ally").filter((a) => a.hp < a.maxHp);
    const tgt = hurt.length ? hurt.reduce((lo, a) => (a.hp / a.maxHp < lo.hp / lo.maxHp ? a : lo), hurt[0]) : self;
    healUnit(tgt, heal, s, log, self);
  }
  // 미브(가드): 분노 — 연계 후 최대 HP 30% 보호막(방해 저항 근사). 12턴마다 1회.
  if (self.id === "mifu" && skill.kind === "link" && (self.timers.furyCd || 0) <= 0) {
    applyBuff(self, "shield", Math.round(self.maxHp * 0.30), undefined, 2); setTimer(self, "furyCd", 12);
    log.push(`  → 분노! 보호막 (최대 HP 30%)`);
  }
  // 결 「어스름 파훼」 — 집중 공격 2회를 소화하면 궁이 「깨달음」(640%)으로 전환된다.
  // 우리 모델은 궁 1회 = 진+집중2회이므로, 궁을 쓰면 다음 궁이 깨달음이 되고 그 다음은 다시 진으로 돌아간다.
  if (self.id === "arcane" && skill.kind === "ult") {
    if ((self.timers.duskAwaken || 0) > 0) { delete self.timers.duskAwaken; log.push(`  → 어스름 파훼의 깨달음! (다음 궁은 다시 진 생성)`); }
    else { setTimer(self, "duskAwaken", 99); log.push(`  → 집중 공격 2회 소화 — 다음 궁이 「깨달음」으로 전환`); }
  }
  // 판: 간 맞추기 — 궁(채 썰어 웍) 후 식재료 준비 → 이후 연계(조미료) 쿨 40% 단축(근사).
  if (self.id === "dapan" && skill.kind === "ult") { self.linkCdMul = 0.6; log.push(`  → 간 맞추기! 연계 쿨 40% 단축`); }
  // 자이히(서포터): 디도스(치유 / 오버힐 시 아츠 증폭) · 스택 오버플로(팀 냉기/자연 증폭, 지능→장비등급)
  if (self.id === "xaihi") {
    if (skill.kind === "battle") { // 디도스: 지원 결정체 소환. 원문은 여기서 치유하지 않는다 —
      // "메인이 강력한 일격 시 치유(최대 2회)"라 발동은 아군 평타 쪽 훅(xaihiCrystal)이 담당한다.
      setTimer(self, "didos", 3);
      self.didosUsed = 0; // 재소환 → 회복 횟수 초기화(연계 「스트레스 테스트」는 2회 소진 후 열린다)
      log.push(`  → 디도스! 지원 결정체 소환(강일 2회까지 치유)`);
    }
    if (skill.kind === "ult") { // 스택 오버플로: 팀 냉기/자연 증폭(12초≈3턴, 지능→장비등급 비례, 상한 30%)
      const amp = 0.11 * self.utilMult + Math.min(0.3, self.gearGrade * 0.003); // 스킬 단조 유틸 + 장비 단조(gearGrade)
      for (const a of living(s, "ally")) {
        a.amp.cryo = (a.amp.cryo || 0) + amp; setTimer(a, "amp:cryo", 3);
        a.amp.nature = (a.amp.nature || 0) + amp; setTimer(a, "amp:nature", 3);
        // 프리징 프로토콜: 팀 전체 냉기 부착·동결 정화
        a.arts.cryo = 0; delete a.timers["arts:cryo"];
        if (a.frozen > 0) { a.frozen = 0; rm(a, "stun"); delete a.timers["frozen"]; }
      }
      log.push(`  → 스택 오버플로! 팀 냉기/자연 증폭 +${(amp * 100).toFixed(0)}% · 냉기/동결 정화`);
    }
  }
  // 안탈(서포터): 오버클럭 타임(팀 전기/열기 증폭) · 자기 폭풍 실험장(포커싱 적 부착/물리 이상 갱신)
  if (self.id === "antal") {
    if (skill.kind === "ult") { // 오버클럭 타임: 팀 전기/열기 증폭(12초≈3턴)
      for (const a of living(s, "ally")) {
        a.amp.electric = (a.amp.electric || 0) + 0.08 * self.utilMult; setTimer(a, "amp:electric", 3);
        a.amp.heat = (a.amp.heat || 0) + 0.08 * self.utilMult; setTimer(a, "amp:heat", 3);
      }
      log.push(`  → 오버클럭 타임! 팀 전기/열기 증폭 +8%`);
    }
    if (skill.kind === "link") { // 자기 폭풍 실험장: 포커싱 적 아츠 부착/물리 이상 재부여(지속 갱신)
      const t = pickTargets(s, self, skill)[0];
      if (t) {
        ELEMENTS.forEach((e) => { if (t.arts[e] > 0) setTimer(t, "arts:" + e, DUR_ATTACH); });
        if (t.physBreak > 0) setTimer(t, "physBreak", DUR_BREAK);
        log.push(`  → 안탈: 아츠 부착/물리 이상 갱신(재부여)`);
      }
    }
  }
  // 질베르타(서포터): 뒤늦은 편지 — 배틀 마지막/연계가 2명 이상 명중 시 최저 체력% 아군 치유(지능→장비등급)
  if (self.id === "gilberta" && (skill.kind === "battle" || skill.kind === "link") && pickTargets(s, self, skill).length >= 2) {
    const hurt = living(s, "ally").filter((a) => a.hp < a.maxHp);
    const tgt = hurt.length ? hurt.reduce((lo, a) => (a.hp / a.maxHp < lo.hp / lo.maxHp ? a : lo), hurt[0]) : self;
    healUnit(tgt, 108 + self.gearGrade * 0.9, s, log);
  }
  // 플루라이트(캐스터): 무료 아츠 부착 지원 — 연계/궁이 냉기/자연 2부착+ 적에 같은 부착 1스택 추가(게이지 무소모)
  if (self.id === "fluorite" && (skill.kind === "link" || skill.kind === "ult")) {
    const t = pickTargets(s, self, skill)[0];
    const el: Element | null = t ? (t.arts.cryo >= 2 ? "cryo" : t.arts.nature >= 2 ? "nature" : null) : null;
    if (t && el) { applyAttach(t, el, self, log); log.push(`  → 무료 아츠 부착(${EL_NAME[el]} 1스택 추가)`); }
  }
  // 탕탕(캐스터): 용오름/와류 — 배틀(냉기 부착+용오름 개수 아츠 취약+게이지) · 연계(와류+의기투합) · 궁(시간 정지)
  if (self.id === "tangtang") {
    if (skill.kind === "battle") { // 우당탕탕 파도: 와류 소모 → 용오름 개수↑(1~3), 개수 비례 아츠 취약 + 지속 냉기 + 게이지 반환
      const vortex = Math.min(2, self.procCount || 0); const spouts = 1 + vortex; self.procCount = 0;
      for (const t of pickTargets(s, self, skill)) {
        t.dot = Math.round(self.attack * eb(self) * 1.33); setTimer(t, "dot", DUR_DOT); // 용오름 지속 냉기
        if (spouts >= 2) { t.vuln.arts = Math.min(0.30, (t.vuln.arts || 0) + (spouts >= 3 ? 0.08 : 0.06) * self.utilMult); setTimer(t, "vuln:arts", 3); } // 용오름 아츠 취약 누적(스킬 단조 유틸)
      }
      const va = Math.round((pickTargets(s, self, skill)[0]?.vuln.arts || 0) * 100);
      if (vortex > 0) gaugeUp(s, vortex * 20); // 와류마다 게이지 20 반환
      log.push(`  → 용오름 ${spouts}개${spouts >= 2 ? ` · 아츠 취약 누적 ${va}%` : ""}${vortex ? ` · 와류 ${vortex} 소모(게이지 +${vortex * 20})` : ""}`);
    }
    if (skill.kind === "link") { // 야, 강물!: 와류 생성(최대 2) + 의기투합(아군 가속 / 적 감속)
      self.procCount = Math.min(2, (self.procCount || 0) + 1);
      for (const a of living(s, "ally")) applyBuff(a, "speedMod", 10);
      for (const e of living(s, "enemy")) { e.speedMod = (e.speedMod || 0) - 20; setTimer(e, "speedMod", 2); }
      log.push(`  → 와류 생성(${self.procCount}/2) · 의기투합(아군 가속 / 적 감속)`);
    }
    if (skill.kind === "ult") { // 대당가: 고대의 진 시간 정지(다음 1턴 행동 불가 — 불균형 아님, 받는 피해 보너스 없음) + 지속 냉기
      for (const t of pickTargets(s, self, skill)) {
        if (t.staggerMax > 0 && !t.staggered) { add(t, "stun"); setTimer(t, "stun", 1); } // 상대 턴 1턴 뒤로
        t.dot = Math.round(self.attack * eb(self) * 1.42); setTimer(t, "dot", DUR_DOT);
      }
      log.push(`  → 고대의 진! 시간 정지(다음 1턴 행동 불가) + 지속 냉기`);
    }
  }
  // 라스트 라이트(스트라이커): 배틀/연계로만 궁 에너지 자가 충전(환영 추격 +16 / 겨울 포식자 +50, 스택 비례 근사)
  if (self.id === "lastrite") {
    if (skill.kind === "battle") self.ultCharge = Math.min(self.ultCost, self.ultCharge + 16);
    if (skill.kind === "link") self.ultCharge = Math.min(self.ultCost, self.ultCharge + 50);
  }
  // 아비웨나(스트라이커): 썬더랜스를 대상(적)에게 누적 — 연계 일반 3개 / 궁 강력 1개. 가로채기(배틀)로 대상 스택 소모.
  if (self.id === "avywenna") {
    const tg = pickTargets(s, self, skill)[0];
    if (tg && skill.kind === "link") { tg.lanceN = (tg.lanceN || 0) + 3; self.ultCharge = Math.min(self.ultCost, self.ultCharge + 12); log.push(`  → 썬더랜스 3개 설치 → ${tg.name}(누적 일반 ${tg.lanceN}/강력 ${tg.lanceBig || 0})`); }
    if (tg && skill.kind === "ult") { tg.lanceBig = (tg.lanceBig || 0) + 1; log.push(`  → 강력 썬더랜스 설치 → ${tg.name}(누적 일반 ${tg.lanceN || 0}/강력 ${tg.lanceBig})`); }
  }
  // 판(스트라이커): 전분 풀기 — 강타로 방어 불능 소모 시 소모 스택당 물리 피해 +6%(최대 4스택=+24%, 10초≈2턴)
  if (self.id === "dapan" && skill.kind === "link" && primaryPre >= 1) {
    const consumed = Math.min(4, primaryPre);
    self.amp.physical = Math.min(0.24, (self.amp.physical || 0) + 0.06 * consumed); setTimer(self, "amp:physical", 2);
    log.push(`  → 전분 풀기! 물리 피해 +${Math.round(self.amp.physical * 100)}% (방어 불능 ${consumed} 소모)`);
  }
  // 레바테인(스트라이커): 열화 연계 궁 에너지(명중 수 비례). 녹아내린 불꽃 빌드는 흡수 루프에서 처리
  if (self.id === "laevatain" && skill.kind === "link") {
    const hits = pickTargets(s, self, skill).length;
    self.ultCharge = Math.min(self.ultCost, self.ultCharge + (hits >= 3 ? 35 : hits === 2 ? 30 : 25) * (self.ultEffMul ?? 1) * (self.wilMul ?? 1));
    log.push(`  → 열화 궁 충전 (${hits}명)`);
  }
  // 레바테인 황혼: 열화의 마검 변신(15초≈3턴) — 지속 동안 일반공격/배틀 강화(act 배수). 변신 직후 즉시 추가 행동.
  if (self.id === "laevatain" && skill.kind === "ult") {
    setTimer(self, "twilight", 3);
    self.atb += 100; // 변신 후 바로 자기 턴(강화 평타/배틀 즉시 활용)
    log.push(`  → 황혼 변신! 일반공격·배틀 스킬 강화 · 즉시 추가 행동`);
  }
  // 이본 「아이스 슈터」: 삐삐 배치 + 메인 전환 — 7초(≈2턴) 강화 평타. 평타마다 치확 +3%(최대 10스택), 만스택 시 치피 +60%.
  if (self.id === "yvonne" && skill.kind === "ult") {
    setTimer(self, "iceshot", 3); // 7초 ≈ 평타 2회분. perTurn이 자기 턴 시작에 감쇠하므로 2를 주면 실사용 1턴 → 3
    self.iceStack = 0;
    self.atb += 100; // 변신 후 바로 자기 턴(강화 평타 즉시 활용)
    log.push(`  → 아이스 슈터 변신! 강화 평타(평타마다 치확 +3%, 만스택 시 치피 +60%) · 즉시 추가 행동`);
  }
  // 변신 중 평타마다 치확 스택 누적(최대 10)
  if (self.id === "yvonne" && skill.kind === "attack" && (self.timers.iceshot || 0) > 0) {
    // 원문 "평타마다 치확 +3%(최대 10스택)"의 "평타"는 **단(히트)** 단위 — 이본 일반 공격은 최대 5단이고
    // 7초면 5단 콤보를 약 2회 돌려 10히트 = 만스택. 턴제에선 평타 1턴 = 5단 콤보 = +5스택.
    self.iceStack = Math.min(10, (self.iceStack || 0) + 5);
    if (self.iceStack === 10) log.push(`  → 아이스 슈터 만스택! 치피 +60%`);
  }
  // 이본(스트라이커): 꽁꽁이 연계 — 명중 시 궁 에너지 +10(여러 목표여도 1회)
  if (self.id === "yvonne" && skill.kind === "link") {
    self.ultCharge = Math.min(self.ultCost, self.ultCharge + 10);
    log.push(`  → 꽁꽁이 궁 충전 (+10)`);
  }
  // 장방이(스트라이커): 심판의 폭풍 — 천리의 경지 변신(25초≈4턴, 평타/배틀 강화·방해 면역) + 첫 배틀 무소모 청뢰검 3자루. 변신 직후 즉시 추가 행동.
  if (self.id === "zhuangfangyi" && skill.kind === "ult") {
    setTimer(self, "heavenly", 4);
    self.zfyUsedFree = false; // 변신마다 첫 배틀 무소모 1회
    self.procCount = Math.min(9, Math.max(self.procCount || 0, 3));
    self.atb += 100; // 변신 후 바로 자기 턴(강화 배틀·청뢰검 즉시 폭발)
    log.push(`  → 심판의 폭풍! 천리의 경지 변신 (청뢰검 ${self.procCount}/9) · 즉시 추가 행동`);
  }
  if (skill.kind === "attack" && self.side === "ally") { // 강력한 일격/처형 → 스킬 게이지 회복
    gaugeUp(s, (executed ? EXEC_RECOVER : BASIC_RECOVER));
  }
  if (self.rampAtk && self.side === "ally" && skill.kind !== "attack") { // 진천우 칼날 베기(스킬마다 공격력 누적, 최대 5스택, 10초≈2턴)
    self.atkBuff = Math.min(5 * self.rampAtk, (self.atkBuff || 0) + self.rampAtk);
    setTimer(self, "atkBuff", 2);
  }
  // 미브 청파 삼형 스탠스 전환(2턴 윈도우)
  if (skill.stanceFromCrush) { self.stance = primaryPre >= 3 ? 2 : 0; setTimer(self, "stance", 2); }
  else if (skill.setStanceTo != null) { self.stance = skill.setStanceTo; setTimer(self, "stance", 2); }
  // 포그 궁: 본인에게 철의 서약 5스택 부여(30초≈6턴)
  if (skill.grantsIronOath) { self.ironOath = skill.grantsIronOath; setTimer(self, "ironOath", 6); s.log.push(`  → ${self.name} 철의 서약 ${skill.grantsIronOath}스택 획득`); }
  // 포그 뱅가드 게이지 수급: 플랫 + 방불 소모량 비례
  if (self.side === "ally") {
    let rec = 0;
    if (skill.gaugeGain) rec += skill.gaugeGain;
    if (skill.gaugeOnConsume && (skill.anomaly === "crush" || skill.anomaly === "armor-break") && primaryPre >= 1)
      rec += skill.gaugeOnConsume[Math.min(4, primaryPre) - 1];
    if (self.id === "akekuri" && skill.kind === "link") rec *= 1 + Math.min(0.75, (self.gearGrade / 10) * 0.015); // 승리의 함성(연계 게이지 +지능→장비등급)
    if (rec > 0) {
      gaugeUp(s, rec);
      // 무기 흐름 시리즈(아케쿠리·알레쉬·아크라이트·포그·카뮤): "자신 스킬로 스킬 게이지를 회복한 후" 팀 공격력+
      weaponTrigger(self, "gauge", living(s, "ally"));
      // 생존의 깃발(포그): 자기 게이지 80 회복마다 사기 격양(공격력 +8%, 최대 3스택=+24%, 20초)
      if (self.id === "pogranichnik") {
        self.gaugeRecovered += rec;
        while (self.gaugeRecovered >= 80) { self.gaugeRecovered -= 80; self.atkBuff = Math.min(0.24, (self.atkBuff || 0) + 0.08); setTimer(self, "atkBuff", 4); }
      }
    }
  }
  // 안탈 즉흥적인 천재성: 증폭 상태 아군이 스킬 피해를 줄 때 회복(30초≈6턴 1회 제한). 힘→장비등급.
  if (self.side === "ally" && (skill.kind === "battle" || skill.kind === "link" || skill.kind === "ult")) {
    const antal = s.units.find((u) => u.id === "antal" && u.hp > 0);
    const amped = ampFor(self, "physical") > 0 || ELEMENTS.some((e) => ampFor(self, e) > 0);
    if (antal && amped && (self.timers.antalHeal || 0) <= 0) { healUnit(self, 108 + antal.gearGrade * 0.9, s, log); setTimer(self, "antalHeal", 6); }
  }
  if (self.multiHit > 0 && (skill.kind === "battle" || skill.kind === "ult")) { // 연타 소모 → 배틀/궁 피해 강화(가시화)
    const n = Math.min(4, self.multiHit);
    s.log.push(`  ⚡ ${self.name} 연타 소모! ${skill.kind === "ult" ? "궁극기" : "배틀"} 피해 +${Math.round((skill.kind === "ult" ? MH_ULT : MH_BATTLE)[n - 1] * 100)}% (${n}스택)`);
    self.multiHit = 0;
  }
  if (skill.grantsMultiHit) self.multiHit = Math.min(4, self.multiHit + skill.grantsMultiHit); // 몰입의 시간(소모 후 부여)
  if (self.side === "ally" && (skill.kind === "link" || skill.kind === "battle")) gearTrigger(self, skill.kind); // 본크러셔·청파(연계)·응룡(배틀) 발동 버프
  if (self.side === "ally") weaponTrigger(self, skill.kind, living(s, "ally")); // 무기 시리즈 조건부 트리거(궁후평타·명중스택·팀버프 등)
  // 팀 피해 버프 세트(gearTrigger 밖에서 처리) — 지원 스킬 사용 시 팀 주는 피해 +16%(3턴, 미중첩).
  //  식양의 숨결: 증폭·비호·취약·허약 부여 후 → "다른 팀원". 개척: 스킬로 게이지 회복 후 → "팀 전체(자신 포함)".
  if (self.side === "ally" && skill.kind !== "attack") {
    const xiran = self.gearSets?.includes("식양의 숨결"), pioneer = self.gearSets?.includes("개척");
    if (xiran || pioneer) {
      const set = xiran ? "식양의 숨결" : "개척";
      const prev = pushSrc({ by: self.name, via: set, kind: "gear" });
      for (const a of living(s, "ally")) { if (xiran && a === self) continue; a.amp.all = Math.max(a.amp.all || 0, 0.16); setTimer(a, "amp:all", 3); }
      popSrc(prev);
      log.push(`  → ${set}! ${xiran ? "다른 " : ""}팀 피해 +16% (3턴)`);
    }
  }

  // ── 연계 예약 ── 이 행동으로 조건이 열린 아군의 연계가 **쿨이 아니고 조건이 서면**, 그 오퍼가 ATB에서
  // 다음 차례로 끼어들어(추가 턴) 자기 차례에 연계를 발동한다. 즉시 발동이 아니라 턴 순서에 등장 → 자기 턴에 발동.
  // usable이 쿨(linkCd)·조건(requires)을 둘 다 검사. 실제 발동은 nextActor→pendingLink 처리(step/allyChoose).
  runPhases(s, log); // 이 행동으로 보스 페이즈가 넘어갔는지 판정(HP 임계·페이즈 체력바 소진)
  if (self.side === "ally" && !s.manualLink && !s.chaining && linkChainProvider) {
    s.chaining = true;
    const nx = linkChainProvider(s, self);
    if (nx && !nx.unit.pendingLink) {
      nx.unit.pendingLinkAtb = nx.unit.atb; // 원래 ATB 저장 → 연계 후 복원(정규 턴 유지 = 원래 턴 + 연계 턴)
      nx.unit.pendingLink = nx.skill;
      nx.unit.chainStep = Math.min(CHAIN_MAX, (s.chain ?? 1) + 1); // 이어붙은 만큼 체인 단계 상승
      nx.unit.atb = Math.max(0, ...living(s).map((u) => u.atb)) + 10; // ATB 최우선으로 끌어올려 다음 차례에 등장
      log.push(`  ⇢ ${nx.unit.name} 연계 대기 — 다음 차례에 「${nx.skill.name}」`);
    }
    s.chaining = false;
  }
}

// 라운드 시작: DoT + 불균형 회복
// 라운드(사이클) 공유 효과 — 스킬 게이지 회복 + 트리거 윈도우 리셋. ATB에서 모두 1회 행동마다 호출.
export function startRound(s: DDState): void {
  s.round++;
  s.anomalyConsumed = Math.max(0, (s.anomalyConsumed ?? 0) - 1); // 아츠 이상/소모·흡수 윈도우 감쇠(즉시 리셋 X — ATB 순서상 셋업이 페이오프보다 늦게 오면 창이 닫혀버림)
  s.allyHit = false; // 피격 트리거 윈도우 리셋(엠버 전선에서의 지원)
  if (s.linkEvents) for (const k of Object.keys(s.linkEvents)) if (--s.linkEvents[k] <= 0) delete s.linkEvents[k]; // 연계 이벤트 윈도우 감쇠
  gaugeUp(s, GAUGE_REGEN); // 스킬 게이지 자연 회복(파티 공유)
}
// 유닛 자기 턴 시작 효과 — 지속피해·재생·불균형 회복·타이머 감쇠·연계 쿨. ATB에서 행동 직전 호출.
export function perTurn(s: DDState, u: DDUnit): void {
  if (u.dot > 0) { u.hp = Math.max(0, u.hp - u.dot); s.log.push(`${u.name} 지속 피해 -${u.dot}`); }
  if (u.hp <= 0) moveBloodWing(s, u, s.log); // 지속 피해로 죽어도 날개는 옮겨간다
  if ((u.regen || 0) > 0 && (u.regenTurns || 0) > 0) { const h = Math.min(u.maxHp - u.hp, u.regen!); if (h > 0) { u.hp += h; s.log.push(`${u.name} 재생 +${h}`); } u.regenTurns = (u.regenTurns || 0) - 1; if ((u.regenTurns || 0) <= 0) u.regen = 0; }
  if (u.staggered) { u.staggerTimer -= 1; if (u.staggerTimer <= 0) { u.staggered = false; u.stagger = 0; s.log.push(`${u.name} 불균형 회복`); } }
  for (const key of Object.keys(u.timers)) { if (--u.timers[key] <= 0) { delete u.timers[key]; delete u.effectSrc[key]; expire(u, key); } } // 효과 지속시간 감쇠
  // 0 초과일 때만 감소 — 마지막 감소로 소수 나머지(예 0.4-1=-0.6)까지만 남고 거기서 멈춘다.
  // 하한을 풀면 조건을 기다리는 동안 음수가 적립돼 다음 쿨이 반토막 난다(장방이 연계 18→36회).
  if (u.linkCd > 0) u.linkCd -= 1; // 연계 쿨 감소(남은 음수 = 소수 나머지 → 다음 쿨에서 차감)
}

export function isOver(s: DDState): "ally" | "enemy" | null {
  if (!living(s, "ally").length) return "enemy";
  if (!living(s, "enemy").length) return "ally";
  return null;
}

// ATB: 행동 게이지가 100에 도달한 유닛이 행동. 속도만큼 충전 → 빠를수록 자주 행동.
const atbSpeed = (u: DDUnit) => Math.max(1, u.speed + (u.speedMod || 0));
// 다음 행동자 결정(게이지 전진, 파괴적). 100 도달자 없으면 최단시간만큼 모두 전진.
export function nextActor(s: DDState): DDUnit | null {
  SRC_CTX = null; // 행동 사이 컨텍스트 초기화(스킬 밖 setTimer는 출처 없음)
  const alive = living(s);
  if (!alive.length) return null;
  let ready = alive.filter((u) => u.atb >= 100);
  if (!ready.length) {
    const t = Math.min(...alive.map((u) => (100 - u.atb) / atbSpeed(u)));
    for (const u of alive) u.atb += atbSpeed(u) * t;
    ready = alive.filter((u) => u.atb >= 99.999);
  }
  const actor = ready.sort((a, b) => b.atb - a.atb || atbSpeed(b) - atbSpeed(a) || a.id.localeCompare(b.id))[0];
  actor.atb -= 100; // 행동 후 게이지 소모(초과분 이월)
  return actor;
}
// 표시용 예측 순서(비파괴) — atb 복제해 다음 n행동 시뮬. UI 순서 컬럼용.
export function turnOrder(s: DDState, n = 8): DDUnit[] {
  const sim = living(s).map((u) => ({ u, atb: u.atb }));
  const out: DDUnit[] = [];
  for (let i = 0; i < n && sim.length; i++) {
    let ready = sim.filter((x) => x.atb >= 100);
    if (!ready.length) { const t = Math.min(...sim.map((x) => (100 - x.atb) / atbSpeed(x.u))); for (const x of sim) x.atb += atbSpeed(x.u) * t; ready = sim.filter((x) => x.atb >= 99.999); }
    const pick = ready.sort((a, b) => b.atb - a.atb || atbSpeed(b.u) - atbSpeed(a.u) || a.u.id.localeCompare(b.u.id))[0];
    out.push(pick.u); pick.atb -= 100;
  }
  return out;
}
