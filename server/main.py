from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import os

from ai.llm import query_llm
from ai.rag import retrieve
from ai.prompts import SYSTEM_PROMPT

app = FastAPI(title="Offline Survival AI")

# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files (legacy HTML UI)
static_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static")
if os.path.exists(static_dir):
    app.mount("/static", StaticFiles(directory=static_dir), name="static")

# Request models
class QueryRequest(BaseModel):
    q: str
    category: str | None = None

# GraphHopper local server
GRAPH_HOPPER_URL = "http://localhost:8989"


# ---------- ROOT ROUTE (SERVE WEB UI) ----------
@app.get("/")
async def root():
    """Serve the main web UI"""
    index_path = os.path.join(static_dir, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return {"message": "Web UI not found. Please ensure static/index.html exists."}


# ---------- HEALTH CHECK ----------
@app.get("/health")
def health():
    return {
        "status": "ok",
        "graphhopper": "expected at localhost:8989",
    }


# ---------- AI QUESTION ANSWERING ----------
@app.post("/api/ask")
def ask_api(request: QueryRequest):
    """API endpoint for React frontend"""
    try:
        docs = retrieve(request.q)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"RAG error: {e}")

    prompt = (
        SYSTEM_PROMPT
        + "\n\nRelevant knowledge:\n"
        + "\n".join(docs)
        + "\n\nQuestion:\n"
        + request.q
    )

    try:
        answer = query_llm(prompt)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=(
                "LLM backend not reachable. "
                "Make sure Ollama is running on port 11434.\n"
                f"Error: {e}"
            ),
        )

    return {"answer": answer}

@app.post("/ask")
def ask(q: str):
    """Legacy endpoint for backward compatibility"""
    try:
        docs = retrieve(q)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"RAG error: {e}")

    prompt = (
        SYSTEM_PROMPT
        + "\n\nRelevant knowledge:\n"
        + "\n".join(docs)
        + "\n\nQuestion:\n"
        + q
    )

    try:
        answer = query_llm(prompt)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=(
                "LLM backend not reachable. "
                "Make sure Ollama is running on port 11434.\n"
                f"Error: {e}"
            ),
        )

    return {"answer": answer}


# ---------- OFFLINE NAVIGATION ----------
@app.post("/api/navigate")
def navigate_api(
    start_lat: float,
    start_lon: float,
    end_lat: float,
    end_lon: float,
):
    """API endpoint for React frontend"""
    return navigate_internal(start_lat, start_lon, end_lat, end_lon)

@app.post("/navigate")
def navigate(
    start_lat: float,
    start_lon: float,
    end_lat: float,
    end_lon: float,
):
    """Legacy endpoint for backward compatibility"""
    return navigate_internal(start_lat, start_lon, end_lat, end_lon)

def navigate_internal(
    start_lat: float,
    start_lon: float,
    end_lat: float,
    end_lon: float,
):
    """Internal navigation logic shared by both endpoints"""
    try:
        r = requests.get(
            f"{GRAPH_HOPPER_URL}/route",
            params={
                "point": [
                    f"{start_lat},{start_lon}",
                    f"{end_lat},{end_lon}",
                ],
                "profile": "car",
                "instructions": "true",
                "calc_points": "true",
                "locale": "en",
            },
            timeout=60,
        )
        r.raise_for_status()
    except requests.RequestException as e:
        raise HTTPException(
            status_code=500,
            detail=f"GraphHopper not reachable: {e}",
        )

    data = r.json()

    if "paths" not in data or not data["paths"]:
        raise HTTPException(
            status_code=500,
            detail="GraphHopper returned no route",
        )

    path = data["paths"][0]

    instructions = path.get("instructions", [])
    steps = [i.get("text", "") for i in instructions if "text" in i]

    return {
        "distance_km": round(path.get("distance", 0) / 1000, 2),
        "time_minutes": round(path.get("time", 0) / 60000, 1),
        "steps": steps,
    }
