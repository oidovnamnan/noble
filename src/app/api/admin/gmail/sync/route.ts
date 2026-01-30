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
    // 1. Validate Environment
    const openAiKey = process.env.OPENAI_API_KEY;
    if (!openAiKey || openAiKey.includes('your_')) {
        return NextResponse.json({ error: 'OpenAI API Key is missing or placeholder. Please set it in .env' }, { status: 500 });
    }

    let authEmail = "unknown";
    try {
        const gmail = await getGmailClient();

        if (!gmail) {
            console.error('[SYNC] No Gmail client: cookie missing or invalid');
            return NextResponse.json({
                error: 'Not authenticated with Gmail. Please click "Connect Gmail" again.'
            }, { status: 401 });
        }

        // Diagnostic: Get exact profile email
        try {
            const profile = await gmail.users.getProfile({ userId: 'me' });
            authEmail = profile.data.emailAddress || "unknown";
        } catch (pe) {
            console.warn('[SYNC] Profile check failed:', pe);
        }

        const body = await req.json();
        const partners = body.partners;
        const syncResults = [];

        if (!partners || !Array.isArray(partners)) {
            return NextResponse.json({ error: 'Invalid partners data' }, { status: 400 });
        }

        console.log(`[SYNC] Starting sync for ${partners.length} partners as ${authEmail}`);

        for (const partner of partners) {
            try {
                const email = partner.contactEmail?.trim();
                const fullName = partner.name?.trim();
                if (!email && !fullName) continue;

                // Clean name for better searching
                const cleanName = fullName.split('(')[0].trim();
                const shortName = cleanName.split(' ')[cleanName.split(' ').length - 1];

                // Build search queries
                const queries = [];
                if (email) {
                    queries.push(`from:${email} OR to:${email}`);
                    queries.push(`"${email}"`);
                    const domainMatch = email.match(/@([a-zA-Z0-9.-]+\.[a-zA-Z0-9.-]+)/);
                    if (domainMatch && domainMatch[1]) queries.push(domainMatch[1]);
                }
                if (cleanName) {
                    queries.push(`"${cleanName}"`);
                    queries.push(cleanName);
                }
                if (shortName && shortName.length > 3) queries.push(shortName);

                let messages: any[] = [];
                for (const q of queries) {
                    const listRes = await gmail.users.messages.list({
                        userId: 'me',
                        q: q,
                        maxResults: 15,
                        includeSpamTrash: true
                    });
                    if (listRes.data.messages && listRes.data.messages.length > 0) {
                        messages = listRes.data.messages;
                        console.log(`[SYNC] Found ${messages.length} messages for ${cleanName} using query: ${q}`);
                        break;
                    }
                }

                if (messages.length === 0) {
                    syncResults.push({
                        partnerId: partner.id,
                        success: true,
                        emailsCount: 0,
                        emails: [],
                        note: 'No messages found'
                    });
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
                        isInbound: email ? from.toLowerCase().includes(email.toLowerCase()) : true
                    });

                    fullThreadContent += `From: ${from}\nDate: ${date}\nContent: ${snippet}\n---\n`;
                }

                const sortedEmails = fetchedEmails.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

                let analysis: any = { status: partner.status, summary: partner.lastUpdateNote };
                try {
                    const systemPrompt = `Analyze email history for ${cleanName}. Respond in JSON ONLY: { "status": "keyword", "summary": "1-2 sentences in Mongolian summarizing state", "nextAction": "mn string" }`;
                    const aiRes = await openai.chat.completions.create({
                        model: "gpt-4o",
                        messages: [{ role: "system", content: systemPrompt }, { role: "user", content: fullThreadContent }],
                        response_format: { type: "json_object" }
                    });
                    const parsed = JSON.parse(aiRes.choices[0].message.content || '{}');
                    if (parsed.status || parsed.summary) analysis = parsed;
                } catch (aiErr: any) {
                    console.warn(`[SYNC] AI Analysis failed for ${cleanName}:`, aiErr.message);
                }

                if (db) {
                    await db.collection('partnerships').doc(partner.id).update({
                        status: analysis.status || partner.status || 'contacted',
                        lastUpdateNote: analysis.summary,
                        updatedAt: new Date(),
                        emails: sortedEmails
                    });
                }

                syncResults.push({
                    partnerId: partner.id,
                    success: true,
                    emailsCount: sortedEmails.length,
                    emails: sortedEmails,
                    analysis
                });

            } catch (err: any) {
                console.error(`[SYNC] Failed for ${partner.name}:`, err.message);
                syncResults.push({ partnerId: partner.id, success: false, error: err.message });
            }
        }

        return NextResponse.json({
            success: true,
            authEmail,
            results: syncResults,
            processedCount: syncResults.filter((r: any) => r.success && (r.emailsCount || 0) > 0).length
        });

    } catch (error: any) {
        console.error('Gmail Deep Sync Fatal Error:', error);
        return NextResponse.json({
            error: error.message || 'Unknown internal error during sync'
        }, { status: 500 });
    }
}
