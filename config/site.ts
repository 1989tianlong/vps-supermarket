export const site = {
  name: "VPS超市",
  tagline: "VPS 库存监控 / 优惠推荐 / 有货提醒",
  version: "1.0.0",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "https://vps-supermarket.vercel.app"),
  // 演示用的访问量基数，真实计数在其基础上累加（/api/stats）
  statsSeed: { total: 52743, today: 466 },
  ads: {
    // 统一开关：接入广告联盟（Google AdSense /affiliates 等）时置为 true 并填入广告代码
    enabled: false,
    contact: "mailto:ads@yins.win",
    slots: {
      // 每个槽位填入广告联盟提供的 HTML 片段即可自动替换占位符
      header: "", // 页头横幅 728x90 / 响应式
      sidebar: "", // 侧栏竖幅 300x250
      inline: "", // 信息流嵌入
      footer: "", // 页脚横幅
    },
  },
};

export type AdSlotKey = keyof typeof site.ads.slots;
