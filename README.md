# LangGraph AI Chatbot

A modern, responsive chatbot interface built with Next.js and TypeScript that connects to a FastAPI backend. Features a sleek dark theme with cyan and amber accents, provider selection, and real-time chat functionality.

## Features

- 🤖 **Multi-Provider Support**: Choose between OpenAI and Groq AI providers
- 🎯 **Model Selection**: Dynamic model options based on selected provider
- 🌐 **Internet Search**: Toggle web search capabilities for enhanced responses
- 🎨 **Modern Dark Theme**: Sleek interface with cyan and amber gradient accents
- 💬 **Real-time Chat**: Smooth chat experience with typing indicators
- ⚙️ **Customizable System Prompts**: Personalize AI behavior
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile
- 🔄 **Chat Management**: Clear chat history and session management

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icons
- **shadcn/ui** - Modern component library

### Backend (Required)
- **FastAPI** - Python web framework
- **OpenAI API** - GPT models integration
- **Groq API** - Fast inference models

## Project Structure

\`\`\`
├── app/
│   ├── globals.css          # Global styles and theme
│   ├── layout.tsx           # Root layout component
│   └── page.tsx             # Main chatbot interface
├── components/
│   └── ui/                  # shadcn/ui components
├── lib/
│   └── utils.ts             # Utility functions
├── types/
│   └── chat.ts              # TypeScript type definitions
└── README.md
\`\`\`

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Python 3.8+ (for backend)
- OpenAI API key
- Groq API key (optional)

### Frontend Setup

1. **Clone and install dependencies:**
   \`\`\`bash
   git clone <repository-url>
   cd langgraph-chatbot
   npm install
   \`\`\`

2. **Start the development server:**
   \`\`\`bash
   npm run dev
   \`\`\`

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Backend Setup

1. **Create a FastAPI backend** with the following endpoint:
   \`\`\`python
   # main.py
   from fastapi import FastAPI
   from pydantic import BaseModel
   from typing import List
   
   app = FastAPI()
   
   class ChatRequest(BaseModel):
       message: str
       provider: str
       model: str
       internet_search: bool
       system_prompt: str
   
   @app.post("/chat")
   async def chat_endpoint(request: ChatRequest):
       # Your AI logic here
       return {"response": "Your AI response"}
   \`\`\`

2. **Install Python dependencies:**
   \`\`\`bash
   pip install fastapi uvicorn openai groq
   \`\`\`

3. **Set up environment variables:**
   \`\`\`bash
   export OPENAI_API_KEY="your-openai-key"
   export GROQ_API_KEY="your-groq-key"
   \`\`\`

4. **Run the backend:**
   \`\`\`bash
   uvicorn main:app --reload --port 8000
   \`\`\`

## Configuration

### Supported Models

**OpenAI:**
- gpt-4o
- gpt-4o-mini
- gpt-3.5-turbo

**Groq:**
- llama-3.1-70b-versatile
- llama-3.1-8b-instant
- mixtral-8x7b-32768

### Backend URL

The frontend connects to `http://localhost:8000` by default. Update the `backendUrl` state in `app/page.tsx` to change this.

## Usage

1. **Select Provider**: Choose between OpenAI or Groq
2. **Pick Model**: Select from available models for your provider
3. **Configure Settings**: 
   - Toggle internet search on/off
   - Customize the system prompt
4. **Start Chatting**: Type your message and press Enter or click Send
5. **Manage Chat**: Use the Clear Chat button to reset the conversation

## API Integration

The frontend sends POST requests to `/chat` with this structure:

\`\`\`typescript
{
  message: string,
  provider: "openai" | "groq",
  model: string,
  internet_search: boolean,
  system_prompt: string
}
\`\`\`

Expected response:
\`\`\`typescript
{
  response: string
}
\`\`\`

## Customization

### Theme Colors
Edit `app/globals.css` to customize the color scheme:
- Primary: Cyan (#06B6D4)
- Secondary: Amber (#F59E0B)
- Background: Dark grays (#0A0A0A to #1A1A1A)

### Adding New Providers
Update the `PROVIDER_MODELS` object in `app/page.tsx`:

\`\`\`typescript
const PROVIDER_MODELS = {
  openai: ["gpt-4o", "gpt-4o-mini"],
  groq: ["llama-3.1-70b-versatile"],
  newprovider: ["model1", "model2"] // Add here
}
\`\`\`

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Building for Production

\`\`\`bash
npm run build
npm run start
\`\`\`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For issues and questions:
- Check the [Issues](../../issues) page
- Review the FastAPI backend setup
- Ensure all environment variables are configured
- Verify the backend is running on the correct port

---

Built with ❤️ using Next.js, TypeScript, and modern web technologies.
