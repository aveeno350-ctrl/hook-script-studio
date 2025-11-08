'use client';
import { useState, useEffect } from 'react';
import { DEFAULTS } from "@/lib/prompts";
import TypingWave from "./components/TypingWave";

const INPUTS_KEY = "hss_inputs_v1";
type SavedInputs = {
  niche: string;
  audience: string;
  offer: string;
  tone: string;
  platform: string;
  keywords: string;
};


export default function Home() {
  const [niche, setNiche] = useState(DEFAULTS.niche);
  const [audience, setAudience] = useState(DEFAULTS.audience);
  const [offer, setOffer] = useState(DEFAULTS.offer);
  const [tone, setTone] = useState(DEFAULTS.tone);
  const [platform, setPlatform] = useState(DEFAULTS.platform);
  const [keywords, setKeywords] = useState(DEFAULTS.keywords);
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [runs, setRuns] = useState<number>(0);


const presets = [
    {
      label: "Etsy Templates",
      niche: "Etsy templates for beginners",
      audience: "new creators, 18–34",
      offer: "starter template pack",
    },
    {
      label: "UGC Offers",
      niche: "UGC creators pitching hotels",
      audience: "travel marketers & boutique hotels",
      offer: "UGC video package",
    },
    {
      label: "Coaches",
      niche: "Business coaching for solopreneurs",
      audience: "solo founders",
      offer: "90-minute clarity session",
    },
  ];

useEffect(() => {
  try {
    const raw = localStorage.getItem(INPUTS_KEY);
    if (!raw) return;
    const saved: Partial<SavedInputs> = JSON.parse(raw);
    if (saved.niche) setNiche(saved.niche);
    if (saved.audience) setAudience(saved.audience);
    if (saved.offer) setOffer(saved.offer);
    if (saved.tone) setTone(saved.tone);
    if (saved.platform) setPlatform(saved.platform);
    if (saved.keywords) setKeywords(saved.keywords);
  } catch { /* ignore parse errors */ }
}, []);

useEffect(() => {
  const payload: SavedInputs = { niche, audience, offer, tone, platform, keywords };
  const id = setTimeout(() => {
    try { localStorage.setItem(INPUTS_KEY, JSON.stringify(payload)); } catch {}
  }, 300); // debounce
  return () => clearTimeout(id);
}, [niche, audience, offer, tone, platform, keywords]);


  useEffect(() => {
    const r = Number(localStorage.getItem('free_runs') || '0');
    setRuns(r);
  }, []);

  async function generate() {
    if (runs >= 3) {
      const link = (process.env.NEXT_PUBLIC_PAYMENT_LINK as unknown as string) || '';
      alert('Free limit reached. Please purchase to unlock unlimited generations.');
      if (link) window.open(link, '_blank');
      return;
    }
    setLoading(true);
    setContent('');
    try {
      const resp = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche, audience, offer, tone, platform, keywords }),
      });
      const data = await resp.json();
      if (data?.content) {
        setContent(data.content);
        const next = runs + 1;
        setRuns(next);
        localStorage.setItem('free_runs', String(next));
      } else {
        alert(data?.error || 'No content returned');
      }
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  }

  function copyAll() {
    navigator.clipboard.writeText(content);
  }

  function downloadTxt() {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'hook-script.txt';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-6">
      <header className="space-y-2">
  <h1 className="text-3xl font-bold">Hook &amp; Script Studio</h1>
  <p className="text-sm opacity-70">
    Generate 20 hooks by angle + a 60s script, B-roll, and CTAs. 3 free runs, then unlock unlimited.
  </p>
  <p className="text-xs opacity-60">Made by Liyah · support: your@email.com</p>
</header>



      <section className="grid gap-3">
        <div className="flex flex-wrap gap-2 mb-4">
      {presets.map((p) => (
        <button
          key={p.label}
          onClick={() => {
            setNiche(p.niche);
            setAudience(p.audience);
            setOffer(p.offer);
          }}
          className="text-xs border rounded px-2 py-1"
        >
          {p.label}
        </button>
      ))}</div>

<button
  type="button"
  onClick={() => {
    // clear storage and restore your DEFAULTS
    localStorage.removeItem(INPUTS_KEY);
    setNiche(DEFAULTS.niche);
    setAudience(DEFAULTS.audience);
    setOffer(DEFAULTS.offer);
    setTone(DEFAULTS.tone);
    setPlatform(DEFAULTS.platform);
    setKeywords(DEFAULTS.keywords || "");
  }}
  className="text-xs opacity-70 underline"
>
  Reset inputs
</button>


        <input className="border rounded p-2" value={niche} onChange={e=>setNiche(e.target.value)} placeholder="Niche" />
        <input className="border rounded p-2" value={audience} onChange={e=>setAudience(e.target.value)} placeholder="Audience" />
        <input className="border rounded p-2" value={offer} onChange={e=>setOffer(e.target.value)} placeholder="Offer/Product" />
        <input className="border rounded p-2" value={tone} onChange={e=>setTone(e.target.value)} placeholder="Tone (e.g., friendly, punchy)" />
        <div className="grid grid-cols-2 gap-3">
          <select className="border rounded p-2" value={platform} onChange={e=>setPlatform(e.target.value)}>
            <option>TikTok</option>
            <option>Reels</option>
            <option>Shorts</option>
          </select>
          <input className="border rounded p-2" value={keywords} onChange={e=>setKeywords(e.target.value)} placeholder="Optional keywords" />
        </div>
        <button
  type="button"
  onClick={generate}                 // ← use generate, not handleGenerate
  disabled={loading}
  className="rounded px-4 py-2 border"
>
  {loading ? (
    <span className="flex items-center gap-2">
      <TypingWave />
      <span>Generating…</span>
    </span>
  ) : (
    "Generate"
  )}
</button>


        <p className="text-xs opacity-60">Free runs used: {runs}/3</p>
      </section>

      {content && (
        <section className="space-y-3">
          <div className="flex gap-2">
            <button onClick={copyAll} className="rounded-lg px-3 py-2 border">Copy All</button>
            <button onClick={downloadTxt} className="rounded-lg px-3 py-2 border">Download .txt</button>
          </div>
          <article className="prose max-w-none">
            {/* Render simple line breaks for now */}
            <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br/>') }} />
          </article>
        </section>
      )}

      {runs >= 3 && (
        <section className="border rounded-xl p-4 bg-gray-50">
          <h2 className="font-semibold mb-2">Unlock unlimited generations</h2>
          <p className="text-sm opacity-70 mb-3">One-time launch price.</p>
          <a className="inline-block rounded-xl px-4 py-2 bg-black text-white" href={process.env.NEXT_PUBLIC_PAYMENT_LINK} target="_blank">Buy access</a>
        </section>
      )}
      <footer className="pt-10 text-xs opacity-60">
  <a href="/support">Support</a>
  <span className="mx-2">·</span>
  <a href="/terms">Terms</a>
  <span className="mx-2">·</span>
  <a href="/privacy">Privacy</a>
  <span className="mx-2">·</span>
  <a href="/refund">Refund Policy</a>
  <span className="mx-2">·</span>
  <a href="mailto:support@yourdomain.com">Email</a>
</footer>


    </main>
  );
}
