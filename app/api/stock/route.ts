import { getStockData } from "@/lib/stock";

/** 公开数据接口：返回最近采集的库存 JSON（与站点展示同源，缓存 30 分钟） */
export const revalidate = 1800;

export async function GET() {
  const data = await getStockData();
  if (!data) {
    return Response.json({ error: "数据尚未初始化" }, { status: 503 });
  }
  return Response.json(data, {
    headers: {
      "cache-control": "public, s-maxage=1800, stale-while-revalidate=86400",
      "access-control-allow-origin": "*",
    },
  });
}
