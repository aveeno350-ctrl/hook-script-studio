// app/cancel/page.tsx

export const metadata = {
  title: "Checkout cancelled — Hook & Script Studio",
  description:
    "Your checkout was cancelled. You can keep using your free runs in Hook & Script Studio.",
};

export default function CancelPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10 space-y-6">
      <header className="space-y-2">
        <p className="kicker">Checkout cancelled</p>
        <h1 className="font-display text-2xl font-semibold">
          No worries — you&apos;re still welcome to use your free runs.
        </h1>
        <p className="text-sm opacity-75 leading-relaxed">
          Your payment didn&apos;t go through this time. Nothing was charged,
          and you can still use your remaining free runs to feel out the tool
          before upgrading.
        </p>
      </header>

      <section className="card p-6 space-y-3">
        <h2 className="font-semibold text-base">You can still:</h2>
        <ul className="list-disc pl-5 text-sm opacity-80 space-y-1">
          <li>Generate hooks and scripts with your free runs.</li>
          <li>
            Test different niches, offers, and tones to see what feels best.
          </li>
          <li>
            Come back to upgrade later if Hook &amp; Script Studio becomes part
            of your workflow.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold text-base">Ready to keep exploring?</h2>
        <p className="text-sm opacity-80 leading-relaxed">
          If you ended up here by accident or changed your mind, you can reopen
          the generator, keep experimenting, and upgrade whenever it makes
          sense.
        </p>

        <div className="flex flex-wrap gap-3">
          <a href="/" className="btn btn-secondary text-sm">
            Back to the generator
          </a>
          <a href="/pricing" className="btn btn-ghost text-xs">
            View pricing
          </a>
        </div>
      </section>

      <p className="text-[11px] opacity-60 pt-4">
        If you ran into an issue during checkout, feel free to contact support
        with a quick description of what happened so it can be looked into.
      </p>
    </main>
  );
}

