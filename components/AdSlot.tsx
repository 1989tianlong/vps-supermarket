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
