import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";

export const metadata = {
  title: "Changelog — Hook & Script Studio",
  description:
    "All product updates, improvements, and fixes for Hook & Script Studio.",
};

export default function ChangelogPage() {
  return (
    <Container>
      <PageHeader
        title="Changelog"
        subtitle="What’s new, improved, and fixed as we roll toward greatness."
      />

      <div className="space-y-6">
        {/* v1.0 — Public Launch */}
        <section className="card p-4 md:p-6">
          <div className="flex items-baseline justify-between">
            <h2 className="text-lg font-semibold">v1.0 — Public Launch</h2>
            <time className="text-xs opacity-60">2025-11-12</time>
          </div>

          <ul className="mt-4 space-y-3">
            <li className="flex items-start gap-3">
              <span className="kicker px-2 py-0.5 rounded-full bg-[rgba(103,87,255,0.12)] text-[11px]">
                New
              </span>
              <p>AI Hook & Script engine with 3 free runs, then upgrade.</p>
            </li>
            <li className="flex items-start gap-3">
              <span className="kicker px-2 py-0.5 rounded-full bg-[rgba(103,87,255,0.12)] text-[11px]">
                New
              </span>
              <p>Admin dashboard with charts (Recharts) + key metrics.</p>
            </li>
            <li className="flex items-start gap-3">
              <span className="kicker px-2 py-0.5 rounded-full bg-[rgba(103,87,255,0.12)] text-[11px]">
                Improved
              </span>
              <p>Unified theme (OG blue + purple), polished inputs & buttons.</p>
            </li>
            <li className="flex items-start gap-3">
              <span className="kicker px-2 py-0.5 rounded-full bg-[rgba(103,87,255,0.12)] text-[11px]">
                Fixed
              </span>
              <p>Admin key verification + cookie fallback for secure access.</p>
            </li>
          </ul>
        </section>

        {/* v0.x — Build-up */}
        <section className="card p-4 md:p-6">
          <div className="flex items-baseline justify-between">
            <h2 className="text-lg font-semibold">v0.x — Beta & groundwork</h2>
            <time className="text-xs opacity-60">2025-11-10 → 2025-11-11</time>
          </div>

          <ul className="mt-4 space-y-3">
            <li className="flex items-start gap-3">
              <span className="kicker px-2 py-0.5 rounded-full bg-[rgba(168,179,207,0.18)] text-[11px]">
                Infra
              </span>
              <p>KV metrics counters, route protection, and deployment hardening.</p>
            </li>
            <li className="flex items-start gap-3">
              <span className="kicker px-2 py-0.5 rounded-full bg-[rgba(168,179,207,0.18)] text-[11px]">
                Meta
              </span>
              <p>Open Graph + Twitter cards, responsive favicon set, and page icons.</p>
            </li>
          </ul>
        </section>

        <div className="text-xs opacity-60">
          Pro tip: we’ll keep this page updated with every release. Want an RSS feed next?
        </div>
      </div>
    </Container>
  );
}
