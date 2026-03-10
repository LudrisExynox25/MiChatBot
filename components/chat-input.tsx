"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowUp, Paperclip, Mic, Square } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatInputProps {
  onSend: (message: string) => void
  isLoading?: boolean
  onStop?: () => void
}

export function ChatInput({ onSend, isLoading, onStop }: ChatInputProps) {
  const [input, setInput] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`
    }
  }, [input])

  const handleSubmit = () => {
    if (!input.trim() || isLoading) return
    onSend(input.trim())
    setInput("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="border-t border-border bg-background p-4">
      <div className="mx-auto max-w-3xl">
        <div className="relative flex items-end gap-2 rounded-2xl border border-input bg-card p-2 shadow-sm focus-within:ring-1 focus-within:ring-ring">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0 text-muted-foreground hover:text-foreground"
          >
            <Paperclip className="h-5 w-5" />
            <span className="sr-only">Attach file</span>
          </Button>

          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message..."
            rows={1}
            className="max-h-[200px] min-h-[44px] flex-1 resize-none bg-transparent px-2 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />

          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9 shrink-0 text-muted-foreground hover:text-foreground"
            >
              <Mic className="h-5 w-5" />
              <span className="sr-only">Voice input</span>
            </Button>

            {isLoading ? (
              <Button
                type="button"
                size="icon"
                className="h-9 w-9 shrink-0 rounded-xl bg-destructive hover:bg-destructive/90"
                onClick={onStop}
              >
                <Square className="h-4 w-4" />
                <span className="sr-only">Stop generating</span>
              </Button>
            ) : (
              <Button
                type="button"
                size="icon"
                className={cn(
                  "h-9 w-9 shrink-0 rounded-xl transition-colors",
                  input.trim()
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-muted text-muted-foreground"
                )}
                disabled={!input.trim()}
                onClick={handleSubmit}
              >
                <ArrowUp className="h-5 w-5" />
                <span className="sr-only">Send message</span>
              </Button>
            )}
          </div>
        </div>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          AI can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  )
}
