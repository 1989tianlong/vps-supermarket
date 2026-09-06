import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { site } from "@/config/site";
import { Mail, Radar, Database, ShieldCheck, Wrench } from "lucide-react";

export const metadata: Metadata = {
  title: "关于我们",
  description: "关于 VPS超市：独立运营的 VPS 库存监控与优惠聚合站，数据每 6 小时自动同步，免费开放数据 API。",
  alternates: { canonical: "/about" },
};

const POINTS = [
  {
    icon: Database,
    title: "数据自动聚合",
    desc: "每 6 小时自动从公开渠道同步 40+ 家厂商的库存与报价，人工不干预排序之外的任何数据。",
  },
  {
    icon: ShieldCheck,
    title: "黑名单警示",
    desc: "公示社区反馈存在跑路、超售、恶意扣款等风险的厂商，帮你避坑。",
  },
  {
    icon: Wrench,
    title: "免费开发者工具",
    desc: "IP 家宽属性检测、带宽流量换算、月均价格计算、开放数据 API，全部免费。",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="mx-auto max-w-[800px] px-4 py-10">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary-soft text-primary">
            <Radar size={18} />
          </span>
          <h1 className="text-[24px] font-bold">关于 {site.name}</h1>
        </div>

        <p className="mt-4 text-[13.5px] leading-relaxed text-muted">
          {site.name}创立于 2026 年，是一个独立运营的 VPS
          库存监控与优惠聚合站。我们注意到选购 VPS 时最大的痛点是：各家厂商分散在不同官网、库存和促销变动快、付费周期五花八门没法比价。本站把这些信息聚合到一个看板里：库存状态、机房位置、折算月均价、最近探测时间一目了然，并提供建站常用的
          IP 家宽检测等小工具。
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {POINTS.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.title} className="rounded-xl border border-line bg-card p-4">
                <Icon size={18} className="text-primary" />
                <b className="mt-2 block text-[13.5px]">{p.title}</b>
                <p className="mt-1 text-[12px] leading-relaxed text-muted">{p.desc}</p>
              </div>
            );
          })}
        </div>

        <h2 className="mb-2 mt-8 text-[17px] font-bold">我们如何赚钱</h2>
        <p className="text-[13.5px] leading-relaxed text-muted">
          本站通过展示广告（如 Google AdSense）与厂商联盟推广链接维持服务器与开发成本，所有推广内容均会标识。这不会影响你的购买价格，也不会影响数据的中立展示。
        </p>

        <h2 className="mb-2 mt-8 text-[17px] font-bold">联系我们</h2>
        <p className="flex items-center gap-2 text-[13.5px] text-muted">
          <Mail size={15} className="text-primary" />
          商务合作或建议反馈：<a className="text-primary hover:underline" href={site.ads.contact}>{site.ads.contact}</a>
        </p>

        <div className="mt-8 flex flex-wrap gap-3 text-[12.5px]">
          <Link href="/guide" className="rounded-lg border border-line px-3 py-1.5 hover:border-primary hover:text-primary">
            选购指南
          </Link>
          <Link href="/privacy" className="rounded-lg border border-line px-3 py-1.5 hover:border-primary hover:text-primary">
            隐私政策
          </Link>
          <Link href="/" className="rounded-lg border border-line px-3 py-1.5 hover:border-primary hover:text-primary">
            库存监控
          </Link>
        </div>
      </div>
    </div>
  );
}
