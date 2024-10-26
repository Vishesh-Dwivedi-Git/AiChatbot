import { GoogleGenerativeAI } from '@google/generative-ai'
import { GoogleGenerativeAIStream, StreamingTextResponse } from 'ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '')

export const runtime = 'edge'

export async function POST(req: Request) {
  const { messages } = await req.json()
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

  const geminiStream = await model.generateContentStream({
    contents: [{ role: 'user', parts: [{ text: messages[messages.length - 1].content }] }],
  })

  const stream = GoogleGenerativeAIStream(geminiStream)

  return new StreamingTextResponse(stream)
}