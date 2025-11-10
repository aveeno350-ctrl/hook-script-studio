// app/admin/page.tsx
export const dynamic = 'force-dynamic'; // don’t cache

type Props = { searchParams: { key?: string } };

export default async function AdminPage({ searchParams }: Props) {
  const ok = searchParams?.key && process.env.ADMIN_KEY && searchParams.key === process.env.ADMIN_KEY;

  if (!ok) {
    return (
      <main className="p-6 max-w-xl">
        <h1 className="text-xl font-semibold">Admin</h1>
        <p className="mt-2">
          Unauthorized. Append <code>?key=YOUR_ADMIN_KEY</code> to the URL to access analytics.
        </p>
      </main>
    );
  }

  // --- your real dashboard goes here ---
  return (
    <main className="p-6 max-w-3xl">
      <h1 className="text-xl font-semibold">Admin — Analytics</h1>
      <p className="mt-2 text-sm opacity-70">Key accepted. Dashboard will render here.</p>
      {/* TODO: render your metrics */}
    </main>
  );
}
