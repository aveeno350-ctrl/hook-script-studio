// app/about/page.tsx

export const metadata = {
  title: "About — Hook & Script Studio",
  description:
    "Learn what Hook & Script Studio is, who it is for, and the vision behind it.",
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10 space-y-6">
      <header className="space-y-2">
        <p className="kicker">About</p>
        <h1 className="font-display text-2xl font-semibold">
          What is Hook &amp; Script Studio?
        </h1>
        <p className="text-sm opacity-75">
          Hook &amp; Script Studio is built for creators, coaches, and founders
          who want to make short-form content without staring at a blank screen
          for hours. It&apos;s a practical tool for turning your ideas into
          scripts, not just a toy demo.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="font-semibold text-base">
          Built for short-form video first
        </h2>
        <p className="text-sm opacity-80 leading-relaxed">
          The tool is centered around TikTok, Reels, and Shorts style content:
          punchy hooks, tight 45–60 second scripts, and clear calls to action
          you can film today — not abstract ideas that never become content.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold text-base">
          For people who already care
        </h2>
        <p className="text-sm opacity-80 leading-relaxed">
          It&apos;s especially useful if you:
        </p>
        <ul className="list-disc pl-5 text-sm opacity-80 space-y-1">
          <li>Sell digital products, coaching, or services.</li>
          <li>Want to show up consistently on social without burning out.</li>
          <li>Know your audience, but struggle to turn insights into scripts.</li>
        </ul>
      </section>

      {/* New: Who this is for / not for */}
      <section className="space-y-3">
        <h2 className="font-semibold text-base">
          Who this is for (and who it&apos;s not for)
        </h2>
        <p className="text-sm opacity-80 leading-relaxed">
          Hook &amp; Script Studio works best for people who already have real
          ideas, offers, or expertise — and want help turning that into
          repeatable, filmable content.
        </p>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-[color-mix(in_oklab,var(--surface)94%,transparent)] p-4 space-y-2">
            <h3 className="font-semibold text-sm">It&apos;s for you if…</h3>
            <ul className="list-disc pl-4 text-xs opacity-80 space-y-1">
              <li>You create or want to create short-form content regularly.</li>
              <li>
                You have an offer (or are developing one) and care about your
                audience.
              </li>
              <li>
                You like editing scripts to sound like you, not copying them
                blindly.
              </li>
              <li>
                You want a simple, dependable tool — not 20+ dashboards and
                overwhelming options.
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-white/10 bg-[color-mix(in_oklab,var(--surface)94%,transparent)] p-4 space-y-2">
            <h3 className="font-semibold text-sm">Probably not a fit if…</h3>
            <ul className="list-disc pl-4 text-xs opacity-80 space-y-1">
              <li>
                You&apos;re looking for a one-click “go viral” button with no
                effort.
              </li>
              <li>
                You don&apos;t have any offer, topic, or audience in mind yet.
              </li>
              <li>
                You never want to edit or review what AI generates before
                posting.
              </li>
              <li>
                You need a full agency, done-for-you service — not a creative
                tool.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold text-base">Why it exists</h2>
        <p className="text-sm opacity-80 leading-relaxed">
          Instead of giving you one generic hook, Hook &amp; Script Studio
          leans into repeatable structure: multiple angles, clear scripts,
          B-roll ideas, and CTAs that make sense for your offer. The goal is
          to reduce friction between &quot;I should post something&quot; and
          &quot;I have a ready-to-film script.&quot;
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold text-base">Where it&apos;s going</h2>
        <p className="text-sm opacity-80 leading-relaxed">
          Over time, the plan is to expand into more templates, more platforms,
          and smarter analytics — while keeping the main experience fast and
          focused. Every update in the{" "}
          <a href="/changelog" className="underline hover:no-underline">
            changelog
          </a>{" "}
          is aimed at making your next video easier to ship.
        </p>
      </section>

      <p className="text-[11px] opacity-60 pt-4">
        If you have feedback or ideas, the best way to influence what gets
        built next is to send a quick note via the Support page.
      </p>
    </main>
  );
}
