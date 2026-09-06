import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { getStockData, makeVendorSlugMap } from "@/lib/stock";
import { formatViews } from "@/lib/format";

export const metadata: Metadata = {
  title: "厂商大全 - 全部 VPS 厂商库存与优惠",
  description: "浏览 VPS超市 收录的全部 VPS 厂商：每家厂商的独立库存监控页、在售套餐数与购买点击热度排行。",
  alternates: { canonical: "/vendors" },
};

export const revalidate = 1800;

export default async function VendorsPage() {
  const data = await getStockData();
  const providers = (data?.providers ?? []).filter(
    (p) => p.name && !p.name.includes("黑名单") && p.name !== "全部产品组",
  );
  const slugMap = makeVendorSlugMap(providers.map((p) => p.name));
  const maxClicks = Math.max(1, ...providers.map((p) => p.buyClicks));

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="mx-auto max-w-[900px] px-4 py-10">
        <h1 className="text-[22px] font-bold">厂商大全（{providers.length} 家）</h1>
        <p className="mt-1.5 text-[13px] text-muted">
          每家厂商都有独立的实时库存监控页，点击查看完整套餐、价格与库存状态。
        </p>

        <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
          {providers.map((p) => {
            const slug = slugMap.get(p.name) ?? "";
            return (
              <Link
                key={p.name}
                href={`/vendor/${slug}`}
                className="rounded-xl border border-line bg-card p-4 transition-colors hover:border-primary/50"
              >
                <div className="flex items-center gap-2">
                  <b className="text-[14px]">{p.name}</b>
                  <span className="num ml-auto text-[11px] text-muted">
                    {p.count} 个套餐
                  </span>
                </div>
                <div className="mt-2 h-[3px] overflow-hidden rounded-full bg-soft">
                  <div
                    className="h-full rounded-full bg-primary/60"
                    style={{ width: `${Math.max(3, (p.buyClicks / maxClicks) * 100)}%` }}
                  />
                </div>
                <div className="num mt-1.5 text-[10.5px] text-muted">
                  购买热度 {formatViews(p.buyClicks)}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
