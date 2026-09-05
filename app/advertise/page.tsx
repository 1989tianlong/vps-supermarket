import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { AdSlot } from "@/components/AdSlot";
import { site } from "@/config/site";
import { Megaphone, TrendingUp, Target, MousePointerClick, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "广告合作 & 项目说明",
  description:
    "在 VPS超市 投放广告：页头横幅、两侧竖栏、信息流原生、页脚横幅等多种广告位，触达高购买意向的 VPS 选购用户。",
  alternates: { canonical: "/advertise" },
};

const SLOTS = [
  {
    name: "两侧竖栏推广",
    size: "300×250 / 300×140",
    desc: "库存看板两侧，与厂商榜单同屏，浏览时长内持续曝光（等同原站左右 rail 位）",
    icon: Target,
  },
  {
    name: "页头横幅",
    size: "728×90 / 响应式",
    desc: "全站首屏顶部，滚动公告下方，曝光量最大",
    icon: Megaphone,
  },
  {
    name: "信息流原生",
    size: "响应式卡片",
    desc: "嵌入产品列表之间，与内容混排，点击率高",
    icon: MousePointerClick,
  },
  {
    name: "页脚横幅",
    size: "970×90",
    desc: "页面底部兜底曝光，适合低价走量联盟流量",
    icon: TrendingUp,
  },
];

export default function AdvertisePage() {
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
            {site.name}聚合 40+ 家 VPS 厂商的实时库存与优惠信息，用户带着明确的服务器选购意图来访，
            是 VPS / 域名 / CDN / 建站工具类产品的高转化投放场景。站点已预留标准化广告位与接入配置，
            开通即上。
          </p>
          <a
            href={site.ads.contact}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-[14px] font-semibold text-primary-fg transition-opacity hover:opacity-85"
          >
            <Mail size={15} /> 联系我们洽谈
          </a>
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

        <h2 className="mb-3 mt-8 text-[18px] font-bold">接入方式</h2>
        <div className="space-y-3">
          <div className="rounded-xl border border-line bg-card p-5 text-[13px] leading-relaxed text-muted">
            <b className="text-fg">① 联盟自助接入（AdSense / 联盟推广）</b>
            <br />
            站点已在{" "}
            <code className="rounded bg-soft px-1.5 py-0.5 text-[12px] text-primary">
              config/site.ts
            </code>{" "}
            中预留 <code className="rounded bg-soft px-1.5 py-0.5 text-[12px] text-primary">ads</code>{" "}
            配置：将广告代码片段填入对应槽位（页头 / 左右竖栏 / 信息流 / 页脚）并把{" "}
            <code className="rounded bg-soft px-1.5 py-0.5 text-[12px] text-primary">enabled</code>{" "}
            置为 <code>true</code>，重新部署即可全站生效，占位符自动替换为真实广告。
          </div>
          <div className="rounded-xl border border-line bg-card p-5 text-[13px] leading-relaxed text-muted">
            <b className="text-fg">② 厂商直投 / 包月合作</b>
            <br />
            支持 CPM / 包月结算，厂商直投可带专属购买链接与优惠码。邮件联系：
            <a className="text-primary hover:underline" href={site.ads.contact}>
              {site.ads.contact}
            </a>
          </div>
        </div>

        <AdSlot slot="footer" label="本页页脚横幅 970×90" h={80} className="mt-8" />

        <h2 id="about" className="mb-3 mt-10 scroll-mt-6 text-[18px] font-bold">
          项目说明
        </h2>
        <div className="rounded-xl border border-line bg-card p-5 text-[13px] leading-relaxed text-muted">
          <p>
            {site.name}（v{site.version}）是 VPS 库存监控与优惠聚合面板：按厂商聚合产品与报价，
            展示库存状态、机房位置、价格周期与最近探测时间，支持线路/地区筛选、价格排序、产品收藏、
            复制清单、缺货到货提醒与黑名单风险警示，并提供 IP 家宽属性检测工具。
          </p>
          <p className="mt-2">
            库存与价格数据每 6 小时从公开数据源自动同步一次；技术栈 Next.js 15 + TypeScript +
            Tailwind CSS，部署于 Vercel。欢迎通过{" "}
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
