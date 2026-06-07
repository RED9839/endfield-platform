"use client";

import { useEffect, useMemo, useState } from "react";

export type SettingEditorData = {
  operators: any[];
  weapons: any[];
  gears: any[];
};

const EMPTY_DATA: SettingEditorData = {
  operators: [],
  weapons: [],
  gears: [],
};

let catalogPromise: Promise<SettingEditorData> | null = null;
const detailPromises = new Map<string, Promise<SettingEditorData>>();
const MAX_DETAIL_CACHE_ENTRIES = 24;

function normalizeSlugs(slugs: string[]) {
  return Array.from(
    new Set(
      slugs
        .map((slug) => String(slug ?? "").trim())
        .filter(Boolean),
    ),
  ).sort();
}

async function fetchEditorData(url: string) {
  const response = await fetch(url).catch(() => null);
  const data = await response?.json().catch(() => null);

  if (!response?.ok || !data?.ok) return EMPTY_DATA;

  return {
    operators: Array.isArray(data.operators) ? data.operators : [],
    weapons: Array.isArray(data.weapons) ? data.weapons : [],
    gears: Array.isArray(data.gears) ? data.gears : [],
  };
}

function loadCatalog() {
  catalogPromise ??= fetchEditorData("/api/settings/editor-data");
  return catalogPromise;
}

function loadDetails(key: string, url: string) {
  const cached = detailPromises.get(key);
  if (cached) {
    detailPromises.delete(key);
    detailPromises.set(key, cached);
    return cached;
  }

  const request = fetchEditorData(url).catch(() => EMPTY_DATA);
  detailPromises.set(key, request);

  if (detailPromises.size > MAX_DETAIL_CACHE_ENTRIES) {
    const oldestKey = detailPromises.keys().next().value;
    if (oldestKey) detailPromises.delete(oldestKey);
  }

  return request;
}

export function useSettingEditorData({
  operatorSlugs,
  weaponSlugs,
  gearSlugs,
}: {
  operatorSlugs: string[];
  weaponSlugs: string[];
  gearSlugs: string[];
}) {
  const [catalog, setCatalog] = useState<SettingEditorData | null>(null);
  const [details, setDetails] = useState<SettingEditorData>(EMPTY_DATA);
  const normalizedOperatorSlugs = useMemo(
    () => normalizeSlugs(operatorSlugs),
    [operatorSlugs],
  );
  const normalizedWeaponSlugs = useMemo(
    () => normalizeSlugs(weaponSlugs),
    [weaponSlugs],
  );
  const normalizedGearSlugs = useMemo(
    () => normalizeSlugs(gearSlugs),
    [gearSlugs],
  );
  const detailKey = useMemo(
    () =>
      [
        normalizedOperatorSlugs.join(","),
        normalizedWeaponSlugs.join(","),
        normalizedGearSlugs.join(","),
      ].join("|"),
    [normalizedGearSlugs, normalizedOperatorSlugs, normalizedWeaponSlugs],
  );

  useEffect(() => {
    let active = true;

    loadCatalog().then((data) => {
      if (active) setCatalog(data);
    });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!detailKey.replaceAll("|", "")) {
      setDetails(EMPTY_DATA);
      return;
    }

    let active = true;
    const [operators, weapons, gears] = detailKey.split("|");
    const params = new URLSearchParams({ operators, weapons, gears });

    loadDetails(
      detailKey,
      `/api/settings/editor-detail?${params.toString()}`,
    ).then((data) => {
      if (active) setDetails(data);
    });

    return () => {
      active = false;
    };
  }, [detailKey]);

  return {
    editorData: catalog,
    editorDetailData: details,
  };
}
