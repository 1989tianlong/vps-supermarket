import { site } from "@/config/site";

/** /ads.txt —— Google AdSense 授权 Sellers 记录，配置 publisherId 后自动生成 */
export function GET() {
  const pub = site.adsense.publisherId.replace(/^ca-/, "");
  const body = pub
    ? `google.com, ${pub}, DIRECT, f08c47fec0942fa0\n`
    : "# 在 config/site.ts 配置 adsense.publisherId 后，此处自动生成 ads.txt\n";
  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
