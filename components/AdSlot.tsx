import Link from "next/link";
import { Megaphone } from "lucide-react";
import { site, type AdSlotKey } from "@/config/site";

/**
 * 广告位组件：config/site.ts → ads.enabled + ads.slots[slot]
 * 填入广告联盟（AdSense / 联盟推广等）的 HTML 片段后自动替换占位符。
 */
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
  const code = site.ads.enabled ? site.ads.slots[slot] : "";
  if (code) {
    return (
      <div
        className={`overflow-hidden ${className}`}
        data-ad-slot={slot}
        dangerouslySetInnerHTML={{ __html: code }}
      />
    );
  }
  return (
    <div
      className={`flex flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-line bg-soft/50 px-4 text-muted ${className}`}
      style={{ minHeight: h }}
      data-ad-slot={slot}
    >
      <Megaphone size={16} className="opacity-40" />
      <div className="text-[11.5px]">广告位招租 · {label}</div>
      <Link href="/advertise" className="text-[11px] text-primary hover:underline">
        了解广告合作 →
      </Link>
    </div>
  );
}
