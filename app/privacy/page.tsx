import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "隐私政策",
  description: "VPS超市 隐私政策：说明本站收集哪些信息、Cookie 与第三方广告（含 Google AdSense 个性化广告）的使用方式。",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <article className="mx-auto max-w-[800px] px-4 py-10 text-[13.5px] leading-relaxed text-muted [&_b]:text-fg [&_li]:mb-1.5 [&_p]:mb-3">
        <h1 className="mb-1 text-[24px] font-bold text-fg">隐私政策</h1>
        <p className="!mb-6 text-[12px]">更新日期：2026-09-06</p>

        <p>
          欢迎使用 {site.name}（以下简称"本站"）。本站是一个 VPS
          库存监控与优惠聚合工具，我们非常重视你的隐私。本政策说明本站收集哪些信息、如何使用，以及第三方服务的参与方式。
        </p>

        <h2 className="mb-2 mt-6 text-[17px] font-bold text-fg">一、我们收集的信息</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <b>访问统计</b>：为展示"总访问 / 今日访问 / 在线数"，本站会在浏览器本地生成一个随机标识（存储于
            localStorage），并以匿名方式累计访问次数。该标识不包含任何个人身份信息。
          </li>
          <li>
            <b>本地偏好</b>：主题选择、收藏的产品、缺货提醒订阅、监控设置等均保存在你自己的浏览器
            localStorage 中，不会上传到服务器。
          </li>
          <li>
            <b>IP 家宽检测工具</b>：当你主动输入 IP 或点击"检测我的 IP"时，本站会将该 IP
            发送给第三方查询接口（ip-api.com、ipwho.is、Tor 出口列表）以返回结果。本站不存储可关联到个人的检测记录。
          </li>
        </ul>

        <h2 className="mb-2 mt-6 text-[17px] font-bold text-fg">二、Cookie 与第三方广告</h2>
        <p>
          本站可能展示第三方广告（如 Google AdSense）以维持运营。这些供应商可能使用 Cookie
          向你投放基于此前访问记录的个性化广告：
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            Google 作为第三方供应商，会使用 Cookie
            在本站投放广告。你可以访问{" "}
            <a
              className="text-primary hover:underline"
              href="https://adssettings.google.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google 广告设置
            </a>{" "}
            关闭个性化广告。
          </li>
          <li>
            关于 Google 如何使用数据的更多说明，见{" "}
            <a
              className="text-primary hover:underline"
              href="https://policies.google.com/technologies/partner-sites"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google 合作伙伴政策
            </a>
            。
          </li>
        </ul>

        <h2 className="mb-2 mt-6 text-[17px] font-bold text-fg">三、数据来源与免责声明</h2>
        <p>
          本站展示的 VPS 库存、价格与优惠信息来自公开渠道的自动聚合，可能存在延迟或偏差。购买决策请以各厂商官网为准，本站不对你与厂商之间的交易承担任何责任。展示的厂商链接可能包含推广性质链接。
        </p>

        <h2 className="mb-2 mt-6 text-[17px] font-bold text-fg">四、儿童隐私</h2>
        <p>本站面向一般用户，不面向 13 岁以下儿童，也不会故意收集儿童的个人信息。</p>

        <h2 className="mb-2 mt-6 text-[17px] font-bold text-fg">五、政策更新</h2>
        <p>本政策可能不定期更新，更新后将在本页面公布。继续使用本站即视为接受更新后的政策。</p>

        <h2 className="mb-2 mt-6 text-[17px] font-bold text-fg">六、联系我们</h2>
        <p>
          对本政策或本站有任何疑问，请联系：<a className="text-primary hover:underline" href={site.ads.contact}>{site.ads.contact}</a>
        </p>

        <div className="mt-8 flex gap-3 text-[12.5px]">
          <Link href="/" className="rounded-lg border border-line px-3 py-1.5 hover:border-primary hover:text-primary">
            返回首页
          </Link>
          <Link href="/about" className="rounded-lg border border-line px-3 py-1.5 hover:border-primary hover:text-primary">
            关于我们
          </Link>
        </div>
      </article>
    </div>
  );
}
