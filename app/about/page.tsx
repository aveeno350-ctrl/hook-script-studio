// app/about/page.tsx
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";

export const metadata = {
  title: "About – Hook & Script Studio",
  description:
    "The story and intention behind Hook & Script Studio, a focused tool for creators who care about quality hooks and scripts.",
};

export default function AboutPage() {
  return (
    <Container>
      <PageHeader
        title="About Hook & Script Studio"
        subtitle="A tiny, focused tool for creators who want better hooks and tighter scripts without spending hours staring at a blank page."
      />

      <main className="prose prose-sm max-w-2xl">
        <p>
          Hook &amp; Script Studio was created for short-form creators who care
          about quality. Instead of yet another generic &quot;AI writer&quot;,
          this tool is intentionally narrow: it&apos;s built to help you ship
          better TikToks, Reels, and Shorts faster.
        </p>

        <p>
          The goal is simple: remove the friction of coming up with{" "}
          <em>that first good idea</em> — the hook, the angle, the opening line —
          so you can focus on delivery, storytelling, and actually pressing
          publish.
        </p>

        <h2>What this tool is (and isn’t)</h2>
        <ul>
          <li>
            <strong>Is:</strong> a fast way to explore angles, hooks, and
            scripts that feel made for short-form video.
          </li>
          <li>
            <strong>Isn&apos;t:</strong> a one-click &quot;viral hack&quot; or a
            replacement for your voice, your stories, or your perspective.
          </li>
        </ul>

        <h2>How to get the most out of it</h2>
        <ul>
          <li>Bring a clear niche, audience, and offer into the inputs.</li>
          <li>Edit and punch up the outputs so they sound like you.</li>
          <li>Test multiple hooks from the same script across different clips.</li>
          <li>Watch what actually performs, then come back and iterate.</li>
        </ul>

        <p>
          Hook &amp; Script Studio will keep evolving over time — smarter
          presets, better structures, and more ways to remix what you generate.
        </p>

        <p className="text-xs opacity-70">
          Have ideas or feedback? You can always reach out via{" "}
          <a href="/support">Support</a>. Your input helps shape what gets built
          next.
        </p>
      </main>
    </Container>
  );
}
