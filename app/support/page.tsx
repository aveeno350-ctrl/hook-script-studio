// app/support/page.tsx

export const metadata = {
  title: "Support — Hook & Script Studio",
  description:
    "Get help with Hook & Script Studio. Find support details and how to contact us.",
};

export default function SupportPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10 space-y-6">
      <header className="space-y-2">
        <p className="kicker">Support</p>
        <h1 className="font-display text-2xl font-semibold">
          Need help with Hook &amp; Script Studio?
        </h1>
        <p className="text-sm opacity-75">
          If something isn&apos;t working, you&apos;re confused by a result, or you
          just need a human to sanity-check an issue, this page explains how
          to reach out and what to include so you can get help faster.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="font-semibold text-base">1. Best way to contact</h2>
        <p className="text-sm opacity-80 leading-relaxed">
          The best way to get support is by email. Include as much detail as
          you can so your question can be answered in one or two replies
          instead of a long back-and-forth.
        </p>
        <p className="text-sm opacity-80">
          Email:{" "}
          <a
            href="mailto:aveeno350@gmail.com?subject=Hook%20%26%20Script%20Studio%20Support%20Request"
            className="underline hover:no-underline"
          >
            aveeno350@gmail.com
          </a>
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold text-base">2. Helpful details to include</h2>
        <p className="text-sm opacity-80 leading-relaxed">
          When you reach out, it helps to share:
        </p>
        <ul className="list-disc pl-5 text-sm opacity-80 space-y-1">
          <li>What you were trying to do (for example, &quot;generate hooks for X&quot;).</li>
          <li>What actually happened (error message, blank output, weird behavior).</li>
          <li>Which browser and device you&apos;re using.</li>
          <li>Any screenshots that show the issue (if comfortable sharing).</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold text-base">3. Response times</h2>
        <p className="text-sm opacity-80 leading-relaxed">
          Support is typically handled within{" "}
          <span className="font-medium">24–48 hours</span> on weekdays. Response
          times may be slower during weekends, holidays, or high-volume periods.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold text-base">4. Billing &amp; access issues</h2>
        <p className="text-sm opacity-80 leading-relaxed">
          If you&apos;re having trouble with billing or access (for example, your
          payment isn&apos;t going through or your access was paused), mention that
          in the subject line so it can be looked at quickly.
        </p>
      </section>

      <p className="text-[11px] opacity-60 pt-4">
        Hook &amp; Script Studio is evolving over time — if you spot a bug or
        have a feature idea, sending it in actually helps shape what gets
        built next.
      </p>
    </main>
  );
}
