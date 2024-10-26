import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const config = new GoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY
});

const genai = new GoogleGenerativeAI(config);

export const runtime = 'edge';


export async function POST(req: NextRequest) {
  try {
    console.log('Received chat request');

    const { messages } = await req.json();

    // Validate input
    if (!messages || !Array.isArray(messages)) {
      console.error('Invalid input: messages is not an array');
      return new NextResponse('Invalid input', { status: 400 });
    }

    console.log('Messages:', JSON.stringify(messages));

    if (!process.env.GOOGLE_API_KEY) {
      console.error('Google API key is not set');
      return new NextResponse('Server configuration error', { status: 500 });
    }

    const model = genai.getGenerativeModel({ model: 'gemini-pro' });

    const chat = model.startChat({
      history: messages.slice(0, -1).map((m: any) => ({
        role: m.role,
        parts: m.content,
      })),
    });

    const result = await chat.sendMessage(messages[messages.length - 1].content);
    const response = await result.response;

    return NextResponse.json({ response: response.text() });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}