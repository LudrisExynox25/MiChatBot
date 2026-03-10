"use client"

import { useState, useRef, useEffect } from "react"
import { ChatSidebar } from "@/components/chat-sidebar"
import { ChatHeader } from "@/components/chat-header"
import { ChatMessages, Message } from "@/components/chat-messages"
import { ChatInput } from "@/components/chat-input"
import { ScrollArea } from "@/components/ui/scroll-area"

const initialChatHistory = [
  { id: "1", title: "Building a React app", date: "Today", isActive: true },
  { id: "2", title: "API design best practices", date: "Today" },
  { id: "3", title: "Database optimization tips", date: "Yesterday" },
  { id: "4", title: "CSS Grid vs Flexbox", date: "Yesterday" },
  { id: "5", title: "TypeScript generics explained", date: "Previous 7 Days" },
  { id: "6", title: "Authentication strategies", date: "Previous 7 Days" },
]

export default function ChatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [chatHistory, setChatHistory] = useState(initialChatHistory)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleNewChat = () => {
    const newId = String(Date.now())
    setChatHistory((prev) =>
      prev.map((chat) => ({ ...chat, isActive: false }))
    )
    setChatHistory((prev) => [
      { id: newId, title: "New conversation", date: "Today", isActive: true },
      ...prev,
    ])
    setMessages([])
  }

  const handleSelectChat = (id: string) => {
    setChatHistory((prev) =>
      prev.map((chat) => ({ ...chat, isActive: chat.id === id }))
    )
    // In a real app, you would load the messages for this chat
    setMessages([])
  }

  const handleDeleteChat = (id: string) => {
    setChatHistory((prev) => prev.filter((chat) => chat.id !== id))
  }

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: String(Date.now()),
      role: "user",
      content,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: String(Date.now() + 1),
        role: "assistant",
        content: getSimulatedResponse(content),
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)

      // Update chat title based on first message
      setChatHistory((prev) =>
        prev.map((chat) =>
          chat.isActive
            ? { ...chat, title: content.slice(0, 30) + (content.length > 30 ? "..." : "") }
            : chat
        )
      )
    }, 1000)
  }

  const handleStop = () => {
    setIsLoading(false)
  }

  return (
    <div className="flex h-screen bg-background">
      <ChatSidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        chatHistory={chatHistory}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
      />

      <main className="flex flex-1 flex-col overflow-hidden">
        <ChatHeader
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onNewChat={handleNewChat}
          isSidebarOpen={sidebarOpen}
        />

        <ScrollArea className="flex-1" ref={scrollAreaRef}>
          <div className="mx-auto max-w-3xl">
            <ChatMessages messages={messages} />
            {isLoading && (
              <div className="flex gap-3 px-4 py-4 md:px-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                  <div className="flex gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <ChatInput
          onSend={handleSendMessage}
          isLoading={isLoading}
          onStop={handleStop}
        />
      </main>
    </div>
  )
}

function getSimulatedResponse(userMessage: string): string {
  const responses = [
    "That's a great question! Let me help you with that. Based on my understanding, here's what I think...",
    "I'd be happy to assist with that. Here are some thoughts and suggestions that might help you move forward.",
    "Interesting! Let me break this down for you. There are several approaches you could consider.",
    "Thanks for asking! This is a common topic. Here's a comprehensive overview of what you need to know.",
    "Great topic! I'll provide you with a detailed explanation and some practical examples.",
  ]
  return responses[Math.floor(Math.random() * responses.length)]
}
