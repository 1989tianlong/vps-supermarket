import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { getStockData, makeVendorSlugMap } from "@/lib/stock";
import { monthlyEquivalent } from "@/lib/format";
import type { StockData } from "@/lib/stock";

export const revalidate = 1800;

type Params = { slug: string };

function withSlugs(data: StockData | null) {
  const providers = (data?.providers ?? []).filter(
    (p) => p.name && !p.name.includes("黑名单") && p.name !== "全部产品组",
  );
  const slugMap = makeVendorSlugMap(providers.map((p) => p.name));
  return { providers, slugMap };
}

export async function generateStaticParams(): Promise<Params[]> {
  const data = await getStockData();
  if (!data) return [];
  const { providers, slugMap } = withSlugs(data);
  return providers.map((p) => ({ slug: slugMap.get(p.name) ?? "" })).filter((x) => x.slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getStockData();
  const { providers, slugMap } = withSlugs(data);
  const provider = providers.find((p) => slugMap.get(p.name) === slug);
  if (!provider) return { title: "厂商不存在" };
  return {
    title: `${provider.name} 库存、价格与优惠 - 实时监控`,
    description: `${provider.name} 在售 ${provider.count} 个套餐的实时库存与价格监控：套餐规格、机房位置、折算月均价格、库存状态与最近探测时间，每 6 小时自动更新。`,
    alternates: { canonical: `/vendor/${slug}` },
  };
}

export default async function VendorPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const data = await getStockData();
  if (!data) notFound();
  const { providers, slugMap } = withSlugs(data);
  const provider = providers.find((p) => slugMap.get(p.name) === slug);
  if (!provider) notFound();

  const entry = data.stock[provider.name];
  const products = entry?.products ?? [];
  const inStock = products.filter((p) => p.inStock).length;
  const groups = [...new Set(products.map((p) => p.group))].filter(Boolean).slice(0, 6);
  const locations = [...new Set(products.flatMap((p) => p.locations))].filter(Boolean).slice(0, 8);

  const breadcrumbLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "VPS超市", item: "https://vps-supermarket.vercel.app/" },
      { "@type": "ListItem", position: 2, name: "厂商大全", item: "https://vps-supermarket.vercel.app/vendors" },
      { "@type": "ListItem", position: 3, name: provider.name },
    ],
  });

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbLd }} />
      <article className="mx-auto max-w-[1100px] px-4 py-8">
        <nav className="mb-3 text-[12px] text-muted">
          <Link href="/" className="text-primary hover:underline">库存监控</Link>
          {" / "}
          <Link href="/vendors" className="text-primary hover:underline">厂商大全</Link>
          {" / "}
          <span>{provider.name}</span>
        </nav>

        <h1 className="text-[24px] font-bold leading-snug">
          {provider.name} 库存、价格与优惠实时监控
        </h1>
        <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
          {provider.name} 当前收录 <b className="text-fg">{products.length}</b> 个在售套餐
          （其中有货 {inStock} 个），覆盖 {locations.join("、") || "多地"} 等{locations.length > 1 ? "机房" : "机房"}，
          产品线包括 {groups.join("、") || "多种类型"}。以下数据每 6 小时自动同步，
          实时筛选与到货提醒请使用
          <Link href="/" className="text-primary hover:underline">在线库存监控看板</Link>。
        </p>

        <div className="mt-6 overflow-x-auto rounded-xl border border-line bg-card">
          <table className="w-full min-w-[860px] text-left text-[13px]">
            <thead>
              <tr className="whitespace-nowrap border-b border-line text-[11.5px] text-muted">
                <th className="px-3 py-2.5 font-medium">产品</th>
                <th className="px-3 py-2.5 font-medium">价格</th>
                <th className="px-3 py-2.5 font-medium">月均</th>
                <th className="px-3 py-2.5 font-medium">规格</th>
                <th className="px-3 py-2.5 font-medium">机房</th>
                <th className="px-3 py-2.5 font-medium">分组</th>
                <th className="px-3 py-2.5 font-medium">状态</th>
                <th className="px-3 py-2.5 font-medium">探测</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.key} className="border-b border-line/60 align-middle last:border-0">
                  <td className="px-3 py-2.5 font-medium">{p.name}</td>
                  <td className="num whitespace-nowrap px-3 py-2.5">{p.cycles[0]?.label ?? "—"}</td>
                  <td className="num whitespace-nowrap px-3 py-2.5 text-[12px] text-muted">
                    {monthlyEquivalent(p.cycles[0]?.label) || "—"}
                  </td>
                  <td className="min-w-[200px] px-3 py-2.5 text-[12px] text-muted">{p.specSummary}</td>
                  <td className="whitespace-nowrap px-3 py-2.5 text-[12px]">{p.locations[0] ?? "—"}</td>
                  <td className="px-3 py-2.5 text-[12px] text-muted">{p.group}</td>
                  <td className="whitespace-nowrap px-3 py-2.5">
                    {p.inStock ? (
                      <span className="rounded bg-ok/10 px-1.5 py-0.5 text-[11px] text-ok">有货</span>
                    ) : (
                      <span className="rounded bg-bad/10 px-1.5 py-0.5 text-[11px] text-bad">缺货</span>
                    )}
                  </td>
                  <td className="num whitespace-nowrap px-3 py-2.5 text-[12px] text-muted" title={p.lastProbeFull}>
                    {p.lastProbeText}
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-3 py-10 text-center text-[13px] text-muted">
                    暂无在售套餐数据
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 rounded-xl border border-primary/30 bg-primary-soft p-4 text-[13px] leading-relaxed">
          想对 {provider.name} 的套餐做筛选、排序、收藏或缺货提醒？使用
          <Link href="/" className="mx-1 font-semibold text-primary hover:underline">
            在线库存监控看板
          </Link>
          即可，数据与本页同步。
        </div>
      </article>
    </div>
  );
}
