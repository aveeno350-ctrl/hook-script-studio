// app/cancel/page.tsx
export const metadata = {
  title: "Checkout canceled — Hook & Script Studio",
  description: "No worries, your card wasn’t charged.",
};

export default function CancelPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <div className="card p-6 md:p-8 text-center">
        <h1 className="text-2xl md:text-3xl font-semibold">Checkout canceled</h1>
        <p className="opacity-70 mt-2">
          Your card wasn’t charged. You still have free runs to test things out.
        </p>

        <div className="mt-6 flex gap-3 justify-center">
          <a href="/" className="btn btn-secondary">Back to app</a>
          <a
            href={process.env.NEXT_PUBLIC_PAYMENT_LINK}
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary"
          >
            Try again
          </a>
        </div>

        <p className="text-xs opacity-60 mt-4">
          Questions? <a className="underline" href="/support">Support</a>.
        </p>
      </div>
    </main>
  );
}
