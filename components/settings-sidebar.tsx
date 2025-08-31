"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Bot, Trash2 } from "lucide-react"

interface SettingsSidebarProps {
  backendUrl: string
  setBackendUrl: (url: string) => void
  provider: string
  setProvider: (provider: string) => void
  model: string
  setModel: (model: string) => void
  internetSearch: boolean
  setInternetSearch: (enabled: boolean) => void
  systemPrompt: string
  setSystemPrompt: (prompt: string) => void
  onClearChat: () => void
  messageCount: number
}

const PROVIDER_MODELS = {
  openai: ["gpt-4o", "gpt-4o-mini", "gpt-3.5-turbo"],
  groq: ["llama-3.1-70b-versatile", "llama-3.1-8b-instant", "mixtral-8x7b-32768"],
}

export function SettingsSidebar({
  backendUrl,
  setBackendUrl,
  provider,
  setProvider,
  model,
  setModel,
  internetSearch,
  setInternetSearch,
  systemPrompt,
  setSystemPrompt,
  onClearChat,
  messageCount,
}: SettingsSidebarProps) {
  return (
    <div className="w-80 bg-sidebar border-r border-sidebar-border p-6 flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
          <Bot className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-sidebar-foreground">LangGraph AI</h1>
          <p className="text-sm text-muted-foreground">Chatbot Interface</p>
        </div>
      </div>

      <Separator />

      {/* Backend URL */}
      <div className="space-y-2">
        <Label htmlFor="backend-url" className="text-sm font-medium text-sidebar-foreground">
          Backend URL
        </Label>
        <Input
          id="backend-url"
          value={backendUrl}
          onChange={(e) => setBackendUrl(e.target.value)}
          placeholder="http://localhost:8000"
          className="bg-input border-border"
        />
      </div>

      {/* Provider Selection */}
      <div className="space-y-2">
        <Label htmlFor="provider" className="text-sm font-medium text-sidebar-foreground">
          AI Provider
        </Label>
        <Select value={provider} onValueChange={setProvider}>
          <SelectTrigger className="bg-input border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="openai">OpenAI</SelectItem>
            <SelectItem value="groq">Groq</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Model Selection */}
      <div className="space-y-2">
        <Label htmlFor="model" className="text-sm font-medium text-sidebar-foreground">
          Model
        </Label>
        <Select value={model} onValueChange={setModel}>
          <SelectTrigger className="bg-input border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PROVIDER_MODELS[provider as keyof typeof PROVIDER_MODELS]?.map((modelOption) => (
              <SelectItem key={modelOption} value={modelOption}>
                {modelOption}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Internet Search Toggle */}
      <div className="flex items-center justify-between">
        <Label htmlFor="internet-search" className="text-sm font-medium text-sidebar-foreground">
          Internet Search
        </Label>
        <Switch id="internet-search" checked={internetSearch} onCheckedChange={setInternetSearch} />
      </div>

      {/* System Prompt */}
      <div className="space-y-2 flex-1">
        <Label htmlFor="system-prompt" className="text-sm font-medium text-sidebar-foreground">
          System Prompt
        </Label>
        <Textarea
          id="system-prompt"
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          placeholder="You are a helpful AI assistant..."
          className="bg-input border-border resize-none min-h-[100px]"
        />
      </div>

      {/* Clear Chat Button */}
      <Button onClick={onClearChat} variant="outline" className="w-full bg-transparent" disabled={messageCount === 0}>
        <Trash2 className="w-4 h-4 mr-2" />
        Clear Chat
      </Button>
    </div>
  )
}
