from fastapi import FastAPI, HTTPException
import requests

from ai.llm import query_llm
from ai.rag import retrieve
from ai.prompts import SYSTEM_PROMPT

app = FastAPI(title="Offline Survival AI")

# GraphHopper local server
GRAPH_HOPPER_URL = "http://localhost:8989"


# ---------- HEALTH CHECK ----------
@app.get("/health")
def health():
    return {
        "status": "ok",
        "graphhopper": "expected at localhost:8989",
    }


# ---------- AI QUESTION ANSWERING ----------
@app.post("/ask")
def ask(q: str):
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
@app.post("/navigate")
def navigate(
    start_lat: float,
    start_lon: float,
    end_lat: float,
    end_lon: float,
):
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
