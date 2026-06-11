export const bigHornAgelos = {
  slug: 'bighornagelos',
  code: 'ACL071',
  name: '큰뿔아겔로스',
  rank: '일반',
  category: '아겔로스',
  description: "'크리오손'(보관 번호: ACL071), 뿔로 적을 들이받습니다. 최초로 기록된 아겔로스의 형성 모델 중 하나로, 각 지역에서 비교적 흔하게 볼 수 있습니다.",
  summaryStats: {
    hp: {1:138,20:994,40:6287,60:24750,80:59536,100:110433},
    attack: {1:33,20:155,40:482,60:1198,80:1802,100:2310},
    defense: {1:100,20:100,40:100,60:100,80:100,100:100}
  },
  extraStats: {
    staggerHp: 60,
    staggerRecovery: '6s',
    finisherAtkMultiplier: '1x',
    finisherSpGain: 25,
    critRate: '0%',
    critDamage: '50%',
    attackRange: '2.1m',
    weight: 1,
  },
  resistances: {
    physical: 'D 100%',
    heat: 'D 100%',
    electric: 'D 100%',
    cold: 'D 100%',
    natural: 'D 100%',
  },
  traits: ['해당 적은 특수 능력이 없습니다.'],
};