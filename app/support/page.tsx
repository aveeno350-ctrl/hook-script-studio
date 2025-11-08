import CopyEmail from './CopyEmail';

export const metadata = { title: 'Support — Hook & Script Studio' };

export default function SupportPage() {
  const email = 'aveeno350@gmail.com'; // ← replace with your real email

  return (
    <main className="mx-auto max-w-3xl p-6 prose">
      <h1>Support</h1>
      <p>Need help or have a request? We’re here.</p>

      <h2>Contact</h2>
      <CopyEmail email={email} />

      <h2>Common questions</h2>
      <ul>
        <li><strong>Billing/Refunds:</strong> See our <a href="/refund">Refund Policy</a>.</li>
        <li><strong>Terms & Privacy:</strong> See <a href="/terms">Terms</a> and <a href="/privacy">Privacy</a>.</li>
        <li><strong>Feature ideas / bugs:</strong> Email us with steps and screenshots.</li>
      </ul>
    </main>
  );
}
