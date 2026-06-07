export function isEnvCheckEnabled(nodeEnv: string | undefined) {
  return nodeEnv !== "production";
}
