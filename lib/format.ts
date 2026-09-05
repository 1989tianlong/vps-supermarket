export function formatViews(n: number): string {
  if (n >= 1000) {
    const k = n / 1000;
    return `${k >= 10 ? Math.round(k * 10) / 10 : Math.round(k * 100) / 100}K`;
  }
  return String(n);
}

export function formatMoney(price: number, currency: "USD" | "CNY"): string {
  return `${currency === "USD" ? "$" : "¥"}${price}`;
}

export function probeTime(minsAgo: number): string {
  const d = new Date(Date.now() - minsAgo * 60_000);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

/** 由名称生成稳定的头像渐变色 */
export function avatarGradient(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360;
  return `linear-gradient(135deg, hsl(${h} 70% 55%), hsl(${(h + 40) % 360} 75% 45%))`;
}
