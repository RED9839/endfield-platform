export const DEFAULT_SETTINGS_PAGE = 1;
export const DEFAULT_SETTINGS_LIMIT = 24;
export const MAX_SETTINGS_LIMIT = 60;

export function getSettingsPage(value: string | null) {
  const page = Number(value ?? DEFAULT_SETTINGS_PAGE);
  return Number.isFinite(page) && page > 0
    ? Math.floor(page)
    : DEFAULT_SETTINGS_PAGE;
}

export function getSettingsLimit(value: string | null) {
  const limit = Number(value ?? DEFAULT_SETTINGS_LIMIT);
  if (!Number.isFinite(limit) || limit <= 0) return DEFAULT_SETTINGS_LIMIT;
  return Math.min(Math.floor(limit), MAX_SETTINGS_LIMIT);
}

export function getGroupedPageWindow({
  page,
  limit,
  primaryTotal,
  secondaryTotal,
}: {
  page: number;
  limit: number;
  primaryTotal: number;
  secondaryTotal: number;
}) {
  const start = (page - 1) * limit;
  const primarySkip = Math.min(start, primaryTotal);
  const primaryTake = Math.max(
    0,
    Math.min(limit, primaryTotal - primarySkip),
  );
  const secondarySkip = Math.max(0, start - primaryTotal);
  const secondaryTake = Math.max(
    0,
    Math.min(limit - primaryTake, secondaryTotal - secondarySkip),
  );
  const total = primaryTotal + secondaryTotal;

  return {
    total,
    hasMore: start + limit < total,
    primarySkip,
    primaryTake,
    secondarySkip,
    secondaryTake,
  };
}
