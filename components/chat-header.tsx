"use client"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { PanelLeft, Plus, Share2 } from "lucide-react"

interface ChatHeaderProps {
  onToggleSidebar: () => void
  onNewChat: () => void
  isSidebarOpen: boolean
}

export function ChatHeader({
  onToggleSidebar,
  onNewChat,
  isSidebarOpen,
}: ChatHeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background px-4">
      <div className="flex items-center gap-2">
        {!isSidebarOpen && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={onToggleSidebar}
            >
              <PanelLeft className="h-5 w-5" />
              <span className="sr-only">Open sidebar</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={onNewChat}
            >
              <Plus className="h-5 w-5" />
              <span className="sr-only">New chat</span>
            </Button>
          </>
        )}
        <h1 className="text-sm font-medium">Chat</h1>
      </div>

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Share2 className="h-5 w-5" />
          <span className="sr-only">Share</span>
        </Button>
        <ThemeToggle />
      </div>
    </header>
  )
}
