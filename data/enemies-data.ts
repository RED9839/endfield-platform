export type EnemyRank = "일반" | "강화" | "정예" | "두목" | "우두머리";

export type EnemyCategory = "아겔로스" | "랜드브레이커" | "창적" | "야외 생물";

export type EnemyData = {
  id: string;
  name: string;
  category: EnemyCategory;
  rank: EnemyRank;
  source: "warfarin.wiki";
  sourceUrl: string;
};

export const enemyDataSource = {
  name: "warfarin.wiki",
  url: "https://warfarin.wiki/kr/enemies",
  gameVersion: "v 1.3",
  lastUpdated: "2026-06-05",
  scannedAt: "2026-06-11",
} as const;

export const enemies: EnemyData[] = [
  { id: "enemy-001", name: "큰뿔아겔로스", category: "아겔로스", rank: "일반", source: "warfarin.wiki", sourceUrl: enemyDataSource.url },
  { id: "enemy-002", name: "쌍뿔아겔로스", category: "아겔로스", rank: "강화", source: "warfarin.wiki", sourceUrl: enemyDataSource.url },
  { id: "enemy-003", name: "일미아겔로스", category: "아겔로스", rank: "일반", source: "warfarin.wiki", sourceUrl: enemyDataSource.url },
  { id: "enemy-004", name: "삼미아겔로스", category: "아겔로스", rank: "강화", source: "warfarin.wiki", sourceUrl: enemyDataSource.url },
  { id: "enemy-005", name: "큰뿔아겔로스 · α", category: "아겔로스", rank: "일반", source: "warfarin.wiki", sourceUrl: enemyDataSource.url },
  { id: "enemy-006", name: "일미아겔로스 · α", category: "아겔로스", rank: "일반", source: "warfarin.wiki", sourceUrl: enemyDataSource.url },
  { id: "enemy-007", name: "쌍뿔아겔로스 · α", category: "아겔로스", rank: "강화", source: "warfarin.wiki", sourceUrl: enemyDataSource.url },
  { id: "enemy-008", name: "삼미아겔로스 · α", category: "아겔로스", rank: "강화", source: "warfarin.wiki", sourceUrl: enemyDataSource.url },
  { id: "enemy-009", name: "보초아겔로스", category: "아겔로스", rank: "정예", source: "warfarin.wiki", sourceUrl: enemyDataSource.url },
  { id: "enemy-010", name: "형상아겔로스", category: "아겔로스", rank: "정예", source: "warfarin.wiki", sourceUrl: enemyDataSource.url },
  { id: "enemy-011", name: "모방아겔로스", category: "아겔로스", rank: "일반", source: "warfarin.wiki", sourceUrl: enemyDataSource.url },
  { id: "enemy-012", name: "모방아겔로스 · α", category: "아겔로스", rank: "일반", source: "warfarin.wiki", sourceUrl: enemyDataSource.url },
  { id: "enemy-013", name: "결정아겔로스", category: "아겔로스", rank: "두목", source: "warfarin.wiki", sourceUrl: enemyDataSource.url },
  { id: "enemy-014", name: "탁류아겔로스", category: "아겔로스", rank: "일반", source: "warfarin.wiki", sourceUrl: enemyDataSource.url },
  { id: "enemy-015", name: "수정아겔로스", category: "아겔로스", rank: "일반", source: "warfarin.wiki", sourceUrl: enemyDataSource.url },
  { id: "enemy-016", name: "굴절아겔로스", category: "아겔로스", rank: "일반", source: "warfarin.wiki", sourceUrl: enemyDataSource.url },
  { id: "enemy-017", name: "조류아겔로스", category: "아겔로스", rank: "정예", source: "warfarin.wiki", sourceUrl: enemyDataSource.url },
  { id: "enemy-018", name: "파조의 상", category: "아겔로스", rank: "두목", source: "warfarin.wiki", sourceUrl: enemyDataSource.url },
  { id: "enemy-019", name: "탁류아겔로스 · δ", category: "아겔로스", rank: "일반", source: "warfarin.wiki", sourceUrl: enemyDataSource.url },
  { id: "enemy-020", name: "수정아겔로스 · δ", category: "아겔로스", rank: "일반", source: "warfarin.wiki", sourceUrl: enemyDataSource.url },
  { id: "enemy-021", name: "조류아겔로스 · δ", category: "아겔로스", rank: "정예", source: "warfarin.wiki", sourceUrl: enemyDataSource.url },
  { id: "enemy-022", name: "트리아겔로스", category: "아겔로스", rank: "우두머리", source: "warfarin.wiki", sourceUrl: enemyDataSource.url },
  { id: "enemy-023", name: "마블 아겔로미레", category: "아겔로스", rank: "우두머리", source: "warfarin.wiki", sourceUrl: enemyDataSource.url },
  { id: "enemy-024", name: "마블 부속체", category: "아겔로스", rank: "우두머리", source: "warfarin.wiki", sourceUrl: enemyDataSource.url },
  { id: "enemy-025", name: "마블 아겔로미레", category: "아겔로스", rank: "우두머리", source: "warfarin.wiki", sourceUrl: enemyDataSource.url },
  { id: "enemy-026", name: "본 크러셔 약탈자", category: "랜드브레이커", rank: "일반", source: "warfarin.wiki", sourceUrl: enemyDataSource.url },
  { id: "enemy-027", name: "본 크러셔 저격수", category: "랜드브레이커", rank: "일반", source: "warfarin.wiki", sourceUrl: enemyDataSource.url },
  { id: "enemy-028", name: "본 크러셔 처형자", category: "랜드브레이커", rank: "정예", source: "warfarin.wiki", sourceUrl: enemyDataSource.url },
  { id: "enemy-029", name: "본 크러셔 염술사", category: "랜드브레이커", rank: "강화", source: "warfarin.wiki", sourceUrl: enemyDataSource.url },
  { id: "enemy-030", name: "본 크러셔 집행자", category: "랜드브레이커", rank: "강화", source: "warfarin.wiki", sourceUrl: enemyDataSource.url },
  { id: "enemy-031", name: "본 크러셔 사수", category: "랜드브레이커", rank: "정예", source: "warfarin.wiki", sourceUrl: enemyDataSource.url },
  { id: "enemy-032", name: "본 크러셔 침투자", category: "랜드브레이커", rank: "일반", source: "warfarin.wiki", sourceUrl: enemyDataSource.url },
  { id: "enemy-033", name: "안갯불에 물든 랜드브레이커", category: "랜드브레이커", rank: "일반", source: "warfarin.wiki", sourceUrl: enemyDataSource.url },
  { id: "enemy-034", name: "본 크러셔 립터스크", category: "랜드브레이커", rank: "일반", source: "warfarin.wiki", sourceUrl: enemyDataSource.url },
  { id: "enemy-035", name: "안갯불에 물든 터스크비스트", category: "랜드브레이커", rank: "일반", source: "warfarin.wiki", sourceUrl: enemyDataSource.url },
  { id: "enemy-036", name: "약탈자 · 정예", category: "랜드브레이커", rank: "일반", source: "warfarin.wiki", sourceUrl: enemyDataSource.url },
  { id: "enemy-037", name: "저격수 · 정예", category: "랜드브레이커", rank: "일반", source: "warfarin.wiki", sourceUrl: enemyDataSource.url },
  { id: "enemy-038", name: "립터스크 · 정예", category: "랜드브레이커", rank: "일반", source: "warfarin.wiki", sourceUrl: enemyDataSource.url },
  { id: "enemy-039", name: "처형자 · 정예", category: "랜드브레이커", rank: "정예", source: "warfarin.wiki", sourceUrl: enemyDataSource.url },
  { id: "enemy-040", name: "본 크러셔 돌격수", category: "랜드브레이커", rank: "일반", source: "warfarin.wiki", sourceUrl: enemyDataSource.url },
  { id: "enemy-041", name: "본 크러셔 파괴자", category: "랜드브레이커", rank: "정예", source: "warfarin.wiki", sourceUrl: enemyDataSource.url },
  { id: "enemy-042", name: "'본 크러셔의 주먹' 로댄", category: "랜드브레이커", rank: "우두머리", source: "warfarin.wiki", sourceUrl: enemyDataSource.url },
  { id: "enemy-043", name: "'본 크러셔' 네파리스", category: "랜드브레이커", rank: "우두머리", source: "warfarin.wiki", sourceUrl: enemyDataSource.url },
  { id: "enemy-044", name: "'정복자' 네파리스", category: "랜드브레이커", rank: "우두머리", source: "warfarin.wiki", sourceUrl: enemyDataSource.url },
  { id: "enemy-045", name: "막류재", category: "창적", rank: "일반", source: "warfarin.wiki", sourceUrl: enemyDataSource.url },
  { id: "enemy-046", name: "천림전", category: "창적", rank: "일반", source: "warfarin.wiki", sourceUrl: enemyDataSource.url },
  { id: "enemy-047", name: "최산장", category: "창적", rank: "정예", source: "warfarin.wiki", sourceUrl: enemyDataSource.url },
  { id: "enemy-048", name: "겁운객", category: "창적", rank: "강화", source: "warfarin.wiki", sourceUrl: enemyDataSource.url },
  { id: "enemy-049", name: "할운옹", category: "창적", rank: "강화", source: "warfarin.wiki", sourceUrl: enemyDataSource.url },
  { id: "enemy-050", name: "막석명", category: "창적", rank: "일반", source: "warfarin.wiki", sourceUrl: enemyDataSource.url },
  { id: "enemy-051", name: "과당풍", category: "창적", rank: "일반", source: "warfarin.wiki", sourceUrl: enemyDataSource.url },
  { id: "enemy-052", name: "개천장", category: "창적", rank: "정예", source: "warfarin.wiki", sourceUrl: enemyDataSource.url },
  { id: "enemy-053", name: "단운수", category: "창적", rank: "정예", source: "warfarin.wiki", sourceUrl: enemyDataSource.url },
  { id: "enemy-054", name: "원일", category: "창적", rank: "우두머리", source: "warfarin.wiki", sourceUrl: enemyDataSource.url },
  { id: "enemy-055", name: "터널링 니드웜", category: "야외 생물", rank: "강화", source: "warfarin.wiki", sourceUrl: enemyDataSource.url },
  { id: "enemy-056", name: "엑스 아머비스트", category: "야외 생물", rank: "정예", source: "warfarin.wiki", sourceUrl: enemyDataSource.url },
  { id: "enemy-057", name: "원시 핀서비스트", category: "야외 생물", rank: "일반", source: "warfarin.wiki", sourceUrl: enemyDataSource.url },
  { id: "enemy-058", name: "산성원석충", category: "야외 생물", rank: "일반", source: "warfarin.wiki", sourceUrl: enemyDataSource.url },
  { id: "enemy-059", name: "천고", category: "야외 생물", rank: "두목", source: "warfarin.wiki", sourceUrl: enemyDataSource.url },
  { id: "enemy-060", name: "백안의 레이커비스트", category: "야외 생물", rank: "정예", source: "warfarin.wiki", sourceUrl: enemyDataSource.url },
  { id: "enemy-061", name: "화염원석충", category: "야외 생물", rank: "일반", source: "warfarin.wiki", sourceUrl: enemyDataSource.url },
  { id: "enemy-062", name: "프릭비스트", category: "야외 생물", rank: "강화", source: "warfarin.wiki", sourceUrl: enemyDataSource.url },
  { id: "enemy-063", name: "수등충", category: "야외 생물", rank: "일반", source: "warfarin.wiki", sourceUrl: enemyDataSource.url },
  { id: "enemy-064", name: "안갯불에 물든 엑스 아머비스트", category: "야외 생물", rank: "정예", source: "warfarin.wiki", sourceUrl: enemyDataSource.url },
  { id: "enemy-065", name: "브루탈 핀서비스트", category: "야외 생물", rank: "일반", source: "warfarin.wiki", sourceUrl: enemyDataSource.url },
  { id: "enemy-066", name: "산성원석충 · α", category: "야외 생물", rank: "일반", source: "warfarin.wiki", sourceUrl: enemyDataSource.url },
  { id: "enemy-067", name: "분노의 레이커비스트", category: "야외 생물", rank: "정예", source: "warfarin.wiki", sourceUrl: enemyDataSource.url },
  { id: "enemy-068", name: "용암원석충", category: "야외 생물", rank: "일반", source: "warfarin.wiki", sourceUrl: enemyDataSource.url },
  { id: "enemy-069", name: "활성화된 프릭비스트", category: "야외 생물", rank: "강화", source: "warfarin.wiki", sourceUrl: enemyDataSource.url },
  { id: "enemy-070", name: "잔영", category: "야외 생물", rank: "일반", source: "warfarin.wiki", sourceUrl: enemyDataSource.url },
  { id: "enemy-071", name: "록하울러", category: "야외 생물", rank: "일반", source: "warfarin.wiki", sourceUrl: enemyDataSource.url },
  { id: "enemy-072", name: "무장 맹글러", category: "야외 생물", rank: "정예", source: "warfarin.wiki", sourceUrl: enemyDataSource.url },
  { id: "enemy-073", name: "거대한 록하울러", category: "야외 생물", rank: "두목", source: "warfarin.wiki", sourceUrl: enemyDataSource.url },
];

export const enemyCategories: EnemyCategory[] = ["아겔로스", "랜드브레이커", "창적", "야외 생물"];

export const enemyRanks: EnemyRank[] = ["일반", "강화", "정예", "두목", "우두머리"];

export function getEnemiesByCategory(category: EnemyCategory) {
  return enemies.filter((enemy) => enemy.category === category);
}
