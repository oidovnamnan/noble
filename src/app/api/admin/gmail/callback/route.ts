import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.NEXTAUTH_URL + '/api/admin/gmail/callback'
);

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');

    if (!code) {
        return NextResponse.json({ error: 'No code provided' }, { status: 400 });
    }

    try {
        const { tokens } = await oauth2Client.getToken(code);

        // Store tokens in a secure cookie for this session
        // In a real app, store this in a database linked to the user
        const cookieStore = await cookies();
        cookieStore.set('gmail_tokens', JSON.stringify(tokens), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
        });

        // Redirect back to the partnerships page
        return NextResponse.redirect(process.env.NEXTAUTH_URL + '/admin/partnerships?gmail=connected');
    } catch (error: any) {
        console.error('Gmail Auth Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
