// ===== 오퍼별 고유 패시브 스펙 (실제 재능 2종을 카드게임 레버로 합성) =====
// 공유 enum(passiveMechanic) 대신, 각 오퍼가 자기 두 재능을 반영한 레버 조합을 가진다.
// 엔진(useRunState)이 이 스펙을 읽어 전투에 적용. 표시용 재능 텍스트는 operator-talents.ts.
export type PassiveSpec = {
  vsBroken?: number;       // 불균형 적 카드 피해 +x
  vsStatus?: number;       // 아츠/이상(연소·감전·동결·부식·관통·감속) 적 +x
  vsVulnerable?: number;   // 물리 취약(physVuln) 적 +x — 미브 냉정 등
  selfPower?: number;      // 상시 자기 카드 피해 +x (고정)
  statPower?: number;      // 지능·의지 등 스탯 파생 자기 화력 +x — 장비 등급에 비례(여풍 돈오 등)
  stackPerHit?: number;    // 비기본 스킬 명중마다 자기 피해 누적 +x/스택(최대5)
  essenceStack?: number;   // 물리 분쇄(강타/갑옷파괴) 시 자기 피해 누적 +x/스택
  teamAmp?: number;        // 파티 전체 카드 피해 오라 +x (생존 보유자 합산, 고정)
  teamStatAmp?: number;    // 지능 등 스탯 파생 파티 피해 오라 +x — 보유자 장비 등급에 비례(아크라이트 황무지의 방랑자)
  crit?: number;           // 자기 치명타 확률 +x
  critVsStatus?: number;   // 아츠/이상 적 대상 치명타 피해 +x
  targetVuln?: number;     // 이 오퍼가 때린 적이 받는 모든 피해 +x (표식 디버프, 팀 전체 이득)
  healOnCast?: number;     // 비기본 스킬 시전 시 파티 회복
  shieldOnCast?: number;   // 비기본 스킬 시전 시 파티 보호막
  breakEnergy?: number;    // 불균형 돌파 시 추가 에너지
  damageResist?: number;   // 받는 피해 감소 x (생존 재능)
  grantMultiHit?: boolean; // 스킬 시 연타 부여
  knockdownBonus?: number; // 넘어뜨리기(물리 이상) 발동 시 추가 물리 = 공격력 ×x (여풍 복마)
  appliesPhysVuln?: number; // 배틀스킬이 방어 불능 없는 적에 물리 취약 x 부여(여풍 신체 정화)
  linkPhysVuln?: number; // 연계 스킬이 적에 물리 취약 x 부여(에스텔라 디스토션)
  bleed?: number; // 배틀 스킬이 방어 불능 적을 칠 때 출혈 부여(공격력 ×x /턴) — 로시 절흔(울프팀의 진주)
  shatterEnergy?: number; // 쇄빙 발동 시 전투 에너지(스킬 게이지) 반환 — 에스텔라 공감
  gaugeOnArmorBreak?: number; // 갑옷 파괴로 방불 소모 시 스택당 게이지(에너지) 수급 — 포그라니치니크 전선 분쇄
  forceFreezeOnCryo?: boolean; // 배틀 스킬이 냉기 부착 적을 강제 동결(2원소 없이도 동결) — 알레쉬 비정규 루어
  noArtsAttach?: boolean; // 원소 피해를 주되 아츠 부착/폭발/이상을 만들지 않음 — 엠버(열기 탈을 쓴 물리 디펜더, 위키 각주 5)
  reflectAttach?: boolean; // 방패(보호막) 배틀 스킬이 반격으로 자기 원소를 적에 부착 + 게이지 반환 — 스노우샤인 포화성 방어
  ultForceFreeze?: boolean; // 궁극이 적중 적을 강제 동결(냉기 부착 미소모) — 스노우샤인 살얼음 추위 빙설 지대
  linkStatDamage?: number; // 연계 스킬 피해 +x — 지능 파생(장비 등급 비례), 알레쉬 낚시의 달인(린수 강화 평균값)
  linkStatGauge?: number; // 연계 스킬 추가 에너지 +x — 지능 파생(장비 등급 비례), 아케쿠리 승리의 함성
  chargeBreakStagger?: number; // 적 차지를 끊었을 때 추가 불균형치(진천우 흐름 끊기)
  teamUltPct?: number;     // 가드/캐스터/서포터 아군의 궁극 충전량 ×(1+x) — 충전 효율 % (질베르타)
  ultOnHit?: number;       // 피해를 준 카드마다 자기 궁극 에너지 +x (아비웬나 명중 충전)
  ultOnFreeze?: number;    // 이 플레이로 동결(냉기 부착)을 부여하면 자기 궁극 에너지 +x (알레쉬)
};

