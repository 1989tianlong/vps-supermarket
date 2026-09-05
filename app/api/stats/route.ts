import { NextRequest } from "next/server";

type Stats = {
  total: number;
  day: string;
  today: number;
  sessions: Map<string, number>;
};

const g = globalThis as unknown as { __vpsmStats?: Stats };

// 真实计数：从 0 开始累计（部署重置后自然重新累计）
if (!g.__vpsmStats) {
  g.__vpsmStats = {
    total: 0,
    day: new Date().toISOString().slice(0, 10),
    today: 0,
    sessions: new Map(),
  };
}
const S = g.__vpsmStats;

function prune() {
  const now = Date.now();
  for (const [k, t] of S.sessions) if (now - t > 70_000) S.sessions.delete(k);
}

function rollDay() {
  const today = new Date().toISOString().slice(0, 10);
  if (today !== S.day) {
    S.day = today;
    S.today = 0;
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}) as { cid?: string });
  const cid = String(body.cid ?? "") || String(Date.now());
  S.sessions.set(cid, Date.now());
  prune();
  rollDay();
  S.total += 1;
  S.today += 1;
  return Response.json({ total: S.total, today: S.today, online: S.sessions.size });
}

export async function GET() {
  prune();
  rollDay();
  return Response.json({ total: S.total, today: S.today, online: S.sessions.size });
}
