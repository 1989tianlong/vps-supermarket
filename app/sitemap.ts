import type { MetadataRoute } from "next";
import { site } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${site.url}/advertise`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];
}
