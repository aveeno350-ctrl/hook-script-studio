// app/privacy/page.tsx

export const metadata = {
  title: "Privacy Policy — Hook & Script Studio",
  description:
    "Privacy policy for Hook & Script Studio. Learn what information is collected and how it is used.",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10 space-y-6">
      <header className="space-y-2">
        <p className="kicker">Legal</p>
        <h1 className="font-display text-2xl font-semibold">
          Privacy Policy
        </h1>
        <p className="text-sm opacity-75">
          This Privacy Policy explains what information may be collected when
          you use Hook &amp; Script Studio, how it may be used, and what
          choices you have. You can adapt or expand this text later to match
          your exact setup and region.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="font-semibold text-base">1. Information you provide</h2>
        <p className="text-sm opacity-80 leading-relaxed">
          When you use Hook &amp; Script Studio, you may provide information
          such as:
        </p>
        <ul className="list-disc pl-5 text-sm opacity-80 space-y-1">
          <li>Your name and email address when creating an account.</li>
          <li>Billing details processed through a secure payment provider.</li>
          <li>
            Inputs you type into the app (niche, audience, offers, and other
            prompt details).
          </li>
        </ul>
        <p className="text-sm opacity-80 leading-relaxed">
          This information is used to provide the service to you, improve the
          product, and handle things like support and billing.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold text-base">2. Automatically collected data</h2>
        <p className="text-sm opacity-80 leading-relaxed">
          Basic analytics may be used to understand how the product is used —
          for example:
        </p>
        <ul className="list-disc pl-5 text-sm opacity-80 space-y-1">
          <li>Which pages are visited and how often.</li>
          <li>General usage patterns (like how many generations run per day).</li>
          <li>Technical information such as browser type and approximate region.</li>
        </ul>
        <p className="text-sm opacity-80 leading-relaxed">
          These insights help improve reliability, performance, and features.
          Data is typically viewed in aggregate, not as individual “profiles.”
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold text-base">3. Third-party services</h2>
        <p className="text-sm opacity-80 leading-relaxed">
          Hook &amp; Script Studio may rely on trusted third parties for:
        </p>
        <ul className="list-disc pl-5 text-sm opacity-80 space-y-1">
          <li>Payment processing (for example, Stripe).</li>
          <li>AI model providers and infrastructure.</li>
          <li>Hosting, logging, and analytics tools.</li>
        </ul>
        <p className="text-sm opacity-80 leading-relaxed">
          These providers have their own privacy policies and may process data
          on your behalf as part of delivering the service.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold text-base">4. Data retention</h2>
        <p className="text-sm opacity-80 leading-relaxed">
          Information may be retained for as long as necessary to operate the
          product, comply with legal obligations, or resolve disputes. You may
          request to have certain data removed or anonymized, where feasible,
          by contacting support.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold text-base">5. Your choices</h2>
        <p className="text-sm opacity-80 leading-relaxed">
          Depending on your location and applicable laws, you may have rights
          to:
        </p>
        <ul className="list-disc pl-5 text-sm opacity-80 space-y-1">
          <li>Access or request a copy of certain personal information.</li>
          <li>Request corrections to inaccurate details.</li>
          <li>Request deletion of certain data, where appropriate.</li>
        </ul>
        <p className="text-sm opacity-80 leading-relaxed">
          To make a request, you can reach out using the contact information
          below.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold text-base">6. Updates to this policy</h2>
        <p className="text-sm opacity-80 leading-relaxed">
          This Privacy Policy may be updated as the product evolves or as
          privacy laws change. When that happens, a note may be added to the
          site indicating the date of the latest update.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold text-base">7. Contact</h2>
        <p className="text-sm opacity-80 leading-relaxed">
          If you have questions about this Privacy Policy or how your
          information is handled, you can get in touch.
        </p>
        <p className="text-sm opacity-80">
          Contact:{" "}
          <a
            href="mailto:aveeno350@gmail.com"
            className="underline hover:no-underline"
          >
            aveeno350@gmail.com
          </a>
        </p>
      </section>

      <p className="text-[11px] opacity-60 pt-4">
        This page is a simple, human-readable privacy overview. It&apos;s not
        legal advice. For stricter compliance (for example with GDPR or CCPA),
        consider having a lawyer review and customize this policy.
      </p>
    </main>
  );
}

