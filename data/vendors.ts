import { cyclesFor, type Product, type Vendor } from "@/lib/types";

let seq = 0;

type PO = Partial<
  Pick<
    Product,
    | "tagline"
    | "group"
    | "location"
    | "currency"
    | "inStock"
    | "hot"
    | "featured"
    | "links"
    | "cycles"
    | "buyUrl"
  >
> & {
  cpu: string;
  ram: string;
  disk: string;
  traffic: string;
  overage?: string;
  ip?: string;
  mins?: number;
};

const P = (name: string, price: number, o: PO): Product => {
  const currency = o.currency ?? "USD";
  return {
    id: `p${String(++seq).padStart(3, "0")}`,
    name,
    price,
    currency,
    cycles: o.cycles ?? cyclesFor(price, currency),
    specs: [
      { label: "CPU", value: o.cpu },
      { label: "内存", value: o.ram },
      { label: "硬盘", value: o.disk },
      { label: "流量", value: o.traffic },
      ...(o.overage ? [{ label: "超量", value: o.overage }] : []),
      { label: "IP", value: o.ip ?? "1 x IPv4 + /64 IPv6" },
    ],
    specSummary: `${o.cpu} · ${o.ram} · ${o.disk} · ${o.traffic}`,
    tagline: o.tagline,
    group: o.group ?? "普通优化",
    location: o.location ?? "美国-洛杉矶",
    inStock: o.inStock ?? true,
    lastProbeMinsAgo: o.mins ?? ((seq * 7) % 217) + 2,
    buyUrl: o.buyUrl ?? "#",
    hot: o.hot,
    featured: o.featured,
    links: o.links,
  };
};

const yearly = (label: string, price: number, months = 12): Product["cycles"] => [
  { label, months, price },
];

const V = (
  id: string,
  name: string,
  site: string,
  views: number,
  products: Product[],
  extra: Partial<Vendor> = {},
): Vendor => {
  for (const p of products) if (p.buyUrl === "#") p.buyUrl = site;
  return { id, name, site, views, products, ...extra };
};

