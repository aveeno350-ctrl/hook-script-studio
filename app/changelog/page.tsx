// app/changelog/page.tsx
import { UPDATES } from "../../data/updates";

export const metadata = {
  title: "Changelog — Hook & Script Studio",
  description:
    "See what’s new in Hook & Script Studio: updates, fixes, and improvements over time.",
};

export default function ChangelogPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10 space-y-6">
      <header className="space-y-2">
        <p className="kicker">Product</p>
        <h1 className="font-display text-2xl font-semibold">
          Changelog
        </h1>
        <p className="text-sm opacity-75">
          A simple log of what&apos;s changing in Hook &amp; Script Studio —
          new features, tweaks, and behind-the-scenes improvements.
        </p>
      </header>

      <section className="space-y-4">
        {UPDATES.map((u) => (
          <article
            key={u.version}
            className="rounded-xl border border-white/8 bg-[color-mix(in_oklab,var(--surface)94%,transparent)] p-4 space-y-2"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-sm">
                  {u.title}
                </h2>
                <span className="text-[11px] opacity-70">
                  v{u.version}
                </span>
              </div>
              <span className="text-[11px] opacity-60">
                {u.date}
              </span>
            </div>

            {u.tags && u.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 text-[10px] opacity-75">
                {u.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 px-2 py-[1px]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <ul className="list-disc pl-5 text-xs opacity-80 space-y-1">
              {u.notes.map((note, idx) => (
                <li key={idx}>{note}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <p className="text-[11px] opacity-60 pt-4">
        This changelog is intentionally simple. The goal is to keep a running
        record of progress — not to overwhelm you with every tiny tweak.
      </p>
    </main>
  );
}


