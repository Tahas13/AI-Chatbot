# LangGraph AI Chatbot

A modern, responsive chatbot interface built with Next.js and TypeScript that connects to a FastAPI backend. Features a sleek dark theme with cyan and amber accents, provider selection, and real-time chat functionality.

## 🚀 Live Demo

- **Frontend**: [https://ai-chatbot-zru2.vercel.app/](https://ai-chatbot-zru2.vercel.app/)
- **Backend API**: [https://ai-chatbot-zugr.vercel.app/](https://ai-chatbot-zugr.vercel.app/)
- **API Documentation**: [https://ai-chatbot-zugr.vercel.app/docs](https://ai-chatbot-zugr.vercel.app/docs)

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

### Quick Start (Using Deployed Version)

Simply visit the live demo at [https://ai-chatbot-zru2.vercel.app/](https://ai-chatbot-zru2.vercel.app/) to start using the chatbot immediately!

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

2. **Configure backend URL:**
   The app is pre-configured to use the deployed backend at `https://ai-chatbot-zugr.vercel.app/`. For local development, update the backend URL in your environment or code.

3. **Start the development server:**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Backend Setup

The backend is already deployed and running at [https://ai-chatbot-zugr.vercel.app/](https://ai-chatbot-zugr.vercel.app/). 

For local development or custom deployment:

1. **Backend structure:**
   \`\`\`python
   # main.py
   from fastapi import FastAPI, HTTPException
   from fastapi.middleware.cors import CORSMiddleware
   from pydantic import BaseModel
   from typing import List
   import os
   
   app = FastAPI(title="LangGraph AI Chatbot API")
   
   # CORS middleware for frontend integration
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["*"],
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   
   class RequestState(BaseModel):
       model_name: str
       model_provider: str
       system_prompt: str
       messages: List[str]
       allow_search: bool
   
   @app.post("/chat")
   async def chat_endpoint(request: RequestState):
       # AI processing logic here
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

The frontend connects to the deployed backend at `https://ai-chatbot-zugr.vercel.app/` by default. For local development, update the `backendUrl` in your configuration.

## 🌐 Deployment

### Frontend Deployment (Vercel)

The frontend is deployed on Vercel at [https://ai-chatbot-zru2.vercel.app/](https://ai-chatbot-zru2.vercel.app/)

To deploy your own version:
1. Fork this repository
2. Connect to Vercel
3. Deploy with default Next.js settings

### Backend Deployment (Vercel)

The FastAPI backend is deployed on Vercel at [https://ai-chatbot-zugr.vercel.app/](https://ai-chatbot-zugr.vercel.app/)

Required environment variables for backend:
- `OPENAI_API_KEY` - Your OpenAI API key
- `GROQ_API_KEY` - Your Groq API key (optional)

## API Integration

The frontend sends POST requests to `/chat` with this structure:

\`\`\`typescript
{
  model_name: string,
  model_provider: "openai" | "groq",
  system_prompt: string,
  messages: string[],
  allow_search: boolean
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
- Try the live demo: [https://ai-chatbot-zru2.vercel.app/](https://ai-chatbot-zru2.vercel.app/)
- Check the API docs: [https://ai-chatbot-zugr.vercel.app/docs](https://ai-chatbot-zugr.vercel.app/docs)
- Review the FastAPI backend setup
- Ensure all environment variables are configured

---

Built with ❤️ using Next.js, TypeScript, FastAPI, and deployed on Vercel.
