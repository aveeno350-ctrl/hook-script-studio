// app/admin/page.tsx
import { Suspense } from "react";
import AdminClient from "./AdminClient";

// Force runtime eval; do NOT prerender
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "edge";

type SP = Record<string, string | string[] | undefined> | undefined;

export default function Page({ searchParams }: { searchParams?: SP }) {
  // 1) read query ?key=… and normalize
  const rawKey =
    (typeof searchParams?.key === "string"
      ? searchParams?.key
      : Array.isArray(searchParams?.key)
      ? searchParams?.key[0]
      : "") ?? "";
  const key = rawKey.trim();

  // 2) read server env and normalize
  const ADMIN = (process.env.ADMIN_KEY ?? "").trim();

  const hasEnv = ADMIN.length > 0;
  const provided = key.length > 0;
  const matches = hasEnv && provided && key === ADMIN;

  // Always show debug panel (temporary)
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
key.len: ${key.length}
admin.len: ${ADMIN.length}
key.preview: ${key ? key.slice(0, 2) + "…" + key.slice(-2) : "(empty)"}
admin.preview: ${ADMIN ? ADMIN.slice(0, 2) + "…" + ADMIN.slice(-2) : "(empty)"}
`}</pre>
  );

  if (!matches) {
    return (
      <main style={{ maxWidth: 760, margin: "56px auto", fontFamily: "ui-sans-serif" }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>Admin</h1>
        <p>
          Unauthorized. Append <code>?key=YOUR_ADMIN_KEY</code> to the URL to access analytics.
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

