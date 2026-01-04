# 🚀 How to Start the Application

## Quick Start Guide

### Step 1: Start the Backend API Server

Open a terminal/PowerShell in the project root directory (`E:\Oflline_AI`):

```powershell
# Activate virtual environment
.\venv\Scripts\activate

# Start FastAPI server
uvicorn server.main:app --host 127.0.0.1 --port 8000 --reload
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
```

**Keep this terminal open!**

---

### Step 2: Start the Frontend (React App)

Open a **NEW** terminal/PowerShell window:

```powershell
# Navigate to frontend directory
cd frontend

# Install dependencies (only needed first time)
npm install

# Start React development server
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
```

---

### Step 3: Open in Browser

Open your web browser and go to:
```
http://localhost:3000
```

You should see the professional survival AI interface!

---

## Optional: Start Backend Services

For full functionality, you may also need:

### Ollama (for AI responses)
```bash
ollama serve
```

### GraphHopper (for navigation)
```bash
cd graphhopper
java -Xmx8g -jar graphhopper-web-11.0.jar server config.yml
```

---

## Troubleshooting

### Port 8000 already in use?
- Find and close the process using port 8000, or
- Change the port in the uvicorn command: `--port 8001`

### Port 3000 already in use?
- Vite will automatically use the next available port (3001, 3002, etc.)
- Check the terminal output for the actual URL

### Frontend can't connect to backend?
- Make sure the backend is running on port 8000
- Check that you see "Uvicorn running" in the backend terminal
- Verify the frontend terminal shows the proxy is working

### npm install fails?
- Make sure Node.js is installed (version 18 or higher)
- Try: `npm cache clean --force` then `npm install` again

---

## Stopping the Servers

- **Backend**: Press `CTRL+C` in the backend terminal
- **Frontend**: Press `CTRL+C` in the frontend terminal

---

## What You'll See

- **Left Sidebar**: Select RAG category (Medical, Food & Water, etc.)
- **Query Box**: Enter your survival question
- **Response Panel**: Formatted guidance with sections
- **Cross-RAG Alerts**: Clickable alerts when escalation is needed

---

## Need Help?

Check these files:
- `FRONTEND_SETUP.md` - Detailed frontend setup
- `README.md` - Project overview
- `QUICK_START.md` - Legacy HTML UI guide

