// lib/rate.ts

// Name of the cookie we use to track free runs
export const COOKIE_NAME = "hss_token";

type TokenData = {
  runs: number; // how many free runs used
  ts: number;   // last timestamp (ms)
};

// base64url helpers (no padding, url-safe)
function b64uEncode(input: string) {
  return Buffer.from(input, "utf8")
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}
function b64uDecode(input: string) {
  const pad = input.length % 4 ? 4 - (input.length % 4) : 0;
  const str = input.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat(pad);
  return Buffer.from(str, "base64").toString("utf8");
}

/**
 * Encode a small token. We include a very light signature so users can’t
 * trivially edit the cookie. This is NOT for strong security—just basic tamper-resistance.
 */
export function encodeToken(data: TokenData, secret: string): string {
  const payload = JSON.stringify(data);
  // very lightweight signature: base64url of (secret + "." + payload)
  const sig = b64uEncode(`${secret}.${payload}`);
  return `${b64uEncode(payload)}.${sig}`;
}

/**
 * Decode and verify the token. If anything looks off, return null.
 */
export function decodeToken(token: string, secret: string): TokenData | null {
  try {
    const [p, s] = token.split(".");
    if (!p || !s) return null;
    const payload = b64uDecode(p);
    const expectSig = b64uEncode(`${secret}.${payload}`);
    if (s !== expectSig) return null;

    const data = JSON.parse(payload) as TokenData;
    if (
      typeof data !== "object" ||
      typeof data.runs !== "number" ||
      typeof data.ts !== "number"
    ) {
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

/**
 * Build a Set-Cookie header value for our token.
 * One year, HttpOnly, Secure, Lax.
 */
export function cookieHeader(name: string, value: string): string {
  const maxAge = 60 * 60 * 24 * 365; // 1 year
  return `${name}=${value}; Path=/; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Lax`;
}
