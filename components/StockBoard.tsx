"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Search,
  RefreshCw,
  Settings,
  Eye,
  CalendarDays,
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
  Megaphone,
  Link2,
  BellPlus,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { site } from "@/config/site";
import { vendors, buildAnnouncement } from "@/data/vendors";
import { formatViews, probeTime, avatarGradient } from "@/lib/format";
import type { Product, Vendor } from "@/lib/types";
import { AdSlot } from "./AdSlot";
import { SettingsModal } from "./SettingsModal";
import { toast } from "./Toast";

const normalVendors = vendors.filter((v) => !v.blacklisted);
const blacklistVendors = vendors.filter((v) => v.blacklisted);
const ANNOUNCEMENTS = buildAnnouncement();

const productLine = (p: Product) =>
  `${p.name} | ${p.cycles[0]?.label ?? ""} | ${p.specSummary} | 机房: ${p.location} | ${p.inStock ? "有货" : "缺货"} | ${p.buyUrl}`;

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast("已复制到剪贴板");
  } catch {
    toast("复制失败，请手动复制", "err");
  }
}

function addWatchlist(p: Product) {
  try {
    const list: string[] = JSON.parse(localStorage.getItem("vpsm-watch") ?? "[]");
    if (!list.includes(p.id)) list.push(p.id);
    localStorage.setItem("vpsm-watch", JSON.stringify(list));
  } catch {}
  toast(`已订阅到货提醒：${p.name}`);
}

