import { chromium } from "playwright";
const browser = await chromium.launch({ headless: true });
const page = await (await browser.newContext({ locale: "zh-CN", viewport: { width: 1440, height: 900 } })).newPage();
const errors = [];
page.on("console", (m) => { if (m.type() === "error") errors.push(["console", page.url(), m.text().slice(0, 150)]); });
page.on("pageerror", (e) => errors.push(["pageerror", page.url(), String(e).slice(0, 150)]));
page.on("requestfailed", (r) => errors.push(["reqfail", r.url().slice(0, 90), r.failure()?.errorText ?? ""]));
for (const u of ["/", "/ip-check", "/tools", "/advertise"]) {
  await page.goto("http://localhost:3000" + u, { waitUntil: "networkidle" }).catch(() => {});
  await page.waitForTimeout(1500);
}
// 移动端也过一遍
await page.setViewportSize({ width: 390, height: 844 });
await page.goto("http://localhost:3000/", { waitUntil: "networkidle" }).catch(() => {});
await page.waitForTimeout(1500);
console.log(JSON.stringify(errors, null, 1).slice(0, 3000) || "no errors");
await browser.close();
