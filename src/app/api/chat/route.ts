// OpenAI API Route Handler
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: Request) {
    try {
        const { messages, context } = await req.json();

        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json(
                { error: 'OpenAI API key is not configured' },
                { status: 500 }
            );
        }

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        const systemPrompt = `Сайн байна уу? Та Noble Consulting-ийн ухаалаг туслах байна. 
Noble Consulting нь гадаад сургалт, виз, аялал, ажлын зуучлалын үйлчилгээ үзүүлдэг.
Хэрэглэгчийн асуултанд Монгол хэлээр, маш эелдэг, тодорхой хариулна уу.

Бидний үзүүлдэг үйлчилгээнүүдийн мэдээлэл:
${context || 'Мэдээлэл одоогоор байхгүй байна.'}

Та дээрх мэдээлэлд үндэслэн хариулт өгнө үү. Хэрэв та тодорхой хариулт мэдэхгүй бол эсвэл мэдээлэл дутуу бол Менежертэй холбогдохыг зөвлөөрэй.`;

        const response = await openai.chat.completions.create({
            model: 'gpt-4o', // Using ChatGPT Omni
            messages: [
                {
                    role: 'system',
                    content: systemPrompt
                },
                ...messages,
            ],
            temperature: 0.7,
            max_tokens: 500,
        });

        return NextResponse.json({
            content: response.choices[0].message.content,
        });
    } catch (error: any) {
        console.error('OpenAI Error:', error);
        return NextResponse.json(
            { error: error.message || 'AI-тай холбогдоход алдаа гарлаа' },
            { status: 500 }
        );
    }
}
