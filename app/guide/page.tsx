import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { guideArticles } from "@/lib/guide";
import { BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "VPS 选购指南",
  description:
    "原创 VPS 选购指南：CN2 GIA / 9929 / CMIN2 线路科普、月付年付怎么选、家宽 IP 与原生 IP 的区别、VPS 避坑检查点。",
  alternates: { canonical: "/guide" },
};

export default function GuidePage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="mx-auto max-w-[860px] px-4 py-10">
        <div className="mb-6 flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary-soft text-primary">
            <BookOpen size={18} />
          </span>
          <div>
            <h1 className="text-[22px] font-bold">VPS 选购指南</h1>
            <p className="text-[12.5px] text-muted">原创科普与避坑经验，配合库存监控页使用效果更佳。</p>
          </div>
        </div>

        <div className="space-y-3">
          {guideArticles.map((a) => (
            <Link
              key={a.slug}
              href={`/guide/${a.slug}`}
              className="fade-up block rounded-xl border border-line bg-card p-5 transition-colors hover:border-primary/50"
            >
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-primary-soft px-2 py-0.5 text-[11px] font-medium text-primary">
                  {a.tag}
                </span>
                <span className="num text-[11px] text-muted">{a.date}</span>
              </div>
              <h2 className="mt-2 text-[16.5px] font-bold leading-snug">{a.title}</h2>
              <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-muted">{a.intro}</p>
              <span className="mt-2.5 inline-block text-[12px] text-primary">阅读全文 →</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
