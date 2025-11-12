// data/updates.ts
export type UpdateItem = {
  version: string;         // e.g. "0.7.0"
  date: string;            // ISO date string
  title: string;           // short headline
  notes: string[];         // bullet points
  tags?: string[];         // optional labels (ui, bug, infra, etc.)
};

export const UPDATES: UpdateItem[] = [
  {
    version: "0.7.0",
    date: "2025-11-12",
    title: "UI polish + social cards ready",
    notes: [
      "Brand theme + gradient CTAs",
      "Full favicon set (16, 32, 180, 192, 512) & metadata",
      "OpenGraph + Twitter cards verified"
    ],
    tags: ["ui", "brand", "seo"]
  },
  {
    version: "0.6.0",
    date: "2025-11-11",
    title: "Admin dashboard & analytics",
    notes: [
      "KV-backed counters with Recharts",
      "Admin key gate + cookie flow",
      "Free-runs tracking & paywall open events"
    ],
    tags: ["admin", "analytics"]
  },
  {
    version: "0.5.0",
    date: "2025-11-10",
    title: "First public preview",
    notes: [
      "Hook + 60s script generator",
      "Input memory + reset",
      "Download / copy actions"
    ],
    tags: ["launch"]
  }
];
