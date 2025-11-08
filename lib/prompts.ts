export const ANGLES = [
  { id: 'pain_relief', label: 'Pain → Relief', pattern: "If you're struggling with {pain}, here's a quick way to {relief} without {common_pitfall}." },
  { id: 'contrarian', label: 'Contrarian', pattern: "Everyone says {myth}. Here’s why that advice slows your growth—and what to do instead: {truth}." },
  { id: 'proof_mini', label: 'Mini Case', pattern: "{persona} did {result} in {time}. The surprising lever? {lever}." },
  { id: 'list_fast', label: '3-Step Fast List', pattern: "3 quick moves to {outcome}: 1){step1} 2){step2} 3){step3}." },
  { id: 'myth_bust', label: 'Myth-Bust', pattern: "Myth: {myth}. Reality: {reality}. Try this instead: {action}." },
  { id: 'pov', label: 'POV', pattern: "POV: You're {audience_state}. In 60s, you’ll know how to {micro_outcome}." },
];

export const TONE_PRESETS: Record<string, string> = {
  "friendly-crisp": "friendly, energetic, crisp sentences, practical",
  "mentor-calm": "calm, reassuring, wise, no fluff",
  "hype-short": "high-energy, short lines, punchy, social-native",
};

export const DEFAULTS = {
  niche: 'Etsy templates for beginners',
  audience: 'new creators, 18–34',
  offer: 'starter template pack',
  tone: TONE_PRESETS['friendly-crisp'],
  platform: 'TikTok',
  keywords: 'viral hooks, 60s script, quick CTA',
};
