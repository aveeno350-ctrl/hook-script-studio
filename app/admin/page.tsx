// app/admin/page.tsx

import { Suspense } from "react";
import AdminClient from "./AdminClient";

// don't prerender; we need the runtime query param
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "edge"; // keep if your project uses Edge

export default function Page(props: { searchParams?: Record<string, string> }) {
  // key from URL: /admin?key=YOUR_ADMIN_KEY
  const key = props?.searchParams?.key ?? "";

  // secret from Vercel env vars (Settings → Environment Variables)
  const ADMIN = process.env.ADMIN_KEY; // ← make sure the name matches in Vercel

  const authorized = !!ADMIN && key === ADMIN;

  if (!authorized) {
    return (
      <main style={{ maxWidth: 720, margin: "56px auto", fontFamily: "ui-sans-serif" }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>Admin</h1>
        <p>Unauthorized. Append <code>?key=YOUR_ADMIN_KEY</code> to the URL.</p>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 1100, margin: "40px auto", padding: 16 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Admin</h1>
      <Suspense fallback={<div style={{ padding: 24 }}>Loading admin…</div>}>
        <AdminClient />
      </Suspense>
    </main>
  );
}

