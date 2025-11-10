// app/admin/AdminClient.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

type Totals = {
  total: number;
  success: number;
  clicked: number;
  paywall: number;
  errors: number;
  avgMs: number;
};

type Point = { t: string; v: number };
type BreakdownRow = { key: string; value: number };
type Err = { ts: string; message: string };

type Props = { authorized: boolean };

// ---- theme (auto-detect) ----------------------------------------------------
function usePrefersDark(): boolean {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => setDark(mq.matches);
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);
  return dark;
}

// ---- mock data (we’ll replace with real fetches to /api/metrics/*) ----------
async function fetchTotals(): Promise<Totals> {
  // TODO: GET /api/metrics/totals
  return {
    total: 1289,
    success: 874,
    clicked: 1120,
    paywall: 97,
    errors: 51,
    avgMs: 1840,
  };
}

async function fetchSeries(eventKey: string, days = 14): Promise<Point[]> {
  // TODO: GET /api/metrics/series?event=evt:generate_success&range=14d
  const now = new Date();
  return Array.from({ length: days }).map((_, i) => {
    const d = new Date(now);
    d.setDate(now.getDate() - (days - 1 - i));
    const seed = (eventKey.length * (i + 3)) % 9;
    return { t: d.toISOString().slice(0, 10), v: 15 + seed * 3 + (i % 4) };
  });
}

async function fetchBreakdown(kind: "platform" | "tone" | "niche"): Promise<BreakdownRow[]> {
  // TODO: GET /api/metrics/breakdown?key=platform|tone|niche&limit=10
  const samples: Record<typeof kind, BreakdownRow[]> = {
    platform: [
      { key: "tiktok", value: 431 },
      { key: "instagram", value: 322 },
      { key: "youtube", value: 211 },
      { key: "reels", value: 186 },
      { key: "shorts", value: 139 },
    ],
    tone: [
      { key: "friendly", value: 284 },
      { key: "bold", value: 212 },
      { key: "feminine", value: 197 },
      { key: "professional", value: 151 },
    ],
    niche: [
      { key: "skincare", value: 121 },
      { key: "coaching", value: 103 },
      { key: "fitness", value: 88 },
      { key: "marketing", value: 76 },
      { key: "fashion", value: 69 },
    ],
  };
  return samples[kind];
}

async function fetchErrors(limit = 10): Promise<Err[]> {
  // TODO: GET /api/metrics/errors?limit=10
  const now = Date.now();
  return Array.from({ length: limit }).map((_, i) => ({
    ts: new Date(now - i * 36e5).toISOString(),
    message: i % 3 === 0 ? "OpenAI timeout" : i % 3 === 1 ? "Rate limit hit" : "Unexpected JSON",
  }));
}

// ---- UI components ----------------------------------------------------------
function Card({ label, value, hint }: { label: string; value: React.ReactNode; hint?: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm bg-white/70 dark:bg-slate-900/60">
      <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</div>
      <div className="mt-2 text-2xl font-extrabold">{value}</div>
      {hint ? <div className="text-xs text-slate-500 mt-1">{hint}</div> : null}
    </div>
  );
}

