import { kv } from "@vercel/kv";

function dayKey(date = new Date()) {
  return new Date(date).toISOString().slice(0, 10); // YYYY-MM-DD
}

export async function inc(event: string, date = new Date()) {
  const key = `metrics:${dayKey(date)}:${event}`;
  await kv.incr(key);
}

export async function getSeries(event: string, days = 7) {
  const out: { date: string; count: number }[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const ds = d.toISOString().slice(0, 10);
    const key = `metrics:${ds}:${event}`;
    out.push({ date: ds, count: (await kv.get<number>(key)) || 0 });
  }
  return out;
}

export async function getTotalsForDay(date = new Date(), events: string[]) {
  const ds = dayKey(date);
  const totals: Record<string, number> = {};
  for (const e of events) {
    totals[e] = (await kv.get<number>(`metrics:${ds}:${e}`)) || 0;
  }
  return totals;
}
