// app/support/page.tsx

export const metadata = {
  title: "Support — Hook & Script Studio",
  description:
    "Need help with Hook & Script Studio? Get support for billing, access, and product questions.",
};

const SUPPORT_EMAIL = "aveeno350@gmail.com";

export default function SupportPage() {
  const mailtoHref = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
    "Hook & Script Studio — Support Request"
  )}&body=${encodeURIComponent(
    [
      "Hi,",
      "",
      "I’m running into an issue with Hook & Script Studio.",
      "",
      "Here’s what happened:",
      "- What I was trying to do:",
      "- What I expected to happen:",
      "- What actually happened:",
      "",
      "Extra details (browser, device, screenshots, etc.):",
      "",
    ].join("\n")
  )}`;

  return (
    <main className="mx-auto max-w-3xl px-6 py-10 space-y-6">
      <header className="space-y-2">
        <p className="kicker">Support</p>
        <h1 className="font-display text-2xl font-semibold">
          Need help with Hook &amp; Script Studio?
        </h1>
        <p className="text-sm opacity-75 leading-relaxed">
          If something isn&apos;t working as expected, or you have a question
          about your access or billing, you can reach out and get direct help.
        </p>
      </header>

      {/* Primary contact card */}
      <section className="card p-6 space-y-4">
        <h2 className="font-semibold text-base">How to contact support</h2>
        <p className="text-sm opacity-80 leading-relaxed">
          The fastest way to get help is to send a short email with what you
          were trying to do and what went wrong. Including a screenshot is
          always helpful.
        </p>

        <a href={mailtoHref} className="btn btn-primary !text-white w-full md:w-auto">
          Email Support
        </a>

        <div className="space-y-2 text-sm opacity-80">
          <p className="font-semibold text-xs uppercase tracking-wide opacity-70">
            Helpful details to include:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>What you were trying to do when the issue happened.</li>
            <li>What you expected to see vs. what actually happened.</li>
            <li>Your browser + device (e.g. Chrome on Windows, Safari on iPhone).</li>
            <li>Any error messages or screenshots you can share.</li>
          </ul>
        </div>
      </section>

      {/* Response expectations */}
      <section className="space-y-3">
        <h2 className="font-semibold text-base">Response times</h2>
        <p className="text-sm opacity-80 leading-relaxed">
          Support is handled personally. Most messages get a reply within{" "}
          <strong>24–48 hours</strong>, excluding major holidays. If you
          haven&apos;t heard back after a couple of days, feel free to follow up
          on the same thread.
        </p>
      </section>

      {/* Links to other pages */}
      <section className="text-xs opacity-70 space-y-2">
        <p>
          For questions about pricing, you can also check the{" "}
          <a href="/pricing" className="hover:underline">
            Pricing
          </a>{" "}
          page.
        </p>
        <p>
          For details about how your data is handled, see the{" "}
          <a href="/privacy" className="hover:underline">
            Privacy Policy
          </a>{" "}
          and{" "}
          <a href="/terms" className="hover:underline">
            Terms of Service
          </a>
          .
        </p>
      </section>
    </main>
  );
}
