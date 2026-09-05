"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Radar,
  ScanSearch,
  Sun,
  Moon,
  Monitor,
  Github,
  Send,
  Users,
  Rss,
} from "lucide-react";
import { site } from "@/config/site";

const TABS = [
  { href: "/", label: "库存监控" },
  { href: "/ip-check", label: "IP家宽检测" },
  { href: "/tools", label: "开发者工具" },
];

const THEMES = [
  { key: "light", icon: Sun, title: "浅色" },
  { key: "dark", icon: Moon, title: "深色" },
  { key: "system", icon: Monitor, title: "跟随系统" },
] as const;

function applyTheme(mode: string) {
  const resolved =
    mode === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : mode;
  const el = document.documentElement;
  el.classList.remove("theme-dark", "theme-light");
  el.classList.add(`theme-${resolved}`);
  localStorage.setItem("vpsm-theme", mode);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [mode, setMode] = useState("dark");
  const [stats, setStats] = useState<{ total: number; today: number; online: number } | null>(null);

  useEffect(() => {
    setMode(localStorage.getItem("vpsm-theme") ?? "dark");
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
    return () => clearInterval(t);
  }, []);

  const pick = (key: string) => {
    setMode(key);
    applyTheme(key);
  };

  const fmt = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(2)}K` : String(n));

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-card/85 backdrop-blur-md">
      <div className="mx-auto max-w-[1600px] px-3 sm:px-5">
        <div className="flex h-14 items-center gap-3">
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-emerald-400 to-teal-600 text-[#04160e] shadow-[0_0_18px_rgba(52,211,153,0.35)]">
              <Radar size={17} strokeWidth={2.4} />
            </span>
            <b className="text-[15.5px] tracking-tight">{site.name}</b>
            <span className="num hidden rounded border border-line px-1 py-px text-[9.5px] uppercase tracking-widest text-primary sm:inline">
              live
            </span>
          </Link>

          <nav className="hidden items-center rounded-full border border-line bg-bg p-0.5 sm:flex">
            {TABS.map((t) => {
              const active = pathname === t.href;
              return (
                <Link
                  key={t.href}
                  href={t.href}
                  className={`rounded-full px-3.5 py-1 text-[12.5px] transition-colors ${
                    active
                      ? "bg-primary font-semibold text-primary-fg"
                      : "text-muted hover:text-fg"
                  }`}
                >
                  {t.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            {stats && (
              <div className="hidden items-center gap-3.5 text-[12px] text-muted md:flex">
                <span className="inline-flex items-center gap-1.5">
                  <ScanSearch size={13} /> 总访问{" "}
                  <b className="num font-semibold text-fg">{fmt(stats.total)}</b>
                </span>
                <span>
                  今日 <b className="num font-semibold text-fg">{fmt(stats.today)}</b>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute h-full w-full animate-ping rounded-full bg-ok opacity-70" />
                    <span className="h-1.5 w-1.5 rounded-full bg-ok" />
                  </span>
                  在线 <b className="num font-semibold text-fg">{stats.online}</b>
                </span>
              </div>
            )}

            {site.community.subscribe && (
              <a
                href={site.community.subscribe}
                target="_blank"
                rel="noopener noreferrer"
                title="订阅更新"
                className="hidden rounded-lg p-2 text-muted hover:bg-soft hover:text-fg sm:block"
              >
                <Rss size={16} />
              </a>
            )}
            {site.community.group && (
              <a
                href={site.community.group}
                target="_blank"
                rel="noopener noreferrer"
                title="加入用户群"
                className="hidden rounded-lg p-2 text-muted hover:bg-soft hover:text-fg sm:block"
              >
                <Users size={16} />
              </a>
            )}
            {site.community.channel && (
              <a
                href={site.community.channel}
                target="_blank"
                rel="noopener noreferrer"
                title="加入频道"
                className="hidden rounded-lg p-2 text-muted hover:bg-soft hover:text-fg sm:block"
              >
                <Send size={16} />
              </a>
            )}
            <a
              href="https://github.com/1989tianlong/vps-supermarket"
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub"
              className="hidden rounded-lg p-2 text-muted hover:bg-soft hover:text-fg sm:block"
            >
              <Github size={16} />
            </a>

            <div className="flex items-center rounded-full border border-line bg-bg p-0.5">
              {THEMES.map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.key}
                    title={t.title}
                    aria-label={t.title}
                    onClick={() => pick(t.key)}
                    className={`grid h-6 w-7 place-items-center rounded-full transition-colors ${
                      mode === t.key ? "bg-primary text-primary-fg" : "text-muted hover:text-fg"
                    }`}
                  >
                    <Icon size={13} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 移动端第二行：可横滑的页签 */}
        <nav className="-mx-3 flex gap-1.5 overflow-x-auto px-3 pb-2 sm:hidden">
          {TABS.map((t) => {
            const active = pathname === t.href;
            return (
              <Link
                key={t.href}
                href={t.href}
                className={`shrink-0 whitespace-nowrap rounded-full border px-3 py-1 text-[12px] transition-colors ${
                  active
                    ? "border-primary bg-primary font-semibold text-primary-fg"
                    : "border-line bg-bg text-muted"
                }`}
              >
                {t.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
