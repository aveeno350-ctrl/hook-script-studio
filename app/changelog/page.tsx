import Container from "../components/Container";
import PageHeader from "../components/PageHeader";
import { UPDATES } from "../data/updates";

export const metadata = {
  title: "Changelog – Hook & Script Studio",
  description:
    "What changed in Hook & Script Studio: features, fixes, polish, and infrastructure notes."
};

export default function ChangelogPage() {
  return (
    <Container>
      <PageHeader
        title="Changelog"
        subtitle="Ship log of features, fixes, and polish."
      />

      <div className="space-y-6">
        {UPDATES.map((u) => (
          <section key={u.version} className="card p-4 md:p-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold">
                v{u.version} — {u.title}
              </h2>
              <time className="text-xs opacity-60">
                {new Date(u.date).toLocaleDateString()}
              </time>
            </div>

            {u.tags?.length ? (
              <div className="mb-3 flex flex-wrap gap-2">
                {u.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-white/5 border border-white/10 px-2 py-0.5 text-xs"
                  >
                    {t}
                  </span>
                ))}
              </div>
            ) : null}

            <ul className="list-disc pl-5 space-y-1 text-sm">
              {u.notes.map((n, i) => (
                <li key={i}>{n}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </Container>
  );
}

