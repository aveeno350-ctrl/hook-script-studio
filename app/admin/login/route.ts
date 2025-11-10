// app/admin/login/route.ts
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs'; // make sure we're on Node

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key') || '';
  const ok = process.env.ADMIN_KEY && key === process.env.ADMIN_KEY;

  if (!ok) {
    // optional: small hint without leaking the real key
    return new NextResponse('Unauthorized', { status: 401 });
  }

  // Set an HttpOnly cookie scoped to /admin
  const res = NextResponse.redirect(new URL('/admin', req.url));
  res.cookies.set({
    name: 'hss_admin',
    value: '1',
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    path: '/admin',
    maxAge: 60 * 60 * 8, // 8 hours
  });
  return res;
}
