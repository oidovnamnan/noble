import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import OpenAI from 'openai';
import { db } from '@/lib/firebase/admin';

export const dynamic = 'force-dynamic';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    const { origin } = new URL(req.url);
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectBase = process.env.NEXTAUTH_URL || origin;
    const redirectUri = `${redirectBase}/api/admin/gmail/callback`;

    const openAiKey = process.env.OPENAI_API_KEY;
    const firebaseKey = process.env.FIREBASE_PRIVATE_KEY;
    const firebaseEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const firebaseProjectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

    if (!clientId || !clientSecret) {
        return NextResponse.json({ error: 'Google OAuth credentials missing' }, { status: 500 });
    }
    if (!openAiKey) {
        return NextResponse.json({ error: 'OpenAI API Key missing' }, { status: 500 });
    }
    // Relaxed Firebase check: allow sync to proceed even if Firebase credentials are not fully set,
    // as long as the 'db' object is handled gracefully later.

    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get('gmail_tokens');

    try {
        if (!tokenCookie) {
            return NextResponse.json({ error: 'Not authenticated with Gmail. Please click "Connect Gmail" first.' }, { status: 401 });
        }

        const tokens = JSON.parse(tokenCookie.value);
        oauth2Client.setCredentials(tokens);

        const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
        const body = await req.json();
        const partners = body.partners;

        console.log(`[SYNC] Starting sync for ${partners?.length || 0} partners`);
        const syncResults = [];

        if (!partners || !Array.isArray(partners)) {
            return NextResponse.json({ error: 'Invalid partners data' }, { status: 400 });
        }

        for (const partner of partners) {
            try {
                const email = partner.contactEmail?.trim();
                if (!email) continue;

                console.log(`[SYNC] Searching Gmail for: ${email}`);

                // Fetch last 10 messages - broader search (removed quotes for better matching)
                const listRes = await gmail.users.messages.list({
                    userId: 'me',
                    q: email,
                    maxResults: 10
                });

                const messages = listRes.data.messages || [];
                if (messages.length === 0) {
                    console.log(`[SYNC] No messages found for ${email}`);
                    syncResults.push({
                        partnerId: partner.id,
                        success: true,
                        emailsCount: 0,
                        emails: []
                    });
                    continue;
                }

                console.log(`[SYNC] Found ${messages.length} messages for ${email}. Fetching details...`);
                const fetchedEmails = [];
                let fullThreadContent = "";

                for (const m of messages) {
                    const msg = await gmail.users.messages.get({
                        userId: 'me',
                        id: m.id!,
                        format: 'metadata',
                        metadataHeaders: ['Subject', 'From', 'Date']
                    });

                    const metadata = msg.data.payload?.headers;
                    const subject = metadata?.find(h => h.name === 'Subject')?.value || 'No Subject';
                    const from = metadata?.find(h => h.name === 'From')?.value || '';
                    const date = metadata?.find(h => h.name === 'Date')?.value || '';
                    const snippet = msg.data.snippet || '';

                    fetchedEmails.push({
                        id: m.id,
                        subject,
                        snippet,
                        from,
                        date: new Date(date).toISOString(),
                        isInbound: from.toLowerCase().includes(email.toLowerCase())
                    });

                    fullThreadContent += `From: ${from}\nDate: ${date}\nContent: ${snippet}\n---\n`;
                }

                const sortedEmails = fetchedEmails.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

                console.log(`[SYNC] Analyzing with AI for ${partner.name}`);

                // Analyze the whole conversation state
                const systemPrompt = `
                    Analyze the following email conversation with partner ${partner.name}.
                    Goal: Determine current relationship status and provide a summary of the latest state.
                    
                    Respond in JSON ONLY: 
                    { 
                      "status": "keyword", 
                      "summary": "1-2 sentences in Mongolian summarizing the whole conversation", 
                      "nextAction": "mn string"
                    }
                `;

                const aiRes = await openai.chat.completions.create({
                    model: "gpt-4o",
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: `Conversation History:\n${fullThreadContent}` }
                    ],
                    response_format: { type: "json_object" }
                });

                const analysis = JSON.parse(aiRes.choices[0].message.content || '{}');

                // Save to Firestore - ensure db is available
                if (db) {
                    const partnerRef = db.collection('partnerships').doc(partner.id);
                    await partnerRef.update({
                        status: analysis.status || partner.status || 'contacted',
                        lastUpdateNote: analysis.summary,
                        updatedAt: new Date(),
                        emails: sortedEmails
                    });
                    console.log(`[SYNC] Firestore updated success for ${partner.name}`);
                } else {
                    console.warn('[SYNC] Firestore db not initialized for update');
                }

                syncResults.push({
                    partnerId: partner.id,
                    success: true,
                    emailsCount: sortedEmails.length,
                    emails: sortedEmails,
                    analysis
                });

            } catch (err: any) {
                console.error(`[SYNC] Failed for partner ${partner.name}:`, err.message);
                syncResults.push({
                    partnerId: partner.id,
                    success: false,
                    error: err.message
                });
            }
        }

        return NextResponse.json({
            success: true,
            results: syncResults,
            processedCount: syncResults.filter(r => r.success).length
        });

    } catch (error: any) {
        console.error('Gmail Deep Sync Fatal Error:', error);
        return NextResponse.json({
            error: error.message || 'Unknown internal error during sync'
        }, { status: 500 });
    }
}
