/** 厂商官网对照表（购买按钮跳转厂商官网；无法确认的厂商不配置） */
export const VENDOR_LINKS: Record<string, string> = {
  QQG: "https://www.qqg.net",
  "丽萨 LisaHost": "https://www.lisahost.com",
  "搬瓦工 BandwagonHost": "https://bandwagonhost.com",
  "大妈 DMIT": "https://www.dmit.io",
  "绿云 GreenCloud": "https://greencloudvps.com",
  "小秘书 V.PS": "https://v.ps",
  VMISS: "https://app.vmiss.com",
  ByteVirt: "https://bytevirt.com",
  RackNerd: "https://www.racknerd.com",
  DediRock: "https://dedirock.com",
  "干杯云 家宽": "https://usvps24.com",
  "AaITR 家宽": "https://www.aaitr.com",
  "云悠 YUNYOO": "https://yunyoo.cc",
  "腾讯云 Tencent Cloud": "https://cloud.tencent.com",
  DMIT: "https://www.dmit.io",
  "野草云 YecaoYun": "https://www.yecaoyun.com",
  CloudCone: "https://cloudcone.com",
  "AkileCloud": "https://akile.io",
  "六六云": "https://www.liuliuyun.com",
};

/** 按厂商名取购买链接（精确 → 包含匹配） */
export function vendorLink(name: string): string | null {
  if (VENDOR_LINKS[name]) return VENDOR_LINKS[name];
  const hit = Object.keys(VENDOR_LINKS).find(
    (k) => name.includes(k) || k.includes(name.split(" ")[0] ?? name),
  );
  return hit ? VENDOR_LINKS[hit] : null;
}
