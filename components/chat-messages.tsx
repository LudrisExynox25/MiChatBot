"use client"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bot, User, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface ChatMessagesProps {
  messages: Message[]
}

export function ChatMessages({ messages }: ChatMessagesProps) {
  if (messages.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="flex flex-col gap-6 py-4">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
    </div>
  )
}

function MessageBubble({ message }: { message: Message }) {
  const [copied, setCopied] = useState(false)
  const isUser = message.role === "user"

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className={cn(
        "group flex gap-3 px-4 md:px-0",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback
          className={cn(
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
          )}
        >
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>
      <div
        className={cn(
          "flex max-w-[80%] flex-col gap-1",
          isUser ? "items-end" : "items-start"
        )}
      >
        <div
          className={cn(
            "rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-foreground"
          )}
        >
          {message.content}
        </div>
        {!isUser && (
          <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleCopy}
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-green-500" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              <span className="sr-only">Copy message</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
        <Bot className="h-8 w-8 text-muted-foreground" />
      </div>
      <div className="max-w-sm space-y-2">
        <h3 className="text-lg font-semibold text-foreground">
          Como te puedo ayudar hoy?
        </h3>
        <p className="text-sm text-muted-foreground">
          Inicia una conversación escribiendo un mensaje abajo. Estoy aquí para asistirte con cualquier pregunta o tarea.
        </p>
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            className="rounded-lg border border-border bg-card p-3 text-left text-sm transition-colors hover:bg-accent"
          >
            <p className="font-medium text-foreground">{suggestion.title}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {suggestion.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  )
}

const suggestions = [
  {
    title: "Explica un concepto",
    description: "Ayudame a entender algo complejo.",
  },
  {
    title: "Escribe algun codigo",
    description: "Generar código para una tarea específica",
  },
  {
    title: "Lluvia de ideas",
    description: "Ayúdame a resolver un problema paso a paso",
  },
  {
    title: "Revisa mi trabajo",
    description: "Dame sugerencias sobre mi contenido",
  },
]
