export const site = {
  name: "VPS超市",
  tagline: "VPS 库存监控 / 优惠推荐 / 有货提醒",
  version: "2.0.0",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "https://vps-supermarket.vercel.app"),
  /** 采集数据所在的 GitHub 仓库（用于站点拉取最新数据） */
  repoRawUrl:
    process.env.NEXT_PUBLIC_REPO_RAW_URL ??
    "https://raw.githubusercontent.com/1989tianlong/vps-supermarket",
  /** 数据来源（展示署名） */
  dataSource: "panel.yins.win/stock",
  community: {
    // 社区入口（配置后显示在顶栏）：订阅更新 / 用户群 / 频道
    subscribe: "",
    group: "",
    channel: "",
  },
  ads: {
    // 统一开关：接入广告联盟（Google AdSense / 联盟推广等）时置为 true 并填入广告代码
    enabled: false,
    contact: "mailto:ads@yins.win",
    slots: {
      header: "", // 页头横幅
      leftRail: "", // 左侧竖栏（多块堆叠）
      rightRail: "", // 右侧竖栏
      inline: "", // 信息流嵌入
      footer: "", // 页脚横幅
    },
  },
};

export type AdSlotKey = keyof typeof site.ads.slots;
