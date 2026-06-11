export const twinHornAgelos = {
  slug: 'twinhornagelos',
  code: 'ACL072',
  name: '쌍뿔아겔로스',
  rank: '강화',
  category: '아겔로스',
  description: "'트릴리소론'(보관 번호: ACL072), ACL071의 비모델 생물류입니다. 주변 환경을 어떻게 이용할지에 대해서 스스로 판단하고 행동하는 능력을 갖고 있습니다.",
  summaryStats: {
    hp: {1:831,20:5961,40:37721,60:148502,80:357214,100:662600},
    attack: {1:66,20:310,40:965,60:2395,80:3604,100:4620},
    defense: {1:100,20:100,40:100,60:100,80:100,100:100}
  },
  extraStats: {
    staggerHp: 160,
    staggerRecovery: '7s',
    finisherAtkMultiplier: '1.25x',
    finisherSpGain: 35,
    critRate: '0%',
    critDamage: '50%',
    attackRange: '3.2m',
    weight: 1.5,
  },
  resistances: {
    physical: 'C 80%',
    heat: 'C 80%',
    electric: 'D 100%',
    cold: 'D 100%',
    natural: 'C 80%',
  },
  traits: ['해당 적은 특수 능력이 없습니다.'],
};