// 각 오퍼의 두 재능 → 레버 매핑(주석 = 재능1 / 재능2)
export const OPERATOR_PASSIVES: Record<string, PassiveSpec> = {
  // 본질 붕괴(오리지늄 결정 소모 시 공격력 누적↑) / 현실 정지(결정 부착 적 받는 물리 +20% → getStatusBonus crystal 처리)
  endministrator: { essenceStack: 0.08 },
  // 오블리터레이션(불균형 적 +20%) / 순환(연계가 방불 적에 1회 더)
  perlica: { vsBroken: 0.20 },
  // 칼날 베기(명중마다 공격+8% 5스택) / 흐름 끊기(차지 끊으면 추가 불균형 10)
  chenqianyu: { stackPerHit: 0.08, chargeBreakStagger: 10 },
  // 친구의 그림자(돌리 그림자 회복 — 스킬 시전 시 파티 회복) / 마운틴 서퍼(부식 적에 배틀 1회 더)
  ardelia: { healOnCast: 16 },
  // 죄를 쫓는 자(연계 명중 시 회복[지능 비례=장비 등급 비례] + 연타) / 혈류 소생(회복 시 자기 열기↑·팀 25%=teamAmp) / 배틀 사르는 불꽃 열기 취약+허약=targetVuln
  camu: { teamAmp: 0.10, grantMultiHit: true, healOnCast: 6, targetVuln: 0.08 },
  // 전진의 결의(배틀/연계 중 50% 비호=damageResist) / 강철에는 강철로(피격 후 공격↑=selfPower) / 연계 전선 지원 치유(의지 비례=장비 등급 비례 healOnCast) — 궁극 보호막은 useUltimateOnState 커스텀(maxHp×25%)
  ember: { healOnCast: 12, damageResist: 0.12, selfPower: 0.06, noArtsAttach: true },
  // 가동 프로세스(냉기/동결 적 받는 냉기+10%) / 프리징(궁 정화)
  xaihi: { targetVuln: 0.12 },
  // 극지 생존(저HP 치유+25%=healOnCast) / 구조 전문가(반격 시 궁충=breakEnergy) / 포화성 방어 비호(damageResist)+반격 냉기 부착(reflectAttach) / 살얼음 추위 강제 동결(ultForceFreeze)
  snowshine: { healOnCast: 12, breakEnergy: 1, damageResist: 0.12, reflectAttach: true, ultForceFreeze: true },
  // 고효율 배송(썬더랜스 명중마다 궁에너지+3) / 완곡한 수단(궁이 전기취약+10%)
  avywenna: { ultOnHit: 3, targetVuln: 0.10 },
  // 황무지의 방랑자(질풍 섬광 후 지능 비례 팀 전기 피해↑ → 장비 등급 비례) / 만물의 지혜(아츠 50% 면역)
  arclight: { teamStatAmp: 0.07, damageResist: 0.10 },
  // 전분 풀기(방어 불능 1스택 소모 후 물리+4% 최대 4스택 → 강타 소모 트리거) / 간 맞추기(연계 쿨↓)
  dapan: { essenceStack: 0.07 },
  // 하이테크 버스트(동결 후 강타+50%) / 빙점(냉기 적 치명피해+20%, 동결 2배)
  yvonne: { crit: 0.12, critVsStatus: 0.16, vsStatus: 0.12 },
  // 절흔(늑대발톱: 받는 물리/열기+12% DoT) / 끓어오르는 피(치명 시 추가 열기딜+회복)
  rossi: { targetVuln: 0.12, crit: 0.10, healOnCast: 6, bleed: 0.3 },
  // 의기투합(아군 가속/적 감속) / 풍랑의 주재자(용오름)
  tangtang: { teamAmp: 0.08 },
  // 돈오(지능·의지→공격력 변환 = 장비 등급 비례 화력) / 복마(넘어뜨리기 시 공격력 100% 추가) / 신체 정화 물리 취약 + 분노의 형상 연타
  lifeng: { statPower: 0.12, knockdownBonus: 0.6, appliesPhysVuln: 0.12, grantMultiHit: true },
  // 전달자의 노래(가드/캐스터/서포터 궁 충전 효율 +20%; 실제 +4%를 카드게임 게이지 경제에 맞춰 상향) / 뒤늦은 편지(2명 명중 시 회복)
  gilberta: { teamUltPct: 0.20, healOnCast: 10 },
  // 생존의 깃발(게이지 회복 시 사기 격양 공격+8%) / 처형 게이지 수급
  // ※ 위키의 '방불 소모 비례 게이지 수급'(gaugeOnArmorBreak)은 카드-템포 모델에서 에너지=템포라 역효과 → 미적용(인프라는 비활성으로 보존).
  pogranichnik: { breakEnergy: 1, selfPower: 0.08 },
  // 불꽃의 심장(녹아내린 불꽃 누적) / 부활의 불씨(저HP 90% 비호+회복)
  laevatain: { stackPerHit: 0.08, damageResist: 0.10 },
  // 저체온증(아츠 소모 후 냉기취약) / 저온 취성(궁이 냉기취약 1.5배)
  lastrite: { vsStatus: 0.22, targetVuln: 0.10 },
  // 불타는 송곳니(연소 적 자기 열기+30%) / 절제(아츠이상 소모 시 게이지+10)
  wulfgard: { selfPower: 0.18, breakEnergy: 1 },
  // 급속 냉동(동결/냉기 부착 시 궁에너지+, 자기 동결이면 추가) / 낚시의 달인(린수 확률) + 비정규 루어 강제 동결
  alesh: { ultOnFreeze: 8, forceFreezeOnCryo: true, linkStatDamage: 0.12 },
  // 공감(쇄빙 시 게이지 반환 → shatterEnergy) / 이유 있는 게으름(냉기 면역, 냉기 -20%) / 생존이 승리다(동결 시 궁충) / 디스토션 물리 취약
  estella: { shatterEnergy: 1, damageResist: 0.10, ultOnFreeze: 5, linkPhysVuln: 0.12 },
  // 강인한 방어선(방어력↑=비호 damageResist) / 전장을 꿰뚫는 통찰(궁 충격파=궁 위력) / 강력한 저지: 비호 + 반격 방어 불능(reflectAttach) + 게이지 / 실시간 억제 보호(shieldOnCast)
  catcher: { shieldOnCast: 14, reflectAttach: true, damageResist: 0.12, breakEnergy: 1 },
  // 즉흥적인 천재성(증폭 팀원 딜 시 회복) / 무의식(30% 물리면역+회복)
  antal: { healOnCast: 10, damageResist: 0.12 },
  // 몰락의 조력자(감속 적 +20%) / 종잡을 수 없는 자(20% 아츠면역+공격+20%)
  fluorite: { vsStatus: 0.22, damageResist: 0.08 },
  // 승리의 함성(연계 게이지 회복 지능 비례 → linkStatGauge) / 몰입의 시간(궁 중 연타)
  akekuri: { breakEnergy: 1, grantMultiHit: true, linkStatGauge: 2 },
  // 천지의 조화(전기 증폭 누적) / 하늘의 가호(9% 면역+회복)
  zhuangfangyi: { stackPerHit: 0.08, damageResist: 0.08 },
  // 냉정(취약/불균형 적 1.2배) / 분노(연계 후 보호막 30%)
  mifu: { vsBroken: 0.20, vsVulnerable: 0.20, shieldOnCast: 12, linkPhysVuln: 0.10 },
};

const EMPTY: PassiveSpec = {};
export function passiveSpec(id: string): PassiveSpec {
  return OPERATOR_PASSIVES[id] ?? EMPTY;
}
