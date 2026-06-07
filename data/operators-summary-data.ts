export type OperatorSummary = {
  slug: string;
  name: string;
  enName: string;
  rarity: 4 | 5 | 6;
  element: "physical" | "cryo" | "heat" | "nature" | "electric";
  class: "vanguard" | "guard" | "defender" | "supporter" | "caster" | "striker";
  weapon: "sword" | "greatsword" | "polearm" | "handcannon" | "artsunit";
  avatar: string;
  avatarSecondary?: string;
};

export const operatorSummaries: OperatorSummary[] = [
  {
    "slug": "rossi",
    "name": "로시",
    "enName": "Rossi",
    "rarity": 6,
    "element": "physical",
    "class": "guard",
    "weapon": "sword",
    "avatar": "/operators/rossi/avatar.webp"
  },
  {
    "slug": "tangtang",
    "name": "탕탕",
    "enName": "Tangtang",
    "rarity": 6,
    "element": "cryo",
    "class": "caster",
    "weapon": "handcannon",
    "avatar": "/operators/tangtang/avatar.webp"
  },
  {
    "slug": "lifeng",
    "name": "여풍",
    "enName": "Lifeng",
    "rarity": 6,
    "element": "physical",
    "class": "guard",
    "weapon": "polearm",
    "avatar": "/operators/lifeng/avatar.webp"
  },
  {
    "slug": "ember",
    "name": "엠버",
    "enName": "Ember",
    "rarity": 6,
    "element": "heat",
    "class": "defender",
    "weapon": "greatsword",
    "avatar": "/operators/ember/avatar.webp"
  },
  {
    "slug": "gilberta",
    "name": "질베르타",
    "enName": "Gilberta",
    "rarity": 6,
    "element": "nature",
    "class": "supporter",
    "weapon": "artsunit",
    "avatar": "/operators/gilberta/avatar.webp"
  },
  {
    "slug": "ardelia",
    "name": "아델리아",
    "enName": "Ardelia",
    "rarity": 6,
    "element": "nature",
    "class": "supporter",
    "weapon": "artsunit",
    "avatar": "/operators/ardelia/avatar.webp"
  },
  {
    "slug": "pogranichnik",
    "name": "포그라니치니크",
    "enName": "Pogranichnik",
    "rarity": 6,
    "element": "physical",
    "class": "vanguard",
    "weapon": "sword",
    "avatar": "/operators/pogranichnik/avatar.webp"
  },
  {
    "slug": "laevatain",
    "name": "레바테인",
    "enName": "Laevatain",
    "rarity": 6,
    "element": "heat",
    "class": "striker",
    "weapon": "sword",
    "avatar": "/operators/laevatain/avatar.webp"
  },
  {
    "slug": "yvonne",
    "name": "이본",
    "enName": "Yvonne",
    "rarity": 6,
    "element": "cryo",
    "class": "striker",
    "weapon": "handcannon",
    "avatar": "/operators/yvonne/avatar.webp"
  },
  {
    "slug": "lastrite",
    "name": "라스트 라이트",
    "enName": "Last Rite",
    "rarity": 6,
    "element": "cryo",
    "class": "striker",
    "weapon": "greatsword",
    "avatar": "/operators/lastrite/avatar.webp"
  },
  {
    "slug": "chenqianyu",
    "name": "진천우",
    "enName": "Chen Qianyu",
    "rarity": 5,
    "element": "physical",
    "class": "guard",
    "weapon": "sword",
    "avatar": "/operators/chenqianyu/avatar.webp"
  },
  {
    "slug": "snowshine",
    "name": "스노우샤인",
    "enName": "Snowshine",
    "rarity": 5,
    "element": "cryo",
    "class": "defender",
    "weapon": "greatsword",
    "avatar": "/operators/snowshine/avatar.webp"
  },
  {
    "slug": "xaihi",
    "name": "자이히",
    "enName": "Xaihi",
    "rarity": 5,
    "element": "cryo",
    "class": "supporter",
    "weapon": "artsunit",
    "avatar": "/operators/xaihi/avatar.webp"
  },
  {
    "slug": "perlica",
    "name": "펠리카",
    "enName": "Perlica",
    "rarity": 5,
    "element": "electric",
    "class": "caster",
    "weapon": "artsunit",
    "avatar": "/operators/perlica/avatar.webp"
  },
  {
    "slug": "wulfgard",
    "name": "울프가드",
    "enName": "Wulfgard",
    "rarity": 5,
    "element": "heat",
    "class": "caster",
    "weapon": "handcannon",
    "avatar": "/operators/wulfgard/avatar.webp"
  },
  {
    "slug": "arclight",
    "name": "아크라이트",
    "enName": "Arclight",
    "rarity": 5,
    "element": "electric",
    "class": "vanguard",
    "weapon": "sword",
    "avatar": "/operators/arclight/avatar.webp"
  },
  {
    "slug": "alesh",
    "name": "알레쉬",
    "enName": "Alesh",
    "rarity": 5,
    "element": "cryo",
    "class": "vanguard",
    "weapon": "sword",
    "avatar": "/operators/alesh/avatar.webp"
  },
  {
    "slug": "avywenna",
    "name": "아비웨나",
    "enName": "Avywenna",
    "rarity": 5,
    "element": "electric",
    "class": "striker",
    "weapon": "polearm",
    "avatar": "/operators/avywenna/avatar.webp"
  },
  {
    "slug": "dapan",
    "name": "판",
    "enName": "Da Pan",
    "rarity": 5,
    "element": "physical",
    "class": "striker",
    "weapon": "greatsword",
    "avatar": "/operators/dapan/avatar.webp"
  },
  {
    "slug": "estella",
    "name": "에스텔라",
    "enName": "Estella",
    "rarity": 4,
    "element": "cryo",
    "class": "guard",
    "weapon": "polearm",
    "avatar": "/operators/estella/avatar.webp"
  },
  {
    "slug": "catcher",
    "name": "카치르",
    "enName": "Catcher",
    "rarity": 4,
    "element": "physical",
    "class": "defender",
    "weapon": "greatsword",
    "avatar": "/operators/catcher/avatar.webp"
  },
  {
    "slug": "antal",
    "name": "안탈",
    "enName": "Antal",
    "rarity": 4,
    "element": "electric",
    "class": "supporter",
    "weapon": "artsunit",
    "avatar": "/operators/antal/avatar.webp"
  },
  {
    "slug": "fluorite",
    "name": "플루라이트",
    "enName": "Fluorite",
    "rarity": 4,
    "element": "nature",
    "class": "caster",
    "weapon": "handcannon",
    "avatar": "/operators/fluorite/avatar.webp"
  },
  {
    "slug": "akekuri",
    "name": "아케쿠리",
    "enName": "Akekuri",
    "rarity": 4,
    "element": "heat",
    "class": "vanguard",
    "weapon": "sword",
    "avatar": "/operators/akekuri/avatar.webp"
  },
  {
    "slug": "endministrator",
    "name": "관리자",
    "enName": "Endministrator",
    "rarity": 6,
    "element": "physical",
    "class": "guard",
    "weapon": "sword",
    "avatar": "/operators/endministrator/avatar1.webp",
    "avatarSecondary": "/operators/endministrator/avatar2.webp"
  },
  {
    "slug": "zhuangfangyi",
    "name": "장방이",
    "enName": "Zhuang Fangyi",
    "rarity": 6,
    "element": "electric",
    "class": "striker",
    "weapon": "artsunit",
    "avatar": "/operators/zhuangfangyi/avatar.webp"
  },
  {
    "slug": "mifu",
    "name": "미브",
    "enName": "Mifu",
    "rarity": 6,
    "element": "physical",
    "class": "guard",
    "weapon": "greatsword",
    "avatar": "/operators/mifu/avatar.webp"
  }
];
