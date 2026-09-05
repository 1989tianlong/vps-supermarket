import type { Metadata, Viewport } from "next";
import "./globals.css";
import { site } from "@/config/site";
import { ToastHost } from "@/components/Toast";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} - ${site.tagline}`,
    template: `%s - ${site.name}`,
  },
  description:
    "VPS超市聚合 40+ 家国内外厂商的 VPS 库存监控面板，基于真实库存实时更新 VPS 优惠与限时促销；可按 CN2/GIA、9929、CMIN2、家宽等线路精准筛选，支持香港、美国、日本、新加坡等热门地区，附热销推荐榜单与 VPS 有货提醒。",
  keywords: [
    "VPS超市",
    "VPS库存监控",
    "VPS库存面板",
    "VPS推荐",
    "VPS优惠",
    "VPS有货提醒",
    "CN2 GIA",
    "9929",
    "CMIN2",
    "家宽VPS",
    "香港VPS",
    "美国VPS",
    "日本VPS",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: site.url,
    siteName: site.name,
    title: `${site.name} - ${site.tagline}`,
    description: "实时监控 40+ 家 VPS 厂商库存与优惠，支持 CN2/9929/CMIN2 与家宽等线路精准筛选。",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf4f7" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1218" },
  ],
};

// 主题防闪烁：渲染前读取本地主题设置
const themeInit = `(()=>{try{const v=['sakura','light','dark','system'];let m='sakura';const s=localStorage.getItem('vpsm-theme');if(v.includes(s))m=s;if(m==='system')m=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.classList.add('theme-'+m);}catch(e){document.documentElement.classList.add('theme-sakura')}})();`;

const jsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: site.name,
  alternateName: ["VPS推荐", "VPS库存面板"],
  url: site.url,
  description: "聚合多厂商 VPS 库存监控面板，实时更新 VPS 优惠，支持 CN2/9929/CMIN2 与家宽等线路筛选和有货提醒。",
  inLanguage: "zh-CN",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body>
        {children}
        <ToastHost />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      </body>
    </html>
  );
}
