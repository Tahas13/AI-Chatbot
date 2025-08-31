export interface ChatRequest {
  message: string
  provider: string
  model: string
  internet_search: boolean
  system_prompt: string
}

export interface ChatResponse {
  response: string
}

export async function sendChatMessage(backendUrl: string, request: ChatRequest): Promise<ChatResponse> {
  const response = await fetch(`${backendUrl}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}
