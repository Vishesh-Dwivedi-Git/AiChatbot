'use client'
import { useChat } from 'ai/react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { useState } from 'react'

export default function Home() {
  const [error, setError] = useState<string | null>(null)
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    onError: (error) => {
      console.error('Chat error:', error)
      setError(error.message || 'An error occurred. Please try again.')
    }
  })

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    try {
      await handleSubmit(e)
    } catch (error) {
      console.error('Submission error:', error)
      setError('Failed to send message. Please try again.')
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>AI Chatbot</CardTitle>
          <CardDescription>Ask questions about h2o.ai, MLflow, Hugging Face, Docker, and Kubernetes</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] w-full pr-4">
            {messages.map(m => (
              <div key={m.id} className={`mb-4 ${m.role === 'user' ? 'text-right' : ''}`}>
                <p className={`font-semibold ${m.role === 'user' ? 'text-blue-600' : 'text-green-600'}`}>
                  {m.role === 'user' ? 'You' : 'AI'}:
                </p>
                <p className={`mt-1 ${m.role === 'user' ? 'text-gray-800' : 'text-gray-600'}`}>
                  {m.content}
                </p>
              </div>
            ))}
            {error && (
              <div className="mb-4 text-red-500">
                Error: {error}
              </div>
            )}
          </ScrollArea>
        </CardContent>
        <CardFooter>
          <form onSubmit={onSubmit} className="flex w-full space-x-2">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Ask about h2o.ai, MLflow, Hugging Face, Docker, or Kubernetes..."
              className="flex-grow"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send'}
            </Button>
          </form>
        </CardFooter>
      </Card>
    </main>
  )
}