import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { Tools } from "@/components/Tools";

export const metadata: Metadata = {
  title: "开发者小工具",
  description:
    "免费在线工具：带宽与月流量换算、VPS 周期月均价格计算、Unix 时间戳转换，以及开放的本站库存数据 API。",
  alternates: { canonical: "/tools" },
};

export default function ToolsPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <Tools />
    </div>
  );
}
