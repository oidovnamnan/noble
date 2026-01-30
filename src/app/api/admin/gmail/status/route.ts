import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import { getGmailClient } from '@/lib/gmail/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const gmail = await getGmailClient();

        if (!gmail) {
            console.log('[STATUS] No Gmail client available (cookie missing or invalid)');
            return NextResponse.json({ authenticated: false });
        }

        const profile = await gmail.users.getProfile({ userId: 'me' });

        console.log('[STATUS] Authenticated successfully as:', profile.data.emailAddress);

        return NextResponse.json({
            authenticated: true,
            email: profile.data.emailAddress
        });
    } catch (e: any) {
        console.error('[STATUS] Check failed with error:', e.message);
        return NextResponse.json({
            authenticated: false,
            error: e.message
        });
    }
}
