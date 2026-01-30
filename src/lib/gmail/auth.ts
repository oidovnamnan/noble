import { google } from 'googleapis';
import { cookies } from 'next/headers';

export async function getGmailClient() {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    // In many environments NEXTAUTH_URL might not be available or might be wrong.
    // For refresh tokens, Gmail expects the redirectUri to match what was used during auth.
    // However, if we just need to use the token, we often don't need it OR we can use a placeholder.
    const redirectUri = process.env.NEXTAUTH_URL
        ? `${process.env.NEXTAUTH_URL}/api/admin/gmail/callback`
        : 'https://nobleworldgate.com/api/admin/gmail/callback'; // Fallback to prod

    if (!clientId || !clientSecret) {
        console.error('[GMAIL Auth] ERROR: Missing Google OAuth credentials in environment');
        return null;
    }

    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get('gmail_tokens');

    if (!tokenCookie) {
        console.log('[GMAIL Auth] No gmail_tokens cookie found');
        return null;
    }

    try {
        const tokens = JSON.parse(tokenCookie.value);
        const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
        oauth2Client.setCredentials(tokens);

        // ALWAYS try to refresh if it's close to expiry (10 mins) or if we don't have an expiry
        const expiryDate = tokens.expiry_date || 0;
        const isExpired = Date.now() >= (expiryDate - 10 * 60 * 1000);

        if (isExpired && tokens.refresh_token) {
            console.log('[GMAIL Auth] Token near expiry or no expiry found, refreshing...');
            try {
                const { credentials } = await oauth2Client.refreshAccessToken();
                const updatedTokens = { ...tokens, ...credentials };

                // Save back to cookie
                cookieStore.set('gmail_tokens', JSON.stringify(updatedTokens), {
                    httpOnly: true,
                    secure: true,
                    maxAge: 60 * 60 * 24 * 7,
                    path: '/',
                });

                oauth2Client.setCredentials(updatedTokens);
                console.log('[GMAIL Auth] Token refreshed successfully');
            } catch (refreshErr: any) {
                console.error('[GMAIL Auth] Token refresh FAILED:', refreshErr.message);
                // If refresh fails, the tokens might be revoked. 
                // We keep going but API calls might fail.
            }
        }

        return google.gmail({ version: 'v1', auth: oauth2Client });
    } catch (error: any) {
        console.error('[GMAIL Auth] Fatal error in initialization:', error.message);
        return null;
    }
}
