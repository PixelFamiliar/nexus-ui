import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  try {
    // 1. Exchange code for access token
    const tokenResponse = await fetch('https://data.whop.com/api/v5/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.WHOP_CLIENT_ID,
        client_secret: process.env.WHOP_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: process.env.WHOP_REDIRECT_URI,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      console.error('Failed to get access token:', tokenData);
      return NextResponse.redirect(new URL('/?auth=error', request.url));
    }

    // 2. Optional: Fetch user info/memberships here to verify access
    // For the "Frontier" MVP, we'll assume any logged-in user with an account is a "Member"
    // or we can just pass the token to the client.

    const response = NextResponse.redirect(new URL('/?auth=success', request.url));
    
    // Set the session cookie
    response.cookies.set('whop_token', tokenData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return response;
  } catch (error) {
    console.error('Auth callback error:', error);
    return NextResponse.redirect(new URL('/?auth=error', request.url));
  }
}
