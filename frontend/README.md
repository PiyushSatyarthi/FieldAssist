# Offline Survival AI - Frontend

Professional React-based frontend for the Offline Survival AI system.

## Tech Stack

- **React 18** (Functional components)
- **TypeScript**
- **Vite**
- **Tailwind CSS**

## Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

### 3. Build for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

## Development

The frontend expects the FastAPI backend to be running on `http://127.0.0.1:8000`.

The Vite dev server is configured to proxy `/api/*` requests to the backend.

## Project Structure

```
frontend/
├── src/
│   ├── components/      # React components
│   ├── styles/          # Global styles
│   ├── types.ts         # TypeScript types
│   ├── App.tsx          # Main app component
│   └── main.tsx         # Entry point
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.ts
```

## Design Philosophy

This UI is designed for **life-critical information**:

- **Serious and trustworthy** - Not playful or decorative
- **High contrast** - Readable in low light conditions
- **Professional** - Feels like a field terminal, not a game
- **Accessible** - Keyboard navigation, high contrast mode
- **Resilient** - Works under stress, clear error states

