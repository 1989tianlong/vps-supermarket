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
    "VPS超市聚合 40+ 家国内外 VPS 厂商的实时库存监控面板，持续更新 VPS 优惠与限时促销；支持按线路、地区、库存状态精准筛选，附热销榜单、有货提醒与 IP 家宽属性检测。",
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
    "IP家宽检测",
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
    description: "实时监控 40+ 家 VPS 厂商库存与优惠，支持线路与地区筛选、有货提醒与 IP 家宽检测。",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0e13" },
    { media: "(prefers-color-scheme: light)", color: "#f6f7f6" },
  ],
};

// 主题防闪烁：dark 为默认，light 覆盖，system 跟随
const themeInit = `(()=>{try{const v=['light','dark','system'];let m='dark';const s=localStorage.getItem('vpsm-theme');if(v.includes(s))m=s;if(m==='system')m=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.classList.add(m==='dark'?'theme-dark':'theme-light');}catch(e){document.documentElement.classList.add('theme-dark')}})();`;

const jsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: site.name,
  alternateName: ["VPS推荐", "VPS库存面板"],
  url: site.url,
  description: "聚合多厂商 VPS 实时库存监控面板，支持线路筛选、有货提醒与 IP 家宽检测。",
  inLanguage: "zh-CN",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${site.url}/vendors?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        {site.adsense.publisherId && (
          <>
            <meta name="google-adsense-account" content={site.adsense.publisherId} />
            <script
              async
              src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${site.adsense.publisherId}`}
              crossOrigin="anonymous"
            />
          </>
        )}
      </head>
      <body>
        {children}
        <ToastHost />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      </body>
    </html>
  );
}
