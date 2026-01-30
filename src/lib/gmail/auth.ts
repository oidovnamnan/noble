import { google } from 'googleapis';
import { cookies } from 'next/headers';

export async function getGmailClient() {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectBase = process.env.NEXTAUTH_URL;

    // Fallback logic for redirect URI
    const redirectUri = redirectBase ? `${redirectBase}/api/admin/gmail/callback` : '';

    if (!clientId || !clientSecret) {
        throw new Error('Google OAuth credentials missing');
    }

    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get('gmail_tokens');

    if (!tokenCookie) {
        return null;
    }

    try {
        const tokens = JSON.parse(tokenCookie.value);
        const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
        oauth2Client.setCredentials(tokens);

        // Check if token needs refresh
        const isExpired = tokens.expiry_date ? Date.now() >= tokens.expiry_date - 60000 : false;

        if (isExpired && tokens.refresh_token) {
            console.log('[GMAIL Auth] Token expired, refreshing...');
            const { credentials } = await oauth2Client.refreshAccessToken();

            // Merge new tokens with old ones (keep refresh_token if not returned)
            const updatedTokens = {
                ...tokens,
                ...credentials
            };

            // Save refreshed tokens back to cookie
            cookieStore.set('gmail_tokens', JSON.stringify(updatedTokens), {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 * 7,
                path: '/',
            });

            oauth2Client.setCredentials(updatedTokens);
            console.log('[GMAIL Auth] Token refreshed and saved successfully');
        }

        return google.gmail({ version: 'v1', auth: oauth2Client });
    } catch (error: any) {
        console.error('[GMAIL Auth] Error initializing client:', error.message);
        return null;
    }
}
