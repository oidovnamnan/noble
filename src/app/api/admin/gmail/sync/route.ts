import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { db } from '@/lib/firebase/admin';
import { getGmailClient } from '@/lib/gmail/auth';

export const dynamic = 'force-dynamic';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    try {
        const gmail = await getGmailClient();

        if (!gmail) {
            console.error('[SYNC] No Gmail client: cookie missing or invalid');
            return NextResponse.json({
                error: 'Not authenticated with Gmail. Please click "Connect Gmail" again.'
            }, { status: 401 });
        }

        const body = await req.json();
        const partners = body.partners;
        const syncResults = [];

        if (!partners || !Array.isArray(partners)) {
            return NextResponse.json({ error: 'Invalid partners data' }, { status: 400 });
        }

        // Relaxed Firebase check: allow sync to proceed even if Firebase credentials are not fully set,
        // as long as the 'db' object is handled gracefully later.

        for (const partner of partners) {
            try {
                const email = partner.contactEmail?.trim();
                const name = partner.name?.trim();
                if (!email && !name) {
                    console.log(`[SYNC] Skipping ${partner.name} - no email or name`);
                    continue;
                }

                console.log(`[SYNC] Processing partner: ${name} (${email || 'no email'})`);

                // Multi-query strategy for maximum coverage
                const queries = [];
                if (email) {
                    queries.push(`from:${email} OR to:${email}`);
                    queries.push(`"${email}"`);
                }
                if (name) {
                    queries.push(`"${name}"`);
                }

                let messages: any[] = [];
                for (const q of queries) {
                    const listRes = await gmail.users.messages.list({
                        userId: 'me',
                        q: q,
                        maxResults: 15
                    });
                    if (listRes.data.messages && listRes.data.messages.length > 0) {
                        messages = listRes.data.messages;
                        console.log(`[SYNC] Found ${messages.length} messages using query: ${q}`);
                        break;
                    }
                }

                if (messages.length === 0) {
                    console.log(`[SYNC] No messages found for ${name}`);
                    syncResults.push({ partnerId: partner.id, success: true, emailsCount: 0, emails: [], note: `No emails found for ${email || name}` });
                    continue;
                }

                console.log(`[SYNC] Found ${messages.length} messages for ${email || name}. Fetching details...`);
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
                        isInbound: email ? from.toLowerCase().includes(email.toLowerCase()) : true
                    });

                    fullThreadContent += `From: ${from}\nDate: ${date}\nContent: ${snippet}\n---\n`;
                }

                const sortedEmails = fetchedEmails.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

                console.log(`[SYNC] Analyzing with AI for ${partner.name}`);

                // Analyze with AI
                const systemPrompt = `Analyze email history for ${name}. Respond in JSON ONLY: { "status": "keyword", "summary": "1-2 sentences in Mongolian summarizing state", "nextAction": "mn string" }`;
                const aiRes = await openai.chat.completions.create({
                    model: "gpt-4o",
                    messages: [{ role: "system", content: systemPrompt }, { role: "user", content: fullThreadContent }],
                    response_format: { type: "json_object" }
                });

                const analysis = JSON.parse(aiRes.choices[0].message.content || '{}');

                // Save to Firestore - ensure db is available
                if (db) {
                    await db.collection('partnerships').doc(partner.id).update({
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
                syncResults.push({ partnerId: partner.id, success: false, error: err.message });
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
