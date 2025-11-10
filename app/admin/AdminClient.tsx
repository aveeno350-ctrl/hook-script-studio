// app/admin/AdminClient.tsx
"use client";

import React from "react";

type Props = {
  authorized: boolean;
};

export default function AdminClient({ authorized }: Props) {
  // Trust the server result passed in from app/admin/page.tsx
  if (!authorized) {
    return (
      <main style={{ maxWidth: 720, margin: "48px auto", padding: 16 }}>
        <h1 style={{ fontSize: 28, marginBottom: 12 }}>Admin</h1>
        <p>Unauthorized (client). Server did not grant access.</p>
      </main>
    );
  }

  // ✅ Replace this section with your real admin dashboard UI
  return (
    <main style={{ maxWidth: 900, margin: "48px auto", padding: 16 }}>
      <h1 style={{ fontSize: 32, marginBottom: 20 }}>Admin Dashboard</h1>

      {/* Your metrics, charts, tables, analytics components go here */}
      <p style={{ color: "#777" }}>
        You are authorized — server verified your admin key successfully.
      </p>
    </main>
  );
}

