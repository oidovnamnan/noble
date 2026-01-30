import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get('gmail_tokens');

    if (!tokenCookie) {
        return NextResponse.json({ authenticated: false });
    }

    try {
        // Try to parse just to be sure
        JSON.parse(tokenCookie.value);
        return NextResponse.json({ authenticated: true });
    } catch (e) {
        return NextResponse.json({ authenticated: false });
    }
}
