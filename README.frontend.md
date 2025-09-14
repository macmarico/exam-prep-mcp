# Frontend UI (React + Redux) for /question.fetch

A minimal React UI (no build step) that interacts with a Node.js server exposing a `/question.fetch` endpoint. It uses Redux Toolkit for state management and supports dark/light themes via a toggle.

## Quick Start

1. Ensure the backend server is running and exposes `POST /question.fetch`:
   - Request body: `{ "topic": string, "difficulty": "easy" | "medium" | "hard" }`
   - Response body: `{ "questions": string[] }`
2. Serve the `frontend/` directory statically and open it in the browser.

### Serve locally

```bash
# Python 3
python3 -m http.server 5173 --directory frontend
# or Node (if installed)
npx serve frontend -l 5173 --single --yes
```

Then visit `http://localhost:5173/`.

## Features

- React 18 via ESM CDN
- Redux Toolkit store with async thunk to fetch questions
- Dark/Light theme toggle using CSS variables
- No build tools required

## Configuration

- Server URL input defaults to `http://localhost:3000`.
- The app posts to `${SERVER}/question.fetch` with JSON body `{ topic, difficulty }`.
- It expects a response of shape `{ questions: string[] }`.

## Files

- `frontend/index.html`: React mount point and module script
- `frontend/main.jsx`: React root and Redux Provider
- `frontend/store.js`: Redux Toolkit store, slices, and thunk
- `frontend/App.jsx`: UI with form, results, and theme toggle
- `frontend/styles.css`: CSS variables supporting dark and light themes