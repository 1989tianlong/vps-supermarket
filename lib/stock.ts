/** 采集数据的类型与加载器（真实数据来自 data/stock-data.json，由 scripts/scrape-stock.mjs 产出） */

export type StockCycle = { value: string; label: string };

export type StockProduct = {
  key: string;
  name: string;
  specFull: string;
  chips: string[];
  cycles: StockCycle[];
  specSummary: string;
  locations: string[];
  group: string;
  inStock: boolean;
  statusText: string;
  lastProbeText: string;
  lastProbeFull: string;
  heatCount: number;
  heatTitle: string;
};

export type StockProvider = {
  name: string;
  buyClicks: number;
  count: number;
  blacklisted: boolean;
};

export type StockTag = { label: string; count: number };

export type StockEntry = {
  tags: StockTag[];
  products: StockProduct[];
};

export type BlacklistItem = { name: string; reason: string };

export type StockData = {
  fetchedAt: string;
  source: string;
  ticker: string;
  providers: StockProvider[];
  blacklist: BlacklistItem[];
  stock: Record<string, StockEntry>;
};

import localData from "@/data/stock-data.json";
import { site } from "@/config/site";

const REMOTE_URL = `${site.repoRawUrl}/main/data/stock-data.json`;

// 数据包 > 2MB 会触发 Next 数据缓存上限警告，改用模块级 30 分钟缓存
const g = globalThis as unknown as {
  __vpsmStock?: { t: number; data: StockData };
};

/** 剥离公告中的原站推广链接，避免为他人导流 */
function cleanTicker(t: string): string {
  return t
    .split(" ⏎ ")
    .map((s) => s.replace(/ *·? *购买[:：]\s*https?:\/\/\S+/g, "").trim())
    .filter((s) => s.length > 8)
    .join(" ⏎ ");
}

/**
 * 服务端获取采集数据：优先取 GitHub 上的最新版（实例内缓存 30 分钟），
 * 失败时回退到构建时打包的本地副本。
 */
export async function getStockData(): Promise<StockData | null> {
  const cached = g.__vpsmStock;
  if (cached && Date.now() - cached.t < 1800_000) return cached.data;
  try {
    const r = await fetch(REMOTE_URL, { cache: "no-store" });
    if (r.ok) {
      const j = (await r.json()) as StockData;
      if (j?.providers?.length) {
        j.ticker = cleanTicker(j.ticker);
        g.__vpsmStock = { t: Date.now(), data: j };
        return j;
      }
    }
  } catch {
    /* 回退到本地 */
  }
  const local = localData as StockData;
  local.ticker = cleanTicker(local.ticker);
  return local;
}

/** 从 ticker 文本解析公告分段 */
export function parseTicker(ticker: string): { segments: string[] } {
  const segments = ticker
    .split(" ⏎ ")
    .map((s) => s.trim())
    .filter((s) => s.length > 8);
  return { segments };
}
