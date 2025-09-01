import os
import openai
from groq import Groq
import requests
from dotenv import load_dotenv

# Load environment variables from .env file
#load_dotenv()

# Initialize Groq client (lazy init so it only creates if needed)
groq_client = None

def get_tavily_search(query: str):
    """
    Calls the Tavily search API and returns the top result text.
    """
    api_key = os.environ.get("TAVILY_API_KEY")
    url = "https://api.tavily.com/search"
    headers = {"Authorization": f"Bearer {api_key}"}
    payload = {
        "query": query,
        "search_depth": "advanced",
        "include_answer": True,
        "include_raw_content": False,
        "max_results": 1
    }
    try:
        response = requests.post(url, json=payload, headers=headers, timeout=10)
        response.raise_for_status()
        data = response.json()
        if "answer" in data and data["answer"]:
            return data["answer"]
        elif "results" in data and data["results"]:
            return data["results"][0].get("content", "")
        else:
            return ""
    except Exception as e:
        return f"[Tavily search error: {e}]"

def get_response_from_ai_agent(llm_id: str, query: str, allow_search: bool, system_prompt: str, provider: str):
    """
    Calls the selected LLM provider (Groq or OpenAI) and returns the response.
    If allow_search is True, injects Tavily search results into the prompt.
    """
    # Optionally augment the prompt with Tavily search results
    search_info = ""
    if allow_search:
        tavily_result = get_tavily_search(query)
        search_info = f"\n[Relevant web search result: {tavily_result}]"

    # Prepare messages for chat completion
    messages = []
    if system_prompt:
        messages.append({"role": "system", "content": system_prompt})
    if search_info:
        messages.append({"role": "system", "content": search_info})
    messages.append({"role": "user", "content": query})

    # Call the appropriate provider
    if provider == "openai":
        openai.api_key = os.environ.get("OPENAI_API_KEY")
        response = openai.ChatCompletion.create(
            model=llm_id,
            messages=messages,
            temperature=0.7,
        )
        answer = response.choices[0].message.content.strip()

    elif provider == "groq":
        global groq_client
        if groq_client is None:
            groq_client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

        response = groq_client.chat.completions.create(
            model=llm_id,
            messages=messages,
            temperature=0.7,
        )
        answer = response.choices[0].message.content.strip()

    else:
        answer = "Unknown provider."

    return {
        "response": answer,
        "model_used": llm_id,
        "provider": provider,
        "search_enabled": allow_search
    }
