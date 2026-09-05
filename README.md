# VPS超市 · VPS 库存监控面板

VPS 库存监控 / 优惠推荐 / 有货提醒 —— 聚合多厂商 VPS 产品与报价的实时库存监控面板。**数据管道真实**：每 6 小时自动从公开数据源同步，非手工模拟数据。

## 功能

- **厂商热度榜**：50+ 厂商按购买点击热度排名（迷你热度条 + Top3 高亮），支持厂商搜索
- **产品库存表**：产品规格 / 价格周期下拉 / 规格 / 机房（多机房下拉选择）/ 分组 / 库存状态 / 上次探测时间（完整时间戳 tooltip）
- **筛选与排序**：产品组标签筛选（含计数）、库存筛选（全部/有货/缺货）、价格排序、产品搜索（n/m 实时计数）、表格/卡片双视图
- **实用工具**：产品/整店一键复制、收藏、缺货到货提醒（本地持久化）
- **黑名单警示**：风险厂商公示与交易警示
- **监控设置**：探测频率、到货提醒、提示音、自动刷新偏好
- **IP 家宽检测**（/ip-check）：判断任意 IP 为家庭宽带 / 机房云 / 代理 VPN / Tor 出口，聚合 ip-api.com、ipwho.is 与 Tor 出口列表 + 云厂商 ASN 表，支持"检测我的 IP"
- **开发者工具**（/tools）：带宽 ↔ 月流量换算、VPS 周期月均计算器、Unix 时间戳转换
- **开放数据 API**（/api/stock）：库存数据免费 JSON 接口（CORS 全开，缓存 30 分钟）
- **价格月均换算**：价格列自动显示 ≈ x.xx/月，年付/两年付与月付公平对比
- **访问统计**：总访问 / 今日 / 在线数（`/api/stats` 心跳，真实计数从 0 起）
- **3 套主题**：深色（默认）/ 浅色 / 跟随系统
- **广告位预留**：页头横幅、两侧竖栏（等同原站 rail）、信息流、页脚，`config/site.ts` 一处配置全站生效
- **SEO 就绪**：Metadata、OpenGraph、JSON-LD、sitemap、robots

## 真实数据管道

```
panel.yins.win/stock（公开数据源）
   │  scripts/scrape-stock.mjs（Playwright 渲染采集，像用户一样点击读取）
   ▼
data/stock-data.json（提交进仓库）
   │  自动同步（二选一）：
   │  ① 本机定时任务每 6 小时运行采集并推送（当前已启用）
   │  ② GitHub Action：把 docs/refresh-stock-data.yml 复制到 .github/workflows/ 即可
   ▼
站点读取：优先 raw.githubusercontent.com 最新版（30 分钟再验证），失败回退构建内副本
```

本地手动同步数据：

```bash
node scripts/scrape-stock.mjs
```

## 技术栈

Next.js 15 (App Router) · TypeScript · Tailwind CSS · lucide-react · Playwright（数据管道）· Vercel

## 本地开发

```bash
npm install
node scripts/scrape-stock.mjs   # 首次先采集数据
npm run dev                      # http://localhost:3000
npm run build && npm start
```

## 挂广告

### Google AdSense（推荐）

1. 在 [adsense.google.com](https://adsense.google.com) 添加站点 `https://vps-supermarket.vercel.app` 并等待审核
2. 编辑 `config/site.ts`：

```ts
adsense: {
  enabled: true,
  publisherId: "ca-pub-XXXXXXXXXXXXXXXX",  // 你的发布商 ID
  slots: {
    header: "1111111111",   // 各广告单元 ID（AdSense 后台创建展示广告后获得）
    leftRail: "2222222222",
    rightRail: "3333333333",
    inline: "",
    footer: "4444444444",
  },
},
```

3. 重新部署。加载脚本、`google-adsense-account` 验证 meta、各广告位单元与 **/ads.txt** 全部自动生效。

### 联盟直投 / 自定义代码

`ads.slots` 中粘贴任意联盟 HTML 代码（优先级高于 AdSense）。未开启时广告位显示"招租"占位符，可直接用于招商。

## 部署

```bash
vercel --prod
```

GitHub Actions 会在每 6 小时自动提交最新库存数据；站点通过 raw.githubusercontent.com 拉取（30 分钟缓存），无需重新部署即可保持数据新鲜。

## 说明

- 库存与价格来自公开数据源（panel.yins.win/stock，每 6 小时同步），购买前请以厂商官网为准
- 采集脚本仅读取浏览器实际渲染的内容，不绕过任何站点防护，不点击购买链接（不污染原站统计）
