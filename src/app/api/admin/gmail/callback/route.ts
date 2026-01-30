import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    const { searchParams, origin } = new URL(req.url);
    const code = searchParams.get('code');

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectBase = process.env.NEXTAUTH_URL || origin;
    const redirectUri = `${redirectBase}/api/admin/gmail/callback`;

    if (!code) {
        return NextResponse.json({ error: 'No code provided' }, { status: 400 });
    }

    if (!clientId || !clientSecret) {
        return NextResponse.json({ error: 'Google OAuth credentials missing' }, { status: 500 });
    }

    try {
        const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
        const { tokens } = await oauth2Client.getToken(code);

        console.log('[GMAIL Callback] Tokens received. Expiry:', tokens.expiry_date ? new Date(tokens.expiry_date).toISOString() : 'none');
        if (!tokens.refresh_token) {
            console.warn('[GMAIL Callback] WARNING: No refresh_token received. Connection will only last for 1 hour.');
        }

        const cookieStore = await cookies();
        cookieStore.set('gmail_tokens', JSON.stringify(tokens), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
        });

        const dashboardUrl = `${redirectBase}/admin/partnerships?gmail=connected`;
        return NextResponse.redirect(dashboardUrl);
    } catch (error: any) {
        console.error('Gmail Auth Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
