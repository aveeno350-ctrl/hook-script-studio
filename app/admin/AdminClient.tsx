// app/admin/AdminClient.tsx
"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

export default function AdminClient() {
  const params = useSearchParams();

  // Read ?key=... from the URL
  const urlKey = params.get("key") ?? "";

  // Pull the public-facing env var for comparison, if you surface it
  // (If you don't expose a public env, just compare to a hard-coded placeholder
  // or show "Unauthorized" and rely on a read API that verifies server-side.)
  const expected = process.env.NEXT_PUBLIC_ADMIN_KEY ?? "";

  const authorized = useMemo(() => {
    // If you’re not exposing a public key, set `authorized = !!urlKey`
    // and let your read API do the *real* check on the server.
    return expected && urlKey && urlKey === expected;
  }, [expected, urlKey]);

  if (!authorized) {
    return (
      <main style={{ maxWidth: 720, margin: "48px auto", padding: 16 }}>
        <h1 style={{ fontSize: 28, marginBottom: 12 }}>Admin</h1>
        <p>
          Unauthorized. Append <code>?key=YOUR_ADMIN_KEY</code> to the URL to
          access analytics.
        </p>
      </main>
    );
  }

  // Minimal placeholder UI until your read endpoint is wired
  return (
    <main style={{ maxWidth: 960, margin: "48px auto", padding: 16 }}>
      <h1 style={{ fontSize: 28, marginBottom: 12 }}>Analytics</h1>
      <p>Authorized. Your dashboard shell is ready.</p>
      <p style={{ opacity: 0.7 }}>
        Next step: call your read API here and render charts/tables.
      </p>
    </main>
  );
}
