// app/success/page.tsx

export const metadata = {
  title: "Upgrade successful — Hook & Script Studio",
  description:
    "Your upgrade is complete. Unlimited generations are now unlocked in Hook & Script Studio.",
};

export default function SuccessPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10 space-y-6">
      <header className="space-y-2">
        <p className="kicker">Upgrade complete</p>
        <h1 className="font-display text-2xl font-semibold">
          You&apos;re unlocked. Let&apos;s make your next video easier.
        </h1>
        <p className="text-sm opacity-75 leading-relaxed">
          Your payment went through and your access is upgraded. You can now
          generate as many hooks, scripts, B-roll ideas, and CTAs as you need
          while Hook &amp; Script Studio remains available.
        </p>
      </header>

      <section className="card p-6 space-y-3">
        <h2 className="font-semibold text-base">What happens next</h2>
        <ul className="list-disc pl-5 text-sm opacity-80 space-y-1">
          <li>
            Your account is now treated as having{" "}
            <strong>unlimited generations</strong>.
          </li>
          <li>
            You can go back to the main generator and start creating new
            scripts right away.
          </li>
          <li>
            Future improvements to the generator are included in your access
            while the product is live.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold text-base">Where to go now</h2>
        <p className="text-sm opacity-80 leading-relaxed">
          The easiest next step is to pick one offer or idea and get your first
          upgraded script out of the tool and into a video.
        </p>

        <div className="flex flex-wrap gap-3">
          <a
            href="/"
            className="btn btn-primary !text-white"
          >
            Go to the generator
          </a>

          <a
            href="/changelog"
            className="btn btn-secondary text-xs"
          >
            See what&apos;s new
          </a>
        </div>
      </section>

      <p className="text-[11px] opacity-60 pt-4">
        If something looks off with your upgrade or you have a billing question,
        please reach out via the{" "}
        <a href="/support" className="underline hover:no-underline">
          Support
        </a>{" "}
        page and include the email you used at checkout.
      </p>
    </main>
  );
}
