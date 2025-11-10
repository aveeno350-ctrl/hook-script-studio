// app/admin/page.tsx
export const dynamic = 'force-dynamic'; // no caching
export const runtime = 'nodejs';        // ensure Node runtime, not Edge

type Props = { searchParams?: Record<string, string | string[] | undefined> };

function asString(v: unknown) {
  return typeof v === 'string' ? v : Array.isArray(v) ? v[0] : undefined;
}

export default async function AdminPage({ searchParams }: Props) {
  // DO NOT print real values; only booleans
  const provided = !!asString(searchParams?.key);
  const hasEnv = !!process.env.ADMIN_KEY;
  const matches =
    provided && hasEnv && asString(searchParams?.key) === process.env.ADMIN_KEY;

  // Also log to Vercel function logs (safe booleans only)
  console.log('[ADMIN DEBUG]', { provided, hasEnv, matches });

  if (!matches) {
    return (
      <main className="p-6 max-w-xl">
        <h1 className="text-xl font-semibold">Admin</h1>
        <p className="mt-3">Unauthorized. Append <code>?key=YOUR_ADMIN_KEY</code> to the URL.</p>
        <div className="mt-6 text-sm opacity-70 space-y-1">
          <div>provided: <b>{String(provided)}</b></div>
          <div>hasEnv: <b>{String(hasEnv)}</b></div>
          <div>matches: <b>{String(matches)}</b></div>
        </div>
      </main>
    );
  }

  return (
    <main className="p-6 max-w-3xl">
      <h1 className="text-xl font-semibold">Admin — Analytics</h1>
      <p className="mt-2 text-sm opacity-70">Key accepted. Dashboard loading…</p>
    </main>
  );
}

