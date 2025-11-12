// app/success/page.tsx
export const metadata = {
  title: "Payment successful — Hook & Script Studio",
  description: "You’re upgraded! Unlimited generations are now unlocked.",
};

export default function SuccessPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <div className="card p-6 md:p-8 text-center">
        <h1 className="text-2xl md:text-3xl font-semibold">You're upgraded 🎉</h1>
        <p className="opacity-70 mt-2">
          Unlimited hooks, scripts, B-roll suggestions, and CTAs are now unlocked.
        </p>

        <a
          href="/"
          className="btn btn-primary w-full mt-6"
        >
          Start generating
        </a>

        <p className="text-xs opacity-60 mt-4">
          Need help? <a className="underline" href="/support">Contact support</a>.
        </p>
      </div>
    </main>
  );
}
