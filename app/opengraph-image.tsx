import { ImageResponse } from "next/og";

export const alt = "VPS超市 - VPS 库存监控 / 优惠推荐 / 有货提醒";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #0a0e13 0%, #0f1c17 100%)",
          color: "#e6ecf2",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <div
            style={{
              width: "88px",
              height: "88px",
              borderRadius: "20px",
              background: "linear-gradient(135deg, #34d399, #0d9488)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "48px",
              fontWeight: 700,
              color: "#04160e",
            }}
          >
            V
          </div>
          <div style={{ fontSize: "64px", fontWeight: 700 }}>VPS超市</div>
        </div>
        <div style={{ marginTop: "40px", fontSize: "34px", lineHeight: 1.5, color: "#a8b5c2" }}>
          77 家厂商 · 2000+ 在售套餐
        </div>
        <div style={{ fontSize: "34px", lineHeight: 1.5, color: "#a8b5c2" }}>
          实时库存监控 · 优惠聚合 · 有货提醒 · IP 家宽检测
        </div>
        <div style={{ marginTop: "48px", display: "flex", gap: "16px" }}>
          {["CN2 GIA", "9929", "CMIN2", "家宽", "高防"].map((t) => (
            <div
              key={t}
              style={{
                display: "flex",
                padding: "10px 24px",
                borderRadius: "999px",
                border: "1px solid #34d39955",
                color: "#34d399",
                fontSize: "24px",
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
