// app/admin/page.tsx

import { Suspense } from "react";
import AdminClient from "./AdminClient";

// Prevent static generation so the build won't prerender this page
export const dynamic = "force-dynamic";
export const revalidate = 0;

// Keep edge runtime if your project uses it
export const runtime = "edge";

export default function Page() {
  return (
    <Suspense fallback={<div style={{ padding: 24 }}>Loading admin…</div>}>
      <AdminClient />
    </Suspense>
  );
}

