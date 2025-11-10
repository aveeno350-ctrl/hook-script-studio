// app/admin/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

type Row = { key: string; value: number };

export default function Admin() {
  const sp = useSearchParams();
  const provided = sp.get("key") || "";

  const [rows, setRows] = useState<Row[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // show quick unauthorized message if no key provided in URL
  const hasKey = provided.length > 0;

  useEffect(() => {
    if (!hasKey) return;
    setLoading(true);
    setErr(null);
    setRows(null);
    (async () => {
      try {
        const res = await fetch(`/api/metrics/read?key=${encodeURIComponent(provided)}`, {
          cache: "no-store",
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error || "read failed");
        setRows(json.data as Row[]);
      } catch (e) {
        setErr(String(e));
      } finally {
        setLoading(false);
      }
    })();
  }, [hasKey, provided]);

  const totals = useMemo(() => {
    const map = new Map<string, number>();
    (rows ?? []).forEach((r) => map.set(r.key, r.value));
    const total = map.get("evt:_all") ?? 0;
    const success = map.get("evt:generate_success") ?? 0;
    const clicked = map.get("evt:generate_clicked") ?? 0;
    const errors = map.get("evt:generate_error") ?? 0;
    const ctr = clicked > 0 ? (success / clicked) * 100 : 0;
    return { total, success, clicked, errors, ctr: Math.round(ctr * 10) / 10 };
  }, [rows]);

  if (!hasKey) {
    return (
      <main style={{ maxWidth: 800, margin: "48px auto", padding: 20 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700 }}>Admin</h1>
        <p>Unauthorized. Append <code>?key=YOUR_ADMIN_KEY</code> to the URL to access analytics.</p>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 960, margin: "48px auto", padding: 24, fontFamily: "ui-sans-serif, system-ui" }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Analytics</h1>
      <p style={{ color: "#666", marginBottom: 24 }}>
        Live counters from KV. Key-protected via <code>?key=…</code>.
      </p>

      {/* KPIs */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <KPI label="Total events" value={totals.total} />
        <KPI label="Generations clicked" value={totals.clicked} />
        <KPI label="Generations success" value={totals.success} />
        <KPI label="Errors" value={totals.errors} />
        <KPI label="Success rate" value={`${totals.ctr}%`} />
      </section>

      {/* Table */}
      <section>
        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
          }}
        >
          <div style={{ padding: "10px 12px", background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
            <strong>Raw counters</strong>
          </div>

          {loading ? (
            <div style={{ padding: 16 }}>Loading…</div>
          ) : err ? (
            <div style={{ padding: 16, color: "#b91c1c" }}>Error: {err}</div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ textAlign: "left", background: "#fff" }}>
                  <th style={{ padding: 12, borderBottom: "1px solid #e5e7eb" }}>Key</th>
                  <th style={{ padding: 12, borderBottom: "1px solid #e5e7eb" }}>Value</th>
                </tr>
              </thead>
              <tbody>
                {(rows ?? []).map((r) => (
                  <tr key={r.key}>
                    <td style={{ padding: 12, borderBottom: "1px solid #f1f5f9", fontFamily: "ui-monospace" }}>
                      {r.key}
                    </td>
                    <td style={{ padding: 12, borderBottom: "1px solid #f1f5f9" }}>{r.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </main>
  );
}

function KPI({ label, value }: { label: string; value: number | string }) {
  return (
    <div
      style={{
        padding: 16,
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        background: "#fff",
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
      }}
    >
      <div style={{ color: "#6b7280", fontSize: 13, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 800 }}>{value}</div>
    </div>
  );
}

