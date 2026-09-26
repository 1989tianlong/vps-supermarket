/**
 * VPS超市库存数据采集脚本（DOM 渲染采集版）
 *
 * 原理：原站 API 载荷为加密内容（反爬保护，不做破解）。
 * 本脚本以真实浏览器正常打开 panel.yins.win/stock（校验自然通过），
 * 像用户一样逐个点击厂商，从渲染后的 DOM 中读取产品数据并落盘。
 * 不点击任何“购买”按钮（避免污染原站点击统计）。
 *
 * 用法：node scripts/scrape-stock.mjs   （输出 data/stock-data.json）
 */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "..", "data", "stock-data.json");
const BASE = process.env.SCRAPE_BASE ?? "https://panel.yins.win";

/** 在浏览器里读取当前表格可见行。
 * 2026-09 源站改版：产品表为 11 列（购买/价格/产品/机房/CPU/内存/硬盘/流量/带宽/IP/状态），
 * 热度在购买列（td0），价格周期下拉在 td1，产品名+分组徽章在 td2，机房在 td3，
 * 规格拆成独立列 td4-td9，状态在 td10；不再显示上次探测时间。 */
const EXTRACT_PAGE = () => {
  const table = document.querySelector("table");
  if (!table) return { rows: [] };
  const out = [];
  for (const tr of table.querySelectorAll("tbody tr")) {
    if (tr.querySelector(".animate-pulse")) continue;
    const tds = tr.querySelectorAll("td");
    if (tds.length < 11) continue;
    const get = (i) => tds[i];
    // 热度（购买列）
    const heatEl = get(0).querySelector('span[title^="累计"]');
    const heatTitle = heatEl?.getAttribute("title") ?? "";
    const heatCount = Number(
      (heatTitle.match(/累计\s*([\d,]+)/) || [])[1]?.replace(/,/g, "") ?? 0,
    );
    // 价格周期
    const cycles = [...get(1).querySelectorAll("select option")].map((o) => ({
      value: o.getAttribute("value") ?? "",
      label: o.textContent.trim(),
    }));
    // 产品名 + 描述 + 分组徽章（优先按列 class 定位，防列序变动）
    const tdName = tr.querySelector("td.stock-col-name") ?? get(2);
    const nameEl = tdName.querySelector(".break-words");
    const specFull = tdName.getAttribute("title") ?? "";
    const chips = [
      ...new Set(
        [...tdName.querySelectorAll("[title]")]
          .map((e) => (e.getAttribute("title") || "").trim())
          .filter((t) => t && t !== specFull),
      ),
    ];
    const group = chips.join(" · ");
    // 机房（下拉或文本，优先按列 class 定位）
    const tdLoc = tr.querySelector("td.stock-col-loc") ?? get(3);
    const locSel = tdLoc.querySelector("select");
    const locations = locSel
      ? [...locSel.options].map((o) => o.value || o.textContent.trim())
      : [tdLoc.textContent.trim().split("\n")[0].trim()].filter(Boolean);
    // 规格列 CPU/内存/硬盘/流量/带宽/IP
    const specParts = [];
    for (let i = 4; i <= 9; i++) {
      const el = get(i).querySelector("[title], span") ?? get(i);
      const t = (el.getAttribute?.("title") || el.textContent || "").trim();
      if (t && t !== "—") specParts.push(t);
    }
    const specSummary = specParts.join(" · ");
    // 状态
    const statusEl = get(10).querySelector("[title], span");
    const statusText = statusEl?.getAttribute("title") ?? statusEl?.textContent.trim() ?? "";
    const inStock = /有货/.test(statusText);
    out.push({
      key: `${nameEl?.textContent.trim()}|${cycles[0]?.label ?? ""}|${group}`,
      name: nameEl?.textContent.trim() ?? "",
      specFull,
      chips,
      cycles,
      specSummary,
      locations,
      group,
      inStock,
      statusText: statusText || get(10).textContent.trim(),
      lastProbeText: "",
      lastProbeFull: "",
      heatCount,
      heatTitle,
    });
  }
  return { rows: out };
};

/** 读取厂商列表可见项（必须是带“购买链接被点击 N 次”标记的厂商按钮） */
const EXTRACT_LIST = () =>
  [...document.querySelectorAll("button span.truncate")]
    .map((s) => {
      const btn = s.closest("button");
      const views = btn?.querySelector('span[title^="购买链接"]');
      if (!views) return null;
      const rowText = btn?.textContent ?? "";
      return {
        name: s.textContent.trim(),
        buyClicks: Number((views?.getAttribute("title") || "").match(/([\d,]+)\s*次/)?.[1]?.replace(/,/g, "") ?? 0),
        count: Number((rowText.match(/(\d+)\s*$/) || [])[1] ?? 0),
      };
    })
    .filter(
      (v) =>
        !!v &&
        v.name &&
        !v.name.includes("黑名单") &&
        v.name !== "全部产品组" &&
        !/^(全部|有货|缺货)$/.test(v.name),
    );

