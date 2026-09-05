"use client";

import { Megaphone } from "lucide-react";

/** 顶部滚动公告（内容来自真实采集数据） */
export function Ticker({ segments }: { segments: string[] }) {
  if (!segments.length) return null;
  const text = segments.join("　✦　");
  return (
    <div className="marquee relative flex items-center gap-2.5 overflow-hidden rounded-xl border border-line bg-card px-3.5 py-2 text-[12.5px] text-muted shadow-sm">
      <span className="z-10 flex shrink-0 items-center gap-1.5 rounded-full bg-primary-soft px-2 py-0.5 text-[11px] font-semibold text-primary">
        <Megaphone size={12} /> 优惠
      </span>
      <div className="marquee-track">
        <span className="pr-16">{text}</span>
        <span className="pr-16" aria-hidden>
          {text}
        </span>
      </div>
    </div>
  );
}
