import { existsSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const sourceDir = join(root, "data", "enemies-source");
const outFile = join(root, "app", "game", "data", "enemies.ts");
const publicDir = join(root, "public", "enemies");

function clamp(min: number, value: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function oneLine(text: unknown, max = 92) {
  const cleaned = String(text ?? "").replace(/\s+/g, " ").trim();
  return cleaned.length > max ? `${cleaned.slice(0, max - 3)}...` : cleaned;
}

function findEnemy(value: unknown, seen = new Set<unknown>()): Record<string, any> | undefined {
  if (!value || typeof value !== "object" || seen.has(value)) return undefined;
  seen.add(value);
  const item = value as Record<string, any>;
  if (typeof item.slug === "string" && item.summaryStats && item.battleStats) return item;
  for (const child of Object.values(item)) {
    const found = findEnemy(child, seen);
    if (found) return found;
  }
  return undefined;
}

function imagePath(slug: string) {
  const legacy: Record<string, string> = {
    "bonekrusher-executioner": "bonecrusher-executioner",
    "tunneling-nidwyrm": "tunneling-needworm",
  };
  const name = legacy[slug] ?? slug;
  if (existsSync(join(publicDir, `${name}.webp`))) return `/enemies/${name}.webp`;
  return `/enemies/${slug}.webp`;
}

function hasAny(text: string, words: string[]) {
  return words.some((word) => text.includes(word));
}

function inferMechanics(enemy: Record<string, any>) {
  const text = [enemy.description, ...(enemy.traits ?? [])].join(" ").toLowerCase();
  const mechanics = new Set<string>();
  const range = Number(enemy.battleStats?.attackRange ?? 2.5);
  const tier = String(enemy.tier ?? "").toLowerCase();

  if (range >= 6 || hasAny(text, ["원거리", "발사", "투척", "화살", "쇠뇌", "포격", "탄막", "공중", "날아", "비행"])) mechanics.add("ranged");
  if (range >= 10 || hasAny(text, ["저격", "화살비", "멀리", "장거리", "포격", "대포", "쇠뇌"])) mechanics.add("sniper");
  if (hasAny(text, ["껍질", "방어", "보호", "단단", "갑옷", "무장", "기둥으로 보호"])) mechanics.add("armored");
  if (hasAny(text, ["방패", "가드", "보호막", "받는 피해가 크게 감소", "피해가 크게 감소"])) mechanics.add("shield");
  if (hasAny(text, ["반사"])) mechanics.add("reflect");
  if (hasAny(text, ["화염", "불", "열기", "용암", "안갯불", "불태", "연소"])) mechanics.add("flame");
  if (hasAny(text, ["산성", "부식성", "산액"])) mechanics.add("acid");
  if (hasAny(text, ["독액", "독성", "중독"])) mechanics.add("poison");
  if (hasAny(text, ["냉기", "동결", "얼음", "빙결", "추위"])) mechanics.add("cold");
  if (hasAny(text, ["감전", "전기", "전류", "번개"])) mechanics.add("shock");
  if (hasAny(text, ["민첩", "회피", "은신", "순간이동", "빠르게", "이동 속도"])) mechanics.add("evasive");
  if (hasAny(text, ["차지", "돌진", "들이받", "도약", "강력한 일격", "2단계", "강공격"])) mechanics.add("charge");
  if (hasAny(text, ["분노", "격노", "광폭", "체력이 낮", "체력 낮"])) mechanics.add("enrage");
  if (hasAny(text, ["잡기", "붙잡", "구출", "끌어당"])) mechanics.add("grab");
  if (hasAny(text, ["속박", "행동 불가", "가두", "묶", "결박"])) mechanics.add("bind");
  if (hasAny(text, ["자폭", "폭발", "터뜨", "불안정", "폭발성"])) mechanics.add("self-destruct");
  if (hasAny(text, ["부활", "되살아", "재생"])) mechanics.add("revive");
  if (hasAny(text, ["연기", "시야", "감속", "연막", "구름"])) mechanics.add("smoke");
  if (hasAny(text, ["치유", "회복", "치료"])) mechanics.add("healer");
  if (hasAny(text, ["소환", "부속체", "앵커", "분신", "생성"])) mechanics.add("summoner");
  if (hasAny(text, ["낙석", "바위", "돌기둥", "기둥", "암석", "떨어뜨"])) mechanics.add("rockfall");
  if (tier === "boss" || hasAny(text, ["보스", "거대", "제압", "핵심", "코어"])) mechanics.add("boss-shield");

  if (mechanics.size === 0) mechanics.add("none");
  return Array.from(mechanics).sort();
}

function hpScale(tier: string) {
  if (tier === "Boss") return 0.95;
  if (tier === "Elite") return 0.62;
  if (["Advanced", "Enhanced", "Alpha"].includes(tier)) return 0.48;
  return 0.58;
}

function attackScale(tier: string) {
  if (tier === "Boss") return 0.75;
  if (tier === "Elite") return 0.55;
  if (["Advanced", "Enhanced", "Alpha"].includes(tier)) return 0.48;
  return 0.42;
}

function buildStats(enemy: Record<string, any>, mechanics: string[]) {
  const tier = String(enemy.tier ?? "Normal");
  const hp40 = Number(enemy.summaryStats?.hp?.level40 ?? 7000);
  const atk40 = Number(enemy.summaryStats?.attack?.level40 ?? 400);
  const def40 = Number(enemy.summaryStats?.defense?.level40 ?? 100);
  const range = Number(enemy.battleStats?.attackRange ?? 2.5);
  const weight = Number(enemy.battleStats?.weight ?? 1);
  const staggerHp = Number(enemy.battleStats?.staggerHp ?? 60);
  let maxHp = Math.round(Math.sqrt(hp40) * hpScale(tier));
  let attack = Math.round(Math.sqrt(atk40) * attackScale(tier));
  let speed = Math.round(104 - weight * 8 + (range <= 2.5 ? 3 : range >= 10 ? -8 : 0));

  if (mechanics.includes("evasive")) speed += 7;
  if (mechanics.includes("charge")) speed += 3;
  if (mechanics.includes("armored") || mechanics.includes("shield")) speed -= 4;
  if (mechanics.includes("sniper")) attack += 2;
  if (mechanics.includes("boss-shield")) maxHp += 25;
  if (tier === "Boss") attack += 2;

  return {
    maxHp: clamp(38, maxHp, tier === "Boss" ? 360 : tier === "Elite" ? 190 : 120),
    attack: clamp(6, attack, tier === "Boss" ? 28 : tier === "Elite" ? 22 : 16),
    defense: clamp(0, Math.round(def40 / 20), 25),
    speed: clamp(68, speed, 116),
    range,
    weight,
    staggerHp,
  };
}

const enemies: Record<string, unknown>[] = [];
const files = readdirSync(sourceDir).filter((file) => file.endsWith(".ts")).sort();

async function main() {
  for (const file of files) {
    const mod = await import(pathToFileURL(join(sourceDir, file)).href);
    const enemy = findEnemy(mod);
    if (!enemy) throw new Error(`No enemy export in ${file}`);

    const mechanics = inferMechanics(enemy);
    const stats = buildStats(enemy, mechanics);
    const tier = String(enemy.tier ?? "Normal");
    const boss = tier === "Boss" || ["tidalklast", "walking-chrysopolis"].includes(enemy.slug);
    const elite = boss || tier === "Elite";

    enemies.push({
      id: enemy.slug,
      name: enemy.name,
      image: imagePath(enemy.slug),
      ...stats,
      intent: oneLine(enemy.description),
      faction: enemy.faction,
      tier,
      traits: (enemy.traits ?? []).map((trait: string) => oneLine(trait, 120)),
      mechanics,
      ...(elite ? { elite: true } : {}),
      ...(boss ? { boss: true } : {}),
    });
  }

  const output = `import type { Enemy } from "../types/game";\n\nexport const enemies: Enemy[] = ${JSON.stringify(enemies, null, 2)};\n\nexport function getEnemy(id: string) {\n  const enemy = enemies.find((item) => item.id === id);\n  if (!enemy) throw new Error(\`Unknown enemy: \${id}\`);\n  return enemy;\n}\n\nexport function getEnemies(ids: string[]) {\n  return ids.map(getEnemy);\n}\n`;

  writeFileSync(outFile, output, "utf8");
  console.log(`Generated ${enemies.length} enemies`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