export const vendors: Vendor[] = [
  V("qoq", "QOQ", "https://qoq.cloud", 6180, [
    P("香港 BGP 轻量", 5.9, { cpu: "1 x vCPU", ram: "1 GB RAM", disk: "20 GB NVMe", traffic: "1 TB/mo @ 500 Mbps", location: "香港", group: "BGP中转", tagline: "三网 BGP 中转低延迟", hot: 4, featured: true }),
    P("香港 BGP 标准", 11.9, { cpu: "2 x vCPU", ram: "2 GB RAM", disk: "40 GB NVMe", traffic: "2 TB/mo @ 1 Gbps", location: "香港", group: "BGP中转" }),
    P("东京软银 Lite", 12.9, { cpu: "1 x vCPU", ram: "1 GB RAM", disk: "20 GB NVMe", traffic: "1 TB/mo @ 1 Gbps", location: "日本-东京", group: "软银", tagline: "软银线路全程优化" }),
    P("东京 9929 Pro", 19.9, { cpu: "2 x vCPU", ram: "2 GB RAM", disk: "40 GB NVMe", traffic: "2 TB/mo @ 2 Gbps", location: "日本-东京", group: "9929", tagline: "AS9929 大陆优化回程", hot: 2 }),
    P("新加坡 CMIN2", 15.9, { cpu: "1 x vCPU", ram: "2 GB RAM", disk: "40 GB NVMe", traffic: "1 TB/mo @ 1 Gbps", location: "新加坡", group: "CMIN2", tagline: "移动 CMIN2 直连" }),
    P("洛杉矶 CN2 GIA", 9.9, { cpu: "1 x vCPU", ram: "1 GB RAM", disk: "20 GB NVMe", traffic: "1 TB/mo @ 1 Gbps", location: "美国-洛杉矶", group: "CN2 GIA", tagline: "电信 CN2 GIA 双程", hot: 3, featured: true }),
    P("首尔 BGP 均衡", 14.9, { cpu: "2 x vCPU", ram: "2 GB RAM", disk: "40 GB NVMe", traffic: "1.5 TB/mo @ 1 Gbps", location: "韩国-首尔", group: "BGP中转" }),
    P("动态家宽出口", 29.9, { cpu: "1 x vCPU", ram: "1 GB RAM", disk: "20 GB NVMe", traffic: "不限 @ 300 Mbps", location: "美国-达拉斯", group: "家宽", tagline: "住宅动态 IP 池" }),
  ]),

  V("lisahost", "丽萨 LisaHost", "https://lisahost.com", 4500, [
    P("香港家宽 Pro", 18.9, { currency: "CNY", cpu: "1 x vCPU", ram: "2 GB RAM", disk: "30 GB NVMe", traffic: "不限 @ 500 Mbps", location: "香港", group: "家宽", tagline: "原生住宅 IP HKBN", hot: 5, featured: true, links: 3 }),
    P("香港家宽 Max", 38.9, { currency: "CNY", cpu: "2 x vCPU", ram: "4 GB RAM", disk: "60 GB NVMe", traffic: "不限 @ 1 Gbps", location: "香港", group: "家宽", tagline: "原生住宅 IP HKBN" }),
    P("美国家宽 AT&T", 39.9, { cpu: "1 x vCPU", ram: "2 GB RAM", disk: "40 GB NVMe", traffic: "不限 @ 1 Gbps", location: "美国-达拉斯", group: "家宽", tagline: "AT&T 原生住宅 IP", ip: "1 x IPv4 (住宅)" }),
    P("美国家宽 Verizon", 44.9, { cpu: "1 x vCPU", ram: "2 GB RAM", disk: "40 GB NVMe", traffic: "不限 @ 1 Gbps", location: "美国-洛杉矶", group: "家宽", tagline: "Verizon 原生住宅 IP", ip: "1 x IPv4 (住宅)" }),
    P("日本家宽 OCN", 35.0, { cpu: "1 x vCPU", ram: "1 GB RAM", disk: "30 GB NVMe", traffic: "不限 @ 500 Mbps", location: "日本-大阪", group: "家宽", tagline: "OCN 原生住宅 IP" }),
    P("台湾家宽 HiNet", 32.0, { cpu: "1 x vCPU", ram: "1 GB RAM", disk: "30 GB NVMe", traffic: "不限 @ 300 Mbps", location: "台湾-台北", group: "家宽", tagline: "HiNet 原生住宅 IP" }),
    P("伦敦家宽 BT", 38.0, { cpu: "1 x vCPU", ram: "2 GB RAM", disk: "40 GB NVMe", traffic: "不限 @ 500 Mbps", location: "英国-伦敦", group: "家宽" }),
    P("法兰克福家宽 DT", 30.0, { cpu: "1 x vCPU", ram: "2 GB RAM", disk: "40 GB NVMe", traffic: "不限 @ 500 Mbps", location: "德国-法兰克福", group: "家宽", tagline: "德国电信住宅 IP" }),
  ]),

  V("dedione", "DediOne", "https://dedione.com", 3840, [
    P("E3-1230v2 独服", 45.0, { cpu: "4C8T E3-1230v2", ram: "16 GB DDR3", disk: "240 GB SSD", traffic: "不限 @ 1 Gbps", location: "美国-圣何塞", group: "独立服务器", ip: "5 x IPv4 (/29)" }),
    P("E5-2650v4 独服", 65.0, { cpu: "12C24T E5-2650v4", ram: "32 GB DDR4", disk: "480 GB SSD", traffic: "不限 @ 1 Gbps", location: "美国-圣何塞", group: "独立服务器", ip: "5 x IPv4 (/29)" }),
    P("Ryzen 7950X 旗舰", 129.0, { cpu: "16C32T 7950X", ram: "64 GB DDR5", disk: "2 TB NVMe", traffic: "不限 @ 10 Gbps", location: "美国-洛杉矶", group: "独立服务器", hot: 2, ip: "5 x IPv4 (/29)" }),
    P("双路 E5-2680v4", 89.0, { cpu: "2 x 14C E5-2680v4", ram: "64 GB DDR4", disk: "960 GB SSD", traffic: "不限 @ 1 Gbps", location: "荷兰-阿姆斯特丹", group: "独立服务器", ip: "5 x IPv4 (/29)" }),
    P("i9-13900K 高频型", 159.0, { cpu: "24C32T 13900K", ram: "64 GB DDR5", disk: "4 TB NVMe", traffic: "不限 @ 10 Gbps", location: "美国-圣何塞", group: "独立服务器", ip: "5 x IPv4 (/29)" }),
  ]),

  V("dmit", "大妈 DMIT", "https://dmit.io", 2280, [
    P("LAX Pro WEE", 14.9, { cpu: "1 x vCPU", ram: "0.75 GB RAM", disk: "10 GB NVMe", traffic: "0.5 TB/mo @ 1 Gbps", location: "美国-洛杉矶", group: "CN2 GIA", tagline: "CN2 GIA 精品线路", featured: true, hot: 4, links: 2 }),
    P("LAX Pro LIT", 28.9, { cpu: "1 x vCPU", ram: "2 GB RAM", disk: "40 GB NVMe", traffic: "2 TB/mo @ 2.5 Gbps", location: "美国-洛杉矶", group: "CN2 GIA", tagline: "CN2 GIA 精品线路" }),
    P("LAX Pro CRE", 54.9, { cpu: "2 x vCPU", ram: "4 GB RAM", disk: "80 GB NVMe", traffic: "3 TB/mo @ 2.5 Gbps", location: "美国-洛杉矶", group: "CN2 GIA", tagline: "CN2 GIA 精品线路" }),
    P("TYO WEE", 16.9, { cpu: "1 x vCPU", ram: "0.75 GB RAM", disk: "10 GB NVMe", traffic: "0.5 TB/mo @ 1 Gbps", location: "日本-东京", group: "CN2 GIA", tagline: "东京 CN2 GIA 直连" }),
    P("HKG WEE", 19.9, { cpu: "1 x vCPU", ram: "0.75 GB RAM", disk: "10 GB NVMe", traffic: "0.5 TB/mo @ 1 Gbps", location: "香港", group: "CN2 GIA", tagline: "香港 CN2 GIA 大陆优化" }),
    P("SJC Lite", 9.9, { cpu: "1 x vCPU", ram: "1 GB RAM", disk: "20 GB NVMe", traffic: "1 TB/mo @ 1 Gbps", location: "美国-圣何塞", group: "CN2 GT", tagline: "CN2 GT 入门之选" }),
  ]),

  V("bandwagon", "搬瓦工 BandwagonHost", "https://bandwagonhost.com", 1790, [
    P("THE PLAN v2 · CN2", 4.17, { cpu: "1 x vCPU", ram: "1 GB RAM", disk: "20 GB NVMe", traffic: "1 TB/mo @ 2.5 Gbps", location: "美国-洛杉矶", group: "CN2 GT", tagline: "经典 CN2 年付套餐", cycles: yearly("年付 $49.99", 49.99), featured: true }),
    P("CN2 GIA-E", 14.17, { cpu: "2 x vCPU", ram: "1 GB RAM", disk: "20 GB NVMe", traffic: "2 TB/mo @ 2.5 Gbps", location: "美国-圣何塞", group: "CN2 GIA", tagline: "三网 CN2 GIA-E 可迁移", cycles: yearly("年付 $169.99", 169.99), hot: 6, featured: true }),
    P("HKG CN2 GIA", 89.99, { cpu: "1 x vCPU", ram: "1 GB RAM", disk: "20 GB NVMe", traffic: "0.5 TB/mo @ 1 Gbps", location: "香港", group: "CN2 GIA", tagline: "香港 CN2 GIA 极速" }),
    P("THE PLAN 入门", 3.33, { cpu: "1 x vCPU", ram: "1 GB RAM", disk: "15 GB SSD", traffic: "1 TB/mo @ 1 Gbps", location: "美国-洛杉矶", group: "普通优化", cycles: yearly("年付 $39.99", 39.99) }),
    P("KVM PROMO 5G", 2.17, { cpu: "1 x vCPU", ram: "512 MB RAM", disk: "10 GB SSD", traffic: "0.5 TB/mo @ 1 Gbps", location: "美国-洛杉矶", group: "普通优化", cycles: yearly("年付 $25.99", 25.99), inStock: false }),
    P("20G KVM 促销", 5.0, { cpu: "1 x vCPU", ram: "1 GB RAM", disk: "20 GB SSD", traffic: "1 TB/mo @ 1 Gbps", location: "美国-纽约", group: "普通优化", cycles: yearly("年付 $59.99", 59.99) }),
  ]),

  V("greencloud", "绿云 GreenCloud", "https://greencloudvps.com", 1700, [
    P("东京 Premium", 24.9, { cpu: "2 x vCPU", ram: "2 GB RAM", disk: "40 GB NVMe", traffic: "2 TB/mo @ 1 Gbps", location: "日本-东京", group: "普通优化", tagline: "IIJ 优质线路", hot: 1 }),
    P("香港 BGP", 29.9, { cpu: "2 x vCPU", ram: "2 GB RAM", disk: "40 GB NVMe", traffic: "2 TB/mo @ 1 Gbps", location: "香港", group: "BGP中转" }),
    P("新加坡 Premium", 26.9, { cpu: "2 x vCPU", ram: "2 GB RAM", disk: "40 GB NVMe", traffic: "2 TB/mo @ 1 Gbps", location: "新加坡", group: "普通优化" }),
    P("荷兰 Budget", 12.9, { cpu: "1 x vCPU", ram: "1 GB RAM", disk: "15 GB NVMe", traffic: "2 TB/mo @ 1 Gbps", location: "荷兰-阿姆斯特丹", group: "普通优化" }),
    P("纽约 Budget", 10.9, { cpu: "1 x vCPU", ram: "1 GB RAM", disk: "15 GB NVMe", traffic: "2 TB/mo @ 1 Gbps", location: "美国-纽约", group: "普通优化", featured: true }),
    P("伦敦 Standard", 15.9, { cpu: "2 x vCPU", ram: "2 GB RAM", disk: "30 GB NVMe", traffic: "3 TB/mo @ 1 Gbps", location: "英国-伦敦", group: "普通优化" }),
    P("存储型 1TB", 19.9, { cpu: "1 x vCPU", ram: "2 GB RAM", disk: "1 TB HDD", traffic: "4 TB/mo @ 1 Gbps", location: "荷兰-阿姆斯特丹", group: "存储型" }),
    P("大阪 KVM", 18.9, { cpu: "2 x vCPU", ram: "2 GB RAM", disk: "40 GB NVMe", traffic: "2 TB/mo @ 1 Gbps", location: "日本-大阪", group: "普通优化" }),
  ]),

  V("vmrack", "VMRack", "https://vmrack.com", 1440, [
    P("存储型 2T", 25.0, { cpu: "2 x vCPU", ram: "4 GB RAM", disk: "2 TB HDD", traffic: "不限 @ 1 Gbps", location: "美国-洛杉矶", group: "存储型", tagline: "大容量冷备首选" }),
    P("存储型 4T", 39.0, { cpu: "2 x vCPU", ram: "4 GB RAM", disk: "4 TB HDD", traffic: "不限 @ 1 Gbps", location: "美国-洛杉矶", group: "存储型" }),
    P("存储型 8T", 69.0, { cpu: "4 x vCPU", ram: "8 GB RAM", disk: "8 TB HDD", traffic: "不限 @ 1 Gbps", location: "美国-洛杉矶", group: "存储型", hot: 1 }),
    P("NAT 大盘鸡 500G", 2.8, { currency: "CNY", cpu: "1 x vCPU", ram: "1 GB RAM", disk: "500 GB HDD", traffic: "2 TB/mo @ 300 Mbps", location: "美国-洛杉矶", group: "存储型", ip: "共享 IPv4 (20 端口)", inStock: false }),
    P("高防型 5G", 59.0, { cpu: "4 x vCPU", ram: "8 GB RAM", disk: "120 GB NVMe", traffic: "不限 @ 1 Gbps", location: "美国-洛杉矶", group: "高防", tagline: "5 Gbps DDoS 防御" }),
  ]),

  V("vps", "小秘书 V.PS", "https://v.ps", 1270, [
    P("Tokyo 2.5G", 14.0, { cpu: "2 x vCPU", ram: "2 GB RAM", disk: "40 GB NVMe", traffic: "2 TB/mo @ 2.5 Gbps", location: "日本-东京", group: "普通优化", tagline: "2.5 Gbps 大带宽", hot: 2, featured: true }),
    P("Tokyo 5G", 28.0, { cpu: "4 x vCPU", ram: "4 GB RAM", disk: "80 GB NVMe", traffic: "4 TB/mo @ 5 Gbps", location: "日本-东京", group: "普通优化" }),
    P("Silicon Valley", 10.0, { cpu: "1 x vCPU", ram: "1 GB RAM", disk: "20 GB NVMe", traffic: "1 TB/mo @ 1 Gbps", location: "美国-圣何塞", group: "普通优化" }),
    P("London", 9.0, { cpu: "1 x vCPU", ram: "1 GB RAM", disk: "20 GB NVMe", traffic: "1 TB/mo @ 1 Gbps", location: "英国-伦敦", group: "普通优化" }),
    P("Helsinki", 8.0, { cpu: "1 x vCPU", ram: "1 GB RAM", disk: "20 GB NVMe", traffic: "1 TB/mo @ 1 Gbps", location: "芬兰-赫尔辛基", group: "普通优化" }),
  ]),

  V("ganbei", "干杯云 家宽", "#", 1210, [
    P("家宽动态版", 29.9, { currency: "CNY", cpu: "1 x vCPU", ram: "1 GB RAM", disk: "20 GB NVMe", traffic: "2 TB/mo @ 300 Mbps", location: "国内-江苏", group: "家宽", tagline: "动态家宽 IP 随机换", ip: "1 x IPv4 (动态家宽)", hot: 2 }),
    P("家宽静态版", 49.9, { currency: "CNY", cpu: "2 x vCPU", ram: "2 GB RAM", disk: "40 GB NVMe", traffic: "3 TB/mo @ 300 Mbps", location: "国内-江苏", group: "家宽", ip: "1 x IPv4 (静态家宽)" }),
    P("家宽 NAT 版", 15.9, { currency: "CNY", cpu: "1 x vCPU", ram: "1 GB RAM", disk: "20 GB NVMe", traffic: "1 TB/mo @ 200 Mbps", location: "国内-安徽", group: "家宽", ip: "共享 IPv4", inStock: false }),
    P("海外家宽中转", 69.9, { currency: "CNY", cpu: "1 x vCPU", ram: "1 GB RAM", disk: "20 GB NVMe", traffic: "1 TB/mo @ 500 Mbps", location: "香港", group: "家宽", tagline: "海外住宅 IP 落地" }),
  ]),

  V("vmiss", "VMISS", "https://vmiss.com", 860, [
    P("香港 BGP Lite", 9.9, { cpu: "1 x vCPU", ram: "1 GB RAM", disk: "20 GB NVMe", traffic: "0.8 TB/mo @ 1 Gbps", location: "香港", group: "BGP中转", tagline: "三网 BGP 中转" }),
    P("东京 9929", 15.9, { cpu: "1 x vCPU", ram: "1 GB RAM", disk: "20 GB NVMe", traffic: "1 TB/mo @ 1 Gbps", location: "日本-东京", group: "9929" }),
    P("洛杉矶 CN2 GIA", 11.9, { cpu: "1 x vCPU", ram: "1 GB RAM", disk: "20 GB NVMe", traffic: "1 TB/mo @ 1 Gbps", location: "美国-洛杉矶", group: "CN2 GIA", tagline: "CN2 GIA 双程优化" }),
    P("新加坡 CMIN2", 13.9, { cpu: "1 x vCPU", ram: "1 GB RAM", disk: "20 GB NVMe", traffic: "1 TB/mo @ 1 Gbps", location: "新加坡", group: "CMIN2" }),
    P("加拿大 BGP", 8.9, { cpu: "1 x vCPU", ram: "1 GB RAM", disk: "20 GB NVMe", traffic: "2 TB/mo @ 1 Gbps", location: "加拿大-多伦多", group: "普通优化" }),
  ]),

  V("nodemach", "NodeMach", "#", 988, [
    P("CN2 GIA Lite", 9.99, { cpu: "1 x vCPU", ram: "2 GB RAM", disk: "20 GB NVMe RAID-10", traffic: "1 TB/mo @ 1 Gbps", overage: "超量后不限量 @ 4 Mbps", location: "美国-加州", group: "CN2 GIA", tagline: "CN2 GIA 精品线路", hot: 2, featured: true, links: 2 }),
    P("CN2 GIA Basic", 15.9, { cpu: "2 x vCPU", ram: "2 GB RAM", disk: "40 GB NVMe RAID-10", traffic: "1.5 TB/mo @ 2.5 Gbps", overage: "超量后不限量 @ 4 Mbps", location: "美国-加州", group: "CN2 GIA", tagline: "CN2 GIA 精品线路" }),
    P("CN2 GIA Standard", 29.9, { cpu: "2 x vCPU", ram: "2 GB RAM", disk: "80 GB NVMe RAID-10", traffic: "3 TB/mo @ 2.5 Gbps", overage: "超量后不限量 @ 4 Mbps", location: "美国-加州", group: "CN2 GIA", tagline: "CN2 GIA 精品线路" }),
    P("CN2 GIA Premium", 49.9, { cpu: "4 x vCPU", ram: "4 GB RAM", disk: "120 GB NVMe RAID-10", traffic: "5 TB/mo @ 5 Gbps", overage: "超量后不限量 @ 6 Mbps", location: "美国-加州", group: "CN2 GIA", tagline: "CN2 GIA 精品线路" }),
    P("CN2 GIA Ultra", 89.9, { cpu: "8 x vCPU", ram: "8 GB RAM", disk: "160 GB NVMe RAID-10", traffic: "10 TB/mo @ 10 Gbps", location: "美国-加州", group: "CN2 GIA", tagline: "CN2 GIA 精品线路" }),
    P("CN2 GIA Starter", 4.99, { cpu: "1 x vCPU", ram: "1 GB RAM", disk: "10 GB NVMe RAID-10", traffic: "0.5 TB/mo @ 1 Gbps", location: "美国-加州", group: "CN2 GIA", tagline: "CN2 GIA 入门体验" }),
    P("CN2 GIA Elite", 129.9, { cpu: "8 x vCPU", ram: "16 GB RAM", disk: "320 GB NVMe RAID-10", traffic: "20 TB/mo @ 10 Gbps", location: "美国-加州", group: "CN2 GIA", tagline: "CN2 GIA 旗舰独享" }),
    P("高速代理", 34.9, { cpu: "—", ram: "—", disk: "—", traffic: "独享 50Mbps [可选]", location: "美国-加州", group: "精品网", tagline: "简易接入 高效稳定", ip: "独立 IP 地址", links: 1 }),
    P("标准版", 35.9, { cpu: "4 核 vCore", ram: "8 GB DDR4", disk: "50 GB NVMe", traffic: "独享 50Mbps [可选]", location: "美国-加州", group: "精品网", tagline: "均衡配置 性价比优" }),
    P("尊享版", 59.9, { cpu: "8 核 vCore", ram: "16 GB DDR4", disk: "100 GB NVMe", traffic: "独享 100Mbps [可选]", location: "美国-加州", group: "精品网", tagline: "高性能 商务首选" }),
    P("大流量型", 45.9, { cpu: "4 核 vCore", ram: "8 GB DDR4", disk: "80 GB NVMe", traffic: "20 TB/mo @ 1 Gbps", location: "美国-加州", group: "精品网", tagline: "超大流量 转发利器" }),
  ]),

  V("brainhost", "BrainHost", "#", 852, [
    P("轻量入门", 3.9, { cpu: "1 x vCPU", ram: "512 MB RAM", disk: "10 GB NVMe", traffic: "0.5 TB/mo @ 1 Gbps", group: "普通优化" }),
    P("标准型", 7.9, { cpu: "1 x vCPU", ram: "1 GB RAM", disk: "20 GB NVMe", traffic: "1 TB/mo @ 1 Gbps", group: "普通优化" }),
    P("高配型", 15.9, { cpu: "2 x vCPU", ram: "4 GB RAM", disk: "60 GB NVMe", traffic: "3 TB/mo @ 2 Gbps", group: "普通优化" }),
    P("大流量型", 12.9, { cpu: "2 x vCPU", ram: "2 GB RAM", disk: "40 GB NVMe", traffic: "4 TB/mo @ 1 Gbps", group: "普通优化" }),
  ]),

  V("liuliu", "六六云", "#", 850, [
    P("轻量云 · 江苏", 24.0, { currency: "CNY", cpu: "2 x vCPU", ram: "2 GB RAM", disk: "50 GB SSD", traffic: "不限 @ 4 Mbps", location: "国内-江苏", group: "轻量云", tagline: "BGP 多线 免备案" }),
    P("轻量云 · 广东", 28.0, { currency: "CNY", cpu: "2 x vCPU", ram: "2 GB RAM", disk: "50 GB SSD", traffic: "不限 @ 5 Mbps", location: "国内-广东", group: "轻量云" }),
    P("BGP 高防型", 59.0, { currency: "CNY", cpu: "4 x vCPU", ram: "4 GB RAM", disk: "80 GB SSD", traffic: "不限 @ 10 Mbps", location: "国内-江苏", group: "高防", tagline: "100G 硬防清洗" }),
    P("标准云 4C8G", 89.0, { currency: "CNY", cpu: "4 x vCPU", ram: "8 GB RAM", disk: "120 GB SSD", traffic: "不限 @ 15 Mbps", location: "国内-江苏", group: "轻量云" }),
    P("高配云 8C16G", 159.0, { currency: "CNY", cpu: "8 x vCPU", ram: "16 GB RAM", disk: "240 GB SSD", traffic: "不限 @ 20 Mbps", location: "国内-广东", group: "轻量云", inStock: false }),
  ]),

  V("acebgp", "ACEBGP", "#", 766, [
    P("香港 BGP", 12.9, { cpu: "1 x vCPU", ram: "1 GB RAM", disk: "20 GB NVMe", traffic: "1 TB/mo @ 1 Gbps", location: "香港", group: "BGP中转", tagline: "混合 BGP 中转" }),
    P("美国 BGP", 10.9, { cpu: "1 x vCPU", ram: "1 GB RAM", disk: "20 GB NVMe", traffic: "2 TB/mo @ 1 Gbps", location: "美国-洛杉矶", group: "BGP中转" }),
    P("日本 CMIN2", 17.9, { cpu: "1 x vCPU", ram: "1 GB RAM", disk: "20 GB NVMe", traffic: "1 TB/mo @ 1 Gbps", location: "日本-东京", group: "CMIN2" }),
    P("新加坡 BGP", 14.9, { cpu: "1 x vCPU", ram: "1 GB RAM", disk: "20 GB NVMe", traffic: "1 TB/mo @ 1 Gbps", location: "新加坡", group: "BGP中转" }),
    P("高防 BGP", 39.9, { cpu: "2 x vCPU", ram: "4 GB RAM", disk: "60 GB NVMe", traffic: "3 TB/mo @ 1 Gbps", location: "香港", group: "高防", tagline: "BGP 高防清洗中心" }),
  ]),

  V("aaltr", "AalTR 家宽", "#", 688, [
    P("香港家宽 HKBN", 29.9, { cpu: "1 x vCPU", ram: "1 GB RAM", disk: "30 GB NVMe", traffic: "不限 @ 500 Mbps", location: "香港", group: "家宽", ip: "1 x IPv4 (住宅)" }),
    P("美国家宽 Comcast", 24.9, { cpu: "1 x vCPU", ram: "1 GB RAM", disk: "30 GB NVMe", traffic: "不限 @ 1 Gbps", location: "美国-洛杉矶", group: "家宽", ip: "1 x IPv4 (住宅)" }),
    P("日本家宽 OCN", 27.9, { cpu: "1 x vCPU", ram: "1 GB RAM", disk: "30 GB NVMe", traffic: "不限 @ 500 Mbps", location: "日本-东京", group: "家宽", ip: "1 x IPv4 (住宅)" }),
    P("德国家宽 DT", 22.9, { cpu: "1 x vCPU", ram: "1 GB RAM", disk: "30 GB NVMe", traffic: "不限 @ 500 Mbps", location: "德国-法兰克福", group: "家宽", ip: "1 x IPv4 (住宅)", inStock: false }),
  ]),

  V("bytevirt", "ByteVirt", "https://bytevirt.com", 616, [
    P("存储型 500G", 4.9, { cpu: "1 x vCPU", ram: "1 GB RAM", disk: "500 GB HDD", traffic: "4 TB/mo @ 1 Gbps", location: "荷兰-阿姆斯特丹", group: "存储型" }),
    P("KVM 1G", 2.9, { cpu: "1 x vCPU", ram: "1 GB RAM", disk: "20 GB NVMe", traffic: "1 TB/mo @ 1 Gbps", location: "拉脱维亚-里加", group: "普通优化", tagline: "性价比怪物", featured: true, hot: 3 }),
    P("KVM 2G", 4.9, { cpu: "2 x vCPU", ram: "2 GB RAM", disk: "40 GB NVMe", traffic: "2 TB/mo @ 1 Gbps", location: "拉脱维亚-里加", group: "普通优化" }),
    P("香港 BGP", 8.9, { cpu: "1 x vCPU", ram: "1 GB RAM", disk: "15 GB NVMe", traffic: "0.5 TB/mo @ 1 Gbps", location: "香港", group: "BGP中转" }),
    P("日本 SoftBank", 9.9, { cpu: "1 x vCPU", ram: "1 GB RAM", disk: "20 GB NVMe", traffic: "1 TB/mo @ 1 Gbps", location: "日本-东京", group: "软银" }),
    P("大流量 8T", 7.9, { cpu: "2 x vCPU", ram: "2 GB RAM", disk: "40 GB NVMe", traffic: "8 TB/mo @ 1 Gbps", location: "德国-法兰克福", group: "普通优化" }),
  ]),

  V("yunyoo", "云悠 YUNYOO", "https://yunyoo.cc", 533, [
    P("德国轻量 DDR4", 15.99, { currency: "CNY", cpu: "1 x vCPU", ram: "2 GB DDR4", disk: "10-100GB 可选 SSD", traffic: "400G 双向 @ 200 Mbps", location: "德国-法兰克福", group: "普通优化", tagline: "系统盘 10-100GB 灵活可选", links: 2 }),
    P("香港轻量", 19.9, { currency: "CNY", cpu: "1 x vCPU", ram: "2 GB DDR4", disk: "40 GB SSD", traffic: "500G 双向 @ 200 Mbps", location: "香港", group: "BGP中转" }),
    P("美国轻量", 16.9, { currency: "CNY", cpu: "1 x vCPU", ram: "2 GB DDR4", disk: "40 GB SSD", traffic: "600G 双向 @ 200 Mbps", location: "美国-洛杉矶", group: "普通优化" }),
    P("日本软银", 45.0, { currency: "CNY", cpu: "2 x vCPU", ram: "2 GB DDR4", disk: "60 GB SSD", traffic: "1 TB 双向 @ 300 Mbps", location: "日本-东京", group: "软银", tagline: "软银国际出口优化" }),
    P("高防型 50G", 99.0, { currency: "CNY", cpu: "4 x vCPU", ram: "8 GB DDR4", disk: "120 GB SSD", traffic: "不限 @ 100 Mbps", location: "德国-法兰克福", group: "高防" }),
  ]),

  V("dedirock", "DediRock", "https://dedirock.com", 456, [
    P("LA KVM", 5.0, { cpu: "1 x vCPU", ram: "1 GB RAM", disk: "20 GB NVMe", traffic: "2 TB/mo @ 1 Gbps", location: "美国-洛杉矶", group: "普通优化" }),
    P("NVMe Turbo", 9.0, { cpu: "2 x vCPU", ram: "4 GB RAM", disk: "80 GB NVMe", traffic: "4 TB/mo @ 2 Gbps", location: "美国-洛杉矶", group: "普通优化" }),
    P("E3 独服", 39.0, { cpu: "4C8T E3-1270v3", ram: "16 GB DDR3", disk: "480 GB SSD", traffic: "不限 @ 1 Gbps", location: "美国-洛杉矶", group: "独立服务器", ip: "1 x IPv4 (/32)" }),
    P("FR 存储型", 14.0, { cpu: "2 x vCPU", ram: "4 GB RAM", disk: "2 TB HDD", traffic: "不限 @ 500 Mbps", location: "法国-鲁贝", group: "存储型" }),
  ]),

  V("akile", "AkileCloud", "#", 335, [
    P("轻量 1C1G", 9.9, { currency: "CNY", cpu: "1 x vCPU", ram: "1 GB RAM", disk: "15 GB NVMe", traffic: "1 TB/mo @ 500 Mbps", location: "香港", group: "轻量云", hot: 3, featured: true }),
    P("轻量 2C2G", 19.9, { currency: "CNY", cpu: "2 x vCPU", ram: "2 GB RAM", disk: "30 GB NVMe", traffic: "2 TB/mo @ 500 Mbps", location: "香港", group: "轻量云" }),
    P("轻量 4C4G", 39.9, { currency: "CNY", cpu: "4 x vCPU", ram: "4 GB RAM", disk: "60 GB NVMe", traffic: "4 TB/mo @ 1 Gbps", location: "香港", group: "轻量云" }),
    P("大流量型", 29.9, { currency: "CNY", cpu: "2 x vCPU", ram: "2 GB RAM", disk: "40 GB NVMe", traffic: "5 TB/mo @ 1 Gbps", location: "美国-洛杉矶", group: "普通优化" }),
    P("美国原生", 34.9, { currency: "CNY", cpu: "1 x vCPU", ram: "1 GB RAM", disk: "20 GB NVMe", traffic: "2 TB/mo @ 1 Gbps", location: "美国-洛杉矶", group: "原生IP", tagline: "原生 IP 支持流媒体" }),
    P("日本软银", 59.9, { currency: "CNY", cpu: "2 x vCPU", ram: "2 GB RAM", disk: "40 GB NVMe", traffic: "2 TB/mo @ 1 Gbps", location: "日本-东京", group: "9929", inStock: false }),
  ]),

  V("ipraft", "iPRaft", "#", 250, [
    P("原生广播 /24", 6.9, { cpu: "1 x vCPU", ram: "1 GB RAM", disk: "15 GB NVMe", traffic: "1 TB/mo @ 1 Gbps", location: "美国-洛杉矶", group: "原生IP", tagline: "支持 BGP 广播 /24", ip: "/24 可广播" }),
    P("BGP 中转", 11.9, { cpu: "1 x vCPU", ram: "2 GB RAM", disk: "20 GB NVMe", traffic: "1.5 TB/mo @ 1 Gbps", location: "香港", group: "BGP中转" }),
    P("9929 大陆优化", 18.9, { cpu: "2 x vCPU", ram: "2 GB RAM", disk: "40 GB NVMe", traffic: "2 TB/mo @ 1 Gbps", location: "日本-东京", group: "9929" }),
    P("CMIN2 移动优化", 16.9, { cpu: "1 x vCPU", ram: "2 GB RAM", disk: "30 GB NVMe", traffic: "1.5 TB/mo @ 1 Gbps", location: "新加坡", group: "CMIN2" }),
    P("家宽隧道", 25.9, { cpu: "1 x vCPU", ram: "1 GB RAM", disk: "15 GB NVMe", traffic: "不限 @ 500 Mbps", location: "美国-凤凰城", group: "家宽", ip: "1 x IPv4 (住宅隧道)" }),
  ]),

  V("zgovps", "ZgoVPS", "#", 230, [
    P("圣何塞 CN2", 6.0, { cpu: "1 x vCPU", ram: "768 MB RAM", disk: "15 GB SSD", traffic: "1 TB/mo @ 1 Gbps", location: "美国-圣何塞", group: "CN2 GT" }),
    P("洛杉矶 DC9 CN2 GIA", 9.9, { cpu: "1 x vCPU", ram: "1 GB RAM", disk: "20 GB SSD", traffic: "1 TB/mo @ 1 Gbps", location: "美国-洛杉矶", group: "CN2 GIA", tagline: "CN2 GIA 精品线路" }),
    P("香港 CMI", 19.9, { cpu: "1 x vCPU", ram: "1 GB RAM", disk: "20 GB NVMe", traffic: "0.5 TB/mo @ 1 Gbps", location: "香港", group: "CMIN2" }),
    P("存储型 1T", 12.0, { cpu: "1 x vCPU", ram: "2 GB RAM", disk: "1 TB HDD", traffic: "3 TB/mo @ 1 Gbps", location: "美国-圣何塞", group: "存储型" }),
  ]),

  V("racknerd", "RackNerd", "https://racknerd.com", 203, [
    P("1G KVM 年付", 10.99, { cpu: "1 x vCPU", ram: "1 GB RAM", disk: "20 GB SSD", traffic: "1 TB/mo @ 1 Gbps", location: "美国-圣何塞", group: "普通优化", cycles: yearly("年付 $10.99", 10.99), featured: true, hot: 5 }),
    P("2G KVM 年付", 18.66, { cpu: "2 x vCPU", ram: "2 GB RAM", disk: "35 GB SSD", traffic: "2.5 TB/mo @ 1 Gbps", location: "美国-洛杉矶", group: "普通优化", cycles: yearly("年付 $18.66", 18.66) }),
    P("3G KVM 年付", 29.99, { cpu: "3 x vCPU", ram: "3 GB RAM", disk: "50 GB SSD", traffic: "4 TB/mo @ 1 Gbps", location: "美国-纽约", group: "普通优化", cycles: yearly("年付 $29.99", 29.99) }),
    P("512M KVM 年付", 8.99, { cpu: "1 x vCPU", ram: "512 MB RAM", disk: "15 GB SSD", traffic: "750 GB/mo @ 1 Gbps", location: "美国-达拉斯", group: "普通优化", cycles: yearly("年付 $8.99", 8.99) }),
    P("黑五特惠 4G", 39.0, { cpu: "4 x vCPU", ram: "4 GB RAM", disk: "60 GB SSD", traffic: "5 TB/mo @ 1 Gbps", location: "美国-圣何塞", group: "普通优化", cycles: yearly("年付 $39.00", 39.00), inStock: false }),
    P("存储型 250G", 24.99, { cpu: "2 x vCPU", ram: "3 GB RAM", disk: "250 GB HDD", traffic: "6 TB/mo @ 1 Gbps", location: "美国-西雅图", group: "存储型", cycles: yearly("年付 $24.99", 24.99) }),
  ]),

  V("yecaoyun", "野草云 YecaoYun", "https://my.yecaoyun.com", 181, [
    P("香港一哥", 29.0, { currency: "CNY", cpu: "1 x vCPU", ram: "1 GB RAM", disk: "20 GB SSD", traffic: "2 TB/mo @ 100 Mbps", location: "香港", group: "轻量云", tagline: "老牌香港 CMI 直连" }),
    P("香港轻量 2C", 49.0, { currency: "CNY", cpu: "2 x vCPU", ram: "2 GB RAM", disk: "40 GB SSD", traffic: "3 TB/mo @ 100 Mbps", location: "香港", group: "轻量云" }),
    P("美国洛杉矶", 19.0, { currency: "CNY", cpu: "1 x vCPU", ram: "1 GB RAM", disk: "20 GB SSD", traffic: "2 TB/mo @ 200 Mbps", location: "美国-洛杉矶", group: "普通优化" }),
    P("香港大牌 4C", 99.0, { currency: "CNY", cpu: "4 x vCPU", ram: "4 GB RAM", disk: "80 GB SSD", traffic: "5 TB/mo @ 300 Mbps", location: "香港", group: "轻量云", inStock: false }),
    P("CN2 优化型", 39.0, { currency: "CNY", cpu: "1 x vCPU", ram: "1 GB RAM", disk: "20 GB SSD", traffic: "1 TB/mo @ 100 Mbps", location: "美国-洛杉矶", group: "CN2 GT" }),
  ]),

  V("digirdp", "DigiRDP", "#", 179, [
    P("RDP Basic", 6.9, { cpu: "2 x vCPU", ram: "4 GB RAM", disk: "60 GB SSD", traffic: "不限 @ 1 Gbps", location: "美国-纽约", group: "远程桌面", tagline: "Windows Server 2022" }),
    P("RDP Pro", 12.9, { cpu: "4 x vCPU", ram: "8 GB RAM", disk: "120 GB SSD", traffic: "不限 @ 1 Gbps", location: "美国-纽约", group: "远程桌面", tagline: "Windows Server 2022" }),
    P("RDP NVMe", 19.9, { cpu: "6 x vCPU", ram: "12 GB RAM", disk: "180 GB NVMe", traffic: "不限 @ 2 Gbps", location: "英国-伦敦", group: "远程桌面", hot: 1 }),
    P("Admin RDP 旗舰", 24.9, { cpu: "8 x vCPU", ram: "16 GB RAM", disk: "240 GB NVMe", traffic: "不限 @ 2 Gbps", location: "荷兰-阿姆斯特丹", group: "远程桌面", tagline: "管理员权限独享" }),
  ]),

  V("novixlink", "NovixLink 诺联主机", "#", 178, [
    P("香港 BGP 入门", 19.9, { currency: "CNY", cpu: "1 x vCPU", ram: "1 GB RAM", disk: "20 GB NVMe", traffic: "1 TB/mo @ 300 Mbps", location: "香港", group: "BGP中转" }),
    P("香港 BGP 标准", 39.9, { currency: "CNY", cpu: "2 x vCPU", ram: "2 GB RAM", disk: "40 GB NVMe", traffic: "2 TB/mo @ 500 Mbps", location: "香港", group: "BGP中转" }),
    P("美国 CN2", 24.9, { currency: "CNY", cpu: "1 x vCPU", ram: "2 GB RAM", disk: "30 GB NVMe", traffic: "2 TB/mo @ 500 Mbps", location: "美国-洛杉矶", group: "CN2 GIA", tagline: "CN2 GIA 精品线路" }),
    P("高防 BGP", 79.9, { currency: "CNY", cpu: "4 x vCPU", ram: "8 GB RAM", disk: "100 GB NVMe", traffic: "不限 @ 200 Mbps", location: "香港", group: "高防" }),
  ]),

  // ── 黑名单厂商（仅展示，警示风险）──────────────────────────
  V("starspeed", "星速云", "#", 262, [
    P("高防 VPS", 49.9, { currency: "CNY", cpu: "2 x vCPU", ram: "2 GB RAM", disk: "40 GB SSD", traffic: "2 TB/mo @ 50 Mbps", location: "国内-山东", group: "高防", inStock: false }),
  ], { blacklisted: true, blacklistReason: "频繁失联，工单长期无人处理" }),

  V("aurora", "极光主机", "#", 188, [
    P("特惠型", 19.9, { currency: "CNY", cpu: "1 x vCPU", ram: "1 GB RAM", disk: "20 GB SSD", traffic: "1 TB/mo @ 100 Mbps", location: "香港", group: "轻量云", inStock: false }),
  ], { blacklisted: true, blacklistReason: "超售严重，长期宕机不赔偿" }),

  V("freecloud", "免费云社", "#", 154, [
    P("免费体验机", 0, { currency: "CNY", cpu: "1 x vCPU", ram: "512 MB RAM", disk: "10 GB SSD", traffic: "50 GB/mo @ 10 Mbps", location: "国内-河南", group: "轻量云", inStock: false }),
  ], { blacklisted: true, blacklistReason: "诱导实名/付费升级，疑似收集个人信息" }),

  V("rainbow", "彩虹云", "#", 143, [
    P("年付特惠", 88.0, { currency: "CNY", cpu: "2 x vCPU", ram: "2 GB RAM", disk: "40 GB SSD", traffic: "2 TB/mo @ 100 Mbps", location: "香港", group: "轻量云", inStock: false }),
  ], { blacklisted: true, blacklistReason: "多次跑路后换域名重开" }),

  V("suda", "速达云", "#", 121, [
    P("标准型", 29.9, { currency: "CNY", cpu: "2 x vCPU", ram: "2 GB RAM", disk: "30 GB SSD", traffic: "1 TB/mo @ 100 Mbps", location: "国内-四川", group: "轻量云", inStock: false }),
  ], { blacklisted: true, blacklistReason: "恶意扣款，拒绝退款" }),

  V("yunbian", "云边计算", "#", 96, [
    P("GPU 体验型", 99.0, { currency: "CNY", cpu: "4 x vCPU", ram: "8 GB RAM", disk: "60 GB SSD", traffic: "1 TB/mo @ 100 Mbps", location: "国内-贵州", group: "轻量云", inStock: false }),
  ], { blacklisted: true, blacklistReason: "用户数据丢失且拒不赔偿" }),

  V("lele", "乐乐主机", "#", 73, [
    P("入门型", 15.0, { currency: "CNY", cpu: "1 x vCPU", ram: "1 GB RAM", disk: "15 GB SSD", traffic: "500 GB/mo @ 50 Mbps", location: "香港", group: "轻量云", inStock: false }),
  ], { blacklisted: true, blacklistReason: "换壳重开，旧账未清" }),

  V("blueocean", "蓝海VPS", "#", 41, [
    P("促销型", 12.9, { currency: "CNY", cpu: "1 x vCPU", ram: "1 GB RAM", disk: "15 GB SSD", traffic: "1 TB/mo @ 100 Mbps", location: "美国-洛杉矶", group: "普通优化", inStock: false }),
  ], { blacklisted: true, blacklistReason: "已失联，存在跑路风险" }),
];

/** 顶部滚动公告：取热门/精选产品生成促销文案 */
export function buildAnnouncement(): string[] {
  const hot = vendors
    .flatMap((v) => v.products.map((p) => ({ v, p })))
    .filter(({ p }) => p.featured || (p.hot ?? 0) >= 2)
    .sort((a, b) => (b.p.hot ?? 0) - (a.p.hot ?? 0))
    .slice(0, 6);
  return hot.map(({ v, p }) => {
    const cycle = p.cycles[0]?.label ?? "";
    return `${v.name} · ${p.name} · ${cycle} · ${p.specSummary} · 机房: ${p.location} · 库存: ${
      p.inStock ? "有货" : "缺货"
    } · PID: ${p.id.toUpperCase()} · 购买: ${p.buyUrl}`;
  });
}
