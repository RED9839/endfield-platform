import type { Enemy } from "../types/game";

export const enemies: Enemy[] = [
  {
    "id": "acid-originium-slug-alpha",
    "name": "산성원석충 · α",
    "image": "/enemies/acid-originium-slug-alpha.webp",
    "maxHp": 48,
    "attack": 9,
    "defense": 28,
    "speed": 92,
    "range": 6,
    "weight": 1,
    "staggerHp": 54,
    "intent": "야생의 감염된 생물, 일반적인 산성원석충보다 더 위협적입니다. 등에 짊어진 오리지늄 클러스터가 활성화될수록 공격성이 더 강해집니다.",
    "faction": "광석수",
    "tier": "Normal",
    "traits": [
      "겁이 많아서 껍질 속으로 숨어 자신을 보호하며, 주변에 마구잡이로 몸의 오리지늄을 발사해 적을 쫓아냅니다."
    ],
    "mechanics": [
      "acid",
      "armored",
      "ranged",
      "charge",
      "enrage"
    ]
  },
  {
    "id": "acid-originium-slug",
    "name": "산성원석충",
    "image": "/enemies/acid-originium-slug.webp",
    "maxHp": 47,
    "attack": 10,
    "defense": 28,
    "speed": 89,
    "range": 6,
    "weight": 1,
    "staggerHp": 53,
    "intent": "야생의 감염된 생물, 산성 물질을 분비할 수 있습니다. 위협받으면 몸을 격렬하게 흔들어, 등에 짊어지고 있던 오리지늄 클러스터를 날려 적을 위협합니다.",
    "faction": "광석수",
    "tier": "Normal",
    "traits": [
      "겁이 많아서 껍질 속으로 숨어 자신을 보호합니다.",
      "주변에 마구잡이로 몸의 오리지늄을 발사해 적을 쫓아냅니다."
    ],
    "mechanics": [
      "acid",
      "armored",
      "ranged",
      "charge",
      "enrage"
    ]
  },
  {
    "id": "aethillu",
    "name": "잔영",
    "image": "/enemies/aethillu.webp",
    "maxHp": 45,
    "attack": 9,
    "defense": 28,
    "speed": 89,
    "range": 7,
    "weight": 1,
    "staggerHp": 51,
    "intent": "아다시르가 소환한 환영, 한때 파멸의 상징이었으며 오래전에 퇴적된 잔재입니다.",
    "faction": "광석수",
    "tier": "Normal",
    "traits": [
      "강력한 부활 능력을 보유하고 있습니다. 부활 후 공격 범위가 더욱 넓어집니다. 부활 이후 자폭 공격을 사용하며 큰 피해를 입힙니다."
    ],
    "mechanics": [
      "ranged",
      "revive",
      "self-destruct",
      "summoner",
      "armored",
      "acid"
    ]
  },
  {
    "id": "armored-manglerbeast",
    "name": "무장 맹글러",
    "image": "/enemies/armored-manglerbeast.webp",
    "maxHp": 239,
    "attack": 30,
    "defense": 94,
    "speed": 89,
    "range": 7,
    "weight": 1.5,
    "staggerHp": 269,
    "intent": "탈로스 II에서 진화한 특수한 맹글러. 몸에는 매우 두꺼운 비늘 갑각을 두르고 있으며, 록하울러와는 서로 도움을 주고받는 공생 관계를 맺고 있습니다. 마치 정찰...",
    "faction": "광석수",
    "tier": "Elite",
    "traits": [
      "등에 탄 록하울러는 바나나 껍질을 투척할 수 있습니다. 무장 맹글러가 돌진 공격을 시도하다 바나나 껍질을 밟으면 미끄러져 넘어집니다.",
      "몸을 웅크리고 방어할 때는 손이 유일한 약점입니다. 팔을 파괴하면 방어 상태가 해제되고 넘어집니다.",
      "넘어졌을 때 록하울러는 추락하며, 록하울러를 공격하면 더 큰 피해를 줄 수 있습니다."
    ],
    "mechanics": [
      "armored",
      "charge",
      "ranged",
      "acid",
      "enrage",
      "rockfall",
      "poison"
    ],
    "elite": true
  },
  {
    "id": "axe-armorbeast",
    "name": "엑스 아머비스트",
    "image": "/enemies/axe-armorbeast.webp",
    "maxHp": 249,
    "attack": 29,
    "defense": 94,
    "speed": 87,
    "range": 7,
    "weight": 2,
    "staggerHp": 281,
    "intent": "야생의 엑스 아머비스트, 뼈로 된 갑옷을 두르고 있습니다. 돌격 상태에 들어가면, 도끼 모양의 거대한 뿔로 두꺼운 합금 문마저 부숴 버릴 수 있습니다.",
    "faction": "광석수",
    "tier": "Elite",
    "traits": [
      "분노한 엑스 아머비스트는 자기 영역에 침입한 모든 적을 거대한 뿔로 몰아냅니다. 돌진을 반드시 조심하세요.",
      "여러 형태의 광역 범위 공격을 합니다. 놈이 분노하면 제때 공격을 중단시키세요."
    ],
    "mechanics": [
      "armored",
      "boss-shield",
      "charge",
      "enrage",
      "ranged",
      "acid",
      "rockfall",
      "poison"
    ],
    "elite": true
  },
  {
    "id": "blazemist-originium-slug",
    "name": "용암원석충",
    "image": "/enemies/blazemist-originium-slug.webp",
    "maxHp": 43,
    "attack": 10,
    "defense": 28,
    "speed": 92,
    "range": 6,
    "weight": 1,
    "staggerHp": 49,
    "intent": "야생의 감염된 생물, 체온이 매우 높고 갑각에 포함된 오리지늄 분진의 활성이 더욱 강합니다. 이 살아있는 용암 덩어리에는 절대 가까이 다가가지 않는 것을 강력히...",
    "faction": "광석수",
    "tier": "Normal",
    "traits": [
      "생명력이 낮아지면 자폭합니다. 자폭은 피격된 오퍼레이터에게 불안정한 화합물을 남기며, 해당 오퍼레이터가 피해를 다시 받으면 이 화합물이 폭발합니다."
    ],
    "mechanics": [
      "flame",
      "ranged",
      "self-destruct",
      "armored",
      "acid"
    ]
  },
  {
    "id": "bonekrusher-ambusher",
    "name": "본 크러셔 저격수",
    "image": "/enemies/bonekrusher-ambusher.webp",
    "maxHp": 39,
    "attack": 12,
    "defense": 20,
    "speed": 97,
    "range": 7,
    "weight": 1,
    "staggerHp": 44,
    "intent": "기초적인 원거리 무기를 장비한 무장 랜드브레이커, 기초적인 사격 훈련만 받았기 때문에 잘 명중시키질 못합니다. 하지만 그래도 여전히 많은 사람이 사수들의 화살에...",
    "faction": "본크러셔",
    "tier": "Normal",
    "traits": [
      "해당 적은 특수 능력이 없습니다."
    ],
    "mechanics": [
      "armored",
      "ranged",
      "flame",
      "charge"
    ]
  },
  {
    "id": "bonekrusher-arsonist",
    "name": "본 크러셔 집행자",
    "image": "/enemies/bonekrusher-arsonist.webp",
    "maxHp": 73,
    "attack": 17,
    "defense": 34,
    "speed": 97,
    "range": 7,
    "weight": 1.5,
    "staggerHp": 85,
    "intent": "화염방사기를 장비한 무장 랜드브레이커, 조악하지만 정교하게 제작된 소각 장비를 사용하며 단단한 엄폐물과 완강한 저항 세력을 쓸어버립니다.",
    "faction": "본크러셔",
    "tier": "Enhanced",
    "traits": [
      "오퍼레이터를 향해 지속적으로 불을 뿜습니다.",
      "최대한 적의 후방으로 회피하세요."
    ],
    "mechanics": [
      "armored",
      "evasive",
      "flame",
      "ranged",
      "charge",
      "enrage"
    ]
  },
  {
    "id": "bonekrusher-ballista",
    "name": "본 크러셔 사수",
    "image": "/enemies/bonekrusher-ballista.webp",
    "maxHp": 226,
    "attack": 36,
    "defense": 67,
    "speed": 93,
    "range": 12,
    "weight": 1.5,
    "staggerHp": 254,
    "intent": "중형 원거리 무기를 장비한 무장 랜드브레이커, 저격수 중에서도 실력이 좋은 정예입니다. 이 사수들이 사용하는 무거운 화살은 목표의 중장갑마저도 뚫습니다.",
    "faction": "본크러셔",
    "tier": "Elite",
    "traits": [
      "화살비를 발사하여 지속 피해를 주고, 몇 초 뒤 폭발을 일으킵니다.",
      "거대한 쇠뇌를 들고 있지만, 근거리 전투 능력도 무시할 수 없습니다."
    ],
    "mechanics": [
      "armored",
      "boss-shield",
      "ranged",
      "self-destruct",
      "sniper",
      "flame",
      "charge",
      "enrage",
      "smoke"
    ],
    "elite": true
  },
  {
    "id": "bonekrusher-executioner",
    "name": "본 크러셔 처형자",
    "image": "/enemies/bonecrusher-executioner.webp",
    "maxHp": 212,
    "attack": 36,
    "defense": 67,
    "speed": 94,
    "range": 2.8,
    "weight": 1.5,
    "staggerHp": 239,
    "intent": "중형 도끼를 장착한 랜드브레이커, 상당히 큰 덩치를 갖고 있습니다. 일반적인 랜드브레이커보다 좀 더 뛰어난 신체 능력을 갖고 있어 비교적 쉽게 전차를 뒤집거나 ...",
    "faction": "본크러셔",
    "tier": "Elite",
    "traits": [
      "잡기 공격에 당하면 대량의 피해를 받습니다. 오퍼레이터가 잡혔다면, 다른 오퍼레이터는 스킬을 사용하여 빠르게 적의 공격을 끊어 구출하세요.",
      "차지 2단 도끼 휘두르기를 사용하면 회피하기 어렵습니다. 빠르게 적의 공격을 끊으세요."
    ],
    "mechanics": [
      "charge",
      "evasive",
      "grab",
      "flame",
      "enrage",
      "smoke",
      "sniper"
    ],
    "elite": true
  },
  {
    "id": "bonekrusher-infiltrator",
    "name": "본 크러셔 침투자",
    "image": "/enemies/bonekrusher-infiltrator.webp",
    "maxHp": 40,
    "attack": 12,
    "defense": 20,
    "speed": 97,
    "range": 2.3,
    "weight": 1,
    "staggerHp": 46,
    "intent": "쌍수 근거리 무기를 장비한 무장 랜드브레이커, 쌍수를 이용한 전투에 상당히 능숙합니다. 행동이 민첩한 건 물론, 근거리 전투가 특기이므로 신중하게 대응해야 합니다.",
    "faction": "본크러셔",
    "tier": "Normal",
    "traits": [
      "매우 민첩하여 오퍼레이터의 일반 공격을 회피합니다. 하지만 공격 중에는 회피할 수 없습니다.",
      "표창을 던지고 적중된 오퍼레이터를 추격합니다. 표창을 피하면 반격을 위한 좋은 기회를 잡을 수 있습니다."
    ],
    "mechanics": [
      "armored",
      "evasive",
      "flame",
      "charge"
    ]
  },
  {
    "id": "bonekrusher-pyromancer",
    "name": "본 크러셔 염술사",
    "image": "/enemies/bonekrusher-pyromancer.webp",
    "maxHp": 74,
    "attack": 17,
    "defense": 34,
    "speed": 92,
    "range": 7,
    "weight": 1.5,
    "staggerHp": 86,
    "intent": "오리지늄 아츠를 다루는 무장 랜드브레이커, 에너지 전환계 오리지늄 아츠를 다룹니다. 전장에서 맹렬한 불길을 퍼뜨리는 존재로 상당히 위협적인 존재입니다.",
    "faction": "본크러셔",
    "tier": "Enhanced",
    "traits": [
      "강력한 원거리 공격을 할 수 있으며, 열기 피해를 줄 수 있지만 이동 능력이 떨어집니다.",
      "지면에서 안갯불을 분출시켜 열기 피해를 줍니다. 주의해서 피하세요.",
      "가까이 다가가면 먼 곳으로 순간이동합니다."
    ],
    "mechanics": [
      "armored",
      "evasive",
      "flame",
      "ranged",
      "charge",
      "enrage"
    ]
  },
  {
    "id": "bonekrusher-raider",
    "name": "본 크러셔 약탈자",
    "image": "/enemies/bonekrusher-raider.webp",
    "maxHp": 45,
    "attack": 12,
    "defense": 20,
    "speed": 97,
    "range": 2.3,
    "weight": 1,
    "staggerHp": 51,
    "intent": "기초적인 근거리 무기를 장비한 무장 랜드브레이커, 랜드브레이커 집단을 구성하는 대다수의 랜드브레이커입니다. 조악한 장비를 들고 있긴 하지만, 종종 떼를 지어 나...",
    "faction": "본크러셔",
    "tier": "Normal",
    "traits": [
      "해당 적은 특수 능력이 없습니다."
    ],
    "mechanics": [
      "armored",
      "flame",
      "charge"
    ]
  },
  {
    "id": "bonekrusher-ripptusk",
    "name": "본 크러셔 립터스크",
    "image": "/enemies/bonekrusher-ripptusk.webp",
    "maxHp": 43,
    "attack": 12,
    "defense": 20,
    "speed": 91,
    "range": 2.1,
    "weight": 1,
    "staggerHp": 48,
    "intent": "무장 랜드브레이커가 조종하는 소형 워비스트, 야생의 터스크비스트보다 훨씬 더 사납고 포악합니다. 주인에게 절대적으로 충성하는 것이 특징입니다.",
    "faction": "본크러셔",
    "tier": "Normal",
    "traits": [
      "민첩하지만, 연속 공격받으면 거의 대응하지 못합니다."
    ],
    "mechanics": [
      "armored",
      "evasive",
      "flame",
      "charge"
    ]
  },
  {
    "id": "bonekrusher-siegeknuckles",
    "name": "본 크러셔 파괴자",
    "image": "/enemies/bonekrusher-siegeknuckles.webp",
    "maxHp": 228,
    "attack": 38,
    "defense": 67,
    "speed": 92,
    "range": 6,
    "weight": 1,
    "staggerHp": 257,
    "intent": "중형 폭파 권갑을 장착한 무장 랜드브레이커, 본 크러셔 집단의 주력 전투 인원으로, 팔에 장착한 무기는 소형화된 공성 병기입니다.",
    "faction": "본크러셔",
    "tier": "Elite",
    "traits": [
      "공세가 끊임없이 이어집니다. 공세를 끊는다고 해도 공격을 계속할 수 있습니다.",
      "견갑에 달린 폭발형 반장갑 파편을 뿌립니다. 혹시라도 밟았다면 즉시 벗어나세요.",
      "지면의 파편을 회수해 재정비를 시도합니다. 회수에 성공하면 강력한 공격을 발동합니다."
    ],
    "mechanics": [
      "armored",
      "ranged",
      "self-destruct",
      "flame",
      "charge",
      "enrage",
      "smoke"
    ],
    "elite": true
  },
  {
    "id": "bonekrusher-vanguard",
    "name": "본 크러셔 돌격수",
    "image": "/enemies/bonekrusher-vanguard.webp",
    "maxHp": 39,
    "attack": 12,
    "defense": 20,
    "speed": 91,
    "range": 6,
    "weight": 1,
    "staggerHp": 45,
    "intent": "창과 방패를 장착한 무장 랜드브레이커, 조잡하게 이어 붙인 장비 덕분에 본 크러셔 돌격수가 공격과 방어를 겸비한 전투 기술을 익히게 되었으니 주의해서 상대해야 ...",
    "faction": "본크러셔",
    "tier": "Normal",
    "traits": [
      "공격 중인 상태가 아니면, 모든 공격을 막아냅니다.",
      "불균형 상태로 만들면 방패를 부술 수 있습니다."
    ],
    "mechanics": [
      "armored",
      "flame",
      "ranged",
      "shield",
      "charge",
      "enrage"
    ]
  },
  {
    "id": "breaking-gust",
    "name": "단운수",
    "image": "/enemies/breaking-gust.webp",
    "maxHp": 210,
    "attack": 35,
    "defense": 64,
    "speed": 97,
    "range": 2.3,
    "weight": 1,
    "staggerHp": 236,
    "intent": "기이한 무기를 장착한 불법 무장 세력. 겁운객 가운데 갈고리를 능숙하게 다루는 고수로, 그 솜씨가 구름과 안개를 네모반듯하게 잘라낼 정도라고 전해집니다.",
    "faction": "청파채",
    "tier": "Elite",
    "traits": [
      "갈고리로 아군 오퍼레이터를 공격하며, 탈출하지 못하면 지속적으로 기절합니다."
    ],
    "mechanics": [
      "armored",
      "flame",
      "smoke",
      "evasive",
      "charge",
      "grab",
      "bind"
    ],
    "elite": true
  },
  {
    "id": "brutal-pincerbeast",
    "name": "브루탈 핀서비스트",
    "image": "/enemies/brutal-pincerbeast.webp",
    "maxHp": 47,
    "attack": 9,
    "defense": 28,
    "speed": 88,
    "range": 6,
    "weight": 1,
    "staggerHp": 54,
    "intent": "야생의 감염된 생물, 등에 대량의 오리지늄 클러스터를 짊어지고 있으며 체구가 거대합니다. 갑각이 일반 개체보다 두껍고, 등에 짊어진 오리지늄 클러스터의 활성이 ...",
    "faction": "광석수",
    "tier": "Normal",
    "traits": [
      "보통 무리를 지어 나타납니다. 놈들의 날카로운 앞다리를 조심하세요."
    ],
    "mechanics": [
      "boss-shield",
      "ranged",
      "armored",
      "acid"
    ]
  },
  {
    "id": "cloud-obliterator",
    "name": "개천장",
    "image": "/enemies/cloud-obliterator.webp",
    "maxHp": 205,
    "attack": 35,
    "defense": 64,
    "speed": 96,
    "range": 2.8,
    "weight": 1.5,
    "staggerHp": 231,
    "intent": "중형 무기를 장착한 불법 무장 세력. 하늘을 여는 것은 아무나 쉽게 할 수 있는 일이 아닙니다. 사중 장착 발사기를 메고 있는 무장 인원 중에서 오직 충분히 강...",
    "faction": "청파채",
    "tier": "Elite",
    "traits": [
      "대포를 휘둘러 근거리 공격을 하거나, 불꽃을 발사하여 원거리 공격을 합니다.",
      "뿔에 받히면 거대한 불꽃을 볼 수 있을지도 모릅니다.",
      "그의 후방에서 공격하면 발굽으로 차일 수도 있으니 조심하세요."
    ],
    "mechanics": [
      "armored",
      "boss-shield",
      "flame",
      "ranged",
      "sniper",
      "evasive",
      "charge",
      "grab",
      "bind"
    ],
    "elite": true
  },
  {
    "id": "cloud-stalker",
    "name": "겁운객",
    "image": "/enemies/cloud-stalker.webp",
    "maxHp": 69,
    "attack": 16,
    "defense": 32,
    "speed": 97,
    "range": 2.3,
    "weight": 1,
    "staggerHp": 80,
    "intent": "기이한 무기를 장착한 불법 무장 세력. 겁운객의 무기는 등롱처럼 생겼지만, 겉보기와는 달리 열 발짝 떨어진 거리에서도 상대를 죽일 수 있으니 절대로 방심해서는 ...",
    "faction": "청파채",
    "tier": "Enhanced",
    "traits": [
      "시야를 방해하는 연기를 뿜어냅니다.",
      "연기 속에서는 오퍼레이터의 시야가 줄어들고, 이동 속도가 느려지며 회피할 수 없습니다.",
      "전투 능력이 비교적 약하기 때문에, 우선적으로 처치하는 것이 좋습니다.",
      "녹색 연기는 다른 적들을 치유합니다."
    ],
    "mechanics": [
      "armored",
      "evasive",
      "flame",
      "healer",
      "smoke",
      "charge",
      "grab"
    ]
  },
  {
    "id": "craghowler",
    "name": "거대한 록하울러",
    "image": "/enemies/craghowler.webp",
    "maxHp": 590,
    "attack": 41,
    "defense": 109,
    "speed": 92,
    "range": 2.8,
    "weight": 1.5,
    "staggerHp": 635,
    "intent": "록하울러 무리의 우두머리. 수많은 싸움 끝에 가장 강인한 록하울러가 무리의 우두머리가 되며, 이때의 거대한 록하울러는 이미 평범한 야수의 수준을 훨씬 뛰어넘는 ...",
    "faction": "광석수",
    "tier": "Boss",
    "traits": [
      "분노 상태에 돌입하면 무작위로 유적의 낙석을 떨어뜨려 피해를 줍니다.",
      "유적의 남은 기둥을 능숙하게 활용하며 공격 범위가 매우 넓습니다.",
      "후퇴하는 척하다가 적이 방심한 틈을 타 바위를 던져 공격합니다."
    ],
    "mechanics": [
      "boss-shield",
      "enrage",
      "rockfall",
      "armored",
      "acid",
      "charge",
      "poison"
    ],
    "elite": true,
    "boss": true
  },
  {
    "id": "effigy",
    "name": "형상아겔로스",
    "image": "/enemies/effigy.webp",
    "maxHp": 261,
    "attack": 30,
    "defense": 98,
    "speed": 87,
    "range": 12,
    "weight": 2,
    "staggerHp": 293,
    "intent": "'호모이오사론'(보관 번호: AGL371), 인간의 신체 또는 특정 부위를 모방하는 형성 모델을 지니고 있으며, 매우 희귀하고 위험합니다. 일부 개체는 초자연 ...",
    "faction": "아겔로스",
    "tier": "Elite",
    "traits": [
      "강력한 타격 수단을 다양하게 가지고 있지만, 공격할 때는 방향 전환 속도가 느리므로 후방에서 공격하는 것이 좋습니다.",
      "신체를 조합하여 다양한 형태로 변신하며 전장을 누빕니다.",
      "오퍼레이터를 속박하려고 시도합니다! 신속하게 움직임을 끊는 것이 효과적인 대응책입니다."
    ],
    "mechanics": [
      "bind",
      "ranged",
      "sniper",
      "armored",
      "shield",
      "reflect"
    ],
    "elite": true
  },
  {
    "id": "elite-ambusher",
    "name": "저격수 · 정예",
    "image": "/enemies/elite-ambusher.webp",
    "maxHp": 40,
    "attack": 12,
    "defense": 20,
    "speed": 94,
    "range": 7,
    "weight": 1,
    "staggerHp": 45,
    "intent": "안갯불의 강화를 받은, 원거리 무기를 장착한 정예 무장 랜드브레이커, 훈련이 잘되어 있고, 높은 명중률을 자랑하며, 사용하는 화살이 전반적으로 강화되었습니다.",
    "faction": "본크러셔",
    "tier": "Normal",
    "traits": [
      "해당 적은 특수 능력이 없습니다."
    ],
    "mechanics": [
      "armored",
      "flame",
      "ranged",
      "charge",
      "enrage"
    ]
  },
  {
    "id": "elite-executioner",
    "name": "처형자 · 정예",
    "image": "/enemies/elite-executioner.webp",
    "maxHp": 217,
    "attack": 38,
    "defense": 67,
    "speed": 91,
    "range": 2.8,
    "weight": 1.5,
    "staggerHp": 244,
    "intent": "안갯불의 강화를 받은, 중형 도끼를 장착한 정예 랜드브레이커, 큰 덩치를 자랑합니다. 이들은 보통 본 크러셔 집단 약탈팀의 우두머리로서 활동합니다.",
    "faction": "본크러셔",
    "tier": "Elite",
    "traits": [
      "잡기 공격에 당하면 대량의 피해를 받습니다. 오퍼레이터가 잡혔다면, 다른 오퍼레이터는 스킬을 사용하여 빠르게 적의 공격을 끊어 구출하세요.",
      "차지 2단 도끼 휘두르기를 사용하면 회피하기 어렵습니다. 빠르게 적의 공격을 끊으세요."
    ],
    "mechanics": [
      "charge",
      "evasive",
      "flame",
      "grab",
      "enrage",
      "smoke",
      "sniper",
      "self-destruct"
    ],
    "elite": true
  },
  {
    "id": "elite-raider",
    "name": "약탈자 · 정예",
    "image": "/enemies/elite-raider.webp",
    "maxHp": 38,
    "attack": 12,
    "defense": 20,
    "speed": 94,
    "range": 2.3,
    "weight": 1,
    "staggerHp": 44,
    "intent": "안갯불의 강화를 받은, 근거리 무기를 장착한 정예 무장 랜드브레이커, 장비, 신체 능력, 그리고 근접 전투 기술이 전반적으로 강화되었습니다.",
    "faction": "본크러셔",
    "tier": "Normal",
    "traits": [
      "해당 적은 특수 능력이 없습니다."
    ],
    "mechanics": [
      "armored",
      "flame",
      "charge",
      "enrage"
    ]
  },
  {
    "id": "elite-ripptusk",
    "name": "립터스크 · 정예",
    "image": "/enemies/elite-ripptusk.webp",
    "maxHp": 43,
    "attack": 13,
    "defense": 20,
    "speed": 95,
    "range": 2.1,
    "weight": 1,
    "staggerHp": 49,
    "intent": "안갯불의 강화를 받은, 무장 랜드브레이커가 조종하는 정예 워비스트, 일반적인 터스크비스트보다 더 잔인하고 교활하며, 행동이 기이하여 예측하기 어렵습니다.",
    "faction": "본크러셔",
    "tier": "Normal",
    "traits": [
      "유연하고 민첩하며, 표적이 된 목표에 계속 접근하며 공격합니다."
    ],
    "mechanics": [
      "armored",
      "evasive",
      "flame",
      "charge",
      "enrage"
    ]
  },
  {
    "id": "falsewings-alpha",
    "name": "모방아겔로스 · α",
    "image": "/enemies/falsewings-alpha.webp",
    "maxHp": 33,
    "attack": 7,
    "defense": 20,
    "speed": 83,
    "range": 6,
    "weight": 1,
    "staggerHp": 40,
    "intent": "'소스 탈론 · 아나본'(보관 번호: ARA07Cα), ARA07C의 활성 모델 생물류입니다. 일반적으로 원래 형성 모델과의 차이는 색상뿐이라고 여겨집니다.",
    "faction": "아겔로스",
    "tier": "Common",
    "traits": [
      "소형 회오리바람은 오퍼레이터를 감속시킵니다."
    ],
    "mechanics": [
      "ranged",
      "smoke",
      "armored",
      "shield"
    ]
  },
  {
    "id": "falsewings",
    "name": "모방아겔로스",
    "image": "/enemies/falsewings.webp",
    "maxHp": 32,
    "attack": 7,
    "defense": 20,
    "speed": 87,
    "range": 6,
    "weight": 1,
    "staggerHp": 39,
    "intent": "'소스 탈론'(보관 번호: ARA07C), 비행 능력은 외형과 무관합니다. 이러한 형성 모델은 처음에는 생물을 모방한 것으로 여겨졌으나, 현재는 테라인이 사용하...",
    "faction": "아겔로스",
    "tier": "Common",
    "traits": [
      "소형 회오리바람은 오퍼레이터를 감속시킵니다."
    ],
    "mechanics": [
      "ranged",
      "smoke",
      "armored",
      "shield"
    ]
  },
  {
    "id": "firemist-originium-slug",
    "name": "화염원석충",
    "image": "/enemies/firemist-originium-slug.webp",
    "maxHp": 50,
    "attack": 9,
    "defense": 28,
    "speed": 93,
    "range": 6,
    "weight": 1,
    "staggerHp": 57,
    "intent": "야생의 감염된 생물, 체온이 매우 높습니다. 빈사 상태가 되면 폭발하며, 끓어오르는 산성 체액과 활성 오리지늄 분진이 주변의 모든 것을 휩쓸어 버립니다.",
    "faction": "광석수",
    "tier": "Normal",
    "traits": [
      "생명력이 낮아지면 자폭합니다. 자폭은 피격된 오퍼레이터에게 불안정한 화합물을 남깁니다. 해당 오퍼레이터가 피해를 다시 받으면 이 화합물이 폭발합니다."
    ],
    "mechanics": [
      "acid",
      "flame",
      "ranged",
      "self-destruct",
      "armored",
      "charge"
    ]
  },
  {
    "id": "glaring-rakerbeast",
    "name": "분노의 레이커비스트",
    "image": "/enemies/glaring-rakerbeast.webp",
    "maxHp": 255,
    "attack": 27,
    "defense": 94,
    "speed": 91,
    "range": 7,
    "weight": 2,
    "staggerHp": 286,
    "intent": "레이커비스트의 특수 변이 색상형, 수명은 다소 짧아졌지만 더 강해졌습니다. 두 눈 속에는 마치 흐르는 불꽃이 깃든 듯합니다.",
    "faction": "광석수",
    "tier": "Elite",
    "traits": [
      "일반 레이커비스트와 달리, 생명력이 낮아지면 잠시 은신하며 차지합니다. 제때 차지를 끊으면 은신이 해제되며 대량의 불균형치를 쌓을 수 있습니다.",
      "분노 상태: 분노 상태에서 공격력이 증가하고, 차지 빈도가 더 높아집니다. 불균형 상태에 진입하면 분노 상태가 종료됩니다."
    ],
    "mechanics": [
      "charge",
      "enrage",
      "evasive",
      "flame",
      "ranged",
      "armored",
      "acid",
      "rockfall",
      "poison"
    ],
    "elite": true
  },
  {
    "id": "grove-archer",
    "name": "천림전",
    "image": "/enemies/grove-archer.webp",
    "maxHp": 42,
    "attack": 11,
    "defense": 19,
    "speed": 99,
    "range": 7,
    "weight": 1,
    "staggerHp": 48,
    "intent": "기본 원거리 무기를 장착한 불법 무장 세력, 대나무 숲에서 단련한 활솜씨는 활을 쏘았을 때 숲을 관통하면서도 나뭇잎 하나 스치지 않을 정도입니다.",
    "faction": "청파채",
    "tier": "Normal",
    "traits": [
      "각종 화살을 발사하고 폭탄을 투척하여 원거리 견제 공격을 합니다."
    ],
    "mechanics": [
      "armored",
      "flame",
      "ranged",
      "evasive",
      "charge"
    ]
  },
  {
    "id": "hazefyre-axe-armorbeast",
    "name": "안갯불에 물든 엑스 아머비스트",
    "image": "/enemies/hazefyre-axe-armorbeast.webp",
    "maxHp": 265,
    "attack": 28,
    "defense": 94,
    "speed": 91,
    "range": 7,
    "weight": 2,
    "staggerHp": 298,
    "intent": "안갯불에 물든 엑스 아머비스트, 성격이 극도로 난폭해져 이미 광기에 빠진 상태입니다. '거대한 도끼'에 쪼개지고 싶지 않다면, 주의해서 상대해야 합니다.",
    "faction": "광석수",
    "tier": "Elite",
    "traits": [
      "분노한 엑스 아머비스트는 자기 영역에 침입한 모든 적을 거대한 뿔로 몰아냅니다. 돌진을 반드시 조심하세요.",
      "여러 형태의 광역 범위 공격을 합니다. 놈이 분노하면 제때 공격을 중단시키세요."
    ],
    "mechanics": [
      "boss-shield",
      "charge",
      "enrage",
      "flame",
      "ranged",
      "armored",
      "acid",
      "rockfall",
      "poison"
    ],
    "elite": true
  },
  {
    "id": "hazefyre-claw",
    "name": "안갯불에 물든 랜드브레이커",
    "image": "/enemies/hazefyre-claw.webp",
    "maxHp": 40,
    "attack": 13,
    "defense": 20,
    "speed": 91,
    "range": 2.3,
    "weight": 1,
    "staggerHp": 46,
    "intent": "안갯불에 물든 무장 랜드브레이커, 안갯불을 흡수하는 게 반드시 행운인 것은 아닙니다. 이 랜드브레이커들은 심각한 왜곡을 겪었습니다.",
    "faction": "본크러셔",
    "tier": "Normal",
    "traits": [
      "연속 물어뜯기 공격을 피하면 바닥에 넘어집니다."
    ],
    "mechanics": [
      "armored",
      "flame",
      "charge",
      "enrage"
    ]
  },
  {
    "id": "hazefyre-tuskbeast",
    "name": "안갯불에 물든 터스크비스트",
    "image": "/enemies/hazefyre-tuskbeast.webp",
    "maxHp": 43,
    "attack": 10,
    "defense": 28,
    "speed": 93,
    "range": 2.1,
    "weight": 1,
    "staggerHp": 49,
    "intent": "안갯불에 물든 터스크비스트, 이런 기괴하고 위험한 소형 생물이 무리를 지어 움직이면, 완전 무장한 특별 파견 팀에도 큰 위협이 될 수 있습니다.",
    "faction": "광석수",
    "tier": "Normal",
    "traits": [
      "일반 터스크비스트보다 더 사납지만, 지능이 낮습니다.",
      "전력 돌진 공격을 피하면 바닥에 넘어집니다."
    ],
    "mechanics": [
      "armored",
      "charge",
      "flame",
      "acid",
      "enrage"
    ]
  },
  {
    "id": "heavy-ram-alpha",
    "name": "쌍뿔아겔로스 · α",
    "image": "/enemies/heavy-ram-alpha.webp",
    "maxHp": 133,
    "attack": 20,
    "defense": 76,
    "speed": 89,
    "range": 3.2,
    "weight": 1.5,
    "staggerHp": 150,
    "intent": "'트릴리소론 아나본'(보관 번호: ACL072α), ACL072의 활성 모델 생물류입니다. 높은 에너지를 가졌음에도 판단 능력에 영향받지 않아 비교적 위험합니다.",
    "faction": "아겔로스",
    "tier": "Advanced",
    "traits": [],
    "mechanics": [
      "armored",
      "shield"
    ]
  },
  {
    "id": "heavy-ram",
    "name": "쌍뿔아겔로스",
    "image": "/enemies/heavy-ram.webp",
    "maxHp": 130,
    "attack": 20,
    "defense": 76,
    "speed": 86,
    "range": 3.2,
    "weight": 1.5,
    "staggerHp": 147,
    "intent": "'트릴리소론'(보관 번호: ACL072), ACL071의 비모델 생물류입니다. 주변 환경을 어떻게 이용할지에 대해서 스스로 판단하고 행동하는 능력을 갖고 있습니다.",
    "faction": "아겔로스",
    "tier": "Advanced",
    "traits": [],
    "mechanics": [
      "armored",
      "shield"
    ]
  },
  {
    "id": "heavy-sting-alpha",
    "name": "삼미아겔로스 · α",
    "image": "/enemies/heavy-sting-alpha.webp",
    "maxHp": 144,
    "attack": 20,
    "defense": 76,
    "speed": 87,
    "range": 7,
    "weight": 1.5,
    "staggerHp": 162,
    "intent": "'바리켄트론 아나본'(보관 번호: ARL141α), ARL141의 활성 모델 생물류입니다. 기존의 다양한 공격 방식을 유지하면서 형성 모델의 견고함을 높여 위험...",
    "faction": "아겔로스",
    "tier": "Advanced",
    "traits": [
      "오퍼레이터의 발 아래에서 오리지늄 기둥이 솟아오르며 공격합니다.",
      "가까이 접근하면 자신 주변에 돌기둥을 소환하여 스스로를 보호합니다."
    ],
    "mechanics": [
      "armored",
      "ranged",
      "rockfall",
      "summoner",
      "shield",
      "reflect"
    ]
  },
  {
    "id": "heavy-sting",
    "name": "삼미아겔로스",
    "image": "/enemies/heavy-sting.webp",
    "maxHp": 141,
    "attack": 19,
    "defense": 76,
    "speed": 84,
    "range": 7,
    "weight": 1.5,
    "staggerHp": 159,
    "intent": "'바리켄트론'(보관 번호: ARL141), ARL121의 비모델 생물류입니다. 가끔 에너지로 공격하기를 포기하고 꼬리를 이용한 근거리 전투를 시도하기도 합니다.",
    "faction": "아겔로스",
    "tier": "Advanced",
    "traits": [
      "오퍼레이터의 발 아래에서 오리지늄 기둥이 솟아오르며 공격합니다.",
      "가까이 접근하면 자신 주변에 돌기둥을 소환하여 스스로를 보호합니다."
    ],
    "mechanics": [
      "armored",
      "ranged",
      "rockfall",
      "summoner",
      "shield",
      "reflect"
    ]
  },
  {
    "id": "hedron-delta",
    "name": "수정아겔로스 · δ",
    "image": "/enemies/hedron-delta.webp",
    "maxHp": 34,
    "attack": 7,
    "defense": 15,
    "speed": 88,
    "range": 6,
    "weight": 1,
    "staggerHp": 40,
    "intent": "'다이파스타그란 · 다이네든'(보관 번호: ARM315δ), ARM315의 격류종, 햇빛 아래에서 눈부신 보랏빛 광채를 내뿜습니다. 탈로스의 반사광 아래에서는 ...",
    "faction": "침식체",
    "tier": "Common",
    "traits": [
      "발사한 총알이 명중하면 오퍼레이터에게 냉기 부착을 부여합니다."
    ],
    "mechanics": [
      "cold",
      "ranged",
      "reflect",
      "poison",
      "healer"
    ]
  },
  {
    "id": "hedron",
    "name": "수정아겔로스",
    "image": "/enemies/hedron.webp",
    "maxHp": 38,
    "attack": 7,
    "defense": 15,
    "speed": 88,
    "range": 2.1,
    "weight": 1,
    "staggerHp": 45,
    "intent": "'다이파스타그란'(보관 번호: ARM315), 에너지를 투척하는 액체 형성 모델, 복잡하고 대칭적인 기하학적 외형을 지녔으며, 공격하면 접촉한 면에서 열을 빼앗...",
    "faction": "침식체",
    "tier": "Common",
    "traits": [
      "발사한 총알이 명중하면 오퍼레이터에게 냉기 부착을 부여합니다."
    ],
    "mechanics": [
      "cold",
      "ranged",
      "poison",
      "healer"
    ]
  },
  {
    "id": "highway-reaver",
    "name": "막석명",
    "image": "/enemies/highway-reaver.webp",
    "maxHp": 42,
    "attack": 11,
    "defense": 19,
    "speed": 97,
    "range": 2.3,
    "weight": 1,
    "staggerHp": 48,
    "intent": "무릉 관할 지역에서 활동하는 불법 무장 세력. 불법 검문소를 설치하고 밀수품을 통해 이익을 취하며, 심지어 사람의 목숨을 위협할 때도 있습니다.",
    "faction": "청파채",
    "tier": "Normal",
    "traits": [
      "해당 적은 특수 능력이 없습니다."
    ],
    "mechanics": [
      "armored",
      "flame",
      "evasive",
      "charge"
    ]
  },
  {
    "id": "hill-smasher",
    "name": "최산장",
    "image": "/enemies/hill-smasher.webp",
    "maxHp": 201,
    "attack": 33,
    "defense": 64,
    "speed": 96,
    "range": 2.8,
    "weight": 1.5,
    "staggerHp": 226,
    "intent": "중형 무기를 장착한 불법 무장 세력. 최산장의 4연장 발사기는 산을 뒤흔들 정도의 진정한 중화기이므로 절대로 방심해서는 안 됩니다.",
    "faction": "청파채",
    "tier": "Elite",
    "traits": [
      "대포를 휘둘러 근거리 공격을 하거나, 불꽃을 발사하여 원거리 공격을 합니다.",
      "뿔에 받히면 거대한 불꽃을 볼 수 있을지도 모릅니다.",
      "그의 후방에서 공격하면 발굽으로 차일 수도 있으니 조심하세요."
    ],
    "mechanics": [
      "armored",
      "boss-shield",
      "flame",
      "ranged",
      "sniper",
      "evasive",
      "charge",
      "grab",
      "bind"
    ],
    "elite": true
  },
  {
    "id": "imbued-quillbeast",
    "name": "활성화된 프릭비스트",
    "image": "/enemies/imbued-quillbeast.webp",
    "maxHp": 73,
    "attack": 14,
    "defense": 47,
    "speed": 90,
    "range": 6,
    "weight": 1,
    "staggerHp": 85,
    "intent": "활성 오리지늄 분진의 영향을 받은 프릭비스트, 온몸의 가시에 상당한 에너지를 저장하고 있으며 더 강한 파괴력을 지녔습니다.",
    "faction": "광석수",
    "tier": "Enhanced",
    "traits": [
      "차지하여 배를 부풀린 뒤 체내의 고열 용암을 분사합니다. 차지 중에 끊으면 대량의 불균형치를 쌓을 수 있습니다.",
      "분노 상태: 분노 상태에서 공격력이 증가하고 차지 빈도가 더 높아집니다. 불균형 상태에 진입하면 분노 상태가 종료됩니다."
    ],
    "mechanics": [
      "charge",
      "enrage",
      "flame",
      "ranged",
      "armored",
      "acid"
    ]
  },
  {
    "id": "indigenous-pincerbeast",
    "name": "원시 핀서비스트",
    "image": "/enemies/indigenous-pincerbeast.webp",
    "maxHp": 48,
    "attack": 10,
    "defense": 28,
    "speed": 88,
    "range": 6,
    "weight": 1,
    "staggerHp": 55,
    "intent": "야생의 감염된 생물, 등에 대량의 오리지늄 클러스터를 짊어지고 있으며 체구가 거대합니다. 낫처럼 생긴 앞다리로 사냥감을 찢어발길 수 있습니다.",
    "faction": "광석수",
    "tier": "Normal",
    "traits": [
      "보통 무리를 지어 나타납니다.",
      "놈들의 날카로운 앞다리를 조심하세요."
    ],
    "mechanics": [
      "boss-shield",
      "ranged",
      "armored",
      "acid"
    ]
  },
  {
    "id": "marble-aggelomoirai-awakened",
    "name": "마블 아겔로미레",
    "image": "/enemies/marble-aggelomoirai-awakened.webp",
    "maxHp": 582,
    "attack": 42,
    "defense": 112,
    "speed": 88,
    "range": 12,
    "weight": 2,
    "staggerHp": 627,
    "intent": "미분류, 형성 특징으로 보아 아겔로스로 추정됩니다. 형성 모델이 네파리스의 외형을 모방했으며, 코어 에너지 지표가 높지만 불안정합니다.",
    "faction": "아겔로스",
    "tier": "Boss",
    "traits": [
      "각성한 마블 아겔로미레는 우주에서 무수한 앵커를 소환하여 땅에 내리칩니다.",
      "이 공격을 피해야만 반격의 기회를 노릴 수 있습니다."
    ],
    "mechanics": [
      "boss-shield",
      "flame",
      "ranged",
      "self-destruct",
      "sniper",
      "summoner",
      "armored",
      "shield",
      "reflect"
    ],
    "elite": true,
    "boss": true
  },
  {
    "id": "marble-aggelomoirai",
    "name": "마블 아겔로미레",
    "image": "/enemies/marble-aggelomoirai.webp",
    "maxHp": 623,
    "attack": 41,
    "defense": 112,
    "speed": 88,
    "range": 12,
    "weight": 2,
    "staggerHp": 671,
    "intent": "미분류, 형성 특징으로 보아 아겔로스로 추정됩니다. 형성 모델이 재구성되었으나 여전히 네파리스의 외형을 모방하였습니다. 모든 추가 추정 결론은 신뢰할 수 없는 ...",
    "faction": "아겔로스",
    "tier": "Boss",
    "traits": [
      "모든 마블 부속체를 처치해야만, 수면 상태의 마블 아겔로미레가 잠시 동안 공격할 수 있는 핵심 부위를 드러냅니다."
    ],
    "mechanics": [
      "boss-shield",
      "ranged",
      "sniper",
      "summoner",
      "armored",
      "shield",
      "reflect"
    ],
    "elite": true,
    "boss": true
  },
  {
    "id": "marble-appendage",
    "name": "마블 부속체",
    "image": "/enemies/marble-appendage.webp",
    "maxHp": 577,
    "attack": 42,
    "defense": 112,
    "speed": 88,
    "range": 12,
    "weight": 2,
    "staggerHp": 621,
    "intent": "미분류, 형성 특징으로 보아 아겔로스로 추정됩니다. 외관상 본체에서 확장된 것처럼 보이지만, 실제로는 형성 위치에서 본체로 확장된 것입니다. 이는 적을 교란하기...",
    "faction": "아겔로스",
    "tier": "Boss",
    "traits": [
      "일부 마블 부속체는 근거리 적을 공격하는 데 특화되어 있으며, 지면을 미친 듯이 내리칩니다.",
      "일부 마블 부속체는 원거리 적을 공격하는 데 특화되어 있으며, 자신의 끝부분을 침식으로 분쇄해 적에게 투척합니다."
    ],
    "mechanics": [
      "boss-shield",
      "ranged",
      "sniper",
      "summoner",
      "armored",
      "shield",
      "reflect"
    ],
    "elite": true,
    "boss": true
  },
  {
    "id": "mudflow-delta",
    "name": "탁류아겔로스 · δ",
    "image": "/enemies/mudflow-delta.webp",
    "maxHp": 36,
    "attack": 7,
    "defense": 15,
    "speed": 88,
    "range": 2.1,
    "weight": 1,
    "staggerHp": 43,
    "intent": "'토레이그란 · 다이네든'(보관 번호: ACM311δ), ACM311의 격류종, 에너지를 다루는 방식이 특이하여, 내부 온도가 구성 물질의 어는 점보다 낮습니다.",
    "faction": "침식체",
    "tier": "Common",
    "traits": [
      "멀리서 빠르게 접근하며, 공격이 명중하면 오퍼레이터에게 냉기 부착을 부여합니다."
    ],
    "mechanics": [
      "cold",
      "evasive",
      "sniper",
      "poison",
      "healer"
    ]
  },
  {
    "id": "mudflow",
    "name": "탁류아겔로스",
    "image": "/enemies/mudflow.webp",
    "maxHp": 34,
    "attack": 7,
    "defense": 15,
    "speed": 88,
    "range": 2.1,
    "weight": 1,
    "staggerHp": 41,
    "intent": "'토레이그란'(보관 번호: ACM311), 인류가 처음 발견한 액체를 사용한 형성 모델, 헤일로의 외형이 불안정하며, 일반적으로 내부 온도가 구성 물질보다 낮습니다.",
    "faction": "침식체",
    "tier": "Common",
    "traits": [
      "멀리서 빠르게 접근하며, 공격이 명중하면 오퍼레이터에게 냉기 부착을 부여합니다."
    ],
    "mechanics": [
      "cold",
      "evasive",
      "flame",
      "self-destruct",
      "sniper",
      "poison",
      "healer"
    ]
  },
  {
    "id": "nefarith-bonekrusher",
    "name": "'본 크러셔' 네파리스",
    "image": "/enemies/nefarith-bonekrusher.webp",
    "maxHp": 514,
    "attack": 53,
    "defense": 77,
    "speed": 96,
    "range": 12,
    "weight": 2,
    "staggerHp": 553,
    "intent": "'본 크러셔'라는 이름은 네파리스로 인해 밴드 전역에 울려 퍼졌습니다. 그녀의 잔혹한 여행은 끝난 적이 없고, 그녀의 야심 또한 아직 온전히 드러나지 않았습니다.",
    "faction": "본크러셔",
    "tier": "Boss",
    "traits": [
      "회피로는 피할 수 없는 초자연 에너지 파동을 베어 냅니다.",
      "장방이의 식양 지원을 이용해 공중으로 점프해 회피해야 합니다.",
      "공중으로 점프해 차지 공격을 가합니다.",
      "식양을 이용해 뛰어오른 후 낙하 공격으로 번개를 소환해 적의 공격을 끊어야 합니다."
    ],
    "mechanics": [
      "boss-shield",
      "charge",
      "evasive",
      "ranged",
      "shock",
      "sniper",
      "summoner",
      "flame",
      "enrage",
      "smoke",
      "self-destruct"
    ],
    "elite": true,
    "boss": true
  },
  {
    "id": "nefarith-conqueror",
    "name": "'정복자' 네파리스",
    "image": "/enemies/nefarith-conqueror.webp",
    "maxHp": 524,
    "attack": 51,
    "defense": 77,
    "speed": 96,
    "range": 12,
    "weight": 2,
    "staggerHp": 564,
    "intent": "정복자의 심상. 그녀는 문명을 유린하고자 하는 욕망을 조금도 감추지 않았습니다.",
    "faction": "본크러셔",
    "tier": "Boss",
    "traits": [
      "평소에는 초자연 보호막의 보호를 받아, 받는 피해가 크게 감소합니다. 차지를 끊어야만 보호막을 잠시 해제할 수 있습니다.",
      "시공간을 찢어 오퍼레이터를 행동 불가 상태로 만드는 능력을 지니고 있습니다. 이런 종류의 스킬은 가장 먼저 끊어야 합니다.",
      "앵커로 아군 오퍼레이터를 가두므로, 앵커를 공격해 오퍼레이터를 구출해야 합니다."
    ],
    "mechanics": [
      "armored",
      "bind",
      "boss-shield",
      "charge",
      "flame",
      "grab",
      "ranged",
      "shield",
      "sniper",
      "summoner",
      "enrage",
      "smoke",
      "self-destruct"
    ],
    "elite": true,
    "boss": true
  },
  {
    "id": "nimbus-razor",
    "name": "할운옹",
    "image": "/enemies/nimbus-razor.webp",
    "maxHp": 72,
    "attack": 16,
    "defense": 32,
    "speed": 100,
    "range": 2.3,
    "weight": 1,
    "staggerHp": 84,
    "intent": "기이한 무기를 장착한 불법 무장 세력. 겁운객이 손에 든 기묘한 등롱으로 적을 상대하는 데 싫증이 나면, 단도를 꺼내 근접전으로 맞붙습니다.",
    "faction": "청파채",
    "tier": "Enhanced",
    "traits": [
      "갈고리로 아군 오퍼레이터를 공격합니다.",
      "탈출하지 못하면 지속적으로 기절 상태에 빠집니다."
    ],
    "mechanics": [
      "armored",
      "flame",
      "evasive",
      "charge"
    ]
  },
  {
    "id": "prism",
    "name": "굴절아겔로스",
    "image": "/enemies/prism.webp",
    "maxHp": 38,
    "attack": 7,
    "defense": 15,
    "speed": 87,
    "range": 2.1,
    "weight": 1,
    "staggerHp": 45,
    "intent": "'프리마타그란'(보관 번호: ASM316), ARM315의 비모델 생물류입니다. 주변 아겔로스에게 보호를 제공하며, ARM315에 섞여 있을 때 조준하기 어렵습니다.",
    "faction": "침식체",
    "tier": "Common",
    "traits": [
      "주위의 동료를 크게 강화하여 능력을 끌어올립니다."
    ],
    "mechanics": [
      "armored",
      "poison",
      "cold"
    ]
  },
  {
    "id": "quillbeast",
    "name": "프릭비스트",
    "image": "/enemies/quillbeast.webp",
    "maxHp": 77,
    "attack": 14,
    "defense": 47,
    "speed": 87,
    "range": 6,
    "weight": 1,
    "staggerHp": 89,
    "intent": "야생의 프릭비스트, 탈로스 II의 토착 동물입니다. 몸의 뾰족한 가시를 세우고 구르기 시작하면, 전기톱에 버금가는 파괴력을 지닙니다.",
    "faction": "광석수",
    "tier": "Enhanced",
    "traits": [
      "분노 상태: 분노 상태에서 공격력이 증가하고, 차지 빈도가 더 높아집니다. 불균형 상태에 진입하면 분노 상태가 종료됩니다."
    ],
    "mechanics": [
      "charge",
      "enrage",
      "flame",
      "ranged",
      "shock",
      "armored",
      "acid"
    ]
  },
  {
    "id": "ram-alpha",
    "name": "큰뿔아겔로스 · α",
    "image": "/enemies/ram-alpha.webp",
    "maxHp": 36,
    "attack": 7,
    "defense": 20,
    "speed": 84,
    "range": 2.1,
    "weight": 1,
    "staggerHp": 44,
    "intent": "'크리오손 아나본'(보관 번호: ACL071α), ACL071의 활성 모델 생물류입니다. 넘치는 에너지로 인해 상징적인 밝은 빨간색 외관을 가지고 있으며, 모델...",
    "faction": "아겔로스",
    "tier": "Common",
    "traits": [],
    "mechanics": [
      "armored",
      "evasive",
      "shield",
      "ranged"
    ]
  },
  {
    "id": "ram",
    "name": "큰뿔아겔로스",
    "image": "/enemies/ram.webp",
    "maxHp": 36,
    "attack": 7,
    "defense": 20,
    "speed": 88,
    "range": 2.1,
    "weight": 1,
    "staggerHp": 43,
    "intent": "'크리오손'(보관 번호: ACL071), 뿔로 적을 들이받습니다. 최초로 기록된 아겔로스의 형성 모델 중 하나로, 각 지역에서 비교적 흔하게 볼 수 있습니다.",
    "faction": "아겔로스",
    "tier": "Common",
    "traits": [],
    "mechanics": [
      "charge",
      "armored",
      "shield"
    ]
  },
  {
    "id": "rhodagn-the-bonekrushing-fist",
    "name": "'본 크러셔의 주먹' 로댄",
    "image": "/enemies/rhodagn-the-bonekrushing-fist.webp",
    "maxHp": 474,
    "attack": 51,
    "defense": 77,
    "speed": 96,
    "range": 12,
    "weight": 2,
    "staggerHp": 511,
    "intent": "네파리스의 '오른팔', 본 크러셔 집단의 최강 전사, 과거 수많은 랜드브레이커들이 네파리스의 권위에 도전했지만, 그들의 야망은 로댄의 주먹에 하나씩 산산조각이 ...",
    "faction": "본크러셔",
    "tier": "Boss",
    "traits": [
      "중무장한 적, 몸의 통풍구를 이용해 상대방을 자신의 주변으로 끌어들여 공격합니다.",
      "지옥의 용광로에서 에너지를 흡수하여 자신의 능력을 강화합니다.",
      "로댄이 뿜는 화염을 조심하세요."
    ],
    "mechanics": [
      "armored",
      "boss-shield",
      "flame",
      "ranged",
      "sniper",
      "charge",
      "enrage",
      "smoke",
      "self-destruct"
    ],
    "elite": true,
    "boss": true
  },
  {
    "id": "road-plunderer",
    "name": "막류재",
    "image": "/enemies/road-plunderer.webp",
    "maxHp": 43,
    "attack": 11,
    "defense": 19,
    "speed": 98,
    "range": 2.3,
    "weight": 1,
    "staggerHp": 49,
    "intent": "무릉 관할 지역에서 활동하는 불법 무장 세력, 사설 검문소를 운영하며 불법 물품을 밀수합니다. 홍산 치안 부대의 주요 단속 대상입니다.",
    "faction": "청파채",
    "tier": "Normal",
    "traits": [
      "해당 적은 특수 능력이 없습니다."
    ],
    "mechanics": [
      "armored",
      "flame",
      "evasive",
      "charge"
    ]
  },
  {
    "id": "rockhowler",
    "name": "록하울러",
    "image": "/enemies/rockhowler.webp",
    "maxHp": 43,
    "attack": 10,
    "defense": 28,
    "speed": 90,
    "range": 6,
    "weight": 1,
    "staggerHp": 48,
    "intent": "야생의 록하울러. 영리하면서도 장난기 많은 이 동물은 종종 사람을 골탕 먹이기 위해 함정을 파놓기도 합니다. 사람들이 잔뜩 약이 오른 모습을 보는 것을 좋아하므...",
    "faction": "광석수",
    "tier": "Normal",
    "traits": [
      "무리를 지어 출몰하는 습성이 있습니다. 록하울러가 던진 바나나 껍질을 밟으면 오퍼레이터와 록하울러 모두 미끄러져 넘어집니다."
    ],
    "mechanics": [
      "armored",
      "ranged",
      "acid",
      "charge"
    ]
  },
  {
    "id": "ruan-yi",
    "name": "원일",
    "image": "/enemies/ruan-yi.webp",
    "maxHp": 487,
    "attack": 48,
    "defense": 74,
    "speed": 100,
    "range": 12,
    "weight": 2,
    "staggerHp": 524,
    "intent": "오랜 고통 끝에, 순식간에 사라질 수 있는 '기회' 앞에서, 원일은 더 이상 마음속 불꽃을 억누르지 않습니다.",
    "faction": "청파채",
    "tier": "Boss",
    "traits": [
      "원일은 모든 공격을 튕겨 냅니다. 식양을 이용하여 원일의 방어를 파괴해야만 피해를 줄 수 있습니다.",
      "생명력이 일정 이하로 떨어지면 격노 상태에 진입합니다.",
      "식양을 이용하면 해당 상태를 해제하고, 장시간의 허약 상태에 빠뜨릴 수 있습니다.",
      "원일은 격노 상태일 때, 메인 컨트롤 오퍼레이터가 가까이 다가가면 폭발하는 분노의 씨앗을 소환합니다.",
      "전장에는 전투를 돕는 식양 에너지가 모입니다.",
      "결정적인 순간에 식양 에너지와 접촉해 활성화하면, 원일을 억제할 수 있습니다."
    ],
    "mechanics": [
      "armored",
      "boss-shield",
      "enrage",
      "flame",
      "ranged",
      "self-destruct",
      "sniper",
      "summoner",
      "evasive",
      "charge",
      "grab",
      "bind"
    ],
    "elite": true,
    "boss": true
  },
  {
    "id": "sentinel",
    "name": "보초아겔로스",
    "image": "/enemies/sentinel.webp",
    "maxHp": 290,
    "attack": 29,
    "defense": 98,
    "speed": 88,
    "range": 7,
    "weight": 2,
    "staggerHp": 327,
    "intent": "'프루로스사론'(보관 번호: ARS316), 형성 모델은 인류의 경비 포탑을 모방한 것으로 여겨집니다. 사거리가 길지만 한번 형성된 후에는 움직이지 않습니다.",
    "faction": "아겔로스",
    "tier": "Elite",
    "traits": [
      "매우 긴 사거리와 막강한 위력을 갖추고 있어, 포격을 피해야만 나아갈 수 있습니다."
    ],
    "mechanics": [
      "ranged",
      "sniper",
      "armored",
      "shield",
      "reflect"
    ],
    "elite": true
  },
  {
    "id": "skydrummer",
    "name": "천고",
    "image": "/enemies/skydrummer.webp",
    "maxHp": 237,
    "attack": 27,
    "defense": 94,
    "speed": 88,
    "range": 7,
    "weight": 2,
    "staggerHp": 266,
    "intent": "야생의 하울러비스트, 탈로스 II의 토착 동물입니다. 머리와 목을 감싼 질긴 피부막이 산림을 뒤흔드는 거대한 포효를 내지르는 데 힘을 보탭니다.",
    "faction": "광석수",
    "tier": "Elite",
    "traits": [
      "생명력이 일정 이하로 떨어지면 자극을 받아 분노 상태에 진입합니다. 차지 공격 빈도가 더 높아지고, 더 큰 피해를 주며, 받는 피해가 감소합니다. 분노 상태를 끝내려면 제때에 끊어야 합니다."
    ],
    "mechanics": [
      "boss-shield",
      "charge",
      "enrage",
      "ranged",
      "armored",
      "acid",
      "rockfall",
      "poison"
    ],
    "elite": true
  },
  {
    "id": "spotted-rakerbeast",
    "name": "백안의 레이커비스트",
    "image": "/enemies/spotted-rakerbeast.webp",
    "maxHp": 247,
    "attack": 29,
    "defense": 94,
    "speed": 87,
    "range": 7,
    "weight": 2,
    "staggerHp": 278,
    "intent": "자연 환경에 서식하는 레이커비스트, 탈로스 II의 토착 동물입니다. 뛰어난 점프력과 날카로운 발톱을 지닌, 산림 지대의 최상위 포식자입니다.",
    "faction": "광석수",
    "tier": "Elite",
    "traits": [
      "몸놀림이 민첩하며, 발톱과 꼬리로 공격합니다. 주의해서 피하세요.",
      "분노 상태에서는 공격력이 증가하고 차지 공격 빈도가 더 높아집니다. 불균형 상태에 진입하면 분노 상태가 종료됩니다."
    ],
    "mechanics": [
      "charge",
      "enrage",
      "evasive",
      "flame",
      "ranged",
      "armored",
      "acid",
      "rockfall",
      "poison"
    ],
    "elite": true
  },
  {
    "id": "sting-alpha",
    "name": "일미아겔로스 · α",
    "image": "/enemies/sting-alpha.webp",
    "maxHp": 33,
    "attack": 7,
    "defense": 20,
    "speed": 89,
    "range": 6,
    "weight": 1,
    "staggerHp": 40,
    "intent": "'켄트론 아나본'(보관 번호: ARL121α), ARL121의 활성 모델 생물류입니다. 단순히 더 높은 에너지 밀도로 화력을 높이지만, 에너지 이용 효율은 여전...",
    "faction": "아겔로스",
    "tier": "Common",
    "traits": [],
    "mechanics": [
      "ranged",
      "armored",
      "shield"
    ]
  },
  {
    "id": "sting",
    "name": "일미아겔로스",
    "image": "/enemies/sting.webp",
    "maxHp": 33,
    "attack": 7,
    "defense": 20,
    "speed": 86,
    "range": 6,
    "weight": 1,
    "staggerHp": 39,
    "intent": "'켄트론'(보관 번호: ARL121), 자신을 구성한 물질에 에너지를 부여하고 관성을 이용해 던집니다. 에너지의 활용 효율은 상당히 낮습니다.",
    "faction": "아겔로스",
    "tier": "Common",
    "traits": [],
    "mechanics": [
      "ranged",
      "armored",
      "shield"
    ]
  },
  {
    "id": "sweeping-wind",
    "name": "과당풍",
    "image": "/enemies/sweeping-wind.webp",
    "maxHp": 37,
    "attack": 11,
    "defense": 19,
    "speed": 97,
    "range": 7,
    "weight": 1,
    "staggerHp": 42,
    "intent": "기본 원거리 무기를 장착한 불법 무장 세력. 시력이 더 뛰어나고 손놀림도 더 능숙합니다. 화살 한 방이면 문을 부수고, 집 안을 휘젓고 다니며, 돈이 될 만한 ...",
    "faction": "청파채",
    "tier": "Normal",
    "traits": [
      "각종 화살을 발사하고 폭탄을 투척하여 원거리 견제 공격을 합니다."
    ],
    "mechanics": [
      "armored",
      "flame",
      "ranged",
      "evasive",
      "charge"
    ]
  },
  {
    "id": "tidalklast",
    "name": "파조의 상",
    "image": "/enemies/tidalklast.webp",
    "maxHp": 679,
    "attack": 43,
    "defense": 87,
    "speed": 90,
    "range": 2.8,
    "weight": 1.5,
    "staggerHp": 731,
    "intent": "'아나파크뤼단'(보관 번호: AGM32L), AGM321의 비모델 생물류입니다. 개체 크기는 일정하지 않으며, 대형 개체가 파도를 가르며 솟구쳐 오르는 모습은 ...",
    "faction": "침식체",
    "tier": "Boss",
    "traits": [
      "원거리와 근거리 두 가지 상태를 가지고 있습니다.",
      "근거리 상태: 목표에 접근하여 근거리 전투를 벌입니다.",
      "원거리 상태: 거리를 유지하며 더 강력한 능력으로 공격합니다.",
      "원거리 상태에서는 열기 피해를 더 많이 받지만, 다른 유형의 피해는 현저히 적게 받습니다."
    ],
    "mechanics": [
      "flame",
      "ranged",
      "poison",
      "cold",
      "healer",
      "boss-shield",
      "summoner",
      "revive"
    ],
    "elite": true,
    "boss": true
  },
  {
    "id": "tidewalker-delta",
    "name": "조류아겔로스 · δ",
    "image": "/enemies/tidewalker-delta.webp",
    "maxHp": 278,
    "attack": 31,
    "defense": 76,
    "speed": 89,
    "range": 2.8,
    "weight": 1.2,
    "staggerHp": 313,
    "intent": "'제나크뤼단 · 다이네든'(보관 번호: AGM321δ), AGM321의 격류종, 내부 구성 물질의 흐름이 격렬하고 밤에 마주치면 그 모습이 평소보다 훨씬 더 무...",
    "faction": "침식체",
    "tier": "Elite",
    "traits": [
      "냉기 부착이 있는 능력으로 공격하며, 명중 시 오퍼레이터를 동결시킵니다."
    ],
    "mechanics": [
      "cold",
      "poison",
      "healer",
      "summoner",
      "revive"
    ],
    "elite": true
  },
  {
    "id": "tidewalker",
    "name": "조류아겔로스",
    "image": "/enemies/tidewalker.webp",
    "maxHp": 310,
    "attack": 31,
    "defense": 76,
    "speed": 89,
    "range": 2.8,
    "weight": 1.2,
    "staggerHp": 349,
    "intent": "'제나크뤼단'(보관 번호: AGM321), 머리와 다리에는 인간과 닮은 특징이 있습니다. 이 형성 모델이 발견된 이후, 인간과 비슷한지가 아겔로스의 강함을 판단...",
    "faction": "침식체",
    "tier": "Elite",
    "traits": [
      "냉기 부착이 있는 능력으로 공격하며, 명중 시 오퍼레이터를 동결시킵니다."
    ],
    "mechanics": [
      "cold",
      "flame",
      "poison",
      "healer",
      "summoner",
      "revive"
    ],
    "elite": true
  },
  {
    "id": "triaggelos",
    "name": "트리아겔로스",
    "image": "/enemies/triaggelos.webp",
    "maxHp": 547,
    "attack": 41,
    "defense": 112,
    "speed": 88,
    "range": 12,
    "weight": 2,
    "staggerHp": 590,
    "intent": "미분류, 형성 특징으로 보아 아겔로스로 추정됩니다. 헤일로 형태의 변화는 판단 능력의 표현일 가능성이 있습니다. 경고, 앵커 속성이 있는 것으로 관찰됩니다.",
    "faction": "아겔로스",
    "tier": "Boss",
    "traits": [
      "세 가지 서로 다른 형태를 지니고 있습니다.",
      "강공 모드: 맹렬한 근거리 공격을 끊임없이 가합니다. 제때 적의 차지를 끊으면 해당 적에게 대량의 불균형치를 쌓을 수 있습니다.",
      "수색 모드: 수많은 아겔로스를 소환하여 함께 공격하고, 앵커의 충격파를 방출합니다.",
      "함정 모드: 몸을 숨기고 멀리서 탄막을 쏘거나 기습 공격을 합니다. 은신 상태를 깨뜨리면 대량의 불균형치를 쌓을 수 있습니다."
    ],
    "mechanics": [
      "boss-shield",
      "charge",
      "evasive",
      "flame",
      "ranged",
      "sniper",
      "summoner",
      "armored",
      "shield",
      "reflect"
    ],
    "elite": true,
    "boss": true
  },
  {
    "id": "tunneling-nidwyrm",
    "name": "터널링 니드웜",
    "image": "/enemies/tunneling-needworm.webp",
    "maxHp": 72,
    "attack": 13,
    "defense": 47,
    "speed": 91,
    "range": 12,
    "weight": 2,
    "staggerHp": 84,
    "intent": "강한 부식성 액체를 뿜어내는 야수, 대부분의 시간을 지하에 숨어 지냅니다. 산성 액체로 금속을 녹인 다음 삼켜버리는 게 습관입니다. 교전할 때는 무기가 상하지 ...",
    "faction": "광석수",
    "tier": "Enhanced",
    "traits": [
      "적이 분사하는 독액을 조심하세요.",
      "독액에 빠지면 지속적으로 자연 피해를 입습니다."
    ],
    "mechanics": [
      "acid",
      "armored",
      "poison",
      "ranged",
      "sniper",
      "charge",
      "enrage"
    ]
  },
  {
    "id": "walking-chrysopolis",
    "name": "결정아겔로스",
    "image": "/enemies/walking-chrysopolis.webp",
    "maxHp": 170,
    "attack": 24,
    "defense": 88,
    "speed": 88,
    "range": 2.8,
    "weight": 1.5,
    "staggerHp": 186,
    "intent": "'투리오론'(보관 번호: ACL156), 헤일로가 전면의 방패형 구조로 완전히 보호된 형성 모델, 에너지를 사용해 먼 거리에 있는 목표를 앞으로 끌어당길 수 있...",
    "faction": "아겔로스",
    "tier": "Alpha",
    "traits": [
      "결정아겔로스는 일반과 방벽 전개 두 가지 형태를 가지고 있습니다.",
      "일반 상태: 멀리 있는 오퍼레이터를 앞으로 끌어당기는 능력을 가지고 있습니다.",
      "방벽 전개 상태: 정면과 측면의 공격을 반사하지만, 동시에 등 뒤의 약점을 노출합니다."
    ],
    "mechanics": [
      "armored",
      "grab",
      "reflect",
      "shield",
      "sniper",
      "ranged",
      "boss-shield"
    ],
    "elite": true,
    "boss": true
  },
  {
    "id": "waterlamp",
    "name": "수등충",
    "image": "/enemies/waterlamp.webp",
    "maxHp": 44,
    "attack": 9,
    "defense": 28,
    "speed": 87,
    "range": 6,
    "weight": 1,
    "staggerHp": 50,
    "intent": "야생의 수생 곤충, 은은한 빛을 발산합니다. 복강 내의 자극성 체액은 피부 알레르기와 화상을 유발할 수 있으니 주의해서 상대해야 합니다.",
    "faction": "광석수",
    "tier": "Normal",
    "traits": [
      "머리에서 축적한 산성 액체를 내뿜습니다. 오퍼레이터에게 명중 시 방어력이 감소하며, 위협적으로 보이지 않더라도 주의해야 합니다."
    ],
    "mechanics": [
      "acid",
      "armored",
      "ranged",
      "charge",
      "enrage"
    ]
  }
];

export function getEnemy(id: string) {
  const enemy = enemies.find((item) => item.id === id);
  if (!enemy) throw new Error(`Unknown enemy: ${id}`);
  return enemy;
}

export function getEnemies(ids: string[]) {
  return ids.map(getEnemy);
}
