export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export interface ChatSettings {
  provider: string
  model: string
  internetSearch: boolean
  systemPrompt: string
  backendUrl: string
}

export const PROVIDER_MODELS = {
  openai: ["gpt-4o", "gpt-4o-mini", "gpt-3.5-turbo"],
  groq: ["llama-3.1-70b-versatile", "llama-3.1-8b-instant", "mixtral-8x7b-32768"],
} as const
