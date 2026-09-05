import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { IpCheck } from "@/components/IpCheck";

export const metadata: Metadata = {
  title: "IP家宽检测",
  description:
    "免费 IP 家宽属性检测：判断 IP 是否为住宅家宽 / 机房云服务器 / 代理 VPN / Tor 出口，聚合 ip-api、ipwho.is 与 Tor 出口列表。",
  alternates: { canonical: "/ip-check" },
};

export default function IpCheckPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <IpCheck />
    </div>
  );
}
