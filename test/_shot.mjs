const [url, out, w = "1280", h = "900", full = "false"] = process.argv.slice(2);
const width = +w, height = +h, fullPage = full === "true";
const list = await (await fetch("http://localhost:9322/json/new?" + encodeURIComponent(url), { method: "PUT" })).json();
const ws = new WebSocket(list.webSocketDebuggerUrl);
let id = 0; const pending = new Map();
const send = (method, params = {}) => new Promise((res) => { const m = ++id; pending.set(m, res); ws.send(JSON.stringify({ id: m, method, params })); });
ws.addEventListener("message", (e) => { const msg = JSON.parse(e.data); if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg.result); pending.delete(msg.id); } });
await new Promise((r) => ws.addEventListener("open", r));
await send("Page.enable");
await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: false });
await send("Page.navigate", { url });
await new Promise((r) => setTimeout(r, 5000));
let clip;
if (fullPage) {
  const { result } = await send("Runtime.evaluate", { expression: "JSON.stringify({h: Math.max(document.documentElement.scrollHeight, document.body.scrollHeight)})", returnByValue: true });
  const dim = JSON.parse(result.value);
  await send("Emulation.setDeviceMetricsOverride", { width, height: Math.min(dim.h, 6000), deviceScaleFactor: 1, mobile: false });
  await new Promise((r) => setTimeout(r, 600));
  clip = { x: 0, y: 0, width, height: Math.min(dim.h, 6000), scale: 1 };
}
const { result: ox } = await send("Runtime.evaluate", { expression: "document.documentElement.scrollWidth - document.documentElement.clientWidth", returnByValue: true });
console.log("overflow-x:", ox.value);
const shot = await send("Page.captureScreenshot", clip ? { format: "png", clip } : { format: "png" });
(await import("node:fs")).writeFileSync(out, Buffer.from(shot.data, "base64"));
console.log("saved", out);
await send("Target.closeTarget", { targetId: list.id });
ws.close(); process.exit(0);
