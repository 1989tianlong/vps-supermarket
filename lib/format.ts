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

/** 周期月数映射：月付/季付/半年付/年付/两年付/三年付 */
const CYCLE_MONTHS: [RegExp, number][] = [
  [/三年/, 36],
  [/两年|二年/, 24],
  [/半年/, 6],
  [/年/, 12],
  [/季/, 3],
  [/月/, 1],
];

/**
 * 从周期标签（如 “年付 $15.00”）解析月均价格，返回 “≈ $1.25/月”；
 * 解析失败返回空字符串。
 */
export function monthlyEquivalent(label: string | undefined): string {
  if (!label) return "";
  const months = CYCLE_MONTHS.find(([re]) => re.test(label))?.[1];
  const amount = parseFloat(label.replace(/[^\d.]/g, ""));
  const symbol = label.match(/[¥$€£]/)?.[0] ?? "$";
  if (!months || !isFinite(amount) || amount <= 0) return "";
  const perMonth = amount / months;
  return `≈ ${symbol}${perMonth.toFixed(2)}/月`;
}
