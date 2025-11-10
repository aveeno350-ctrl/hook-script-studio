import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "https://your-domain.com";
  const now = new Date().toISOString();

  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/refund-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/support`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
  ];
}
