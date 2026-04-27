const fs = require("fs");

const path = "E:/endfield-platform/app/simulator/page.tsx";
let content = fs.readFileSync(path, "utf8");

content = content.replace(
  /export default function SimulatorPage\(\) \{\s*const router = useRouter\(\);\s*return items[\s\S]*?const searchParams = useSearchParams\(\);/,
  `export default function SimulatorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function resetSimulatorAndGoHome() {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("endfield:simulator-selection");
      window.sessionStorage.removeItem("endfield:simulator-selection");
      window.localStorage.removeItem("endfield:farming-transfer");
      window.localStorage.removeItem("endfield:farming-page-state");
      window.sessionStorage.removeItem(SIMULATOR_OPERATOR_STORAGE_KEY);
      window.sessionStorage.removeItem(SIMULATOR_WEAPON_STORAGE_KEY);
    }

    router.push("/");
  }`
);

content = content.replace(
  /function handleGoFarmingCalculator\(\) \{\s*const requiredMaterials = normalizeFarmingMaterialList\(\s*\[\]\s*\);\s*const ownedMaterialsForFarming = normalizeOwnedMaterialsForFarming\(ownedMaterials\);\s*const payload = \{\s*requiredMaterials,\s*ownedMaterials: ownedMaterialsForFarming,\s*\};\s*saveFarmingTransferPayload\(payload\);\s*router\.push\(buildFarmingHref\(payload\)\);\s*\}/,
  `function handleGoFarmingCalculator() {
    const requiredMaterials = normalizeFarmingMaterialList(
      combinedMaterialDeficitItems
        .filter((item) => Number(item.lacking ?? 0) > 0)
        .map((item) => ({
          name: item.name,
          amount: Number(item.lacking ?? 0),
        }))
    );

    const ownedMaterialsForFarming =
      normalizeOwnedMaterialsForFarming(ownedMaterials);

    const payload = {
      requiredMaterials,
      ownedMaterials: ownedMaterialsForFarming,
    };

    saveFarmingTransferPayload(payload);
    router.push(buildFarmingHref(payload));
  }`
);

fs.writeFileSync(path, content, "utf8");
console.log("simulator page patched");