"use client";

import { useState } from "react";
import {
  Radar,
  Search,
  LocateFixed,
  ShieldCheck,
  ShieldAlert,
  Home,
  Server,
  Loader2,
} from "lucide-react";

type Result = {
  ip: string;
  verdict: string;
  risk: "low" | "mid" | "high";
  residential: boolean;
  isp: string;
  org: string;
  as: string;
  asname: string;
  reverse: string;
  cloud: string;
  geo: { country: string; region: string; city: string };
  flags: { hosting: boolean; proxy: boolean; mobile: boolean; tor: boolean };
  sources: Record<string, boolean>;
  checkedAt: string;
  error?: string;
};

function Row({ label, value }: { label: string; value?: string | number | null }) {
  if (!value) return null;
  return (
    <div className="flex items-start justify-between gap-3 border-b border-line/60 py-2 text-[13px] last:border-0">
      <span className="shrink-0 text-muted">{label}</span>
      <span className="break-all text-right font-medium">{value}</span>
    </div>
  );
}

export function IpCheck() {
  const [ip, setIp] = useState("");
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState<Result | null>(null);
  const [err, setErr] = useState("");

  const run = async (target?: string) => {
    const q = (target ?? ip).trim();
    setLoading(true);
    setErr("");
    try {
      const r = await fetch(`/api/ip-check${q ? `?ip=${encodeURIComponent(q)}` : ""}`);
      const j = await r.json();
      if (!r.ok) setErr(j.error ?? "检测失败");
      else {
        setRes(j);
        if (!q) setIp(j.ip ?? "");
      }
    } catch {
      setErr("网络错误，请稍后重试");
    }
    setLoading(false);
  };

  const riskColor =
    res?.risk === "high" ? "text-bad" : res?.risk === "mid" ? "text-rank" : "text-ok";

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="fade-up rounded-2xl border border-line bg-card p-6 sm:p-8">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary-soft text-primary">
            <Radar size={18} />
          </span>
          <h1 className="text-[19px] font-bold">IP 家宽属性检测</h1>
          <span className="rounded-full border border-line px-2 py-0.5 text-[10.5px] text-muted">
            公开
          </span>
        </div>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <input
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && run()}
            placeholder="输入要检测的 IP，如 24.120.12.122"
            className="num flex-1 rounded-xl border border-line bg-bg px-4 py-2.5 text-[14px] outline-none transition-colors placeholder:text-muted/60 focus:border-primary"
          />
          <div className="flex gap-2">
            <button
              onClick={() => run()}
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-[13.5px] font-semibold text-primary-fg transition-opacity hover:opacity-85 disabled:opacity-60"
            >
              {loading ? <Loader2 size={15} className="animate-spin" /> : <Search size={15} />}
              查询
            </button>
            <button
              onClick={() => run("")}
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-bg px-4 py-2.5 text-[13.5px] transition-colors hover:border-primary hover:text-primary disabled:opacity-60"
            >
              <LocateFixed size={15} /> 检测我的IP
            </button>
          </div>
        </div>
        <p className="mt-2.5 text-[11.5px] leading-relaxed text-muted">
          免费数据源：ip-api.com + ipwho.is（多库聚合），辅以 Tor 出口列表 / 云厂商 ASN
          表与家宽 ISP 关键词。结论仅供参考。
        </p>

        {err && (
          <div className="mt-4 rounded-xl border border-bad/30 bg-bad/10 p-3 text-[13px] text-bad">
            {err}
          </div>
        )}

        {res && !err && (
          <div className="fade-up mt-6 space-y-4">
            {/* 判定 */}
            <div
              className={`flex items-center gap-3 rounded-xl border p-4 ${
                res.risk === "high"
                  ? "border-bad/40 bg-bad/10"
                  : res.risk === "mid"
                    ? "border-rank/40 bg-rank/10"
                    : "border-ok/40 bg-ok/10"
              }`}
            >
              {res.risk === "high" ? (
                <ShieldAlert size={26} className="shrink-0 text-bad" />
              ) : res.residential ? (
                <Home size={26} className="shrink-0 text-ok" />
              ) : (
                <Server size={26} className={`shrink-0 ${riskColor}`} />
              )}
              <div>
                <div className={`text-[17px] font-bold ${riskColor}`}>{res.verdict}</div>
                <div className="num text-[12px] text-muted">{res.ip}</div>
              </div>
              {res.residential && (
                <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-ok/15 px-3 py-1 text-[12px] font-semibold text-ok">
                  <ShieldCheck size={13} /> 家宽属性
                </span>
              )}
            </div>

            {/* 标记 */}
            <div className="flex flex-wrap gap-2">
              {[
                ["机房/云", res.flags.hosting],
                ["代理/VPN", res.flags.proxy],
                ["移动网络", res.flags.mobile],
                ["Tor 出口", res.flags.tor],
              ].map(([label, on]) => (
                <span
                  key={label as string}
                  className={`rounded-lg border px-2.5 py-1 text-[12px] ${
                    on ? "border-bad/40 bg-bad/10 text-bad" : "border-line text-muted"
                  }`}
                >
                  {on ? "⚠ " : ""}
                  {label as string}
                </span>
              ))}
            </div>

            {/* 详情 */}
            <div className="rounded-xl border border-line bg-bg px-4 py-1">
              <Row label="ISP 运营商" value={res.isp} />
              <Row label="组织" value={res.org} />
              <Row label="AS" value={res.as} />
              <Row label="AS 名称" value={res.asname} />
              <Row label="反向 DNS" value={res.reverse} />
              <Row
                label="归属地"
                value={[res.geo.country, res.geo.region, res.geo.city].filter(Boolean).join(" · ")}
              />
              <Row label="云厂商特征" value={res.cloud} />
              <Row label="检测时间" value={new Date(res.checkedAt).toLocaleString("zh-CN", { hour12: false })} />
            </div>

            <p className="text-[11px] text-muted">
              数据源：{
                Object.entries(res.sources)
                  .filter(([, ok]) => ok)
                  .map(([k]) => k)
                  .join(" · ") || "—"
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
