"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Gauge,
  Calculator,
  Clock,
  Database,
  ArrowLeftRight,
  ExternalLink,
} from "lucide-react";

const inputCls =
  "num w-full rounded-lg border border-line bg-bg px-3 py-2 text-[13.5px] outline-none transition-colors focus:border-primary";

/** 带宽 ↔ 月流量换算（持续满速跑 30 天） */
function BandwidthCalc() {
  const [mbps, setMbps] = useState("100");
  const [tb, setTb] = useState("");
  const mbpsNum = parseFloat(mbps);
  const fullTB = (mbps: number) => ((mbps * 1e6) / 8 / 1e12) * 86400 * 30; // Mbps → TB/月

  return (
    <div className="rounded-xl border border-line bg-card p-5">
      <div className="flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary-soft text-primary">
          <Gauge size={16} />
        </span>
        <b className="text-[14.5px]">带宽 ↔ 月流量换算</b>
      </div>
      <p className="mt-2 text-[12px] leading-relaxed text-muted">
        满速持续跑 30 天时，带宽能跑出的月流量上限。例：100 Mbps ≈ 32.4 TB/月。
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <label className="space-y-1">
          <span className="text-[12px] text-muted">带宽（Mbps）</span>
          <input
            className={inputCls}
            value={mbps}
            onChange={(e) => {
              setMbps(e.target.value);
              const n = parseFloat(e.target.value);
              setTb(isFinite(n) && n > 0 ? fullTB(n).toFixed(2) : "");
            }}
            inputMode="decimal"
          />
        </label>
        <label className="space-y-1">
          <span className="text-[12px] text-muted">月流量（TB）</span>
          <input
            className={inputCls}
            value={tb}
            onChange={(e) => {
              setTb(e.target.value);
              const n = parseFloat(e.target.value);
              setMbps(isFinite(n) && n > 0 ? ((n * 8 * 1e12) / 1e6 / (86400 * 30)).toFixed(1) : "");
            }}
            inputMode="decimal"
          />
        </label>
      </div>
      <div className="mt-3 rounded-lg bg-soft px-3 py-2 text-[12.5px] text-muted">
        {mbpsNum > 0 ? (
          <>
            反向参考：跑完 1 TB 需 <b className="num text-fg">{((1e12 / ((mbpsNum * 1e6) / 8)) / 3600).toFixed(1)}</b> 小时满速
          </>
        ) : (
          "输入带宽查看结果"
        )}
      </div>
    </div>
  );
}

