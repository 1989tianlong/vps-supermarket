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

编辑 `config/site.ts`：

```ts
ads: {
  enabled: true,                    // 打开总开关
  contact: "mailto:you@example.com",
  slots: {
    header: `<script ...></script>`,   // 页头横幅
    leftRail: `<ins ...></ins>`,       // 左侧竖栏
    rightRail: ``,
    inline: ``,
    footer: ``,
  },
},
```

广告代码自动替换占位符；未开启时占位符展示"广告位招租"，可直接用于招商。

## 部署

```bash
vercel --prod
```

GitHub Actions 会在每 6 小时自动提交最新库存数据；站点通过 raw.githubusercontent.com 拉取（30 分钟缓存），无需重新部署即可保持数据新鲜。

## 说明

- 库存与价格来自公开数据源（panel.yins.win/stock，每 6 小时同步），购买前请以厂商官网为准
- 采集脚本仅读取浏览器实际渲染的内容，不绕过任何站点防护，不点击购买链接（不污染原站统计）