/* ── 价格周期下拉 ─────────────────────────────────────── */
function PriceSelect({ p }: { p: Product }) {
  const [i, setI] = useState(0);
  return (
    <div className="relative inline-block">
      <select
        value={i}
        onChange={(e) => setI(+e.target.value)}
        className="cursor-pointer appearance-none rounded-md border border-line bg-bg py-1.5 pl-2.5 pr-7 text-[12.5px] tabular-nums outline-none transition-colors hover:border-primary focus:border-primary"
        aria-label="选择付费周期"
      >
        {p.cycles.map((c, idx) => (
          <option key={c.label} value={idx}>
            {c.label}
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
  fav,
  onFav,
  probedAt,
}: {
  p: Product;
  fav: boolean;
  onFav: () => void;
  probedAt: number;
}) {
  const mins = probedAt ? 0 : p.lastProbeMinsAgo;
  return (
    <tr className="border-b border-line/60 align-top transition-colors last:border-0 hover:bg-soft/50">
      <td className="px-4 py-3.5">
        <div className="flex flex-col items-start gap-1">
          <div className="flex items-center gap-1">
            <a
              href={p.buyUrl === "#" ? undefined : p.buyUrl}
              target="_blank"
              rel="nofollow noopener noreferrer"
              onClick={
                p.buyUrl === "#"
                  ? (e) => {
                      e.preventDefault();
                      toast("演示数据：该厂商未配置购买链接", "err");
                    }
                  : undefined
              }
              className="inline-flex items-center gap-1 whitespace-nowrap rounded-md border border-line px-2 py-1 text-[11.5px] transition-colors hover:border-primary hover:text-primary"
            >
              购买 <ExternalLink size={10} />
            </a>
            <button
              onClick={() => copyText(productLine(p))}
              className="rounded-md p-1 text-muted transition-colors hover:text-primary"
              title="复制产品信息"
            >
              <Copy size={12} />
            </button>
          </div>
          {!!p.hot && (
            <span className="inline-flex items-center gap-0.5 text-[10.5px] text-rank">
              <Flame size={10} /> {p.hot}
            </span>
          )}
        </div>
      </td>

      <td className="max-w-[420px] px-4 py-3.5">
        <div className="flex items-center gap-1">
          <button
            onClick={onFav}
            className={fav ? "text-amber-400" : "text-muted/40 hover:text-amber-400"}
            title="收藏"
          >
            <Star size={12} fill={fav ? "currentColor" : "none"} />
          </button>
          <span className="text-[13.5px] font-medium">{p.name}</span>
        </div>
        {p.tagline && <div className="mt-0.5 text-[11px] text-muted">{p.tagline}</div>}
        <div className="mt-1.5 flex flex-wrap gap-1">
          {p.specs.map((s) => (
            <span
              key={s.label}
              className="rounded border border-line/70 bg-soft px-1 py-px text-[10.5px] text-muted"
            >
              {s.label}: {s.value}
            </span>
          ))}
        </div>
        {!!p.links && (
          <div className="mt-1 inline-flex items-center gap-1 text-[10.5px] text-muted">
            <Link2 size={10} /> {p.links}
          </div>
        )}
      </td>

      <td className="px-4 py-3.5">
        <PriceSelect p={p} />
      </td>

      <td className="px-4 py-3.5 text-[12px] text-muted">
        <div className="max-w-[250px] leading-relaxed">{p.specSummary}</div>
      </td>

      <td className="whitespace-nowrap px-4 py-3.5 text-[12.5px]">{p.location}</td>

      <td className="px-4 py-3.5 text-[12.5px] leading-snug">
        <div>{p.group}</div>
        {p.tagline && <div className="text-[11px] text-muted">{p.tagline}</div>}
      </td>

      <td className="px-4 py-3.5">
        {p.inStock ? (
          <CircleCheck size={16} className="text-ok" aria-label="有货" />
        ) : (
          <span className="inline-flex items-center gap-1 rounded bg-bad/10 px-1.5 py-0.5 text-[10.5px] text-bad">
            缺货
            <button onClick={() => addWatchlist(p)} title="到货提醒" className="hover:text-bad/80">
              <BellPlus size={11} />
            </button>
          </span>
        )}
      </td>

      <td className="whitespace-nowrap px-4 py-3.5 text-[12px] tabular-nums text-muted">
        {probeTime(mins)}
      </td>
    </tr>
  );
}

/* ── 主看板 ───────────────────────────────────────────── */
export function StockBoard() {
  const [vendorQuery, setVendorQuery] = useState("");
  const [showBlacklist, setShowBlacklist] = useState(false);
  const [vendorId, setVendorId] = useState("nodemach");
  const [productQuery, setProductQuery] = useState("");
  const [groupFilter, setGroupFilter] = useState("");
  const [stockFilter, setStockFilter] = useState<"all" | "in" | "out">("all");
  const [sortDir, setSortDir] = useState<"" | "asc" | "desc">("");
  const [view, setView] = useState<"table" | "cards">("table");
  const [favs, setFavs] = useState<string[]>([]);
  const [probing, setProbing] = useState(false);
  const [probedAt, setProbedAt] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [stats, setStats] = useState({
    total: site.statsSeed.total,
    today: site.statsSeed.today,
    online: 1,
  });
  const searchRef = useRef<HTMLInputElement>(null);
  const [, setTick] = useState(0);

  useEffect(() => {
    try {
      setFavs(JSON.parse(localStorage.getItem("vpsm-favs") ?? "[]"));
    } catch {}
    // 在线心跳
    let cid = localStorage.getItem("vpsm-cid");
    if (!cid) {
      cid = crypto.randomUUID();
      localStorage.setItem("vpsm-cid", cid);
    }
    const ping = () =>
      fetch("/api/stats", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ cid }),
      })
        .then((r) => r.json())
        .then(setStats)
        .catch(() => {});
    ping();
    const t = setInterval(ping, 30_000);
    const tick = setInterval(() => setTick((x) => x + 1), 60_000);
    return () => {
      clearInterval(t);
      clearInterval(tick);
    };
  }, []);

  useEffect(() => {
    setGroupFilter("");
    setProductQuery("");
  }, [vendorId]);

  const vendor: Vendor = useMemo(
    () => vendors.find((v) => v.id === vendorId) ?? normalVendors[0],
    [vendorId],
  );

  const tags = useMemo(() => {
    const m = new Map<string, number>();
    for (const p of vendor.products) m.set(p.group, (m.get(p.group) ?? 0) + 1);
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, [vendor]);

  const products = useMemo(() => {
    let list = vendor.products;
    const q = productQuery.trim().toLowerCase();
    if (q)
      list = list.filter((p) =>
        `${p.name} ${p.tagline ?? ""} ${p.specSummary} ${p.location} ${p.group}`
          .toLowerCase()
          .includes(q),
      );
    if (groupFilter) list = list.filter((p) => p.group === groupFilter);
    if (stockFilter !== "all") list = list.filter((p) => (stockFilter === "in") === p.inStock);
    if (sortDir) list = [...list].sort((a, b) => (sortDir === "asc" ? a.price - b.price : b.price - a.price));
    return list;
  }, [vendor, productQuery, groupFilter, stockFilter, sortDir]);

  const pool = showBlacklist ? blacklistVendors : normalVendors;
  const vList = useMemo(() => {
    const q = vendorQuery.trim().toLowerCase();
    return q ? pool.filter((v) => v.name.toLowerCase().includes(q)) : pool;
  }, [pool, vendorQuery]);

  const toggleFav = (id: string) => {
    setFavs((f) => {
      const next = f.includes(id) ? f.filter((x) => x !== id) : [...f, id];
      localStorage.setItem("vpsm-favs", JSON.stringify(next));
      return next;
    });
  };

  const probe = () => {
    if (probing) return;
    setProbing(true);
    setTimeout(() => {
      setProbing(false);
      setProbedAt(Date.now());
      toast(`探测完成 · ${vendor.products.filter((p) => p.inStock).length}/${vendor.products.length} 个产品在线`);
    }, 1100);
  };

  const copyAll = () =>
    copyText(
      [`【${vendor.name}】共 ${vendor.products.length} 个产品`, ...vendor.products.map(productLine)].join(
        "\n",
      ),
    );

  const marquee = ANNOUNCEMENTS.join("　✦　");
  const selectCls =
    "cursor-pointer appearance-none rounded-lg border border-line bg-card py-2 pl-3 pr-8 text-[12.5px] outline-none transition-colors hover:border-primary focus:border-primary";

  return (
    <div className="mx-auto max-w-[1500px] px-3 py-4 sm:px-5">
      {/* 顶栏 */}
      <header className="flex flex-wrap items-center gap-x-4 gap-y-2.5">
        <h1 className="text-[22px] font-bold tracking-tight">{site.name}</h1>
        <div className="flex flex-1 flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-muted">
          <span className="inline-flex items-center gap-1.5">
            <Eye size={14} /> 总访问{" "}
            <b className="font-semibold text-fg">{formatViews(stats.total)}</b>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays size={14} /> 今日 <b className="font-semibold text-fg">{stats.today}</b>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute h-full w-full animate-ping rounded-full bg-ok opacity-60" />
              <span className="h-2 w-2 rounded-full bg-ok" />
            </span>
            在线 <b className="font-semibold text-fg">{stats.online}</b>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => searchRef.current?.focus()}
            className="hidden items-center gap-1.5 rounded-lg bg-fg px-3 py-2 text-[13px] font-medium text-bg transition-opacity hover:opacity-80 md:inline-flex"
          >
            <Search size={14} /> 搜索库存
          </button>
          <button
            onClick={probe}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-[13px] font-medium text-primary-fg transition-opacity hover:opacity-90"
          >
            <RefreshCw size={14} className={probing ? "animate-spin" : ""} /> 立即探测
          </button>
          <button
            onClick={() => setSettingsOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-card px-3 py-2 text-[13px] transition-colors hover:border-primary hover:text-primary"
          >
            <Settings size={14} /> 监控设置
          </button>
        </div>
      </header>

      {/* 滚动公告 */}
      <div className="marquee mt-3 flex items-center gap-2 overflow-hidden rounded-lg border border-amber-200/70 bg-[#fff7df] px-3 py-2 text-[12.5px] text-[#8a6a1f] dark:border-[#3a331a] dark:bg-[#28220e] dark:text-[#d9b95c]">
        <Megaphone size={14} className="shrink-0 text-amber-500" />
        <div className="marquee-track">
          <span className="pr-16">{marquee}</span>
          <span className="pr-16" aria-hidden>
            {marquee}
          </span>
        </div>
      </div>

      {/* 页头广告位 */}
      <AdSlot slot="header" label="页头横幅 728×90 / 响应式" h={80} className="mt-3" />

      {/* 移动端厂商快选 */}
      <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1 lg:hidden">
        <button
          onClick={() => setShowBlacklist((s) => !s)}
          className={`whitespace-nowrap rounded-full border px-3 py-1 text-xs transition-colors ${
            showBlacklist ? "border-bad bg-bad text-white" : "border-line bg-card text-bad"
          }`}
        >
          黑名单({blacklistVendors.length})
        </button>
        {(showBlacklist ? blacklistVendors : normalVendors.slice(0, 14)).map((v) => (
          <button
            key={v.id}
            onClick={() => setVendorId(v.id)}
            className={`whitespace-nowrap rounded-full border px-3 py-1 text-xs transition-colors ${
              vendorId === v.id
                ? "border-primary bg-primary text-primary-fg"
                : "border-line bg-card text-muted"
            }`}
          >
            {v.name}
          </button>
        ))}
      </div>

      <div className="mt-3 grid items-start gap-4 lg:grid-cols-[290px,minmax(0,1fr)]">
        {/* 厂商榜（桌面端） */}
        <aside className="hidden h-fit flex-col overflow-hidden rounded-xl border border-line bg-card lg:sticky lg:top-4 lg:flex">
          <div className="border-b border-line p-3">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" />
              <input
                value={vendorQuery}
                onChange={(e) => setVendorQuery(e.target.value)}
                placeholder="搜索厂商..."
                className="w-full rounded-lg border border-line bg-bg py-2 pl-8 pr-3 text-[13px] outline-none transition-colors placeholder:text-muted/70 focus:border-primary"
              />
            </div>
          </div>
          <button
            onClick={() => setShowBlacklist((s) => !s)}
            className={`mx-3 mt-2.5 flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[13px] font-medium transition-colors ${
              showBlacklist ? "bg-bad/10" : "text-bad hover:bg-bad/10"
            }`}
          >
            <ShieldAlert size={14} /> 黑名单({blacklistVendors.length})
          </button>
          <div className="max-h-[calc(100vh-380px)] min-h-[240px] space-y-0.5 overflow-y-auto p-2">
            {vList.map((v) => {
              const rank = pool.indexOf(v) + 1;
              const active = v.id === vendorId;
              return (
                <button
                  key={v.id}
                  onClick={() => setVendorId(v.id)}
                  className={`flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left transition-colors ${
                    active ? "bg-accent text-primary" : "hover:bg-soft"
                  }`}
                >
                  {showBlacklist ? (
                    <ShieldAlert size={13} className="shrink-0 text-bad" />
                  ) : rank <= 10 ? (
                    <span className="grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full bg-rank text-[10px] font-bold text-white">
                      {rank}
                    </span>
                  ) : (
                    <span className="w-[18px] shrink-0 text-center text-[11px] text-muted">{rank}</span>
                  )}
                  <span className="w-11 shrink-0 text-[11px] tabular-nums text-muted">
                    [{formatViews(v.views)}]
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px]">{v.name}</span>
                    {showBlacklist && v.blacklistReason && (
                      <span className="block truncate text-[10px] text-bad/80">{v.blacklistReason}</span>
                    )}
                  </span>
                  {!showBlacklist && (
                    <span className="shrink-0 text-[11px] tabular-nums text-muted">
                      {v.products.length}
                    </span>
                  )}
                </button>
              );
            })}
            {vList.length === 0 && (
              <div className="py-8 text-center text-[12px] text-muted">没有匹配的厂商</div>
            )}
          </div>
          <div className="border-t border-line p-3">
            <AdSlot slot="sidebar" label="侧栏竖幅 300×250" h={210} />
          </div>
        </aside>

        {/* 厂商详情 */}
        <main className="min-w-0 overflow-hidden rounded-xl border border-line bg-card">
          {vendor.blacklisted && (
            <div className="m-4 mb-0 flex items-start gap-2 rounded-lg border border-bad/30 bg-bad/10 p-3 text-[12.5px] text-bad">
              <ShieldAlert size={15} className="mt-px shrink-0" />
              <div>
                <b>风险警示：</b>
                {vendor.blacklistReason}。请谨慎交易，本站已停止收录该厂商的推广链接。
              </div>
            </div>
          )}

          {/* 头部：品牌 + 筛选 */}
          <div className="flex flex-wrap items-center gap-3 p-4 pb-3">
            <span
              className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-[15px] font-bold text-white"
              style={{ background: avatarGradient(vendor.name) }}
            >
              {vendor.name[0]}
            </span>
            <h2 className="text-[17px] font-semibold">{vendor.name}</h2>
            <div className="ml-auto flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search
                  size={13}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted"
                />
                <input
                  ref={searchRef}
                  value={productQuery}
                  onChange={(e) => setProductQuery(e.target.value)}
                  placeholder="搜索..."
                  className="w-36 rounded-lg border border-line bg-bg py-2 pl-8 pr-3 text-[12.5px] outline-none transition-colors placeholder:text-muted/70 focus:border-primary sm:w-44"
                />
              </div>
              <div className="relative">
                <select
                  value={groupFilter}
                  onChange={(e) => setGroupFilter(e.target.value)}
                  className={selectCls}
                  aria-label="产品组筛选"
                >
                  <option value="">全部产品组</option>
                  {tags.map(([g, n]) => (
                    <option key={g} value={g}>
                      {g} ({n})
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={12}
                  className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted"
                />
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
                <ChevronDown
                  size={12}
                  className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted"
                />
              </div>
              <div className="flex overflow-hidden rounded-lg border border-line">
                <button
                  onClick={() => setView("table")}
                  className={`p-2 transition-colors ${
                    view === "table" ? "bg-accent text-primary" : "text-muted hover:text-fg"
                  }`}
                  title="列表视图"
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
          </div>

          {/* 标签 + 复制全部 */}
          <div className="flex flex-wrap items-center gap-2 border-b border-line px-4 py-2.5">
            {tags.map(([g, n]) => (
              <button
                key={g}
                onClick={() => setGroupFilter(groupFilter === g ? "" : g)}
                className={`rounded-full border px-2.5 py-0.5 text-[11.5px] transition-colors ${
                  groupFilter === g
                    ? "border-primary bg-primary text-primary-fg"
                    : "border-line text-muted hover:border-primary hover:text-primary"
                }`}
              >
                {g} {n}
              </button>
            ))}
            <button
              onClick={copyAll}
              className="ml-auto inline-flex items-center gap-1.5 rounded-md border border-line px-2.5 py-1 text-[11.5px] text-muted transition-colors hover:border-primary hover:text-primary"
            >
              <Copy size={11} /> 复制全部({vendor.products.length})
            </button>
          </div>

          {/* 内容区 */}
          {products.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-16 text-muted">
              <PackageSearch size={36} className="opacity-40" />
              <span className="text-[13px]">没有匹配的产品，试试调整筛选条件</span>
            </div>
          ) : view === "table" ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] text-left">
                <thead>
                  <tr className="whitespace-nowrap border-b border-line text-[12px] text-muted">
                    <th className="px-4 py-2.5 font-medium">
                      操作
                      <Flame size={11} className="ml-1 inline text-rank" />
                    </th>
                    <th className="px-4 py-2.5 font-medium">产品</th>
                    <th className="px-4 py-2.5 font-medium">
                      <button
                        onClick={() =>
                          setSortDir((d) => (d === "" ? "asc" : d === "asc" ? "desc" : ""))
                        }
                        className="inline-flex items-center gap-0.5 transition-colors hover:text-fg"
                      >
                        价格
                        {sortDir === "" ? (
                          <ArrowUpDown size={11} className="opacity-40" />
                        ) : sortDir === "asc" ? (
                          <ArrowUp size={11} className="text-primary" />
                        ) : (
                          <ArrowDown size={11} className="text-primary" />
                        )}
                      </button>
                    </th>
                    <th className="px-4 py-2.5 font-medium">规格</th>
                    <th className="px-4 py-2.5 font-medium">机房</th>
                    <th className="px-4 py-2.5 font-medium">分组</th>
                    <th className="px-4 py-2.5 font-medium">状态</th>
                    <th className="px-4 py-2.5 font-medium">上次探测</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <ProductRow
                      key={p.id}
                      p={p}
                      fav={favs.includes(p.id)}
                      onFav={() => toggleFav(p.id)}
                      probedAt={probedAt}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid gap-3 p-4 sm:grid-cols-2 2xl:grid-cols-3">
              {products.map((p) => (
                <div key={p.id} className="flex flex-col gap-2 rounded-xl border border-line bg-bg p-4">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => toggleFav(p.id)}
                      className={favs.includes(p.id) ? "text-amber-400" : "text-muted/40 hover:text-amber-400"}
                    >
                      <Star size={13} fill={favs.includes(p.id) ? "currentColor" : "none"} />
                    </button>
                    <span className="text-[14px] font-medium">{p.name}</span>
                    <span className="ml-auto">
                      {p.inStock ? (
                        <CircleCheck size={15} className="text-ok" />
                      ) : (
                        <span className="rounded bg-bad/10 px-1.5 py-0.5 text-[10.5px] text-bad">缺货</span>
                      )}
                    </span>
                  </div>
                  {p.tagline && <div className="text-[11px] text-muted">{p.tagline}</div>}
                  <div className="space-y-0.5 text-[11.5px] text-muted">
                    {p.specs.slice(0, 5).map((s) => (
                      <div key={s.label} className="flex gap-1.5">
                        <span className="w-8 shrink-0">{s.label}</span>
                        <span className="text-fg/80">{s.value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-auto flex items-center gap-2 pt-1.5">
                    <PriceSelect p={p} />
                    <a
                      href={p.buyUrl === "#" ? undefined : p.buyUrl}
                      target="_blank"
                      rel="nofollow noopener noreferrer"
                      onClick={
                        p.buyUrl === "#"
                          ? (e) => {
                              e.preventDefault();
                              toast("演示数据：该厂商未配置购买链接", "err");
                            }
                          : undefined
                      }
                      className="inline-flex flex-1 items-center justify-center gap-1 rounded-md bg-primary py-1.5 text-[12px] font-medium text-primary-fg transition-opacity hover:opacity-90"
                    >
                      购买 <ExternalLink size={10} />
                    </a>
                    <button
                      onClick={() => copyText(productLine(p))}
                      className="rounded-md p-1.5 text-muted transition-colors hover:text-primary"
                    >
                      <Copy size={13} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-[10.5px] text-muted">
                    <span>{p.location} · {p.group}</span>
                    <span className="tabular-nums">探测 {probeTime(probedAt ? 0 : p.lastProbeMinsAgo)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* 页脚 */}
      <footer className="mt-4 space-y-3 pb-8">
        <AdSlot slot="footer" label="页脚横幅 970×90" h={80} />
        <p className="text-center text-[11.5px] leading-relaxed text-muted">
          © 2026 {site.name} · 本站数据为演示数据，购买前请以厂商官网为准 ·{" "}
          <Link href="/advertise" className="text-primary hover:underline">
            广告合作
          </Link>
        </p>
      </footer>

      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
