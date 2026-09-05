import { NextRequest } from "next/server";

export const runtime = "nodejs";

/** 内置云厂商 ASN/ISP 关键词 */
const CLOUD_KEYWORDS = [
  "amazon", "aws", "google", "microsoft", "azure", "alibaba", "alibaba", "阿里",
  "腾讯", "tencent", "huawei", "华为", "cloudflare", "digitalocean", "ovh",
  "hetzner", "linode", "akamai", "oracle", "vultr", "choopa", "contabo",
  "sero", "gcore", "leaseweb", "sharktech", "psychz", "quadranet", "it7",
  "uvdaemon", "oracle", "zenlayer", "ucloud", "baijiayun", "jtti", "tencent",
];
/** 家宽/住宅 ISP 关键词 */
const RESIDENTIAL_KEYWORDS = [
  "电信", "联通", "移动", "广电", "长城宽带", "宽带", "telecom", "unicom", "mobile",
  "comcast", "verizon", "at&t", "charter", "spectrum", "cox", "bt", "sky", "vodafone",
  "orange", "dt", "telekom", "kddi", "softbank", "ntt", "sk broadband", "hinet",
  "hkbn", "pccw", "smar tone", "cmi",
];

const cache = new Map<string, { t: number; data: unknown }>();
const CACHE_TTL = 10 * 60_000;
let torList: { t: number; set: Set<string> } | null = null;

function clientIp(req: NextRequest): string {
  const xf = req.headers.get("x-forwarded-for") ?? "";
  return xf.split(",")[0].trim() || req.headers.get("x-real-ip") || "";
}

function isIp(s: string): boolean {
  return /^(\d{1,3}\.){3}\d{1,3}$/.test(s) || /^[0-9a-fA-F:]+$/.test(s);
}

async function getTorSet(): Promise<Set<string>> {
  if (torList && Date.now() - torList.t < 3600_000) return torList.set;
  try {
    const r = await fetch("https://check.torproject.org/torbulkexitlist", {
      next: { revalidate: 3600 },
    });
    const text = await r.text();
    torList = { t: Date.now(), set: new Set(text.split("\n").map((l) => l.trim()).filter(Boolean)) };
  } catch {
    torList = { t: Date.now(), set: new Set() };
  }
  return torList.set;
}

async function check(ip: string) {
  const [ipapiRes, ipwhoRes] = await Promise.allSettled([
    fetch(
      `http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,message,country,regionName,city,isp,org,as,asname,reverse,mobile,proxy,hosting,query&lang=zh-CN`,
      { signal: AbortSignal.timeout(8000) },
    ).then((r) => r.json()),
    fetch(`https://ipwho.is/${encodeURIComponent(ip)}`, {
      signal: AbortSignal.timeout(8000),
    }).then((r) => r.json()),
  ]);

  const a = ipapiRes.status === "fulfilled" ? ipapiRes.value : null;
  const b = ipwhoRes.status === "fulfilled" ? ipwhoRes.value : null;
  const torSet = await getTorSet();

  const isp: string = a?.isp || b?.connection?.isp || "";
  const org: string = a?.org || b?.connection?.org || "";
  const as: string = a?.as || (b?.connection?.asn ? `AS${b.connection.asn}` : "");
  const asname: string = a?.asname || b?.connection?.domain || "";
  const reverse: string = a?.reverse || "";
  const hosting: boolean = !!a?.hosting;
  const proxy: boolean = !!a?.proxy;
  const mobile: boolean = !!a?.mobile;
  const tor = torSet.has(ip);

  const haystack = `${isp} ${org} ${asname} ${as}`.toLowerCase();
  const cloud =
    CLOUD_KEYWORDS.find((k) => haystack.includes(k)) ??
    (hosting ? "机房/云服务商" : "");

  let verdict = "未判定";
  let risk: "low" | "mid" | "high" = "low";
  if (tor) {
    verdict = "Tor 出口节点";
    risk = "high";
  } else if (proxy) {
    verdict = "代理 / VPN 出口";
    risk = "high";
  } else if (mobile) {
    verdict = "移动网络（4G/5G）";
    risk = "low";
  } else if (hosting || cloud) {
    verdict = "机房 / 云服务器";
    risk = "mid";
  } else if (RESIDENTIAL_KEYWORDS.some((k) => haystack.includes(k))) {
    verdict = "家庭宽带（家宽）";
  } else if (isp) {
    verdict = "住宅 / 企业线路（疑似）";
  }

  return {
    ip,
    verdict,
    risk,
    residential: !hosting && !proxy && !tor && !mobile,
    isp,
    org,
    as,
    asname,
    reverse,
    cloud,
    geo: {
      country: a?.country ?? b?.country ?? "",
      region: a?.regionName ?? b?.region ?? "",
      city: a?.city ?? b?.city ?? "",
    },
    flags: { hosting, proxy, mobile, tor },
    sources: {
      "ip-api.com": !!a && a.status !== "fail",
      "ipwho.is": !!b && b.success !== false,
      "torproject.org": true,
    },
    checkedAt: new Date().toISOString(),
  };
}

export async function GET(req: NextRequest) {
  let ip = (req.nextUrl.searchParams.get("ip") ?? "").trim();
  if (!ip) ip = clientIp(req);
  if (!ip || !isIp(ip)) {
    return Response.json({ error: "无效的 IP 地址" }, { status: 400 });
  }

  const hit = cache.get(ip);
  if (hit && Date.now() - hit.t < CACHE_TTL) {
    return Response.json(hit.data);
  }
  try {
    const data = await check(ip);
    cache.set(ip, { t: Date.now(), data });
    if (cache.size > 500) cache.clear();
    return Response.json(data);
  } catch (e) {
    return Response.json({ error: `检测失败：${String(e).slice(0, 80)}` }, { status: 502 });
  }
}
