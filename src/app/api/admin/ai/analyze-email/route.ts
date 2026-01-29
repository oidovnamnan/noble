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
      You are an expert admin assistant for Noble Consulting, an education consulting firm in Mongolia. 
      Analyze the following email from a potential school partner (${partnerTarget}).
      
      Your goal is to detect the current progress and assign the correct status from this list:
      - prospect: No contact yet.
      - contacted: Initial inquiry sent, first response received.
      - interested: Partner shows clear interest in collaborating.
      - applying: Noble is currently filling out forms/applications.
      - submitted: Application sent, awaiting decision.
      - under_review: Partner is checking references or reviewing data.
      - negotiation: Discussing contract terms or commissions.
      - contract_sent: Contract is being signed by either party.
      - active: Fully signed agreement, Noble is an official agent.
      - rejected: Partnership was declined.
      - dormant: No response for a long time.
      - on_hold: Paused for specific reasons.

      Provide:
      1. status: One of the keywords above.
      2. summary: 1-2 sentences in Mongolian explaining the core message.
      3. nextAction: Clear instruction for Noble staff (in Mongolian).
      4. proposedReply: A professional, warm follow-up email in English ready to be sent.

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
