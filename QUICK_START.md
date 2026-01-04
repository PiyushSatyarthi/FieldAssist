# 🚀 Quick Start Guide - Web UI

## Starting the Server

### Step 1: Activate Virtual Environment (if not already active)

**Windows:**
```powershell
.\venv\Scripts\activate
```

**Linux/Mac:**
```bash
source venv/bin/activate
```

### Step 2: Start the FastAPI Server

```bash
uvicorn server.main:app --host 127.0.0.1 --port 8000 --reload
```

The `--reload` flag enables auto-reload when you make code changes (optional but recommended for development).

### Step 3: Open the Webpage

Once the server is running, you'll see output like:
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
```

**Open your web browser and go to:**
```
http://127.0.0.1:8000
```

or

```
http://localhost:8000
```

## What You'll See

- **Futuristic Apocalyptic Theme** with animated background
- **Survival Assistant Panel** - Ask questions about survival topics
- **Navigation System Panel** - Calculate routes using coordinates
- **System Status Indicators** - Real-time status display

## Using the Web UI

### Ask a Survival Question:
1. Type your question in the chat input at the bottom
2. Press Enter or click the ▶ button
3. The AI will respond with survival guidance

### Calculate a Route:
1. Enter start coordinates (latitude, longitude)
2. Enter destination coordinates (latitude, longitude)
3. Click "CALCULATE ROUTE"
4. View distance, time, and step-by-step directions

## Troubleshooting

### Server won't start?
- Make sure you're in the project directory
- Ensure virtual environment is activated
- Check if port 8000 is already in use

### Webpage shows errors?
- Make sure Ollama is running (for AI questions): `ollama serve`
- Make sure GraphHopper is running (for navigation): See README.md
- Check browser console (F12) for error messages

### API calls fail?
- Verify the server is running on port 8000
- Check that backend services (Ollama, GraphHopper) are running
- Look at server terminal for error messages

## Stopping the Server

Press `CTRL+C` in the terminal where the server is running.

