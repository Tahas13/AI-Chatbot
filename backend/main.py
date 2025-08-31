from urllib import response
from pydantic import BaseModel
from typing import List

class RequestState(BaseModel):
    model_name: str
    model_provider: str
    system_prompt: str
    messages: List[str]
    allow_search: bool

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from ai_agent import get_response_from_ai_agent

ALLOWED_MODEL_NAMES = ["llama3-70b-8192", "mixtral-8x7b-32768", "llama-3.3-70b-versatile", "gpt-4o-mini"]

app = FastAPI(title="LangGraph AI Agent")

# Add CORS middleware to allow frontend connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/chat")
def chat_endpoint(request: RequestState):
    '''
    API Endpoint to interact with the Chatbot using LangGraph and search tools.
    It dynamically selects the appropriate model and tool
    '''
    if request.model_name not in ALLOWED_MODEL_NAMES:
        return {"error": "Model not allowed"}
    
    llm_id = request.model_name
    query = request.messages[-1] 
    allow_search = request.allow_search
    system_prompt = request.system_prompt
    provider = request.model_provider
 
    response = get_response_from_ai_agent(llm_id, query, allow_search, system_prompt, provider)
    return response

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
