export type FarmingTransferMaterial = {
  name: string;
  amount: number;
};

export type FarmingTransferPayload = {
  requiredMaterials: FarmingTransferMaterial[];
  ownedMaterials: FarmingTransferMaterial[];
};

export const FARMING_TRANSFER_STORAGE_KEY = "endfield:farming-transfer";

export function safeFarmingMaterials(items: unknown): FarmingTransferMaterial[] {
  if (!Array.isArray(items)) return [];

  return items
    .map((item: any) => ({
      name: String(item?.name ?? item?.material ?? "").trim(),
      amount: Number(item?.amount ?? item?.owned ?? item?.value ?? item?.count ?? 0),
    }))
    .filter(
      (item) =>
        item.name.length > 0 &&
        Number.isFinite(item.amount) &&
        item.amount > 0
    );
}

export function saveFarmingTransferPayload(payload: FarmingTransferPayload) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(
    FARMING_TRANSFER_STORAGE_KEY,
    JSON.stringify({
      requiredMaterials: safeFarmingMaterials(payload.requiredMaterials),
      ownedMaterials: safeFarmingMaterials(payload.ownedMaterials),
    })
  );
}

export function buildFarmingHref(payload: FarmingTransferPayload) {
  const safePayload = {
    requiredMaterials: safeFarmingMaterials(payload.requiredMaterials),
    ownedMaterials: safeFarmingMaterials(payload.ownedMaterials),
  };

  if (typeof window !== "undefined") {
    saveFarmingTransferPayload(safePayload);
  }

  const params = new URLSearchParams();
  params.set("requiredMaterials", JSON.stringify(safePayload.requiredMaterials));
  params.set("ownedMaterials", JSON.stringify(safePayload.ownedMaterials));

  return `/farming?${params.toString()}`;
}

export function readFarmingTransferFromStorage(): FarmingTransferPayload | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(FARMING_TRANSFER_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<FarmingTransferPayload>;

    return {
      requiredMaterials: safeFarmingMaterials(parsed.requiredMaterials),
      ownedMaterials: safeFarmingMaterials(parsed.ownedMaterials),
    };
  } catch {
    return null;
  }
}

export function readFarmingTransferFromUrl(
  searchParams: URLSearchParams
): FarmingTransferPayload {
  function parseParam(key: string): FarmingTransferMaterial[] {
    try {
      const raw = searchParams.get(key);
      if (!raw) return [];
      return safeFarmingMaterials(JSON.parse(raw));
    } catch {
      return [];
    }
  }

  return {
    requiredMaterials: parseParam("requiredMaterials"),
    ownedMaterials: parseParam("ownedMaterials"),
  };
}

export function clearFarmingTransferStorage() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(FARMING_TRANSFER_STORAGE_KEY);
}
