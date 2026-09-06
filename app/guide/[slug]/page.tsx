import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { guideArticles, getGuideArticle } from "@/lib/guide";

export function generateStaticParams() {
  return guideArticles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const a = getGuideArticle(slug);
  if (!a) return { title: "文章不存在" };
  return {
    title: a.title,
    description: a.intro,
    alternates: { canonical: `/guide/${a.slug}` },
  };
}

export default async function GuideArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = getGuideArticle(slug);
  if (!a) notFound();

  const others = guideArticles.filter((x) => x.slug !== a.slug).slice(0, 3);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <article className="mx-auto max-w-[780px] px-4 py-10">
        <div className="flex items-center gap-2 text-[12px]">
          <Link href="/guide" className="text-primary hover:underline">
            选购指南
          </Link>
          <span className="text-muted">/</span>
          <span className="rounded-full bg-primary-soft px-2 py-0.5 font-medium text-primary">{a.tag}</span>
          <span className="num text-muted">{a.date}</span>
        </div>

        <h1 className="mt-3 text-[25px] font-bold leading-snug">{a.title}</h1>
        <p className="mt-3 rounded-xl border border-line bg-card p-4 text-[13.5px] leading-relaxed text-muted">
          {a.intro}
        </p>

        <div className="mt-6 space-y-7">
          {a.sections.map((s) => (
            <section key={s.h}>
              <h2 className="mb-2 text-[17px] font-bold">{s.h}</h2>
              {s.ps.map((p, i) => (
                <p key={i} className="mb-3 text-[14px] leading-[1.9] text-muted">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>

        <div className="mt-10 rounded-xl border border-line bg-card p-5">
          <b className="text-[14px]">延伸阅读</b>
          <div className="mt-3 space-y-2">
            {others.map((o) => (
              <Link
                key={o.slug}
                href={`/guide/${o.slug}`}
                className="block text-[13px] text-muted transition-colors hover:text-primary"
              >
                → {o.title}
              </Link>
            ))}
          </div>
        </div>

        <p className="mt-6 text-[11.5px] text-muted">
          内容为原创经验分享，仅供参考。选购决策请结合本站
          <Link href="/" className="text-primary hover:underline">库存监控</Link>
          的实时数据。
        </p>
      </article>
    </div>
  );
}
