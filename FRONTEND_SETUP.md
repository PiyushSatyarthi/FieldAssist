# Frontend Setup Guide

## Quick Start

### 1. Install Node.js Dependencies

```bash
cd frontend
npm install
```

### 2. Start the Frontend Development Server

```bash
npm run dev
```

The React app will be available at `http://localhost:3000`

### 3. Start the Backend API Server

In a separate terminal, from the project root:

```bash
# Activate virtual environment
.\venv\Scripts\activate  # Windows
# or
source venv/bin/activate  # Linux/Mac

# Start FastAPI server
uvicorn server.main:app --host 127.0.0.1 --port 8000 --reload
```

### 4. Access the Application

Open your browser to: `http://localhost:3000`

## Architecture

### Frontend (React + TypeScript + Vite)
- **Port**: 3000
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite

### Backend (FastAPI)
- **Port**: 8000
- **API Endpoints**: `/api/ask`, `/api/navigate`, `/health`

### Development Proxy

The Vite dev server automatically proxies `/api/*` requests to `http://127.0.0.1:8000`, so you don't need to configure CORS for development.

## Building for Production

### Build the Frontend

```bash
cd frontend
npm run build
```

This creates a `dist/` folder with optimized production files.

### Serve Production Build

You can serve the production build using:

```bash
npm run preview
```

Or integrate it with your FastAPI server by mounting the `dist/` directory.

## Features

### Core Components

1. **Header** - System name and status
2. **Sidebar** - RAG category selection
3. **QueryInput** - Large textarea for queries
4. **ResponsePanel** - Formatted response display with section parsing
5. **TriggerAlert** - Cross-RAG escalation alerts

### Design Principles

- **Professional & Serious** - No playful elements
- **High Contrast** - Readable in low light
- **Accessible** - Keyboard navigation, focus states
- **Responsive** - Desktop-first, mobile-friendly

## Troubleshooting

### Port Already in Use

If port 3000 is in use, Vite will automatically try the next available port.

### API Connection Errors

- Ensure the FastAPI server is running on port 8000
- Check that Ollama is running (for AI queries)
- Verify CORS settings in `server/main.py`

### Build Errors

- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version (requires Node 18+)

