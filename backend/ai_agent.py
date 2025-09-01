import os
import requests
from typing import Optional

# Only import heavy libraries when needed
def import_openai():
    import openai
    return openai

def import_groq():
    from groq import Groq
    return Groq

# Tavily search function
def get_tavily_search(query: str) -> str:
    api_key = os.environ.get("TAVILY_API_KEY")
    if not api_key:
        return "[Tavily API key not set]"

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
        resp = requests.post(url, json=payload, headers=headers, timeout=10)
        resp.raise_for_status()
        data = resp.json()
        if "answer" in data and data["answer"]:
            return data["answer"]
        elif "results" in data and data["results"]:
            return data["results"][0].get("content", "")
        else:
            return ""
    except Exception as e:
        return f"[Tavily search error: {e}]"

# Main AI agent function
def get_response_from_ai_agent(
    llm_id: str,
    query: str,
    allow_search: bool,
    system_prompt: str,
    provider: str
):
    search_info = ""
    if allow_search:
        search_info = f"\n[Relevant web search result: {get_tavily_search(query)}]"

    messages = []
    if system_prompt:
        messages.append({"role": "system", "content": system_prompt})
    if search_info:
        messages.append({"role": "system", "content": search_info})
    messages.append({"role": "user", "content": query})

    answer = "Unknown provider."

    if provider == "openai":
        openai = import_openai()
        api_key = os.environ.get("OPENAI_API_KEY")
        if not api_key:
            return {"response": "[OpenAI API key not set]"}
        openai.api_key = api_key
        response = openai.ChatCompletion.create(
            model=llm_id,
            messages=messages,
            temperature=0.7
        )
        answer = response.choices[0].message.content.strip()

    elif provider == "groq":
        Groq = import_groq()
        api_key = os.environ.get("GROQ_API_KEY")
        if not api_key:
            return {"response": "[GROQ API key not set]"}
        client = Groq(api_key=api_key)
        response = client.chat.completions.create(
            model=llm_id,
            messages=messages,
            temperature=0.7
        )
        answer = response.choices[0].message.content.strip()

    return {
        "response": answer,
        "model_used": llm_id,
        "provider": provider,
        "search_enabled": allow_search
    }
