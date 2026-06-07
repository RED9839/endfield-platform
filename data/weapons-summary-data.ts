export type WeaponSummary = {
  slug: string;
  name: string;
  enName: string;
  rarity: 3 | 4 | 5 | 6;
  weaponType: string;
  image: string;
  series?: string;
};

export const weaponSummaries: WeaponSummary[] = [
  {
    "slug": "phantompain",
    "name": "환상통",
    "enName": "Phantom Pain",
    "rarity": 6,
    "weaponType": "greatsword",
    "image": "/weapons/phantompain.webp",
    "series": "억제"
  },
  {
    "slug": "beaconofduty",
    "name": "등불의 사명",
    "enName": "Beacon of Duty",
    "rarity": 6,
    "weaponType": "polearm",
    "image": "/weapons/beaconofduty.webp",
    "series": "효율"
  },
  {
    "slug": "amaranthinetassel",
    "name": "적영",
    "enName": "Amaranthine Tassel",
    "rarity": 6,
    "weaponType": "greatsword",
    "image": "/weapons/amaranthinetassel.webp",
    "series": "기예"
  },
  {
    "slug": "grandvision",
    "name": "장대한 염원",
    "enName": "Grand Vision",
    "rarity": 6,
    "weaponType": "sword",
    "image": "/weapons/grandvision.webp",
    "series": "고통"
  },
  {
    "slug": "whitenightnova",
    "name": "백야의 별",
    "enName": "White Night Nova",
    "rarity": 6,
    "weaponType": "sword",
    "image": "/weapons/whitenightnova.webp",
    "series": "고통"
  },
  {
    "slug": "forgebornscathe",
    "name": "용조의 불꽃",
    "enName": "Forgeborn Scathe",
    "rarity": 6,
    "weaponType": "sword",
    "image": "/weapons/forgebornscathe.webp",
    "series": "어둠"
  },
  {
    "slug": "rapidascent",
    "name": "부요",
    "enName": "Rapid Ascent",
    "rarity": 6,
    "weaponType": "sword",
    "image": "/weapons/rapidascent.webp",
    "series": "어둠"
  },
  {
    "slug": "umbraltorch",
    "name": "암흑의 횃불",
    "enName": "Umbral Torch",
    "rarity": 6,
    "weaponType": "sword",
    "image": "/weapons/umbraltorch.webp",
    "series": "고통"
  },
  {
    "slug": "thermitecutter",
    "name": "테르밋 커터",
    "enName": "Thermite Cutter",
    "rarity": 6,
    "weaponType": "sword",
    "image": "/weapons/thermitecutter.webp",
    "series": "흐름"
  },
  {
    "slug": "eminentrepute",
    "name": "위대한 이름",
    "enName": "Eminent Repute",
    "rarity": 6,
    "weaponType": "sword",
    "image": "/weapons/eminentrepute.webp",
    "series": "잔혹"
  },
  {
    "slug": "neverrest",
    "name": "끝없는 방랑",
    "enName": "Never Rest",
    "rarity": 6,
    "weaponType": "sword",
    "image": "/weapons/neverrest.webp",
    "series": "흐름"
  },
  {
    "slug": "gloriousmemory",
    "name": "찬란했던 기억",
    "enName": "Glorious Memory",
    "rarity": 6,
    "weaponType": "sword",
    "image": "/weapons/gloriousmemory.webp",
    "series": "어둠"
  },
  {
    "slug": "lupinescarlet",
    "name": "늑대의 혈흔",
    "enName": "Lupine Scarlet",
    "rarity": 6,
    "weaponType": "sword",
    "image": "/weapons/lupinescarlet.webp",
    "series": "골절"
  },
  {
    "slug": "objedgeoflightness",
    "name": "O.B.J. 엣지 오브 라이트",
    "enName": "OBJ Edge of Lightness",
    "rarity": 5,
    "weaponType": "sword",
    "image": "/weapons/objedgeoflightness.webp",
    "series": "흐름"
  },
  {
    "slug": "twelvequestions",
    "name": "십이문",
    "enName": "Twelve Questions",
    "rarity": 5,
    "weaponType": "sword",
    "image": "/weapons/twelvequestions.webp",
    "series": "고통"
  },
  {
    "slug": "finchaser30",
    "name": "린수를 찾아서 3.0",
    "enName": "Finchaser 3.0",
    "rarity": 5,
    "weaponType": "sword",
    "image": "/weapons/finchaser30.webp",
    "series": "억제"
  },
  {
    "slug": "sunderingsteel",
    "name": "강철의 여운",
    "enName": "Sundering Steel",
    "rarity": 5,
    "weaponType": "sword",
    "image": "/weapons/sunderingsteel.webp",
    "series": "기예"
  },
  {
    "slug": "fortmaker",
    "name": "불사의 성주",
    "enName": "Fortmaker",
    "rarity": 5,
    "weaponType": "sword",
    "image": "/weapons/fortmaker.webp",
    "series": "사기"
  },
  {
    "slug": "aspirant",
    "name": "숭배의 시선",
    "enName": "Aspirant",
    "rarity": 5,
    "weaponType": "sword",
    "image": "/weapons/aspirant.webp",
    "series": "어둠"
  },
  {
    "slug": "wavetide",
    "name": "거대한 격랑",
    "enName": "Wave Tide",
    "rarity": 4,
    "weaponType": "sword",
    "image": "/weapons/wavetide.webp",
    "series": "추격"
  },
  {
    "slug": "prominentedge",
    "name": "드러난 칼날",
    "enName": "Prominent Edge",
    "rarity": 4,
    "weaponType": "sword",
    "image": "/weapons/prominentedge.webp",
    "series": "억제"
  },
  {
    "slug": "tarr11",
    "name": "타르 11",
    "enName": "Tarr 11",
    "rarity": 3,
    "weaponType": "sword",
    "image": "/weapons/tarr11.webp",
    "series": "강공"
  },
  {
    "slug": "opusetchfigure",
    "name": "작품: 침식 흔적",
    "enName": "Opus: Etch Figure",
    "rarity": 6,
    "weaponType": "artsunit",
    "image": "/weapons/opusetchfigure.webp",
    "series": "억제"
  },
  {
    "slug": "detonationunit",
    "name": "폭발 유닛",
    "enName": "Detonation Unit",
    "rarity": 6,
    "weaponType": "artsunit",
    "image": "/weapons/detonationunit.webp",
    "series": "방출"
  },
  {
    "slug": "oblivion",
    "name": "망각",
    "enName": "Oblivion",
    "rarity": 6,
    "weaponType": "artsunit",
    "image": "/weapons/oblivion.webp",
    "series": "어둠"
  },
  {
    "slug": "chivalricvirtues",
    "name": "기사도 정신",
    "enName": "Chivalric Virtues",
    "rarity": 6,
    "weaponType": "artsunit",
    "image": "/weapons/chivalricvirtues.webp",
    "series": "의료"
  },
  {
    "slug": "deliveryguaranteed",
    "name": "사명의 길",
    "enName": "Delivery Guaranteed",
    "rarity": 6,
    "weaponType": "artsunit",
    "image": "/weapons/deliveryguaranteed.webp",
    "series": "추격"
  },
  {
    "slug": "dreamsofthestarrybeach",
    "name": "바다와 별의 꿈",
    "enName": "Dreams of the Starry Beach",
    "rarity": 6,
    "weaponType": "artsunit",
    "image": "/weapons/dreamsofthestarrybeach.webp",
    "series": "고통"
  },
  {
    "slug": "monaihe",
    "name": "무가내하",
    "enName": "Monaihe",
    "rarity": 5,
    "weaponType": "artsunit",
    "image": "/weapons/monaihe.webp",
    "series": "사기"
  },
  {
    "slug": "wildwanderer",
    "name": "황무지의 방랑자",
    "enName": "Wild Wanderer",
    "rarity": 5,
    "weaponType": "artsunit",
    "image": "/weapons/wildwanderer.webp",
    "series": "고통"
  },
  {
    "slug": "stanzaofmemorials",
    "name": "망자의 노래",
    "enName": "Stanza of Memorials",
    "rarity": 5,
    "weaponType": "artsunit",
    "image": "/weapons/stanzaofmemorials.webp",
    "series": "어둠"
  },
  {
    "slug": "freedomtoproselytize",
    "name": "교의 자유",
    "enName": "Freedom to Proselytize",
    "rarity": 5,
    "weaponType": "artsunit",
    "image": "/weapons/freedomtoproselytize.webp",
    "series": "의료"
  },
  {
    "slug": "objartsidentifier",
    "name": "O.B.J. 아츠 아이덴티티",
    "enName": "OBJ Arts Identifier",
    "rarity": 5,
    "weaponType": "artsunit",
    "image": "/weapons/objartsidentifier.webp",
    "series": "추격"
  },
  {
    "slug": "fluorescentroc",
    "name": "섬광 번개",
    "enName": "Fluorescent Roc",
    "rarity": 4,
    "weaponType": "artsunit",
    "image": "/weapons/fluorescentroc.webp",
    "series": "억제"
  },
  {
    "slug": "hypernovaauto",
    "name": "오토 하이퍼노바",
    "enName": "Hypernova Auto",
    "rarity": 4,
    "weaponType": "artsunit",
    "image": "/weapons/hypernovaauto.webp",
    "series": "사기"
  },
  {
    "slug": "jiminy12",
    "name": "지미니 12",
    "enName": "Jiminy 12",
    "rarity": 3,
    "weaponType": "artsunit",
    "image": "/weapons/jiminy12.webp",
    "series": "강공"
  },
  {
    "slug": "exemplar",
    "name": "모범",
    "enName": "Exemplar",
    "rarity": 6,
    "weaponType": "greatsword",
    "image": "/weapons/exemplar.webp",
    "series": "억제"
  },
  {
    "slug": "formerfinery",
    "name": "과거의 일품",
    "enName": "Former Finery",
    "rarity": 6,
    "weaponType": "greatsword",
    "image": "/weapons/formerfinery.webp",
    "series": "효율"
  },
  {
    "slug": "thunderberge",
    "name": "천둥의 흔적",
    "enName": "Thunderberge",
    "rarity": 6,
    "weaponType": "greatsword",
    "image": "/weapons/thunderberge.webp",
    "series": "의료"
  },
  {
    "slug": "sunderedprince",
    "name": "분쇄의 군주",
    "enName": "Sundered Prince",
    "rarity": 6,
    "weaponType": "greatsword",
    "image": "/weapons/sunderedprince.webp",
    "series": "분쇄"
  },
  {
    "slug": "khravengger",
    "name": "헤라펜거",
    "enName": "Khravengger",
    "rarity": 6,
    "weaponType": "greatsword",
    "image": "/weapons/khravengger.webp",
    "series": "방출"
  },
  {
    "slug": "finishingcall",
    "name": "최후의 메아리",
    "enName": "Finishing Call",
    "rarity": 5,
    "weaponType": "greatsword",
    "image": "/weapons/finishingcall.webp",
    "series": "의료"
  },
  {
    "slug": "seekerofdarklung",
    "name": "검은 추적자",
    "enName": "Seeker of Dark Lung",
    "rarity": 5,
    "weaponType": "greatsword",
    "image": "/weapons/seekerofdarklung.webp",
    "series": "방출"
  },
  {
    "slug": "ancientcanal",
    "name": "고대의 강줄기",
    "enName": "Ancient Canal",
    "rarity": 5,
    "weaponType": "greatsword",
    "image": "/weapons/ancientcanal.webp",
    "series": "잔혹"
  },
  {
    "slug": "objheavyburden",
    "name": "O.B.J. 헤비 버든",
    "enName": "OBJ Heavy Burden",
    "rarity": 5,
    "weaponType": "greatsword",
    "image": "/weapons/objheavyburden.webp",
    "series": "효율"
  },
  {
    "slug": "industry01",
    "name": "공업 0.1",
    "enName": "Industry 0.1",
    "rarity": 4,
    "weaponType": "greatsword",
    "image": "/weapons/industry01.webp",
    "series": "억제"
  },
  {
    "slug": "quencher",
    "name": "불꽃의 시험",
    "enName": "Quencher",
    "rarity": 4,
    "weaponType": "greatsword",
    "image": "/weapons/quencher.webp",
    "series": "분쇄"
  },
  {
    "slug": "darhoff7",
    "name": "다호프 7",
    "enName": "Darhoff 7",
    "rarity": 3,
    "weaponType": "greatsword",
    "image": "/weapons/darhoff7.webp",
    "series": "강공"
  },
  {
    "slug": "jet",
    "name": "J.E.T.",
    "enName": "JET",
    "rarity": 6,
    "weaponType": "polearm",
    "image": "/weapons/jet.webp",
    "series": "억제"
  },
  {
    "slug": "valiant",
    "name": "용사",
    "enName": "Valiant",
    "rarity": 6,
    "weaponType": "polearm",
    "image": "/weapons/valiant.webp",
    "series": "기예"
  },
  {
    "slug": "mountainbearer",
    "name": "산의 지배자",
    "enName": "Mountain Bearer",
    "rarity": 6,
    "weaponType": "polearm",
    "image": "/weapons/mountainbearer.webp",
    "series": "효율"
  },
  {
    "slug": "chimericjustice",
    "name": "키메라의 정의",
    "enName": "Chimeric Justice",
    "rarity": 5,
    "weaponType": "polearm",
    "image": "/weapons/chimericjustice.webp",
    "series": "잔혹"
  },
  {
    "slug": "cohesivetraction",
    "name": "중심력",
    "enName": "Cohesive Traction",
    "rarity": 5,
    "weaponType": "polearm",
    "image": "/weapons/cohesivetraction.webp",
    "series": "억제"
  },
  {
    "slug": "objrazorhorn",
    "name": "O.B.J. 스파이크",
    "enName": "OBJ Razorhorn",
    "rarity": 5,
    "weaponType": "polearm",
    "image": "/weapons/objrazorhorn.webp",
    "series": "고통"
  },
  {
    "slug": "pathfindersbeacon",
    "name": "개척자의 이정표",
    "enName": "Pathfinder's Beacon",
    "rarity": 4,
    "weaponType": "polearm",
    "image": "/weapons/pathfindersbeacon.webp",
    "series": "사기"
  },
  {
    "slug": "aggeloslayer",
    "name": "아겔로스 사냥꾼",
    "enName": "Aggeloslayer",
    "rarity": 4,
    "weaponType": "polearm",
    "image": "/weapons/aggeloslayer.webp",
    "series": "억제"
  },
  {
    "slug": "opero77",
    "name": "오페로 77",
    "enName": "Opero 77",
    "rarity": 3,
    "weaponType": "polearm",
    "image": "/weapons/opero77.webp",
    "series": "강공"
  },
  {
    "slug": "homelonging",
    "name": "향수",
    "enName": "Home Longing",
    "rarity": 6,
    "weaponType": "handcannon",
    "image": "/weapons/homelonging.webp",
    "series": "억제"
  },
  {
    "slug": "wedge",
    "name": "쐐기",
    "enName": "Wedge",
    "rarity": 6,
    "weaponType": "handcannon",
    "image": "/weapons/wedge.webp",
    "series": "고통"
  },
  {
    "slug": "navigator",
    "name": "항로의 개척자",
    "enName": "Navigator",
    "rarity": 6,
    "weaponType": "handcannon",
    "image": "/weapons/navigator.webp",
    "series": "고통"
  },
  {
    "slug": "clannibal",
    "name": "클래니벌",
    "enName": "Clannibal",
    "rarity": 6,
    "weaponType": "handcannon",
    "image": "/weapons/clannibal.webp",
    "series": "고통"
  },
  {
    "slug": "artzytyrannical",
    "name": "예술의 폭군",
    "enName": "Artzy Tyrannical",
    "rarity": 6,
    "weaponType": "handcannon",
    "image": "/weapons/artzytyrannical.webp",
    "series": "골절"
  },
  {
    "slug": "brigandscalling",
    "name": "반항",
    "enName": "Brigand's Calling",
    "rarity": 6,
    "weaponType": "handcannon",
    "image": "/weapons/brigandscalling.webp",
    "series": "방출"
  },
  {
    "slug": "objvelocitous",
    "name": "O.B.J. 벨로시투스",
    "enName": "OBJ Velocitous",
    "rarity": 5,
    "weaponType": "handcannon",
    "image": "/weapons/objvelocitous.webp",
    "series": "방출"
  },
  {
    "slug": "rationalfarewell",
    "name": "이성적인 작별",
    "enName": "Rational Farewell",
    "rarity": 5,
    "weaponType": "handcannon",
    "image": "/weapons/rationalfarewell.webp",
    "series": "추격"
  },
  {
    "slug": "opustheliving",
    "name": "작품: 중생",
    "enName": "Opus: The Living",
    "rarity": 5,
    "weaponType": "handcannon",
    "image": "/weapons/opustheliving.webp",
    "series": "고통"
  },
  {
    "slug": "howlingguard",
    "name": "하울링 가드",
    "enName": "Howling Guard",
    "rarity": 4,
    "weaponType": "handcannon",
    "image": "/weapons/howlingguard.webp",
    "series": "억제"
  },
  {
    "slug": "longroad",
    "name": "끝없는 여정",
    "enName": "Long Road",
    "rarity": 4,
    "weaponType": "handcannon",
    "image": "/weapons/longroad.webp",
    "series": "추격"
  },
  {
    "slug": "peco5",
    "name": "페코 5",
    "enName": "Peco 5",
    "rarity": 3,
    "weaponType": "handcannon",
    "image": "/weapons/peco5.webp",
    "series": "강공"
  },
  {
    "slug": "lonebarge",
    "name": "고독한 나룻배",
    "enName": "Lone Barge",
    "rarity": 6,
    "weaponType": "artsunit",
    "image": "/weapons/lonebarge.webp",
    "series": "억제 · 떠도는 번개"
  },
  {
    "slug": "flickersinthemist",
    "name": "안개 속 불빛",
    "enName": "Flickers in the Mist",
    "rarity": 6,
    "weaponType": "artsunit",
    "image": "/weapons/flickersinthemist.webp",
    "series": "효율 · 중첩된 빛"
  }
];
