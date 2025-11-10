// app/admin/page.tsx
import { Suspense } from "react";
import { cookies } from "next/headers";
import AdminClient from "./AdminClient";
import KeyBridge from "./KeyBridge";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "edge";

type SP = Record<string, string | string[] | undefined> | undefined;

function pickParam(sp: SP, names: string[]): string {
  if (!sp) return "";
  for (const n of names) {
    const v = sp[n];
    const raw = typeof v === "string" ? v : Array.isArray(v) ? v[0] : "";
    if (raw && raw.trim()) return raw.trim();
  }
  const first = Object.values(sp)[0];
  const raw = typeof first === "string" ? first : Array.isArray(first) ? first[0] : "";
  return (raw ?? "").trim();
}

export default async function Page({ searchParams }: { searchParams?: SP }) {
  const jar = await cookies();
  const fromCookie = (jar.get("admin_key")?.value ?? "").trim();
  const fromQuery = pickParam(searchParams, ["key", "admin_key", "k"]);
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
fromQuery.preview: ${fromQuery ? fromQuery.slice(0,2) + "…" + fromQuery.slice(-2) : "(empty)"}
fromCookie.preview: ${fromCookie ? fromCookie.slice(0,2) + "…" + fromCookie.slice(-2) : "(empty)"}
admin.preview: ${ADMIN ? ADMIN.slice(0,2) + "…" + ADMIN.slice(-2) : "(empty)"}
`}</pre>
  );

  if (!matches) {
    return (
      <main style={{ maxWidth: 760, margin: "56px auto", fontFamily: "ui-sans-serif" }}>
        <KeyBridge />
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>Admin</h1>
        <p style={{ marginBottom: 8 }}>
          Unauthorized. Append <code>?key=YOUR_ADMIN_KEY</code> (or{" "}
          <code>?admin_key=</code> / <code>?k=</code>) to the URL. After one load, a
          cookie is saved so you won’t need the query again.
        </p>
        {debug}
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 1100, margin: "40px auto", padding: 16 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Admin</h1>
      <Suspense fallback={<div style={{ padding: 24 }}>Loading admin…</div>}>
  <AdminClient authorized={matches} />
</Suspense>

      {debug}
    </main>
  );
}
