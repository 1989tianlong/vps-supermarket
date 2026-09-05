"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Star,
  Copy,
  ExternalLink,
  ChevronDown,
  CircleCheck,
  ShieldAlert,
  PackageSearch,
  Flame,
  LayoutList,
  LayoutGrid,
  BellPlus,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Settings,
  Store,
  Timer,
} from "lucide-react";
import type { StockData, StockProduct, StockProvider } from "@/lib/stock";
import { vendorLink } from "@/lib/vendor-links";
import { SettingsModal } from "./SettingsModal";
import { toast } from "./Toast";

type Entry = StockData["stock"][string];

const num = (s: string | undefined) => {
  const m = (s ?? "").match(/[\d.]+/);
  return m ? parseFloat(m[0]) : NaN;
};
const fmtClicks = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(2)}K` : String(n));

function copyText(text: string) {
  navigator.clipboard
    .writeText(text)
    .then(() => toast("已复制到剪贴板"))
    .catch(() => toast("复制失败，请手动复制", "err"));
}

const productLine = (p: StockProduct, provider: string) =>
  `${p.name} · 厂商: ${provider} | ${p.specFull || p.specSummary} · 库存: ${
    p.inStock ? "有货" : "缺货"
  } · 探测: ${p.lastProbeFull || p.lastProbeText}`;

function addWatchlist(p: StockProduct, provider: string) {
  try {
    const list: string[] = JSON.parse(localStorage.getItem("vpsm-watch") ?? "[]");
    if (!list.includes(`${provider}/${p.key}`)) list.push(`${provider}/${p.key}`);
    localStorage.setItem("vpsm-watch", JSON.stringify(list));
  } catch {}
  toast(`已订阅到货提醒：${provider} · ${p.name}`);
}

/* ── 价格周期 / 机房 下拉 ─────────────────────────────── */
function SelectBox({
  options,
  title,
}: {
  options: { value: string; label: string }[];
  title?: string;
}) {
  if (!options.length) return <span className="text-muted">—</span>;
  return (
    <div className="relative inline-block max-w-full">
      <select
        title={title}
        className="num w-full max-w-[190px] cursor-pointer appearance-none truncate rounded-lg border border-line bg-bg py-1.5 pl-2.5 pr-7 text-[12.5px] outline-none transition-colors hover:border-primary focus:border-primary"
      >
        {options.map((o) => (
          <option key={o.value + o.label} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={12}
        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-muted"
      />
    </div>
  );
}

/* ── 产品表格行 ───────────────────────────────────────── */
function ProductRow({
  p,
  provider,
  link,
  fav,
  onFav,
}: {
  p: StockProduct;
  provider: string;
  link: string | null;
  fav: boolean;
  onFav: () => void;
}) {
  return (
    <tr
      className={`border-b border-line/60 align-middle transition-colors last:border-0 hover:bg-soft/60 ${
        p.inStock ? "" : "opacity-70"
      }`}
    >
      <td className="whitespace-nowrap px-3 py-3">
        <div className="flex flex-col items-start gap-1">
          {link ? (
            <a
              href={link}
              target="_blank"
              rel="nofollow noopener noreferrer"
              className="inline-flex items-center gap-1 whitespace-nowrap rounded-lg bg-primary px-2.5 py-1 text-[11.5px] font-semibold text-primary-fg transition-opacity hover:opacity-85"
            >
              购买 <ExternalLink size={10} />
            </a>
          ) : (
            <span
              className="inline-flex cursor-not-allowed items-center gap-1 rounded-lg border border-line px-2.5 py-1 text-[11.5px] text-muted"
              title="暂未收录该厂商官网链接"
            >
              官网
            </span>
          )}
          <button
            onClick={() => copyText(productLine(p, provider))}
            className="rounded-md p-0.5 text-muted transition-colors hover:text-primary"
            title="复制产品信息"
          >
            <Copy size={12} />
          </button>
        </div>
      </td>

      <td className="min-w-[220px] px-3 py-3">
        <div className="flex items-center gap-1.5">
          <button
            onClick={onFav}
            className={fav ? "text-amber-400" : "text-muted/40 hover:text-amber-400"}
            title="收藏"
          >
            <Star size={12} fill={fav ? "currentColor" : "none"} />
          </button>
          <span className="text-[13.5px] font-semibold">{p.name}</span>
          {!!p.heatCount && (
            <span
              className="num inline-flex items-center gap-0.5 rounded-full bg-rank/10 px-1.5 py-px text-[10px] font-medium text-rank"
              title={p.heatTitle}
            >
              <Flame size={9} /> {p.heatCount}
            </span>
          )}
        </div>
        <div className="mt-1 flex max-w-[440px] flex-wrap gap-1">
          {(p.chips.length ? p.chips : [p.specSummary]).slice(0, 10).map((c, i) => (
            <span
              key={i}
              className="rounded border border-line/60 bg-soft px-1 py-px text-[10px] text-muted"
            >
              {c}
            </span>
          ))}
        </div>
      </td>

      <td className="px-3 py-3">
        <SelectBox options={p.cycles} title="选择付费周期" />
      </td>

      <td className="min-w-[200px] px-3 py-3 text-[12px] leading-relaxed text-muted">
        <div className="max-w-[280px]">{p.specSummary || p.specFull}</div>
      </td>

      <td className="min-w-[130px] px-3 py-3">
        <SelectBox
          options={p.locations.map((l) => ({ value: l, label: l }))}
          title={p.locations.join(" / ")}
        />
      </td>

      <td className="max-w-[160px] px-3 py-3 text-[12px] text-muted" title={p.group}>
        <div className="line-clamp-2">{p.group || "—"}</div>
      </td>

      <td className="px-3 py-3">
        {p.inStock ? (
          <CircleCheck size={16} className="text-ok" aria-label="有货" />
        ) : (
          <span className="inline-flex items-center gap-1 rounded-md bg-bad/10 px-1.5 py-0.5 text-[10.5px] font-medium text-bad">
            缺货
            <button
              onClick={() => addWatchlist(p, provider)}
              title="订阅到货提醒"
              className="transition-opacity hover:opacity-75"
            >
              <BellPlus size={11} />
            </button>
          </span>
        )}
      </td>

      <td
        className="num whitespace-nowrap px-3 py-3 text-[12px] text-muted"
        title={p.lastProbeFull}
      >
        {p.lastProbeText || "—"}
      </td>
    </tr>
  );
}

/* ── 主看板 ───────────────────────────────────────────── */
export function MarketBoard({
  data,
  deepLinks = {},
}: {
  data: StockData | null;
  deepLinks?: Record<string, string>;
}) {
  const router = useRouter();
  const [vendorQuery, setVendorQuery] = useState("");
  const [showBlacklist, setShowBlacklist] = useState(false);
  const [providerName, setProviderName] = useState<string>("");
  const [productQuery, setProductQuery] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [stockFilter, setStockFilter] = useState<"all" | "in" | "out">("all");
  const [sortDir, setSortDir] = useState<"" | "asc" | "desc">("");
  const [view, setView] = useState<"table" | "cards">("table");
  const [favs, setFavs] = useState<string[]>([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const linkFor = (provider: string) => deepLinks[provider] ?? vendorLink(provider);

  const providers: StockProvider[] = useMemo(
    () => (data?.providers ?? []).filter((p) => p.name && !p.name.includes("黑名单")),
    [data],
  );
  const pool = useMemo(
    () => providers.filter((p) => (showBlacklist ? p.blacklisted : !p.blacklisted)),
    [providers, showBlacklist],
  );
  const vList = useMemo(() => {
    const q = vendorQuery.trim().toLowerCase();
    return q ? pool.filter((v) => v.name.toLowerCase().includes(q)) : pool;
  }, [pool, vendorQuery]);

  // 默认选中热度最高的厂商
  useEffect(() => {
    if (!providerName && providers.length) {
      const top = [...providers].sort((a, b) => b.buyClicks - a.buyClicks)[0];
      setProviderName(top?.name ?? providers[0]?.name ?? "");
    }
  }, [providers, providerName]);

  useEffect(() => {
    try {
      setFavs(JSON.parse(localStorage.getItem("vpsm-favs") ?? "[]"));
    } catch {}
  }, []);

  const entry: Entry | undefined = data?.stock?.[providerName];
  const products = entry?.products ?? [];

  const totalProducts = products.length;
  const filtered = useMemo(() => {
    let list = products;
    const q = productQuery.trim().toLowerCase();
    if (q)
      list = list.filter((p) =>
        `${p.name} ${p.group} ${p.specSummary} ${p.locations.join(" ")}`
          .toLowerCase()
          .includes(q),
      );
    if (tagFilter)
      list = list.filter(
        (p) =>
          p.group.startsWith(tagFilter) || p.locations.some((l) => l.startsWith(tagFilter)),
      );
    if (stockFilter !== "all") list = list.filter((p) => (stockFilter === "in") === p.inStock);
    if (sortDir)
      list = [...list].sort((a, b) => {
        const pa = num(a.cycles[0]?.label);
        const pb = num(b.cycles[0]?.label);
        return sortDir === "asc" ? pa - pb : pb - pa;
      });
    return list;
  }, [products, productQuery, tagFilter, stockFilter, sortDir]);

  const toggleFav = (key: string) => {
    setFavs((f) => {
      const next = f.includes(key) ? f.filter((x) => x !== key) : [...f, key];
      localStorage.setItem("vpsm-favs", JSON.stringify(next));
      return next;
    });
  };

  const maxClicks = Math.max(1, ...pool.map((v) => v.buyClicks));

  const refresh = () => {
    if (refreshing) return;
    setRefreshing(true);
    router.refresh();
    setTimeout(() => {
      setRefreshing(false);
      toast("数据已刷新（缓存 30 分钟更新一次）");
    }, 1200);
  };

  if (!data || !providers.length) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-2xl border border-line bg-card p-10 text-center text-muted">
        <PackageSearch size={36} className="opacity-40" />
        <p className="text-sm">库存数据初始化中：先运行 scripts/scrape-stock.mjs 采集数据。</p>
      </div>
    );
  }

  const selectCls =
    "cursor-pointer appearance-none rounded-lg border border-line bg-bg py-2 pl-3 pr-8 text-[12.5px] outline-none transition-colors hover:border-primary focus:border-primary";
  const chevron = (
    <ChevronDown
      size={12}
      className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted"
    />
  );

  return (
    <div className="mx-auto grid max-w-[1600px] items-start gap-4 px-3 pb-10 sm:px-5 xl:grid-cols-[250px,minmax(0,1fr)]">
      {/* ── 厂商榜 ── */}
      <aside className="flex h-fit flex-col overflow-hidden rounded-2xl border border-line bg-card lg:sticky lg:top-[72px]">
        <div className="flex items-center gap-2 border-b border-line px-3.5 py-2.5">
          <Store size={14} className="text-primary" />
          <b className="text-[13px]">厂商热度榜</b>
          <span className="num ml-auto rounded-full bg-primary-soft px-2 py-0.5 text-[10.5px] text-primary">
            {showBlacklist ? data?.blacklist?.length ?? 0 : pool.length}
          </span>
        </div>
        <div className="p-2.5">
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              value={vendorQuery}
              onChange={(e) => setVendorQuery(e.target.value)}
              placeholder="搜索厂商..."
              className="w-full rounded-lg border border-line bg-bg py-2 pl-8 pr-3 text-[13px] outline-none transition-colors placeholder:text-muted/60 focus:border-primary"
            />
          </div>
          <button
            onClick={() => setShowBlacklist((s) => !s)}
            className={`mt-2 flex w-full items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12.5px] font-semibold transition-colors ${
              showBlacklist ? "bg-bad/10 text-bad" : "text-bad/90 hover:bg-bad/10"
            }`}
          >
            <ShieldAlert size={13} /> 黑名单（{data?.blacklist?.length ?? 0}）
          </button>
        </div>
        <div className="max-h-[56vh] min-h-[200px] space-y-0.5 overflow-y-auto px-2 pb-2 lg:max-h-[calc(100vh-300px)]">
          {showBlacklist
            ? (data?.blacklist ?? []).map((b) => (
                <button
                  key={b.name}
                  onClick={() => {
                    const inStock = providers.find((p) => p.name === b.name);
                    if (inStock) {
                      setProviderName(b.name);
                      setProductQuery("");
                      setTagFilter("");
                    } else {
                      toast("该黑名单厂商暂无产品数据", "err");
                    }
                  }}
                  className={`w-full rounded-lg px-2 py-1.5 text-left transition-colors ${
                    providerName === b.name
                      ? "border-l-2 border-bad bg-bad/10"
                      : "border-l-2 border-transparent hover:bg-soft"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <ShieldAlert size={12} className="shrink-0 text-bad" />
                    <span className="min-w-0 flex-1 truncate text-[12.5px] font-medium">{b.name}</span>
                  </div>
                  {b.reason && (
                    <div className="mt-0.5 line-clamp-2 pl-[18px] text-[10px] leading-relaxed text-bad/80">
                      {b.reason}
                    </div>
                  )}
                </button>
              ))
            : vList.map((v) => {
            const rank = pool.findIndex((x) => x.name === v.name) + 1;
            const active = v.name === providerName;
            return (
              <button
                key={v.name}
                onClick={() => {
                  setProviderName(v.name);
                  setProductQuery("");
                  setTagFilter("");
                }}
                className={`w-full rounded-lg px-2 py-1.5 text-left transition-colors ${
                  active
                    ? "border-l-2 border-primary bg-accent"
                    : "border-l-2 border-transparent hover:bg-soft"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className={`num w-5 shrink-0 text-center text-[11px] font-bold ${
                      rank <= 3 && !showBlacklist ? "text-rank" : "text-muted/70"
                    }`}
                  >
                    {rank}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[12.5px] font-medium">
                    {v.name}
                  </span>
                  <span className="num shrink-0 text-[10.5px] text-muted">{v.count}</span>
                </div>
                <div className="mt-1 flex items-center gap-1.5">
                  <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-soft">
                    <div
                      className={`h-full rounded-full ${showBlacklist ? "bg-bad/60" : "bg-primary/60"}`}
                      style={{ width: `${Math.max(3, (v.buyClicks / maxClicks) * 100)}%` }}
                    />
                  </div>
                  <span className="num shrink-0 text-[9.5px] text-muted/80">
                    {fmtClicks(v.buyClicks)}
                  </span>
                </div>
              </button>
            );
          })}
          {(showBlacklist ? !(data?.blacklist ?? []).length : vList.length === 0) && (
            <div className="py-8 text-center text-[12px] text-muted">
              {showBlacklist ? "黑名单为空" : "没有匹配的厂商"}
            </div>
          )}
        </div>
      </aside>

      {/* ── 产品库存 ── */}
      <main className="min-w-0 overflow-hidden rounded-2xl border border-line bg-card">
        {providerName && (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3.5">
            <h2 className="flex items-center gap-2 text-[16px] font-bold">
              {providerName}
              <span className="num rounded-md bg-soft px-1.5 py-0.5 text-[10.5px] font-normal text-muted">
                {totalProducts} 个产品
              </span>
            </h2>
            <span className="num inline-flex items-center gap-1 text-[11px] text-muted">
              <Timer size={11} /> 数据更新 {new Date(data.fetchedAt).toLocaleString("zh-CN", { hour12: false })}
            </span>
            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={refresh}
                className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-bg px-3 py-2 text-[12.5px] transition-colors hover:border-primary hover:text-primary"
              >
                <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} /> 刷新
              </button>
              <button
                onClick={() => searchRef.current?.focus()}
                className="hidden items-center gap-1.5 rounded-lg bg-fg px-3 py-2 text-[12.5px] font-medium text-bg transition-opacity hover:opacity-80 md:inline-flex"
              >
                <Search size={13} /> 搜索库存
              </button>
              <button
                onClick={() => setSettingsOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-bg px-3 py-2 text-[12.5px] transition-colors hover:border-primary hover:text-primary"
              >
                <Settings size={13} /> 监控设置
              </button>
            </div>
          </div>
        )}

        {providerName?.length > 0 && providers.find((p) => p.name === providerName)?.blacklisted && (
          <div className="mx-4 mb-3 flex items-start gap-2 rounded-xl border border-bad/30 bg-bad/10 p-3 text-[12.5px] text-bad">
            <ShieldAlert size={15} className="mt-px shrink-0" />
            <div>
              <b>风险警示：</b>该厂商在社区黑名单中（跑路/超售等风险），交易请务必谨慎，本站不提供其推广链接。
            </div>
          </div>
        )}

        {/* 标签筛选 */}
        {!!entry?.tags?.length && (
          <div className="flex flex-wrap items-center gap-1.5 px-4 pb-3">
            <button
              onClick={() => setTagFilter("")}
              className={`rounded-full border px-2.5 py-0.5 text-[11.5px] transition-colors ${
                tagFilter === ""
                  ? "border-primary bg-primary font-semibold text-primary-fg"
                  : "border-line text-muted hover:border-primary hover:text-primary"
              }`}
            >
              全部 {totalProducts}
            </button>
            {entry.tags.map((t) => (
              <button
                key={t.label}
                onClick={() => setTagFilter(tagFilter === t.label ? "" : t.label)}
                className={`rounded-full border px-2.5 py-0.5 text-[11.5px] transition-colors ${
                  tagFilter === t.label
                    ? "border-primary bg-primary font-semibold text-primary-fg"
                    : "border-line text-muted hover:border-primary hover:text-primary"
                }`}
              >
                {t.label} {t.count}
              </button>
            ))}
          </div>
        )}

        {/* 工具栏 */}
        <div className="flex flex-wrap items-center gap-2 border-y border-line px-4 py-2.5">
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              ref={searchRef}
              value={productQuery}
              onChange={(e) => setProductQuery(e.target.value)}
              placeholder="搜索产品..."
              className="w-36 rounded-lg border border-line bg-bg py-2 pl-8 pr-9 text-[12.5px] outline-none transition-colors placeholder:text-muted/60 focus:border-primary sm:w-48"
            />
            <span className="num absolute right-2.5 top-1/2 -translate-y-1/2 text-[10.5px] text-muted">
              {filtered.length}/{totalProducts}
            </span>
          </div>
          <div className="relative">
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value as typeof stockFilter)}
              className={selectCls}
              aria-label="库存筛选"
            >
              <option value="all">全部库存</option>
              <option value="in">有货</option>
              <option value="out">缺货</option>
            </select>
            {chevron}
          </div>
          <button
            onClick={() =>
              copyText(
                [
                  `【${providerName}】共 ${totalProducts} 个产品`,
                  ...products.map((p) => productLine(p, providerName)),
                ].join("\n"),
              )
            }
            className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-bg px-2.5 py-2 text-[12px] text-muted transition-colors hover:border-primary hover:text-primary"
          >
            <Copy size={11} /> 复制全部({totalProducts})
          </button>
          <div className="ml-auto flex overflow-hidden rounded-lg border border-line">
            <button
              onClick={() => setView("table")}
              className={`p-2 transition-colors ${
                view === "table" ? "bg-accent text-primary" : "text-muted hover:text-fg"
              }`}
              title="表格视图"
            >
              <LayoutList size={15} />
            </button>
            <button
              onClick={() => setView("cards")}
              className={`p-2 transition-colors ${
                view === "cards" ? "bg-accent text-primary" : "text-muted hover:text-fg"
              }`}
              title="卡片视图"
            >
              <LayoutGrid size={15} />
            </button>
          </div>
        </div>

        {/* 内容 */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-muted">
            <PackageSearch size={36} className="opacity-40" />
            <span className="text-[13px]">没有匹配的产品，试试调整筛选条件</span>
          </div>
        ) : view === "table" ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left">
              <thead>
                <tr className="whitespace-nowrap border-b border-line text-[11.5px] text-muted">
                  <th className="px-3 py-2.5 font-medium">
                    操作
                    <Flame size={10} className="ml-1 inline text-rank" />
                  </th>
                  <th className="px-3 py-2.5 font-medium">产品</th>
                  <th className="px-3 py-2.5 font-medium">
                    <button
                      onClick={() =>
                        setSortDir((d) => (d === "" ? "asc" : d === "asc" ? "desc" : ""))
                      }
                      className="inline-flex items-center gap-0.5 transition-colors hover:text-fg"
                    >
                      价格
                      {sortDir === "" ? (
                        <ArrowUpDown size={10} className="opacity-40" />
                      ) : sortDir === "asc" ? (
                        <ArrowUp size={10} className="text-primary" />
                      ) : (
                        <ArrowDown size={10} className="text-primary" />
                      )}
                    </button>
                  </th>
                  <th className="px-3 py-2.5 font-medium">规格</th>
                  <th className="px-3 py-2.5 font-medium">机房</th>
                  <th className="px-3 py-2.5 font-medium">分组</th>
                  <th className="px-3 py-2.5 font-medium">状态</th>
                  <th className="px-3 py-2.5 font-medium">上次探测</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <ProductRow
                    key={p.key}
                    p={p}
                    provider={providerName}
                    link={linkFor(providerName)}
                    fav={favs.includes(`${providerName}/${p.key}`)}
                    onFav={() => toggleFav(`${providerName}/${p.key}`)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
            <div className="grid gap-3 p-4 sm:grid-cols-2 2xl:grid-cols-3">
              {filtered.map((p) => {
                const link = linkFor(providerName);
              return (
                <div
                  key={p.key}
                  className="flex flex-col gap-2 rounded-xl border border-line bg-bg p-4 transition-colors hover:border-primary/50"
                >
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => toggleFav(`${providerName}/${p.key}`)}
                      className={
                        favs.includes(`${providerName}/${p.key}`)
                          ? "text-amber-400"
                          : "text-muted/40 hover:text-amber-400"
                      }
                    >
                      <Star
                        size={13}
                        fill={favs.includes(`${providerName}/${p.key}`) ? "currentColor" : "none"}
                      />
                    </button>
                    <span className="text-[14px] font-semibold">{p.name}</span>
                    <span className="ml-auto">
                      {p.inStock ? (
                        <CircleCheck size={15} className="text-ok" />
                      ) : (
                        <span className="rounded bg-bad/10 px-1.5 py-0.5 text-[10.5px] text-bad">
                          缺货
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {(p.chips.length ? p.chips : [p.specSummary]).slice(0, 6).map((c, i) => (
                      <span
                        key={i}
                        className="rounded border border-line/60 bg-soft px-1 py-px text-[10px] text-muted"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <SelectBox options={p.cycles} title="选择付费周期" />
                    {link ? (
                      <a
                        href={link}
                        target="_blank"
                        rel="nofollow noopener noreferrer"
                        className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg bg-primary py-1.5 text-[12px] font-semibold text-primary-fg transition-opacity hover:opacity-85"
                      >
                        购买 <ExternalLink size={10} />
                      </a>
                    ) : (
                      <span className="flex-1" />
                    )}
                  </div>
                  <div className="flex items-center justify-between text-[10.5px] text-muted">
                    <span className="truncate">{p.locations[0] ?? p.group}</span>
                    <span className="num" title={p.lastProbeFull}>
                      探测 {p.lastProbeText}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
