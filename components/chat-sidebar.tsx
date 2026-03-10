"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  MessageSquare,
  Plus,
  Search,
  Settings,
  Trash2,
  MoreHorizontal,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ChatHistory {
  id: string
  title: string
  date: string
  isActive?: boolean
}

interface ChatSidebarProps {
  isOpen: boolean
  onToggle: () => void
  chatHistory: ChatHistory[]
  onNewChat: () => void
  onSelectChat: (id: string) => void
  onDeleteChat: (id: string) => void
}

export function ChatSidebar({
  isOpen,
  onToggle,
  chatHistory,
  onNewChat,
  onSelectChat,
  onDeleteChat,
}: ChatSidebarProps) {
  const groupedChats = groupChatsByDate(chatHistory)

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full w-[280px] flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex h-14 items-center justify-between border-b border-sidebar-border px-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={onToggle}
          >
            <PanelLeftClose className="h-5 w-5" />
            <span className="sr-only">Close sidebar</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={onNewChat}
          >
            <Plus className="h-5 w-5" />
            <span className="sr-only">New chat</span>
          </Button>
        </div>

        {/* Search */}
        <div className="px-3 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search chats..."
              className="w-full rounded-lg border border-sidebar-border bg-sidebar-accent/50 py-2 pl-9 pr-3 text-sm text-sidebar-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-sidebar-ring"
            />
          </div>
        </div>

        {/* Chat History */}
        <ScrollArea className="flex-1 px-3">
          {Object.entries(groupedChats).map(([dateGroup, chats]) => (
            <div key={dateGroup} className="mb-4">
              <p className="mb-2 px-2 text-xs font-medium text-muted-foreground">
                {dateGroup}
              </p>
              <div className="space-y-1">
                {chats.map((chat) => (
                  <div
                    key={chat.id}
                    className={cn(
                      "group flex items-center gap-2 rounded-lg px-2 py-2 text-sm transition-colors cursor-pointer",
                      chat.isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                    )}
                    onClick={() => onSelectChat(chat.id)}
                  >
                    <MessageSquare className="h-4 w-4 shrink-0" />
                    <span className="flex-1 truncate">{chat.title}</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation()
                            onDeleteChat(chat.id)
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </ScrollArea>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-3">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </div>
      </aside>

      {/* Toggle button when sidebar is closed */}
      {!isOpen && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed left-4 top-3 z-30 h-9 w-9 md:hidden"
          onClick={onToggle}
        >
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Open sidebar</span>
        </Button>
      )}
    </>
  )
}

function groupChatsByDate(chats: ChatHistory[]): Record<string, ChatHistory[]> {
  const groups: Record<string, ChatHistory[]> = {}

  chats.forEach((chat) => {
    const dateGroup = chat.date
    if (!groups[dateGroup]) {
      groups[dateGroup] = []
    }
    groups[dateGroup].push(chat)
  })

  return groups
}
