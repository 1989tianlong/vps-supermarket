import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { guideArticles } from "@/lib/guide";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: site.url, lastModified: now, changeFrequency: "hourly", priority: 1 },
    { url: `${site.url}/ip-check`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${site.url}/tools`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${site.url}/guide`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    ...guideArticles.map((a) => ({
      url: `${site.url}/guide/${a.slug}`,
      lastModified: new Date(a.date),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    { url: `${site.url}/about`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${site.url}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${site.url}/advertise`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];
}
