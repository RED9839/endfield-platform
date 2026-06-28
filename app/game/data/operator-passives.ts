// ===== 오퍼별 고유 패시브 스펙 (실제 재능 2종을 카드게임 레버로 합성) =====
// 공유 enum(passiveMechanic) 대신, 각 오퍼가 자기 두 재능을 반영한 레버 조합을 가진다.
// 엔진(useRunState)이 이 스펙을 읽어 전투에 적용. 표시용 재능 텍스트는 operator-talents.ts.
export type PassiveSpec = {
  vsBroken?: number;       // 불균형 적 카드 피해 +x
  vsStatus?: number;       // 아츠/이상(연소·감전·동결·부식·관통·감속) 적 +x
  vsVulnerable?: number;   // 물리 취약(physBreak) 적 +x
  selfPower?: number;      // 상시 자기 카드 피해 +x
  stackPerHit?: number;    // 비기본 스킬 명중마다 자기 피해 누적 +x/스택(최대5)
  essenceStack?: number;   // 물리 분쇄(강타/갑옷파괴) 시 자기 피해 누적 +x/스택
  teamAmp?: number;        // 파티 전체 카드 피해 오라 +x (생존 보유자 합산)
  crit?: number;           // 자기 치명타 확률 +x
  critVsStatus?: number;   // 아츠/이상 적 대상 치명타 피해 +x
  targetVuln?: number;     // 이 오퍼가 때린 적이 받는 모든 피해 +x (표식 디버프, 팀 전체 이득)
  healOnCast?: number;     // 비기본 스킬 시전 시 파티 회복
  shieldOnCast?: number;   // 비기본 스킬 시전 시 파티 보호막
  breakEnergy?: number;    // 불균형 돌파 시 추가 에너지
  damageResist?: number;   // 받는 피해 감소 x (생존 재능)
  grantMultiHit?: boolean; // 스킬 시 연타 부여
};

// 각 오퍼의 두 재능 → 레버 매핑(주석 = 재능1 / 재능2)
export const OPERATOR_PASSIVES: Record<string, PassiveSpec> = {
  // 본질 붕괴(분쇄 시 공격력↑) / 현실 정지(결정 부착 적 받는 물리↑)
  endministrator: { essenceStack: 0.08, vsStatus: 0.20 },
  // 오블리터레이션(불균형 적 +30%) / 순환(연계가 방불 적에 1회 더)
  perlica: { vsBroken: 0.30 },
  // 칼날 베기(명중마다 공격+8% 5스택) / 흐름 끊기(차지 끊으면 불균형+)
  chenqianyu: { stackPerHit: 0.08 },
  // 친구의 그림자(회복) / 마운틴 서퍼(부식 적에 배틀 1회 더)
  ardelia: { healOnCast: 12 },
  // 죄를 쫓는 자(연계 회복+연타) / 혈류 소생(열기 피해 팀 공유)
  camu: { teamAmp: 0.10, grantMultiHit: true },
  // 전진의 결의(50% 비호) / 강철에는 강철로(피격 후 공격↑)
  ember: { shieldOnCast: 14, selfPower: 0.06 },
  // 가동 프로세스(냉기/동결 적 받는 냉기+10%) / 프리징(궁 정화)
  xaihi: { targetVuln: 0.12 },
  // 극지 생존(저HP 치유+25%) / 구조 전문가(방어 성공 시 에너지+10)
  snowshine: { healOnCast: 12, breakEnergy: 1 },
  // 고효율 배송(명중 시 궁에너지+4) / 완곡한 수단(궁이 전기취약+10%)
  avywenna: { breakEnergy: 1, targetVuln: 0.10 },
  // 황무지의 여행자(팀 전기 피해↑) / 만물의 지혜(아츠 50% 면역)
  arclight: { teamAmp: 0.10, damageResist: 0.10 },
  // 전분 풀기(방불 소모 후 물리+6% 4스택) / 간 맞추기(연계 쿨↓)
  dapan: { stackPerHit: 0.07 },
  // 하이테크 버스트(동결 후 강타+50%) / 빙점(냉기 적 치명피해+20%, 동결 2배)
  yvonne: { crit: 0.12, critVsStatus: 0.16, vsStatus: 0.12 },
  // 절흔(늑대발톱: 받는 물리/열기+12% DoT) / 끓어오르는 피(치명 시 추가 열기딜+회복)
  rossi: { targetVuln: 0.12, crit: 0.10, healOnCast: 6 },
  // 의기투합(아군 가속/적 감속) / 풍랑의 주재자(용오름)
  tangtang: { teamAmp: 0.08 },
  // 돈오(스탯당 공격+0.15%) / 복마(넘어뜨리기 시 공격력 100% 추가)
  lifeng: { selfPower: 0.18, vsVulnerable: 0.15 },
  // 전달자의 노래(팀 궁충전+7%) / 뒤늦은 편지(2명 명중 시 회복)
  gilberta: { teamAmp: 0.06, healOnCast: 10 },
  // 생존의 깃발(게이지 회복 시 공격+8%) / 전술 지도(궁 후 사기격양)
  pogranichnik: { breakEnergy: 1, selfPower: 0.08 },
  // 불꽃의 심장(녹아내린 불꽃 누적) / 부활의 불씨(저HP 90% 비호+회복)
  laevatain: { stackPerHit: 0.08, damageResist: 0.10 },
  // 저체온증(아츠 소모 후 냉기취약) / 저온 취성(궁이 냉기취약 1.5배)
  lastrite: { vsStatus: 0.22, targetVuln: 0.10 },
  // 불타는 송곳니(연소 적 자기 열기+30%) / 절제(아츠이상 소모 시 게이지+10)
  wulfgard: { selfPower: 0.18, breakEnergy: 1 },
  // 급속 냉동(동결/결정 시 에너지+) / 낚시의 달인(린수 확률)
  alesh: { breakEnergy: 1 },
  // 공감(쇄빙 후 게이지 반환) / 이유 있는 게으름(냉기 면역, 냉기 -20%)
  estella: { breakEnergy: 1, damageResist: 0.10 },
  // 강인한 방어선(방어력↑) / 전장을 꿰뚫는 통찰(궁 충격파)
  catcher: { shieldOnCast: 14 },
  // 즉흥적인 천재성(증폭 팀원 딜 시 회복) / 무의식(30% 물리면역+회복)
  antal: { healOnCast: 10, damageResist: 0.12 },
  // 몰락의 조력자(감속 적 +20%) / 종잡을 수 없는 자(20% 아츠면역+공격+20%)
  fluorite: { vsStatus: 0.22, damageResist: 0.08 },
  // 승리의 함성(연계 게이지 회복) / 몰입의 시간(궁 중 연타)
  akekuri: { breakEnergy: 1, grantMultiHit: true },
  // 천지의 조화(전기 증폭 누적) / 하늘의 가호(9% 면역+회복)
  zhuangfangyi: { stackPerHit: 0.08, damageResist: 0.08 },
  // 냉정(취약/불균형 적 1.2배) / 분노(연계 후 보호막 30%)
  mifu: { vsBroken: 0.20, vsVulnerable: 0.20, shieldOnCast: 12 },
};

const EMPTY: PassiveSpec = {};
export function passiveSpec(id: string): PassiveSpec {
  return OPERATOR_PASSIVES[id] ?? EMPTY;
}
