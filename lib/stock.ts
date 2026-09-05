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

/**
 * 服务端获取采集数据：优先取 GitHub 上的最新版（每 30 分钟再验证），
 * 失败时回退到构建时打包的本地副本。
 */
export async function getStockData(): Promise<StockData | null> {
  try {
    const r = await fetch(REMOTE_URL, { next: { revalidate: 1800 } });
    if (r.ok) {
      const j = (await r.json()) as StockData;
      if (j?.providers?.length) return j;
    }
  } catch {
    /* 回退到本地 */
  }
  return localData as StockData;
}

/** 从 ticker 文本解析厂商深层购买链接与公告分段 */
export function parseTicker(ticker: string): { segments: string[]; deepLinks: Record<string, string> } {
  const segments = ticker
    .split(" ⏎ ")
    .map((s) => s.trim())
    .filter(Boolean);
  const deepLinks: Record<string, string> = {};
  for (const seg of segments) {
    const url = seg.match(/购买[:：]\s*(https?:\/\/\S+)/)?.[1];
    const provider = seg.match(/厂商[:：]\s*([^\s|·｜]+)/)?.[1];
    if (url && provider) deepLinks[provider] = deepLinks[provider] ?? url;
  }
  return { segments, deepLinks };
}
