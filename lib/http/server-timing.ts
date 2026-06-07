export function formatServerTiming(
  metrics: Array<{ name: string; duration: number; description?: string }>,
) {
  return metrics
    .map(({ name, duration, description }) => {
      const safeDuration = Math.max(0, duration).toFixed(1);
      const suffix = description
        ? `;desc="${description.replaceAll('"', "'")}"`
        : "";

      return `${name};dur=${safeDuration}${suffix}`;
    })
    .join(", ");
}
