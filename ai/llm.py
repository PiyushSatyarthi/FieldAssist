import requests

OLLAMA_URL = "http://localhost:11434/api/chat"
MODEL_NAME = "survival-assistant"

# ---------------------------------------------
# DEPTH / TRAINING PROMPT (STYLE CONTROLLER)
# ---------------------------------------------

FIRST_DAY_TRAINING_PROMPT = """
You are a professional field instructor training a complete beginner on their first day of work.

The reader:
- Has never done this task before
- Does not know the tools
- Does not know the sequence
- Will make mistakes unless warned

Your job is to teach, not summarize.

DO NOT give high-level tips.
DO NOT give short bullet lists.
DO NOT assume prior knowledge.
DO NOT compress steps.
DO NOT say “ensure”, “properly”, or “carefully” without explaining HOW.

Every step must explain:
- What to do
- Why it is done
- What can go wrong if done incorrectly
- What beginners usually get wrong

Write as if you are standing next to the person, explaining each action slowly and clearly.

Use non-graphic, professional language.
Focus on food safety, hygiene, workflow, and error prevention.

Use full paragraphs, not shallow bullets.
Depth is more important than brevity.
"""

# ---------------------------------------------
# MAIN QUERY FUNCTION
# ---------------------------------------------

def query_llm(user_query: str, training_mode: bool = True) -> str:
    """
    Sends a query to Ollama using the survival-assistant model.

    training_mode=True  -> deep, first-day-on-the-job instruction
    training_mode=False -> normal concise response
    """

    if training_mode:
        final_prompt = (
            FIRST_DAY_TRAINING_PROMPT
            + "\n\nBEGIN TASK:\n"
            + user_query
        )
    else:
        final_prompt = user_query

    response = requests.post(
        OLLAMA_URL,
        json={
            "model": MODEL_NAME,
            "messages": [
                {
                    "role": "user",
                    "content": final_prompt
                }
            ],
            "options": {
                "temperature": 0.2,
                "repeat_penalty": 1.1
            },
            "stream": False
        },
        timeout=120
    )

    response.raise_for_status()
    return response.json()["message"]["content"]