function MiniSeries({
  title,
  data,
  dark,
}: {
  title: string;
  data: Point[];
  dark: boolean;
}) {
  const stroke = dark ? "#93c5fd" : "#2563eb";
  const fill = dark ? "rgba(147,197,253,0.18)" : "rgba(37,99,235,0.12)";
  const grid = dark ? "#0f172a" : "#eef2ff";
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4 bg-white/70 dark:bg-slate-900/60">
      <div className="text-sm font-semibold mb-3">{title}</div>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={stroke} stopOpacity={0.45} />
                <stop offset="100%" stopColor={stroke} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={grid} vertical={false} />
            <XAxis dataKey="t" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} width={38} />
            <Tooltip />
            <Area type="monotone" dataKey="v" stroke={stroke} fill="url(#trendFill)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function TopList({ title, rows }: { title: string; rows: BreakdownRow[] }) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4 bg-white/70 dark:bg-slate-900/60">
      <div className="text-sm font-semibold mb-3">{title}</div>
      <ul className="divide-y divide-slate-100 dark:divide-slate-800">
        {rows.map((r) => (
          <li key={r.key} className="flex items-center justify-between py-2 text-sm">
            <span className="font-medium">{r.key}</span>
            <span className="tabular-nums text-slate-600 dark:text-slate-300">{r.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ErrorsPanel({ items }: { items: Err[] }) {
  return (
    <div className="rounded-2xl border border-rose-200 dark:border-rose-900/60 p-4 bg-rose-50/60 dark:bg-rose-950/30">
      <div className="text-sm font-semibold mb-3">Recent errors</div>
      <ul className="divide-y divide-rose-100/60 dark:divide-rose-900/40">
        {items.map((e, i) => (
          <li key={i} className="py-2">
            <div className="text-xs text-slate-500">{new Date(e.ts).toLocaleString()}</div>
            <div className="text-sm">{e.message}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ---- Main admin client ------------------------------------------------------
export default function AdminClient({ authorized }: Props) {
  if (!authorized) {
    return (
      <main className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-2">Admin</h1>
        <p>Unauthorized (client). Server did not grant access.</p>
      </main>
    );
  }

  const dark = usePrefersDark();

  const [totals, setTotals] = useState<Totals | null>(null);
  const [seriesRuns, setSeriesRuns] = useState<Point[]>([]);
  const [seriesSuccess, setSeriesSuccess] = useState<Point[]>([]);
  const [seriesErrors, setSeriesErrors] = useState<Point[]>([]);
  const [topPlatforms, setTopPlatforms] = useState<BreakdownRow[]>([]);
  const [topTones, setTopTones] = useState<BreakdownRow[]>([]);
  const [topNiches, setTopNiches] = useState<BreakdownRow[]>([]);
  const [errs, setErrs] = useState<Err[]>([]);

  useEffect(() => {
    // parallel warm-up; swap to real APIs next step
    (async () => {
      const [t, r, s, e, bp, bt, bn, el] = await Promise.all([
        fetchTotals(),
        fetchSeries("evt:generate_clicked"),
        fetchSeries("evt:generate_success"),
        fetchSeries("evt:generate_error"),
        fetchBreakdown("platform"),
        fetchBreakdown("tone"),
        fetchBreakdown("niche"),
        fetchErrors(8),
      ]);
      setTotals(t);
      setSeriesRuns(r);
      setSeriesSuccess(s);
      setSeriesErrors(e);
      setTopPlatforms(bp);
      setTopTones(bt);
      setTopNiches(bn);
      setErrs(el);
    })();
  }, []);

  const funnel = useMemo(() => {
    if (!totals) return { clicked: 0, success: 0, paywall: 0, errors: 0, conv: 0 };
    const conv = totals.clicked ? Math.round((totals.success / totals.clicked) * 1000) / 10 : 0;
    return { clicked: totals.clicked, success: totals.success, paywall: totals.paywall, errors: totals.errors, conv };
  }, [totals]);

  return (
    <main className="max-w-7xl mx-auto p-6 space-y-6">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Analytics</h1>
          <p className="text-slate-600 dark:text-slate-300">Live counters from KV · auto theme · Recharts</p>
        </div>
      </header>

      {/* KPI cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card label="Total events" value={totals?.total ?? "…"} />
        <Card label="Clicked" value={totals?.clicked ?? "…"} />
        <Card label="Success" value={totals?.success ?? "…"} />
        <Card label="Paywall opens" value={totals?.paywall ?? "…"} />
        <Card label="Errors" value={totals?.errors ?? "…"} />
        <Card label="Avg gen time" value={totals ? `${Math.round(totals.avgMs)} ms` : "…"} />
      </section>

      {/* Trends */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <MiniSeries title="Daily Clicks" data={seriesRuns} dark={dark} />
        <MiniSeries title="Daily Successes" data={seriesSuccess} dark={dark} />
        <MiniSeries title="Daily Errors" data={seriesErrors} dark={dark} />
      </section>

      {/* Funnel */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4 bg-white/70 dark:bg-slate-900/60">
        <div className="text-sm font-semibold mb-3">Funnel</div>
        <div className="grid grid-cols-4 gap-4 items-end">
          {[
            { label: "Clicked", value: funnel.clicked },
            { label: "Success", value: funnel.success },
            { label: "Paywall", value: funnel.paywall },
            { label: "Errors", value: funnel.errors },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div
                className="mx-auto w-12 rounded-t-xl bg-blue-500/70 dark:bg-blue-400/60"
                style={{ height: 20 + Math.min(120, s.value / 2) }}
                aria-hidden
              />
              <div className="mt-2 text-sm font-medium">{s.label}</div>
              <div className="text-xs text-slate-600 dark:text-slate-300 tabular-nums">{s.value}</div>
            </div>
          ))}
        </div>
        <div className="mt-2 text-xs text-slate-500">Click→Success conversion: <b>{funnel.conv}%</b></div>
      </section>

      {/* Top breakdowns */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <TopList title="Top platforms" rows={topPlatforms} />
        <TopList title="Top tones" rows={topTones} />
        <TopList title="Top niches" rows={topNiches} />
      </section>

      {/* Errors */}
      <ErrorsPanel items={errs} />
    </main>
  );
}


