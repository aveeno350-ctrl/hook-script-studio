export const metadata = { title: "Privacy Policy — Hook & Script Studio" };

export default function Page() {
  const today = new Date().toLocaleDateString();
  return (
    <main className="mx-auto max-w-3xl p-6 prose">
      <h1>Privacy Policy</h1>
      <p><em>Last updated: {today}</em></p>

      <h2>What We Collect</h2>
      <ul>
        <li>
          <strong>App inputs:</strong> text you enter to generate hooks and scripts (processed by our AI provider).
        </li>
        <li>
          <strong>Usage data:</strong> basic telemetry (e.g., request success/failure) to keep the Service reliable.
        </li>
        <li>
          <strong>Local device storage:</strong> we may store a simple counter in your browser (e.g., free runs used).
        </li>
      </ul>

      <h2>What We Don’t Collect</h2>
      <ul>
        <li>No ad tracking pixels.</li>
        <li>No sale of personal information.</li>
      </ul>

      <h2>How We Use Data</h2>
      <p>
        To operate, secure, and improve the Service, provide support, and comply with applicable law.
      </p>

      <h2>Third-Party Services</h2>
      <p>
        We use trusted providers for hosting and payments. Your payment details are handled by our
        payment processor and are not stored on our servers.
      </p>

      <h2>Your Choices</h2>
      <ul>
        <li>You can clear local browser storage to reset locally stored counters.</li>
        <li>Contact us to request deletion of support communications or to ask questions.</li>
      </ul>

      <h2>Children</h2>
      <p>The Service is not directed to children under 13.</p>

      <h2>Changes</h2>
      <p>We may update this policy; changes will appear here with an updated date.</p>

      <h2>Contact</h2>
      <p>
        Email <a href="mailto:aveeno350@gmail.com">support@yourdomain.com</a> for privacy requests.
        {/* TODO: replace with your real support email */}
      </p>
    </main>
  );
}
