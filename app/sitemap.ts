import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { guideArticles } from "@/lib/guide";
import { getStockData, makeVendorSlugMap } from "@/lib/stock";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const data = await getStockData();
  const providers = (data?.providers ?? []).filter(
    (p) => p.name && !p.name.includes("黑名单") && p.name !== "全部产品组",
  );
  const slugMap = makeVendorSlugMap(providers.map((p) => p.name));

  return [
    { url: site.url, lastModified: now, changeFrequency: "hourly", priority: 1 },
    { url: `${site.url}/vendors`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${site.url}/ip-check`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${site.url}/guide`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    ...guideArticles.map((a) => ({
      url: `${site.url}/guide/${a.slug}`,
      lastModified: new Date(a.date),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...providers.map((p) => ({
      url: `${site.url}/vendor/${slugMap.get(p.name)}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.6,
    })),
    { url: `${site.url}/about`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${site.url}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${site.url}/advertise`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];
}
