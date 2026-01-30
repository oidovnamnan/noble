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

    if (!clientId || !clientSecret) {
        return NextResponse.json({ error: 'Google OAuth credentials missing' }, { status: 500 });
    }

    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get('gmail_tokens');

    if (!tokenCookie) {
        return NextResponse.json({ error: 'Not authenticated with Gmail' }, { status: 401 });
    }

    try {
        if (!tokenCookie) {
            return NextResponse.json({ error: 'Not authenticated with Gmail. Please connect Gmail first.' }, { status: 401 });
        }

        const tokens = JSON.parse(tokenCookie.value);
        oauth2Client.setCredentials(tokens);

        const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
        const { partners } = await req.json();

        const syncResults = [];

        if (!partners || !Array.isArray(partners)) {
            return NextResponse.json({ error: 'Invalid partners data' }, { status: 400 });
        }

        for (const partner of partners) {
            try {
                const email = partner.contactEmail?.trim();
                if (!email) continue;

                console.log(`[SYNC] Processing search for: ${email}`);

                // Fetch last 10 messages - balanced for speed and history
                const listRes = await gmail.users.messages.list({
                    userId: 'me',
                    q: email,
                    maxResults: 10
                });

                const messages = listRes.data.messages || [];
                if (messages.length === 0) {
                    console.log(`[SYNC] No messages found for ${email}`);
                    continue;
                }

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

                console.log(`[SYNC] Analyzing with AI for ${partner.name}`);

                // Analyze the whole conversation state
                const systemPrompt = `
                    Analyze the following email conversation with partner ${partner.name}.
                    Goal: Determine current relationship status and provide a summary of the latest state.
                    
                    Correct Status List: prospect, contacted, interested, applying, submitted, under_review, negotiation, contract_sent, active, rejected, dormant, on_hold
                    
                    Respond in JSON ONLY: 
                    { 
                      "status": "keyword", 
                      "summary": "1-2 sentences in Mongolian summarizing the whole conversation", 
                      "nextAction": "mn string explaining what to do next", 
                      "proposedReply": "a professional email reply in English" 
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
                        emails: fetchedEmails.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    });
                } else {
                    console.warn('[SYNC] Firestore db not initialized, skipping update');
                }

                syncResults.push({
                    partnerId: partner.id,
                    success: true,
                    emailsCount: fetchedEmails.length
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
