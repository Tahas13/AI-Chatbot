from pydantic import BaseModel
from typing import List
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum
from ai_agent import get_response_from_ai_agent

ALLOWED_MODEL_NAMES = [
    "llama3-70b-8192",
    "mixtral-8x7b-32768",
    "llama-3.3-70b-versatile",
    "gpt-4o-mini"
]

# Define your request model and suppress Pydantic warnings
class RequestState(BaseModel):
    model_name: str
    model_provider: str
    system_prompt: str
    messages: List[str]
    allow_search: bool

    # Suppress warnings about "model_" namespace
    model_config = {
        "protected_namespaces": ()
    }

app = FastAPI(title="LangGraph AI Agent")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root endpoint (optional, prevents 500 on "/")
@app.get("/")
def root():
    return {"message": "FastAPI backend is running."}

# Chat endpoint
@app.post("/chat")
def chat_endpoint(request: RequestState):
    if request.model_name not in ALLOWED_MODEL_NAMES:
        return {"error": "Model not allowed"}
    
    llm_id = request.model_name
    query = request.messages[-1]
    allow_search = request.allow_search
    system_prompt = request.system_prompt
    provider = request.model_provider

    response = get_response_from_ai_agent(llm_id, query, allow_search, system_prompt, provider)
    return response

# Serverless handler for Vercel
handler = Mangum(app)

# Only run uvicorn locally
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
