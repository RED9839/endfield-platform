"use client";

import { useEffect } from "react";

const STORAGE_PREFIX = "endfield:setting-viewed:";

export default function OperatorSettingViewTracker({
  settingId,
}: {
  settingId: string;
}) {
  useEffect(() => {
    const storageKey = `${STORAGE_PREFIX}${settingId}`;

    try {
      if (window.sessionStorage.getItem(storageKey)) return;
      window.sessionStorage.setItem(storageKey, "1");
    } catch {
      // Tracking may continue when storage is unavailable.
    }

    fetch(`/api/operator-settings/${encodeURIComponent(settingId)}/view`, {
      method: "POST",
      keepalive: true,
    }).catch(() => {});
  }, [settingId]);

  return null;
}
