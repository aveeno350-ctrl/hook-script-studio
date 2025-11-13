// data/examples.ts

export type Example = {
  label: string;      // short tag like "Fitness coach"
  niche: string;
  audience: string;
  offer: string;
  hook: string;
  script: string;
};

export const EXAMPLES: Example[] = [
  {
    label: "Fitness coach",
    niche: "Online fitness coaching",
    audience: "women in their 20s–40s",
    offer: "a 12-week home workout program",
    hook:
      "You're 30 days away from looking at old photos and wondering why you ever doubted yourself.",
    script:
      "Open on you sitting at a desk, clearly tired.\n\nHook: “You’re 3 months away from looking at old photos and wondering why you ever doubted yourself.”\n\nBody: Call out busy professionals who feel stuck, explain how your 12-week program fits into a packed schedule (30–40 min sessions, no gym required), and show 2–3 quick b-roll clips: water bottle on desk, timer starting, you doing 2–3 moves.\n\nCTA: “Comment ‘PLAN’ and I’ll send you a sample week.”"
  },

  {
    label: "Digital product creator",
    niche: "Notion templates and digital planners",
    audience: "creators and students",
    offer: "a Notion hub that organizes content, tasks, and deadlines",
    hook:
      "If your to-do list lives in 5 different apps, this is why you never feel ‘done’ at the end of the day.",
    script:
      "Start with a shot of multiple tabs and sticky notes.\n\nHook: “If your to-do list lives in 5 different apps, this is why you never feel ‘done’ at the end of the day.”\n\nBody: Show your Notion hub in 2–3 quick cuts: tasks, content ideas, deadlines. Explain how everything lives in one place and takes 10 minutes to set up.\n\nCTA: “Save this and check the link in bio to grab the template.”"
  },

  {
    label: "Skincare educator",
    niche: "beginner-friendly skincare",
    audience: "people with sensitive, acne-prone skin",
    offer: "a simple 3-step routine guide",
    hook:
      "Your skin isn’t ‘stubborn’ — it’s just overloaded. Here’s the 3-step routine that finally calms it down.",
    script:
      "Close-up of you holding 3 products only.\n\nHook: “Your skin isn’t ‘stubborn’ — it’s just overloaded. Here’s the 3-step routine that finally calms it down.”\n\nBody: Walk through morning/evening basics: gentle cleanser, barrier-friendly moisturizer, and sunscreen. Emphasize ‘no 10-step routines, no burning toners.’\n\nCTA: “Comment ‘ROUTINE’ and I’ll DM you the full breakdown.”"
  },

  {
    label: "Dating & confidence coach",
    niche: "Mindset and dating confidence",
    audience: "women rebuilding self-worth",
    offer: "a mini-course on magnetic confidence",
    hook:
      "You’re not ‘too much.’ You’ve just been giving the right energy to the wrong people.",
    script:
      "Open with a soft, intimate shot.\n\nHook: “You’re not ‘too much.’ You’ve just been giving the right energy to the wrong people.”\n\nBody: Speak to the cycle of over-giving, introduce your framework for rebuilding baseline confidence, and give one micro-action they can implement today.\n\nCTA: “Comment ‘CONFIDENCE’ and I’ll send you the first exercise.”"
  },

  {
    label: "Side-hustle creator",
    niche: "Digital side hustles + passive income",
    audience: "beginners trying to earn online",
    offer: "a starter guide to creating your first digital product",
    hook:
      "If you can create one digital product, you can build income that works while you sleep.",
    script:
      "Open with a quick scroll of your earnings dashboard.\n\nHook: “If you can create one digital product, you can build income that works while you sleep.”\n\nBody: Show how a simple product (planner, notion template, checklist) can be made in one afternoon. Break it into 3 digestible steps: idea → build → publish.\n\nCTA: “Comment ‘START’ and I’ll send you my beginner-friendly guide.”"
  }
];
