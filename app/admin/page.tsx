// app/admin/page.tsx
import { Suspense } from "react";
import { cookies } from "next/headers";
import AdminClient from "./AdminClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "edge";

type SP = Record<string, string | string[] | undefined> | undefined;

function pickParam(sp: SP, names: string[]): string {
  if (!sp) return "";
  // search case-insensitively across a few accepted names
  const entries = Object.entries(sp);
  for (const want of names) {
    const hit = entries.find(([k]) => k.toLowerCase() === want);
    if (!hit) continue;
    const v = hit[1];
    const raw =
      typeof v === "string" ? v : Array.isArray(v) ? v[0] : "";
    if (raw) return raw.trim();
  }
  // also accept the very first param if user used a weird name
  const first = entries[0]?.[1];
  const raw =
    typeof first === "string" ? first : Array.isArray(first) ? first[0] : "";
  return (raw ?? "").trim();
}

export default function Page({ searchParams }: { searchParams?: SP }) {
  // Accept ?key=, ?admin_key=, or ?k=
  const fromQuery = pickParam(searchParams, ["key", "admin_key", "k"]);
  // Optional cookie fallback (lets you avoid typing every time)
  const fromCookie = (cookies().get("admin_key")?.value ?? "").trim();

  const key = (fromQuery || fromCookie).trim();
  const ADMIN = (process.env.ADMIN_KEY ?? "").trim();

  const hasEnv = ADMIN.length > 0;
  const provided = key.length > 0;
  const matches = hasEnv && provided && key === ADMIN;

  const debug = (
    <pre
      style={{
        background: "#0b1220",
        color: "#d7e3ff",
        padding: 16,
        borderRadius: 8,
        fontSize: 13,
        lineHeight: 1.45,
        overflowX: "auto",
        marginTop: 16,
      }}
    >{`hasEnv: ${hasEnv}
provided: ${provided}
matches: ${matches}
fromQuery.len: ${fromQuery.length}
fromCookie.len: ${fromCookie.length}
admin.len: ${ADMIN.length}
fromQuery.preview: ${fromQuery ? fromQuery.slice(0, 2) + "…" + fromQuery.slice(-2) : "(empty)"}
fromCookie.preview: ${fromCookie ? fromCookie.slice(0, 2) + "…" + fromCookie.slice(-2) : "(empty)"}
admin.preview: ${ADMIN ? ADMIN.slice(0, 2) + "…" + ADMIN.slice(-2) : "(empty)"}
`}</pre>
  );

  if (!matches) {
    return (
      <main style={{ maxWidth: 760, margin: "56px auto", fontFamily: "ui-sans-serif" }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>Admin</h1>
        <p>
          Unauthorized. Append <code>?key=YOUR_ADMIN_KEY</code> to the URL
          (or use <code>?admin_key=</code> or <code>?k=</code>).
        </p>
        <p style={{ marginTop: 8 }}>
          Also make sure the key is **before** any <code>#</code> fragment and that
          the param name is lowercase.
        </p>
        {debug}
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 1100, margin: "40px auto", padding: 16 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Admin</h1>
      <Suspense fallback={<div style={{ padding: 24 }}>Loading admin…</div>}>
        <AdminClient />
      </Suspense>
      {debug}
    </main>
  );
}