/** 周期 → 月均价格 */
function PriceCalc() {
  const [price, setPrice] = useState("49.99");
  const [months, setMonths] = useState("12");
  const p = parseFloat(price);
  const m = parseFloat(months);
  const perMonth = isFinite(p) && isFinite(m) && m > 0 ? p / m : NaN;

  return (
    <div className="rounded-xl border border-line bg-card p-5">
      <div className="flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary-soft text-primary">
          <Calculator size={16} />
        </span>
        <b className="text-[14.5px]">VPS 周期月均计算器</b>
      </div>
      <p className="mt-2 text-[12px] leading-relaxed text-muted">
        把年付/两年付总价折算成月均，和月付方案公平对比。
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-[1fr,1fr]">
        <label className="space-y-1">
          <span className="text-[12px] text-muted">总价</span>
          <input className={inputCls} value={price} onChange={(e) => setPrice(e.target.value)} inputMode="decimal" />
        </label>
        <label className="space-y-1">
          <span className="text-[12px] text-muted">周期（月）</span>
          <select className={inputCls} value={months} onChange={(e) => setMonths(e.target.value)}>
            {["1", "3", "6", "12", "24", "36"].map((mo) => (
              <option key={mo} value={mo}>
                {mo === "1" ? "月付（1 个月）" : mo === "3" ? "季付（3 个月）" : mo === "6" ? "半年付（6 个月）" : `${mo} 个月`}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="num mt-3 rounded-lg bg-primary-soft px-3 py-2 text-[13.5px] font-semibold text-primary">
        月均 {isFinite(perMonth) ? perMonth.toFixed(2) : "—"}
      </div>
    </div>
  );
}

/** Unix 时间戳 ⇄ 日期 */
function TimestampCalc() {
  const [ts, setTs] = useState(String(Math.floor(Date.now() / 1000)));
  const [iso, setIso] = useState(new Date().toISOString());
  const n = parseInt(ts, 10);

  const fromTs = (v: string) => {
    setTs(v);
    const x = parseInt(v, 10);
    if (isFinite(x)) {
      const ms = v.length > 10 ? x : x * 1000;
      const d = new Date(ms);
      if (!isNaN(d.getTime())) setIso(d.toISOString());
    }
  };
  const fromIso = (v: string) => {
    setIso(v);
    const d = new Date(v);
    if (!isNaN(d.getTime())) setTs(String(Math.floor(d.getTime() / 1000)));
  };

  return (
    <div className="rounded-xl border border-line bg-card p-5">
      <div className="flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary-soft text-primary">
          <Clock size={16} />
        </span>
        <b className="text-[14.5px]">Unix 时间戳转换</b>
      </div>
      <div className="mt-3 space-y-3">
        <label className="block space-y-1">
          <span className="text-[12px] text-muted">时间戳（秒 / 毫秒）</span>
          <input className={inputCls} value={ts} onChange={(e) => fromTs(e.target.value)} inputMode="numeric" />
        </label>
        <label className="block space-y-1">
          <span className="text-[12px] text-muted">ISO 日期（本地时区显示）</span>
          <input className={inputCls} value={iso} onChange={(e) => fromIso(e.target.value)} />
        </label>
        <div className="rounded-lg bg-soft px-3 py-2 text-[12.5px] text-muted">
          本地时间：
          <b className="num text-fg">
            {isFinite(n)
              ? new Date(ts.length > 10 ? n : n * 1000).toLocaleString("zh-CN", { hour12: false })
              : "—"}
          </b>
        </div>
      </div>
    </div>
  );
}

export function Tools() {
  return (
    <div className="mx-auto max-w-[1100px] px-4 py-8">
      <div className="fade-up mb-6">
        <h1 className="flex items-center gap-2 text-[22px] font-bold">
          <ArrowLeftRight size={20} className="text-primary" />
          开发者小工具
        </h1>
        <p className="mt-1.5 text-[13px] text-muted">
          选购 VPS 和日常开发常用的换算工具，全部在浏览器本地计算，无请求、无追踪。
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <BandwidthCalc />
        <PriceCalc />
        <TimestampCalc />
        <div className="rounded-xl border border-line bg-card p-5">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary-soft text-primary">
              <Database size={16} />
            </span>
            <b className="text-[14.5px]">免费库存数据 API</b>
          </div>
          <p className="mt-2 text-[12px] leading-relaxed text-muted">
            本站采集的 VPS 库存数据开放为免费 JSON 接口，个人开发者可直接调用（请合理控制频率，缓存 30 分钟）。
          </p>
          <div className="num mt-3 overflow-x-auto rounded-lg bg-soft px-3 py-2 text-[12px] text-primary">
            GET {typeof window !== "undefined" ? window.location.origin : ""}/api/stock
          </div>
          <div className="num mt-2 overflow-x-auto rounded-lg bg-soft px-3 py-2 text-[12px] text-muted">
            curl -s https://vps-supermarket.vercel.app/api/stock | jq &apos;.stock.QQG.products[0]&apos;
          </div>
          <Link
            href="/api/stock"
            target="_blank"
            className="mt-3 inline-flex items-center gap-1 rounded-lg border border-line px-3 py-1.5 text-[12.5px] text-muted transition-colors hover:border-primary hover:text-primary"
          >
            打开接口看看 <ExternalLink size={11} />
          </Link>
        </div>
      </div>
    </div>
  );
}
