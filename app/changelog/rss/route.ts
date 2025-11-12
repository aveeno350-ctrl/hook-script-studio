import { UPDATES } from "../../data/updates";

export async function GET() {
  const items = UPDATES.map(
    (u) => `
      <item>
        <title>${u.title}</title>
        <description><![CDATA[${u.body}]]></description>
        <pubDate>${new Date(u.date).toUTCString()}</pubDate>
        <guid>https://hook-script-studio.vercel.app/changelog#${encodeURIComponent(u.title)}</guid>
      </item>`
  ).join("");

  const rss = `
    <?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0">
      <channel>
        <title>Hook & Script Studio Changelog</title>
        <link>https://hook-script-studio.vercel.app/changelog</link>
        <description>Product updates and new feature releases</description>
        ${items}
      </channel>
    </rss>`;

  return new Response(rss, {
    headers: { "Content-Type": "application/xml" },
  });
}