async function main() {
  fs.mkdirSync(path.dirname(OUT), { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    locale: "zh-CN",
    viewport: { width: 1600, height: 1400 },
  });
  const page = await ctx.newPage();

  console.log("→ 打开", BASE + "/stock");
  await page.goto(BASE + "/stock", { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForFunction(() => document.querySelectorAll("button span.truncate").length > 3, null, { timeout: 60000 });
  await page.waitForFunction(
    () => {
      const tr = document.querySelector("table tbody tr");
      return tr && !tr.querySelector(".animate-pulse");
    },
    null,
    { timeout: 45000 },
  ).catch(() => {});
  await page.waitForTimeout(1500);

  // 把库存筛选切到“全部”，避免默认“有货”过滤漏掉缺货产品
  await page.evaluate(() => {
    const sels = [...document.querySelectorAll("select")];
    const s = sels.find((el) => [...el.options].some((o) => o.textContent.includes("有货")));
    if (!s) return;
    const all = [...s.options].find((o) => o.textContent.includes("全部"));
    if (all && s.value !== all.value) {
      s.value = all.value;
      s.dispatchEvent(new Event("change", { bubbles: true }));
    }
  });
  await page.waitForTimeout(1000);

  /** 采集当前产品表：点击「显示更多」加载全部行（源站 2026-09 已从分页改为增量加载） */
  async function collectRows() {
    const sig = new Set();
    const rows = [];
    let stagnant = 0;
    for (let i = 0; i < 40; i++) {
      await page.waitForTimeout(300);
      const { rows: seen } = await page.evaluate(EXTRACT_PAGE);
      let fresh = 0;
      for (const r of seen) {
        if (!r.key || sig.has(r.key)) continue;
        sig.add(r.key);
        rows.push(r);
        fresh++;
      }
      if (fresh > 0) stagnant = 0;
      else stagnant++;
      if (stagnant >= 3) break;
      // 点击「显示更多（剩余 N 款）」
      const hasMore = await page.evaluate(() => {
        const btn = [...document.querySelectorAll("button")].find(
          (b) =>
            b.offsetParent !== null &&
            !b.disabled &&
            /显示更多|加载更多|查看更多/.test(b.textContent || ""),
        );
        if (!btn) return false;
        btn.click();
        return true;
      });
      if (hasMore) {
        await page.waitForTimeout(900);
        continue;
      }
      // 无按钮时滚动表格容器兜底（可能存在滚动加载）
      await page.evaluate(() => {
        const table = document.querySelector("table");
        let el = table;
        while (el && !/(auto|scroll)/.test(getComputedStyle(el).overflowY)) el = el.parentElement;
        if (el) el.scrollTop = el.scrollHeight;
      });
      await page.waitForTimeout(900);
    }
    return rows;
  }

  /** 读取产品面板头部的标签（counter 为站点内部值，弃用） */
  async function collectMeta() {
    return page.evaluate(() => {
      const table = document.querySelector("table");
      if (!table) return { tags: [] };
      let panel = table;
      for (let i = 0; i < 6 && panel.parentElement; i++) panel = panel.parentElement;
      const tags = [...panel.querySelectorAll("button")]
        .map((b) => (b.textContent || "").replace(/\s+/g, "").trim())
        .filter((t) => /^[\u4e00-\u9fa5A-Za-z]{1,12}\d{1,4}$/.test(t) && !t.includes("黑名单"))
        .slice(0, 24)
        .map((t) => {
          const m = t.match(/^(.+?)(\d{1,4})$/);
          return { label: m[1], count: Number(m[2]) };
        });
      return { tags };
    });
  }

  const visited = new Set();
  const stock = {};

  /** 点击指定厂商并采集其产品 */
  async function scrapeProvider(name) {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        // 用 DOM click 绕过可能存在的浮层拦截
        const ok = await page.evaluate((t) => {
          const btn = [...document.querySelectorAll("button span.truncate")]
            .find((s) => s.textContent.trim() === t)
            ?.closest("button");
          if (!btn) return false;
          btn.scrollIntoView({ block: "center" });
          btn.click();
          return true;
        }, name);
        if (!ok) {
          console.log(`  ✗ ${name}: 按钮未找到`);
          return;
        }
        // 等表格渲染出非骨架行
        for (let i = 0; i < 24; i++) {
          await page.waitForTimeout(500);
          const ready = await page.evaluate(() => {
            const tr = document.querySelector("table tbody tr");
            return tr && !tr.querySelector(".animate-pulse");
          });
          if (ready) break;
        }
        await page.waitForTimeout(600);
        const [rows, meta] = [await collectRows(), await collectMeta()];
        stock[name] = { tags: meta.tags, products: rows };
        console.log(`  ✓ ${name}: ${rows.length} 行`);
        return;
      } catch (e) {
        console.log(`  … ${name} 第 ${attempt + 1} 次重试: ${String(e).slice(0, 60)}`);
        await page.waitForTimeout(1500);
      }
    }
    console.log(`  ✗ ${name}: 采集失败`);
  }

  /** 遍历列表里所有可见厂商（处理虚拟滚动） */
  async function forEachVendor(cb) {
    const container = await page.evaluateHandle(() => {
      const btn = [...document.querySelectorAll("button span.truncate")].find((s) =>
        s.closest("button")?.querySelector('span[title^="购买链接"]'),
      );
      let el = btn?.closest("button")?.parentElement;
      while (el && !/(auto|scroll)/.test(getComputedStyle(el).overflowY)) el = el.parentElement;
      return el;
    });
    let stagnant = 0;
    for (let y = 0; stagnant < 8 && y < 40000; y += 260) {
      await page.evaluate(({ el, y: top }) => { if (el) el.scrollTop = top; }, { el: container, y });
      await page.waitForTimeout(240);
      const list = await page.evaluate(EXTRACT_LIST);
      let fresh = false;
      for (const v of list) {
        const key = v.name;
        if (visited.has(key)) continue;
        visited.add(key);
        fresh = true;
        await cb(v);
      }
      stagnant = fresh ? 0 : stagnant + 1;
    }
  }

  // ── 常规厂商 ──
  const providers = [];
  const blacklist = [];
  let ticker = "";
  console.log("→ 采集常规厂商");
  try {
    await forEachVendor(async (v) => {
      providers.push({ ...v, blacklisted: false });
      await scrapeProvider(v.name);
    });
  } catch (e) {
    console.log("常规采集提前结束:", String(e).slice(0, 100));
  }

  // ── 黑名单面板（名称 + 原因）──
  console.log("→ 采集黑名单面板");
  try {
    const toggled = await page.evaluate(() => {
      const b = [...document.querySelectorAll("button")].find((el) =>
        /黑名单\(\d+\)/.test(el.textContent || ""),
      );
      if (!b) return false;
      b.click();
      return true;
    });
    if (toggled) {
      await page.waitForTimeout(1200);
      const items = await page.evaluate(() =>
        [...document.querySelectorAll("li")]
          .filter((li) => /destructive/.test(li.className || ""))
          .map((li) => {
            const lines = (li.textContent || "").split("\n").map((s) => s.trim()).filter(Boolean);
            return { name: lines[0] ?? "", reason: lines.slice(1).join("；") };
          })
          .filter((x) => x.name),
      );
      blacklist.push(...items);
      console.log(`  ✓ 黑名单 ${items.length} 项`);
    }
  } catch (e) {
    console.log("黑名单采集提前结束:", String(e).slice(0, 100));
  }

  // ── 公告 ──
  try {
    ticker = await page.evaluate(() => {
      const lines = document.body.innerText.split("\n").map((s) => s.trim());
      const seg = lines.filter((l) => /厂商[:：]/.test(l) || /购买[:：]/.test(l));
      return seg.join(" ⏎ ").slice(0, 6000);
    });
  } catch {}

  await browser.close().catch(() => {});

  // 标记黑名单厂商
  try {
    const norm = (s) => (s ?? "").replace(/\s+/g, "").toLowerCase();
    const blNames = new Set(blacklist.map((b) => norm(b.name)));
    for (const p of providers) p.blacklisted = blNames.has(norm(p.name));
  } catch (e) {
    console.log("黑名单标记失败（不影响数据落盘）:", String(e).slice(0, 80));
  }

  const payload = {
    fetchedAt: new Date().toISOString(),
    source: BASE + "/stock",
    ticker,
    providers,
    blacklist,
    stock,
  };
  fs.writeFileSync(OUT, JSON.stringify(payload));
  const totalProducts = Object.values(stock).reduce((n, s) => n + s.products.length, 0);
  console.log(
    `\n完成：${providers.length} 家厂商（含 ${providers.filter((p) => p.blacklisted).length} 家黑名单命中）+ ${blacklist.length} 条黑名单记录，共 ${totalProducts} 个产品 → ${OUT}`,
  );
  if (providers.length === 0) process.exit(2);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
