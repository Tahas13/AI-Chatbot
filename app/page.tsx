"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Send, Bot, User, Trash2 } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface ChatRequest {
  model_name: string
  model_provider: string
  system_prompt: string
  messages: string[]
  allow_search: boolean
}

const PROVIDER_MODELS = {
  openai: ["gpt-4o-mini"],
  groq: ["llama3-70b-8192", "mixtral-8x7b-32768", "llama-3.3-70b-versatile"],
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [provider, setProvider] = useState("openai")
  const [model, setModel] = useState("gpt-4o-mini")
  const [internetSearch, setInternetSearch] = useState(false)
  const [systemPrompt, setSystemPrompt] = useState("You are a helpful AI assistant.")
  const [backendUrl, setBackendUrl] = useState("http://localhost:8000")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Update model when provider changes
    const availableModels = PROVIDER_MODELS[provider as keyof typeof PROVIDER_MODELS]
    if (availableModels && !availableModels.includes(model)) {
      setModel(availableModels[0])
    }
  }, [provider, model])

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const currentInput = inputMessage
    setInputMessage("")
    setIsLoading(true)

    try {
      const allMessages = [...messages, userMessage].map((msg) => msg.content)

      const requestData: ChatRequest = {
        model_name: model,
        model_provider: provider,
        system_prompt: systemPrompt,
        messages: allMessages,
        allow_search: internetSearch,
      }

      const response = await fetch(`${backendUrl}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: typeof data === "string" ? data : data.response || data.content || JSON.stringify(data),
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please check your backend connection and try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const clearChat = () => {
    setMessages([])
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-80 bg-sidebar border-r border-sidebar-border p-6 flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center shadow-lg">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-sidebar-foreground">Insighta AI</h1>
            <p className="text-sm text-muted-foreground">Taha's Chatbot Interface</p>
          </div>
        </div>

        <Separator className="bg-sidebar-border" />

        {/* Provider Selection */}
        <div className="space-y-2">
          <Label htmlFor="provider" className="text-sm font-medium text-sidebar-foreground">
            AI Provider
          </Label>
          <Select value={provider} onValueChange={setProvider}>
            <SelectTrigger className="bg-input border-border hover:glow-border transition-all duration-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="openai" className="hover:bg-accent hover:text-accent-foreground">
                OpenAI
              </SelectItem>
              <SelectItem value="groq" className="hover:bg-accent hover:text-accent-foreground">
                Groq
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Model Selection */}
        <div className="space-y-2">
          <Label htmlFor="model" className="text-sm font-medium text-sidebar-foreground">
            Model
          </Label>
          <Select value={model} onValueChange={setModel}>
            <SelectTrigger className="bg-input border-border hover:glow-border transition-all duration-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              {PROVIDER_MODELS[provider as keyof typeof PROVIDER_MODELS]?.map((modelOption) => (
                <SelectItem
                  key={modelOption}
                  value={modelOption}
                  className="hover:bg-accent hover:text-accent-foreground"
                >
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
          <Switch
            id="internet-search"
            checked={internetSearch}
            onCheckedChange={setInternetSearch}
            className="data-[state=checked]:gradient-primary"
          />
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
            className="bg-input border-border resize-none min-h-[100px] focus:glow-border-focus transition-all duration-200"
          />
        </div>

        {/* Clear Chat Button */}
        <Button
          onClick={clearChat}
          variant="outline"
          className="w-full bg-transparent border-border hover:gradient-primary-hover hover:text-white hover:border-transparent transition-all duration-200"
          disabled={messages.length === 0}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Clear Chat
        </Button>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-card border-b border-border p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-card-foreground">Chat</h2>
              <p className="text-sm text-muted-foreground">
                Using {provider} • {model} {internetSearch && "• Internet Search"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isLoading ? "bg-accent animate-pulse" : "bg-green-400"}`} />
              <span className="text-xs text-muted-foreground">{isLoading ? "Thinking..." : "Ready"}</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4 max-w-4xl mx-auto">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Bot className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">Welcome to Insighta AI Chatbot</h3>
                <p className="text-muted-foreground">Start a conversation by typing a message below.</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "assistant" && (
                    <div className="w-8 h-8 gradient-primary rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[70%] rounded-xl px-4 py-3 chat-bubble-shadow ${
                      message.role === "user"
                        ? "gradient-primary text-white"
                        : "bg-card text-card-foreground border border-border"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs opacity-70 mt-2">{message.timestamp.toLocaleTimeString()}</p>
                  </div>
                  {message.role === "user" && (
                    <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                      <User className="w-4 h-4 text-secondary-foreground" />
                    </div>
                  )}
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 gradient-primary rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-card text-card-foreground border border-border rounded-xl px-4 py-3 chat-bubble-shadow">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                    <div
                      className="w-2 h-2 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="bg-card border-t border-border p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message here..."
                  disabled={isLoading}
                  className="bg-input border-border focus:glow-border-focus transition-all duration-200 rounded-xl"
                />
              </div>
              <Button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="px-4 gradient-primary hover:gradient-primary-hover text-white border-0 rounded-xl shadow-lg transition-all duration-200"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
