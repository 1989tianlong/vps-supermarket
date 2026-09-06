import { SiteHeader } from "@/components/SiteHeader";
import { Ticker } from "@/components/Ticker";
import { MarketBoard } from "@/components/MarketBoard";
import { AdSlot } from "@/components/AdSlot";
import { getStockData, parseTicker } from "@/lib/stock";
import { site } from "@/config/site";
import Link from "next/link";

export const revalidate = 1800;

export default async function Home() {
  const data = await getStockData();
  const { segments } = data ? parseTicker(data.ticker) : { segments: [] };

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <div className="mx-auto max-w-[1600px] space-y-3 px-3 py-4 sm:px-5">
        {/* 首页最上方推广位 */}
        <AdSlot slot="top" variant="strip" label="首页顶部横条" />

        <Ticker segments={segments} />
        <AdSlot slot="header" label="页头横幅 728×90 / 响应式" h={76} />

        <MarketBoard data={data} />

        <AdSlot slot="footer" label="页脚横幅 970×90" h={76} />

        <footer className="space-y-1.5 pb-6 text-center text-[11.5px] leading-relaxed text-muted">
          <p>
            © 2026 {site.name} · 库存与价格数据来源{" "}
            <a
              href={site.dataSource ? `https://${site.dataSource}` : "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {site.dataSource}
            </a>{" "}
            （每 6 小时同步）· 购买前请以厂商官网为准
          </p>
          <p>
            <Link href="/vendors" className="text-primary hover:underline">
              厂商大全
            </Link>{" "}
            ·{" "}
            <Link href="/guide" className="text-primary hover:underline">
              选购指南
            </Link>{" "}
            ·{" "}
            <Link href="/about" className="text-primary hover:underline">
              关于我们
            </Link>{" "}
            ·{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              隐私政策
            </Link>{" "}
            ·{" "}
            <Link href="/tools" className="text-primary hover:underline">
              开发者工具
            </Link>{" "}
            ·{" "}
            <Link href="/advertise" className="text-primary hover:underline">
              广告合作
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
}
