import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { AdSlot } from "@/components/AdSlot";
import { site } from "@/config/site";
import { getStockData } from "@/lib/stock";
import {
  Megaphone,
  TrendingUp,
  Target,
  MousePointerClick,
  Mail,
  Handshake,
  Code2,
  Rocket,
} from "lucide-react";

export const metadata: Metadata = {
  title: "广告合作",
  description:
    "在 VPS超市 投放广告：页头横幅、两侧竖栏、信息流原生、页脚横幅等多种广告位，触达高购买意向的 VPS 选购用户。支持包月与 CPM 结算。",
  alternates: { canonical: "/advertise" },
};

const SLOTS = [
  {
    name: "页头横幅",
    size: "728×90 / 响应式",
    desc: "首屏顶部、滚动公告下方，全站页面可见，曝光量最大",
    icon: Megaphone,
  },
  {
    name: "两侧竖栏推广",
    size: "300×250 / 300×140",
    desc: "库存看板两侧，与厂商榜单同屏，浏览时长内持续曝光",
    icon: Target,
  },
  {
    name: "信息流原生",
    size: "响应式卡片",
    desc: "嵌入产品列表之间，与内容混排，点击率最高",
    icon: MousePointerClick,
  },
  {
    name: "页脚横幅",
    size: "970×90",
    desc: "页面底部兜底曝光，适合低价走量联盟流量",
    icon: TrendingUp,
  },
];

const STEPS = [
  {
    icon: Mail,
    title: "① 邮件洽谈",
    desc: "说明你的产品、期望位置与周期，我们会回复实时流量数据与报价。",
  },
  {
    icon: Code2,
    title: "② 提供素材",
    desc: "给你准备好 banner 图或推广链接 / 广告代码即可，也支持我们代为制作。",
  },
  {
    icon: Rocket,
    title: "③ 上线投放",
    desc: "最快当天上线，期间提供位置截图与点击数据，效果不满意可随时调整。",
  },
];

export default async function AdvertisePage() {
  const data = await getStockData();
  const providerCount = data?.providers.filter((p) => !p.blacklisted).length ?? 0;
  const productCount = Object.values(data?.stock ?? {}).reduce(
    (n, s) => n + s.products.length,
    0,
  );

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="mx-auto max-w-[900px] px-4 py-8">
        <div className="fade-up rounded-2xl border border-line bg-card p-8 text-center">
          <span className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-xl bg-primary-soft text-primary">
            <Megaphone size={22} />
          </span>
          <h1 className="text-[26px] font-bold">在 {site.name} 投放广告</h1>
          <p className="mx-auto mt-3 max-w-xl text-[13.5px] leading-relaxed text-muted">
            本站聚合 {providerCount} 家 VPS 厂商、{productCount}
            个在售套餐的实时库存数据，访客都是带着明确服务器选购意图的开发者与站长——
            是 VPS / 域名 / CDN / 建站工具类产品的高转化投放场景。
          </p>
          <a
            href={site.ads.contact}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-[14px] font-semibold text-primary-fg transition-opacity hover:opacity-85"
          >
            <Mail size={15} /> 广告合作：ytlhack@gmail.com
          </a>
        </div>

        <h2 className="mb-3 mt-8 text-[18px] font-bold">为什么值得投</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            ["精准受众", "访客正在比价选购 VPS，购买意图明确，无需二次教育"],
            ["原生场景", "广告位融入库存看板与厂商榜单，而非弹窗骚扰"],
            ["数据透明", "投放期间提供位置、曝光与点击数据，效果可量化"],
          ].map(([t, d]) => (
            <div key={t} className="rounded-xl border border-line bg-card p-4">
              <b className="text-[13.5px]">{t}</b>
              <p className="mt-1.5 text-[12px] leading-relaxed text-muted">{d}</p>
            </div>
          ))}
        </div>

        <h2 className="mb-3 mt-8 text-[18px] font-bold">广告位与规格</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {SLOTS.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.name}
                className="rounded-xl border border-line bg-card p-5 transition-colors hover:border-primary/40"
              >
                <div className="flex items-center gap-2.5">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary-soft text-primary">
                    <Icon size={16} />
                  </span>
                  <b className="text-[14.5px]">{s.name}</b>
                  <span className="num ml-auto rounded-full bg-soft px-2 py-0.5 text-[11px] text-muted">
                    {s.size}
                  </span>
                </div>
                <p className="mt-2.5 text-[12.5px] leading-relaxed text-muted">{s.desc}</p>
              </div>
            );
          })}
        </div>

        <h2 className="mb-3 mt-8 text-[18px] font-bold">合作流程</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {STEPS.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.title} className="rounded-xl border border-line bg-card p-5">
                <Icon size={18} className="text-primary" />
                <b className="mt-2 block text-[13.5px]">{s.title}</b>
                <p className="mt-1.5 text-[12px] leading-relaxed text-muted">{s.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-6 rounded-xl border border-primary/30 bg-primary-soft p-5 text-[13px] leading-relaxed">
          <div className="flex items-center gap-2">
            <Handshake size={16} className="text-primary" />
            <b className="text-fg">支持的合作形式</b>
          </div>
          <p className="mt-1.5 text-muted">
            包月固定位置 · CPM 结算 · 厂商直投（带专属购买链接与优惠码，可进入顶部优惠公告与热销榜） ·
            联盟推广位互换。采购预算与周期灵活，欢迎邮件沟通。
          </p>
        </div>

        <AdSlot slot="footer" label="本页页脚横幅 970×90" h={80} className="mt-8" />

        <h2 id="about" className="mb-3 mt-10 scroll-mt-6 text-[18px] font-bold">
          项目说明
        </h2>
        <div className="rounded-xl border border-line bg-card p-5 text-[13px] leading-relaxed text-muted">
          <p>
            {site.name}（v{site.version}）是 VPS
            库存监控与优惠聚合面板：按厂商聚合产品与报价，展示库存状态、机房位置、价格周期与最近探测时间，
            支持线路/地区筛选、价格排序、产品收藏、复制清单、缺货到货提醒与黑名单风险警示，并提供 IP
            家宽属性检测等开发者工具。
          </p>
          <p className="mt-2">
            库存与价格数据每 6 小时从公开数据源自动同步；技术栈 Next.js + Tailwind CSS，部署于 Vercel。欢迎通过{" "}
            <Link href="/" className="text-primary hover:underline">
              库存监控首页
            </Link>{" "}
            体验全部功能。
          </p>
        </div>
      </div>
    </div>
  );
}
