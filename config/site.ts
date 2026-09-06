export const site = {
  name: "VPS超市",
  tagline: "VPS 库存监控 / 优惠推荐 / 有货提醒",
  version: "2.1.0",
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
  /**
   * Google AdSense 接入：
   * 1. 在 https://adsense.google.com 添加站点并通过审核
   * 2. 把「发布商 ID」（ca-pub- 开头）填到 publisherId
   * 3. 在 AdSense 后台按广告单元创建展示广告，把单元 ID（纯数字）填到 slots
   * 4. enabled 改为 true —— 全站广告位与 /ads.txt 自动生效
   */
  adsense: {
    enabled: false,
    publisherId: "", // 例: "ca-pub-1234567890123456"
    slots: {
      header: "", // 页头横幅广告单元 ID（数字）
      leftRail: "",
      rightRail: "",
      inline: "",
      footer: "",
    },
  },
  /**
   * 联盟直投推广位（原生卡片样式，比横幅广告转化更高）。
   * 操作：注册联盟 → 把 url 里的 YOUR_AFF_ID 换成你的联盟 ID → enabled 改 true → 重新部署。
   * 注意：url 里还留着 YOUR_AFF_ID 时不会上线（避免挂死链）。
   */
  affiliate: {
    enabled: true,
    items: [
      {
        slot: "top",
        brand: "搬瓦工 BandwagonHost",
        desc: "老牌 CN2 GIA 优化线路，三网回程好，稳定性口碑佳",
        url: "https://bandwagonhost.com/aff.php?aff=84179",
        cta: "查看优惠",
      },
      {
        slot: "vendorPanel",
        brand: "RackNerd",
        desc: "超低价年付 KVM，轻量应用性价比之选",
        url: "https://my.racknerd.com/aff.php?aff=21143",
        cta: "查看优惠",
      },
    ],
  },
  /** 兼容旧字段：联盟自定义 HTML 代码（优先级高于 AdSense 单元）
   *  示例（把 YOUR_AFF_ID 换成你的联盟 ID）：
   *  header: `<a href="https://bandwagonhost.com/aff.php?aff=YOUR_AFF_ID" target="_blank" rel="nofollow noopener"><img src="https://banner图地址" width="728" height="90" alt="ad"></a>`
   */
  ads: {
    enabled: false,
    contact: "mailto:ytlhack@gmail.com",
    slots: {
      header: "",
      leftRail: "",
      rightRail: "",
      inline: "",
      footer: "",
    },
  },
};

export type AdSlotKey = keyof typeof site.ads.slots;
