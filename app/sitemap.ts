import type { MetadataRoute } from "next";
import { site } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: site.url, lastModified: now, changeFrequency: "hourly", priority: 1 },
    { url: `${site.url}/ip-check`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${site.url}/advertise`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];
}
