"use client"

import { useState } from "react"
import { ChatInput } from "@/components/chat-input"
import { ChatMessages } from "@/components/chat-messages"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Message {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}


export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: String(Date.now()),
      role: "user",
      content,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true)

    try {
      const aiResponseContent = await getGroqResponse(content)
      
      const assistantMessage: Message = {
        id: String(Date.now() + 1),
        role: "assistant",
        content: aiResponseContent,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error al obtener respuesta:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStop = () => {
    setIsLoading(false)
  }

  return (
    <div className="flex h-screen bg-background">
      <main className="flex-1 flex flex-col max-w-4xl mx-auto p-4">
        <ScrollArea className="flex-1 pr-4">
          <ChatMessages messages={messages} />
        </ScrollArea>
        <div className="mt-4">
          <ChatInput 
            onSend={handleSendMessage} 
            isLoading={isLoading} 
            onStop={handleStop} 
          />
        </div>
      </main>
    </div>
  )
}

// Esta función debe ir fuera de ChatPage para que no haya errores de llaves
async function getGroqResponse(userMessage: string): Promise<string> {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: userMessage }),
    })

    if (!response.ok) {
      throw new Error('Error en la conexión con el servidor')
    }

    const data = await response.json()
    return data.response
  } catch (error) {
    console.error("Error:", error)
    return "Lo siento, compadre, hubo un problema al conectar con el servidor."
  }
}