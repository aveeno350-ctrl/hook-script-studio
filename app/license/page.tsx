// app/license/page.tsx
import Container from "../components/Container";
import PageHeader from "../components/PageHeader";

export const metadata = {
  title: "License – Hook & Script Studio",
  description:
    "Usage terms for Hook & Script Studio. Learn what you can and can’t do with the outputs.",
};

export default function LicensePage() {
  return (
    <Container>
      <PageHeader
        title="License"
        subtitle="How you’re allowed to use Hook & Script Studio and its outputs."
      />

      <main className="prose prose-sm max-w-2xl">
        <p>
          This page is a simple, human-readable summary of how you can use Hook
          &amp; Script Studio. It&apos;s not formal legal advice, but it&apos;s
          meant to be clear and fair.
        </p>

        <h2>What you <strong>can</strong> do</h2>
        <ul>
          <li>Use the tool to generate hooks, scripts, and ideas for your own content.</li>
          <li>Edit, remix, and customize outputs however you like.</li>
          <li>Publish generated content on your social platforms, website, or ads.</li>
          <li>Use the tool for client work as part of your services.</li>
        </ul>

        <h2>What you <strong>can’t</strong> do</h2>
        <ul>
          <li>
            Resell Hook &amp; Script Studio itself, or market it as your own tool, app, or API.
          </li>
          <li>
            Package raw outputs as a competing &quot;hook generator&quot; or prompt product.
          </li>
          <li>
            Use the tool for spammy, abusive, hateful, or illegal content.
          </li>
        </ul>

        <h2>Attribution &amp; ownership</h2>
        <p>
          You&apos;re responsible for reviewing and editing outputs before you
          publish them. Hook &amp; Script Studio does not claim ownership over
          your final videos, posts, or campaigns.
        </p>

        <p>
          By using this tool, you agree to our{" "}
          <a href="/terms">Terms</a> and <a href="/privacy">Privacy Policy</a>.
        </p>

        <p className="text-xs opacity-70">
          This page may be updated over time as the product evolves.
        </p>
      </main>
    </Container>
  );
}
