import { NextRequest } from "next/server";
import { site } from "@/config/site";

type Stats = {
  total: number;
  day: string;
  today: number;
  sessions: Map<string, number>;
};

const g = globalThis as unknown as { __vpsmStats?: Stats };

if (!g.__vpsmStats) {
  g.__vpsmStats = {
    total: site.statsSeed.total,
    day: new Date().toISOString().slice(0, 10),
    today: site.statsSeed.today,
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
