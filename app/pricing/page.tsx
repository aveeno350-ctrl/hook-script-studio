// app/pricing/page.tsx
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";

export const metadata = {
  title: "Pricing – Hook & Script Studio",
  description:
    "Simple, transparent pricing for Hook & Script Studio. Start with 3 free runs, then unlock unlimited generations.",
};

export default function PricingPage() {
  const paymentLink = process.env.NEXT_PUBLIC_PAYMENT_LINK;

  return (
    <Container>
      <PageHeader
        title="Pricing"
        subtitle="Start with 3 free runs. When you’re ready, unlock unlimited hooks, scripts, B-roll ideas, and CTAs."
      />

      <main className="max-w-2xl">
        <section className="card p-6 md:p-8 space-y-4">
          <div className="flex items-baseline justify-between gap-4">
            <div>
              <h2 className="font-display text-xl font-semibold">
                Creator Access
              </h2>
              <p className="text-sm opacity-75">
                For creators who want a focused tool for short-form video ideas and scripts.
              </p>
            </div>

            {/* You can update this once you pick your final price */}
            <div className="text-right">
              <div className="text-2xl font-semibold">$19</div>
              <div className="text-xs opacity-70">one-time payment</div>
              {/* or “per month” if you go subscription later */}
            </div>
          </div>

          <ul className="text-sm space-y-2">
            <li>✔ Unlimited generations after your 3 free runs</li>
            <li>✔ Hooks by angle + a tight 45–60s script</li>
            <li>✔ B-roll ideas and CTA suggestions</li>
            <li>✔ Input memory so you’re not retyping your niche every time</li>
            <li>✔ Access to future improvements while the product is live</li>
          </ul>

          <p className="text-xs opacity-70">
            You can test the tool with 3 free runs before upgrading. Your upgrade
            unlocks unlimited generations for your account.
          </p>

          {paymentLink ? (
            <a
              href={paymentLink}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary w-full mt-3 text-white"
            >
              Upgrade to Creator Access
            </a>
          ) : (
            <p className="text-xs text-red-400 mt-3">
              Payment link not configured yet. Set <code>NEXT_PUBLIC_PAYMENT_LINK</code> in your environment.
            </p>
          )}
        </section>

        <section className="mt-8 text-xs opacity-70 space-y-2">
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
    </Container>
  );
}
