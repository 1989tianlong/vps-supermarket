import Link from "next/link";
import { Megaphone } from "lucide-react";
import { site, type AdSlotKey } from "@/config/site";

/**
 * 广告位组件，三级降级：
 * 1. ads.slots[slot] 有自定义 HTML（联盟代码）→ 直接渲染
 * 2. adsense 已配置（publisherId + 单元 ID）→ 自动渲染 AdSense 展示单元
 * 3. 都没有 → "广告位招租" 占位符（可直接用于招商）
 */
declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export function AdSlot({
  slot,
  label,
  h = 90,
  className = "",
}: {
  slot: AdSlotKey;
  label: string;
  h?: number;
  className?: string;
}) {
  const custom = site.ads.enabled ? site.ads.slots[slot] : "";
  if (custom) {
    return (
      <div
        className={`overflow-hidden ${className}`}
        data-ad-slot={slot}
        dangerouslySetInnerHTML={{ __html: custom }}
      />
    );
  }

  const adSlotId = site.adsense.slots[slot];
  if (site.adsense.enabled && site.adsense.publisherId && adSlotId) {
    return (
      <div className={`overflow-hidden ${className}`} data-ad-slot={slot}>
        <ins
          className="adsbygoogle block"
          style={{ display: "block", minHeight: h }}
          data-ad-client={site.adsense.publisherId}
          data-ad-slot={adSlotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: "(adsbygoogle=window.adsbygoogle||[]).push({});",
          }}
        />
      </div>
    );
  }

  // 联盟直投原生卡片：url 里还带 YOUR_AFF_ID 占位符时不上线（防死链）
  const affItems = (site.affiliate?.items ?? []).filter(
    (i) => i.slot === slot && site.affiliate.enabled && !i.url.includes("YOUR_AFF_ID"),
  );
  if (affItems.length) {
    return (
      <div className={`space-y-2.5 ${className}`} data-ad-slot={slot}>
        {affItems.map((i) => (
          <div
            key={i.url}
            className="relative overflow-hidden rounded-xl border border-line bg-card p-4 transition-colors hover:border-primary/50"
          >
            <span className="absolute right-2.5 top-2 text-[9.5px] uppercase tracking-wider text-muted/60">
              广告
            </span>
            <b className="text-[13.5px]">{i.brand}</b>
            <p className="mt-1 text-[11.5px] leading-relaxed text-muted">{i.desc}</p>
            <a
              href={i.url}
              target="_blank"
              rel="nofollow sponsored noopener noreferrer"
              className="mt-2.5 inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-[12px] font-semibold text-primary-fg transition-opacity hover:opacity-85"
            >
              {i.cta} <Megaphone size={11} />
            </a>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-line bg-card/60 px-3 text-muted ${className}`}
      style={{ minHeight: h }}
      data-ad-slot={slot}
    >
      <Megaphone size={15} className="opacity-40" />
      <div className="text-center text-[11px] leading-relaxed">
        广告位招租
        <br />
        <span className="opacity-70">{label}</span>
      </div>
      <Link href="/advertise" className="text-[10.5px] text-primary hover:underline">
        广告合作 →
      </Link>
    </div>
  );
}
