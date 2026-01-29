import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.NEXTAUTH_URL + '/api/admin/gmail/callback'
);

export async function POST(req: Request) {
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

            // Search for messages from this email
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

                // Extract body
                let body = '';
                const parts = msg.data.payload?.parts || [];
                if (parts.length > 0) {
                    const data = parts.find((p: any) => p.mimeType === 'text/plain')?.body?.data || parts[0].body?.data;
                    if (data) body = Buffer.from(data, 'base64').toString();
                } else if (msg.data.payload?.body?.data) {
                    body = Buffer.from(msg.data.payload.body.data, 'base64').toString();
                }

                if (body) {
                    // Analyze with AI (similar to existing logic but automated)
                    const systemPrompt = `
            You are an expert admin assistant for Noble Consulting. 
            Analyze the following email from partner ${partner.name}.
            
            Detect Correct Status:
            - prospect, contacted, interested, applying, submitted, under_review, negotiation, contract_sent, active, rejected, dormant, on_hold

            Provide:
            1. status: Keyword from list.
            2. summary: 1-2 sentences in Mongolian.
            3. nextAction: Clear instruction in Mongolian.
            4. proposedReply: Professional English reply.

            Respond ONLY with JSON.
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
