export const runtime = "edge";

import { getSeries, getTotalsForDay } from "@/lib/metrics";

const EVENTS = [
  "generate_success",
  "generate_error",
  "paywall_open",
  "copy_all",
  "download_txt",
];

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { key?: string };
}) {
  const pass = process.env.ADMIN_KEY || "";
  if (!searchParams?.key || searchParams.key !== pass) {
    return (
      <main className="mx-auto max-w-md p-6">
        <h1 className="text-xl font-semibold mb-4">Admin</h1>
        <p>
          Unauthorized. Append <code>?key=YOUR_ADMIN_KEY</code> to the URL to
          access analytics.
        </p>
      </main>
    );
  }

  const todayTotals = await getTotalsForDay(new Date(), EVENTS);
  const last7 = await Promise.all(
    EVENTS.map(async (e) => ({
      e,
      series: await getSeries(e, 7),
    })),
  );

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-bold mb-6">Founder Dashboard</h1>

      <section className="mb-10">
        <h2 className="font-semibold text-lg">Today</h2>
        <ul className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {EVENTS.map((e) => (
            <li
              key={e}
              className="border border-gray-300 rounded p-4 bg-white shadow-sm"
            >
              <div className="text-xs uppercase opacity-60">{e}</div>
              <div className="text-3xl font-semibold mt-1">
                {todayTotals[e]}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="font-semibold text-lg mb-3">Last 7 Days</h2>
        <div className="grid gap-6">
          {last7.map(({ e, series }) => (
            <div
              key={e}
              className="border border-gray-300 rounded p-4 bg-white shadow-sm"
            >
              <div className="font-medium mb-2">{e}</div>
              <div className="grid grid-cols-7 gap-2 text-center text-xs">
                {series.map((pt) => (
                  <div key={pt.date}>
                    <div className="text-lg font-semibold">{pt.count}</div>
                    <div className="opacity-50 mt-1">
                      {pt.date.slice(5).replace("-", "/")}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
