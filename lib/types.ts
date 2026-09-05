export type SpecItem = { label: string; value: string };

export type BillingCycle = { label: string; months: number; price: number };

export type Product = {
  id: string;
  name: string;
  /** 一句话卖点，如 “CN2 GIA 精品线路” */
  tagline?: string;
  specs: SpecItem[];
  specSummary: string;
  /** 基准月付价格 */
  price: number;
  currency: "USD" | "CNY";
  cycles: BillingCycle[];
  location: string;
  /** 线路/产品分组：CN2 GIA / 9929 / CMIN2 / 家宽 / 普通优化 … */
  group: string;
  inStock: boolean;
  /** 上次探测距现在的分钟数（演示数据） */
  lastProbeMinsAgo: number;
  buyUrl: string;
  /** 近 30 天成交热度 */
  hot?: number;
  featured?: boolean;
  links?: number;
};

export type Vendor = {
  id: string;
  name: string;
  site: string;
  /** 侧栏展示的历史浏览量 */
  views: number;
  blacklisted?: boolean;
  blacklistReason?: string;
  products: Product[];
};

export const cyclesFor = (price: number, currency: Currency = "USD"): BillingCycle[] => {
  const sym = currency === "USD" ? "$" : "¥";
  const nice = (x: number) => Math.round(x * 10) / 10;
  const fmt = (x: number) => `${sym}${nice(x)}`;
  return [
    { label: `月付 ${fmt(price)}`, months: 1, price },
    { label: `季付 ${fmt(price * 3 * 0.95)}`, months: 3, price: nice(price * 3 * 0.95) },
    { label: `年付 ${fmt(price * 12 * 0.8)}`, months: 12, price: nice(price * 12 * 0.8) },
    { label: `两年付 ${fmt(price * 24 * 0.72)}`, months: 24, price: nice(price * 24 * 0.72) },
  ];
};

type Currency = "USD" | "CNY";
