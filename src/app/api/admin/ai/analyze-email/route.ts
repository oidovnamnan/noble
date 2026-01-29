import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    try {
        const { emailText, partnerTarget } = await req.json();

        if (!emailText) {
            return NextResponse.json({ error: 'Email text is required' }, { status: 400 });
        }

        const systemPrompt = `
      You are an expert admin assistant for Noble Consulting, an education consulting firm. 
      Analyze the following email from a potential school partner (${partnerTarget}).
      Extract:
      1. Current Partnership Status (pending, submitted, processing, approved, rejected, incomplete, dormant)
      2. Summary of the information (Brief, max 2 sentences)
      3. Next Action Required (Action item for Noble Consulting staff)
      4. Proposed followup message (Cordial, professional, in the language of the email - usually English).

      Respond ONLY with a JSON object:
      {
        "status": "string",
        "summary": "string",
        "nextAction": "string",
        "proposedReply": "string"
      }
    `;

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `Partner: ${partnerTarget}\n\nEmail Content:\n${emailText}` }
            ],
            response_format: { type: "json_object" }
        });

        const result = JSON.parse(response.choices[0].message.content || '{}');
        return NextResponse.json(result);
    } catch (error: any) {
        console.error('AI Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
