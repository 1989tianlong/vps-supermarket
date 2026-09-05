"use client";

import { useEffect, useState, type ComponentType } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Activity,
  Warehouse,
  Globe,
  ShieldCheck,
  Server,
  Radio,
  Route,
  Zap,
  Network,
  Rss,
  Wallet,
  Users,
  Package,
  Bell,
  UserCog,
  ScrollText,
  ShoppingBag,
  ChevronLeft,
  Menu,
  X,
  Sparkles,
  Sun,
  Moon,
  Monitor,
  Megaphone,
  Info,
  type LucideProps,
} from "lucide-react";
import { site } from "@/config/site";
import { toast } from "./Toast";

type NavItem = { label: string; icon: ComponentType<LucideProps>; href?: string; active?: boolean };

const NAV: { group: string; items: NavItem[] }[] = [
  {
    group: "概览",
    items: [
      { label: "仪表盘", icon: LayoutDashboard },
      { label: "流量统计", icon: Activity },
      { label: "库存监控", icon: Warehouse, href: "/", active: true },
      { label: "IP家宽检测", icon: Globe },
    ],
  },
  {
    group: "基础设施",
    items: [
      { label: "S1-证书与CDN", icon: ShieldCheck },
      { label: "S2-VPS管理", icon: Server },
      { label: "S3-监听器管理", icon: Radio },
      { label: "S4-CDN手动优选", icon: Route },
      { label: "S5-CDN自动优选", icon: Zap },
      { label: "S6-链式代理", icon: Network },
      { label: "S7-订阅聚合", icon: Rss },
    ],
  },
  {
    group: "用户管理",
    items: [
      { label: "续费成本", icon: Wallet },
      { label: "代理用户", icon: Users },
      { label: "套餐管理", icon: Package },
    ],
  },
  {
    group: "系统",
    items: [
      { label: "告警通知", icon: Bell },
      { label: "管理员", icon: UserCog },
      { label: "审计日志", icon: ScrollText },
    ],
  },
];

const THEMES = [
  { key: "sakura", icon: Sparkles, title: "樱花主题" },
  { key: "light", icon: Sun, title: "明亮主题" },
  { key: "dark", icon: Moon, title: "夜间主题" },
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
  el.classList.remove("theme-sakura", "theme-light", "theme-dark");
  el.classList.add(`theme-${resolved}`);
  localStorage.setItem("vpsm-theme", mode);
}

export function PanelShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mode, setMode] = useState<string>("sakura");

  useEffect(() => {
    setMode(localStorage.getItem("vpsm-theme") ?? "sakura");
    setCollapsed(localStorage.getItem("vpsm-collapsed") === "1");
  }, []);

  const pickTheme = (key: string) => {
    setMode(key);
    applyTheme(key);
  };

  const toggleCollapse = () => {
    setCollapsed((c) => {
      localStorage.setItem("vpsm-collapsed", c ? "0" : "1");
      return !c;
    });
  };

  const navClick = (item: NavItem) => {
    if (item.href) return;
    toast(`「${item.label}」模块规划中，敬请期待`);
    setMobileOpen(false);
  };

  const sidebarWidth = collapsed ? "w-14" : "w-56";

  return (
    <div className="min-h-screen">
      {/* 移动端遮罩 */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* 侧边栏 */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-line bg-card transition-all duration-200 ${sidebarWidth} ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* 品牌 */}
        <div className="flex h-12 shrink-0 items-center gap-2 border-b border-line px-3">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-primary text-primary-fg">
            <ShoppingBag size={15} />
          </span>
          {!collapsed && (
            <span className="truncate text-[13.5px] font-semibold">
              VPS Panel{" "}
              <sup className="font-normal text-muted">v{site.version}</sup>
            </span>
          )}
          <button
            onClick={() => (window.innerWidth < 1024 ? setMobileOpen(false) : toggleCollapse())}
            className="ml-auto hidden rounded-md p-1 text-muted hover:bg-soft hover:text-fg lg:block"
            aria-label="折叠侧栏"
          >
            <ChevronLeft size={15} className={collapsed ? "rotate-180" : ""} />
          </button>
          <button
            onClick={() => setMobileOpen(false)}
            className="ml-auto rounded-md p-1 text-muted hover:bg-soft lg:hidden"
            aria-label="关闭菜单"
          >
            <X size={16} />
          </button>
        </div>

        {/* 导航 */}
        <nav className="flex-1 overflow-y-auto px-2 py-3">
          {NAV.map((g) => (
            <div key={g.group} className="mb-4">
              {!collapsed && (
                <div className="mb-1 px-2 text-[10.5px] font-medium uppercase tracking-wider text-muted">
                  {g.group}
                </div>
              )}
              <div className="space-y-0.5">
                {g.items.map((item) => {
                  const Icon = item.icon;
                  const cls = item.active
                    ? "bg-accent font-medium text-primary"
                    : "text-muted hover:bg-soft hover:text-fg";
                  const inner = (
                    <>
                      <Icon size={16} className="shrink-0" />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </>
                  );
                  return item.href ? (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] transition-colors ${cls}`}
                    >
                      {inner}
                    </Link>
                  ) : (
                    <button
                      key={item.label}
                      onClick={() => navClick(item)}
                      className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] transition-colors ${cls}`}
                      title={collapsed ? item.label : undefined}
                    >
                      {inner}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* 底部：主题切换 / 链接 */}
        <div className="shrink-0 border-t border-line p-2">
          <div className={`grid grid-cols-4 gap-1 ${collapsed ? "px-0" : "px-1"}`}>
            {THEMES.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.key}
                  title={t.title}
                  aria-label={t.title}
                  onClick={() => pickTheme(t.key)}
                  className={`grid place-items-center rounded-lg border p-1.5 transition-colors ${
                    mode === t.key
                      ? "border-primary bg-primary text-primary-fg"
                      : "border-transparent text-muted hover:bg-soft hover:text-fg"
                  }`}
                >
                  <Icon size={15} />
                </button>
              );
            })}
          </div>
          <div className={`mt-2 space-y-0.5 ${collapsed ? "" : "border-t border-line pt-2"}`}>
            <Link
              href="/advertise"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] text-muted hover:bg-soft hover:text-fg"
              title={collapsed ? "广告合作" : undefined}
            >
              <Megaphone size={16} className="shrink-0" />
              {!collapsed && <span>广告合作</span>}
            </Link>
            <Link
              href="/advertise#about"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] text-muted hover:bg-soft hover:text-fg"
              title={collapsed ? "项目说明" : undefined}
            >
              <Info size={16} className="shrink-0" />
              {!collapsed && <span>项目说明</span>}
            </Link>
          </div>
          {!collapsed && (
            <div className="px-2.5 pb-1 pt-2 text-center text-[10px] text-muted">
              © 2026 {site.name}
            </div>
          )}
        </div>
      </aside>

      {/* 主内容 */}
      <div className={`transition-all duration-200 ${collapsed ? "lg:pl-14" : "lg:pl-56"}`}>
        {/* 移动端顶栏 */}
        <div className="sticky top-0 z-30 flex h-12 items-center gap-2.5 border-b border-line bg-card/90 px-3 backdrop-blur lg:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-md p-1.5 text-muted hover:bg-soft hover:text-fg"
            aria-label="打开菜单"
          >
            <Menu size={18} />
          </button>
          <span className="grid h-6 w-6 place-items-center rounded-md bg-primary text-primary-fg">
            <ShoppingBag size={13} />
          </span>
          <span className="text-[13.5px] font-semibold">{site.name}</span>
        </div>

        {children}
      </div>
    </div>
  );
}
