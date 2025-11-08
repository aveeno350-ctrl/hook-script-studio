export const metadata = { title: "Terms of Service — Hook & Script Studio" };

export default function Page() {
  const today = new Date().toLocaleDateString();
  return (
    <main className="mx-auto max-w-3xl p-6 prose">
      <h1>Terms of Service</h1>
      <p><em>Last updated: {today}</em></p>

      <p>
        These Terms govern your access to and use of Hook &amp; Script Studio (“Service”).
        By using the Service, you agree to these Terms.
      </p>

      <h2>Use of the Service</h2>
      <ul>
        <li>You are responsible for how you use generated content.</li>
        <li>Do not use the Service to create illegal, harmful, or infringing content.</li>
        <li>We may update or suspend features at any time to improve reliability and safety.</li>
      </ul>

      <h2>License to Outputs</h2>
      <p>
        You receive a broad license to use, edit, and monetize the outputs you generate,
        subject to applicable platform rules and third-party rights (e.g., music, trademarks).
      </p>

      <h2>Accounts &amp; Access</h2>
      <p>
        Free usage may be limited. Paid access unlocks higher usage as described at purchase.
        We may take steps to prevent abuse (e.g., rate limits, device/browser checks).
      </p>

      <h2>Payments &amp; Refunds</h2>
      <p>
        Payments are processed by our payment partner. Refunds are handled under our{" "}
        <a href="/refund">Refund Policy</a>.
      </p>

      <h2>Disclaimers</h2>
      <p>
        The Service is provided “as is.” We do not guarantee specific results. You should
        review outputs for accuracy and fitness before publishing.
      </p>

      <h2>Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by law, we are not liable for indirect, incidental,
        special, or consequential damages arising from use of the Service.
      </p>

      <h2>Changes</h2>
      <p>
        We may update these Terms from time to time. Material changes will be reflected on this page.
      </p>

      <h2>Contact</h2>
      <p>
        Questions? Email <a href="mailto:aveeno350@gmail.com">aveeno350@gmail.com</a>.
        {/* TODO: replace with your real support email */}
      </p>
    </main>
  );
}
