// app/admin/page.tsx
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function AdminPage() {
  const jar = await cookies();
  const authed = jar.get('hss_admin')?.value === '1';

  if (!authed) {
    return (
      <main className="p-6 max-w-xl">
        <h1 className="text-xl font-semibold">Admin</h1>
        <p className="mt-3">
          Unauthorized. Log in at <code>/admin/login?key=YOUR_ADMIN_KEY</code>.
        </p>
      </main>
    );
  }

  return (
    <main className="p-6 max-w-3xl">
      <h1 className="text-xl font-semibold">Admin — Analytics</h1>
      <p className="mt-2 text-sm opacity-70">
        Authenticated. Dashboard loading…
      </p>
      {/* TODO: render your charts here */}
    </main>
  );
}

