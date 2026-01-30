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
        const tokens = JSON.parse(tokenCookie.value);
        oauth2Client.setCredentials(tokens);

        const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
        const { partners } = await req.json(); // Array of {id, name, contactEmail}

        const results = [];

        for (const partner of partners) {
            if (!partner.contactEmail) continue;

            const res = await gmail.users.messages.list({
                userId: 'me',
                q: `from:${partner.contactEmail}`,
                maxResults: 1
            });

            if (res.data.messages && res.data.messages.length > 0) {
                const msgId = res.data.messages[0].id;
                const msg = await gmail.users.messages.get({
                    userId: 'me',
                    id: msgId!,
                    format: 'full'
                });

                let body = '';
                const payload = msg.data.payload;
                if (payload?.parts) {
                    const textPart = payload.parts.find(p => p.mimeType === 'text/plain');
                    if (textPart?.body?.data) {
                        body = Buffer.from(textPart.body.data, 'base64').toString();
                    }
                } else if (payload?.body?.data) {
                    body = Buffer.from(payload.body.data, 'base64').toString();
                }

                if (body) {
                    const systemPrompt = `
            Analyze the following email from partner ${partner.name}.
            Correct Status List: prospect, contacted, interested, applying, submitted, under_review, negotiation, contract_sent, active, rejected, dormant, on_hold
            Respond in JSON: { "status": "keyword", "summary": "mn string", "nextAction": "mn string", "proposedReply": "en string" }
          `;

                    const aiRes = await openai.chat.completions.create({
                        model: "gpt-4o",
                        messages: [
                            { role: "system", content: systemPrompt },
                            { role: "user", content: `Email Content:\n${body}` }
                        ],
                        response_format: { type: "json_object" }
                    });

                    const analysis = JSON.parse(aiRes.choices[0].message.content || '{}');

                    // Save to Firestore
                    const partnerRef = db.collection('partnerships').doc(partner.id);
                    await partnerRef.update({
                        status: analysis.status,
                        lastUpdateNote: analysis.summary,
                        nextActionDate: new Date(), // Just for tracking
                        updatedAt: new Date(),
                        // Append to emails if needed, but for now just update primary status
                    });

                    results.push({
                        partnerId: partner.id,
                        analysis,
                        messageId: msgId,
                        date: msg.data.internalDate
                    });
                }
            }
        }

        return NextResponse.json({ success: true, results });
    } catch (error: any) {
        console.error('Gmail Sync Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
