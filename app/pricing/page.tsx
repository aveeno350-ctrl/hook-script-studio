// app/pricing/page.tsx

export const metadata = {
  title: "Pricing — Hook & Script Studio",
  description:
    "Simple, transparent pricing for Hook & Script Studio. Start with 3 free runs, then unlock unlimited generations.",
};

export default function PricingPage() {
  const paymentLink = process.env.NEXT_PUBLIC_PAYMENT_LINK;

  return (
    <main className="mx-auto max-w-3xl px-6 py-10 space-y-8">
      <header className="space-y-2">
        <p className="kicker">Pricing</p>
        <h1 className="font-display text-2xl font-semibold">
          Simple, creator-friendly pricing
        </h1>
        <p className="text-sm opacity-75">
          Start with <strong>3 free runs</strong> to feel how the tool works.
          When you&apos;re ready, unlock unlimited hooks, scripts, B-roll ideas,
          and CTAs with a single upgrade.
        </p>
      </header>

      {/* Main pricing card */}
      <section className="card p-6 md:p-8 space-y-4">
        <div className="flex items-baseline justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-semibold">
              Creator Access
            </h2>
            <p className="text-sm opacity-75">
              For creators who want a focused tool for short-form video ideas
              and scripts.
            </p>
          </div>

          <div className="text-right">
            <div className="text-2xl font-semibold">$19</div>
            <div className="text-xs opacity-70">one-time payment</div>
            {/* You can switch this to “per month” later if you go subscription */}
          </div>
        </div>

        <ul className="text-sm space-y-2">
          <li>✔ Unlimited generations after your 3 free runs</li>
          <li>✔ Hooks by angle + a tight 45–60s script</li>
          <li>✔ B-roll ideas and CTA suggestions</li>
          <li>✔ Input memory so you’re not retyping your niche every time</li>
          <li>✔ Access to future improvements while the product is live</li>
        </ul>

        <p className="text-xs opacity-70 leading-relaxed">
          You can test the tool with 3 free runs before upgrading. Your upgrade
          unlocks unlimited generations for your account while Hook &amp; Script
          Studio remains available.
        </p>

        {paymentLink ? (
          <a
            href={paymentLink}
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary w-full mt-3 !text-white"
          >
            Upgrade to Creator Access
          </a>
        ) : (
          <p className="text-xs text-red-400 mt-3">
            Payment link not configured yet. Set{" "}
            <code>NEXT_PUBLIC_PAYMENT_LINK</code> in your environment.
          </p>
        )}
      </section>

      {/* FAQ */}
      <section className="space-y-4">
        <header className="space-y-1">
          <p className="kicker">FAQ</p>
          <h2 className="font-display text-base font-semibold">
            Common questions
          </h2>
          <p className="text-xs opacity-75">
            A few quick answers before you decide if this fits your workflow.
          </p>
        </header>

        <div className="space-y-3 text-sm">
          <div>
            <p className="font-semibold text-sm">
              Do I need to pay to try it?
            </p>
            <p className="text-sm opacity-80 leading-relaxed">
              No. You get <strong>3 free runs</strong> to test the flow, see the
              hooks, and feel how the scripts are structured. You only upgrade
              if it actually helps you ship content faster.
            </p>
          </div>

          <div>
            <p className="font-semibold text-sm">
              What happens after I upgrade?
            </p>
            <p className="text-sm opacity-80 leading-relaxed">
              Once your payment goes through, your account is unlocked for{" "}
              <strong>unlimited generations</strong> while Hook &amp; Script
              Studio remains available. You keep access to future improvements
              to the generator as they&apos;re shipped.
            </p>
          </div>

          <div>
            <p className="font-semibold text-sm">
              Can I use the content for clients?
            </p>
            <p className="text-sm opacity-80 leading-relaxed">
              Yes. You can use the hooks and scripts you generate for your own
              brand, client work, and paid offers. You&apos;re responsible for
              reviewing and editing the content before publishing so it matches
              your brand, voice, and platform rules.
            </p>
          </div>
        </div>
      </section>

      {/* Fine print / links */}
      <section className="text-xs opacity-70 space-y-2">
        <p>
          Questions about pricing or upgrades? Reach out via{" "}
          <a href="/support" className="hover:underline">
            Support
          </a>
          .
        </p>
        <p>
          By upgrading, you agree to the{" "}
          <a href="/terms" className="hover:underline">
            Terms
          </a>{" "}
          and{" "}
          <a href="/privacy" className="hover:underline">
            Privacy Policy
          </a>
          .
        </p>
      </section>
    </main>
  );
}
