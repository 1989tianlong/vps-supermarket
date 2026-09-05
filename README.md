# VPS超市 · VPS 库存监控面板

VPS 库存监控 / 优惠推荐 / 有货提醒 —— 聚合多厂商 VPS 产品与报价的库存监控面板，参考 VPS Panel 风格构建，已预留广告位，开箱即可挂广告变现。

## 功能

- **厂商热榜**：按浏览量排序的厂商榜单（Top10 橙色排名徽章），支持厂商搜索
- **库存监控表**：产品规格 / 价格周期（月付·季付·年付·两年付）/ 机房 / 分组 / 库存状态 / 上次探测时间
- **筛选与排序**：产品组标签筛选、库存筛选、价格排序、产品搜索、列表/卡片双视图
- **立即探测**：模拟重新探测，刷新全站产品探测时间
- **监控设置**：探测频率、到货提醒、提示音、自动刷新（本地持久化）
- **实用工具**：产品/整店一键复制、收藏、缺货到货提醒
- **黑名单警示**：跑路/超售风险厂商公示
- **访问统计**：总访问 / 今日 / 在线数（内置 `/api/stats` 心跳接口）
- **4 套主题**：樱花（默认）/ 明亮 / 夜间 / 跟随系统
- **SEO 就绪**：Metadata、OpenGraph、JSON-LD、sitemap、robots
- **广告位预留**：页头 / 侧栏 / 页脚三个标准广告位，`config/site.ts` 一处配置全站生效

## 技术栈

Next.js 15 (App Router) · TypeScript · Tailwind CSS · lucide-react · Vercel

## 本地开发

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## 挂广告

编辑 `config/site.ts`：

```ts
ads: {
  enabled: true,                 // 打开总开关
  contact: "mailto:you@example.com",
  slots: {
    header: `<script ...></script>`,  // 粘贴 AdSense / 联盟广告代码
    sidebar: `<ins class="adsbygoogle" ...></ins>`,
    footer: ``,
    inline: ``,
  },
},
```

广告代码会自动替换页面上的占位符；未开启时占位符本身展示"广告位招租"，可用于招商。

## 部署

已配置可直接部署到 Vercel（零配置）：

```bash
vercel --prod
```

## 目录结构

```
app/            页面（/ 库存监控 · /advertise 广告合作）+ api/stats 访问统计
components/     PanelShell(侧栏) · StockBoard(看板) · AdSlot · SettingsModal · Toast
data/vendors.ts 厂商与产品数据（演示数据，可替换为真实抓取/接口）
lib/            类型与格式化工具
config/site.ts  站点信息 / 统计基数 / 广告配置
```

## 说明

站内厂商与产品均为演示数据，价格与库存请以各厂商官网为准。
