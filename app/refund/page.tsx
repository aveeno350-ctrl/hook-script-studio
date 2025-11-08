export const metadata = { title: "Refund Policy — Hook & Script Studio" };

export default function Page() {
  const today = new Date().toLocaleDateString();
  return (
    <main className="mx-auto max-w-3xl p-6 prose">
      <h1>Refund Policy</h1>
      <p><em>Last updated: {today}</em></p>

      <p>
        We want you to have a great experience with Hook &amp; Script Studio. If something isn’t working as
        expected, please contact us first—we can usually help quickly.
      </p>

      <h2>Eligibility</h2>
      <ul>
        <li>
          For one-time purchases, we offer refunds within <strong>7 days</strong> of purchase if you’ve used
          fewer than <strong>3 generations</strong> after upgrading.
          {/* TODO: adjust window/threshold to your policy */}
        </li>
        <li>
          Refunds are not guaranteed; abuse or excessive use may disqualify eligibility.
        </li>
      </ul>

      <h2>How to Request</h2>
      <p>
        Email <a href="mailto:aveeno350@gmail.com">support@yourdomain.com</a> with your order email and
        proof of purchase (e.g., Stripe receipt). We’ll respond as soon as possible.
        {/* TODO: replace with your real support email */}
      </p>

      <h2>Chargebacks</h2>
      <p>
        Please contact us before initiating a chargeback so we can resolve the issue directly.
      </p>
    </main>
  );
}
