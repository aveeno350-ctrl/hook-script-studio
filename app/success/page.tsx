export const metadata = { title: "Access Unlocked — Hook & Script Studio" };

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl p-6 prose">
      <h1>Access Unlocked 🎉</h1>
      <p>
        Thanks for supporting Hook &amp; Script Studio. Your purchase is complete. You now have
        unlimited generations on this device/browser.
      </p>
      <p>
        If anything seems off, we’re here to help:
        {" "}
        <a href="mailto:aveeno350@gmail.com">aveeno350@gmail.com</a>.
        {/* TODO: replace with your real support email */}
      </p>
      <p><a className="inline-block rounded px-4 py-2 bg-black text-white" href="/">Back to the app</a></p>
    </main>
  );
}
