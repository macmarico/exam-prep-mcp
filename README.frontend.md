# Frontend UI (React + Redux with Vite)

A minimal React UI that interacts with a Node.js server exposing a `/question.fetch` endpoint. Uses Redux Toolkit for state and Vite for dev/build. Includes dark/light theme toggle.

## Quick Start

```bash
cd frontend
yarn install
yarn dev
```
Open the printed URL (e.g., `http://localhost:5173`).

Ensure the backend is running and exposes `POST /question.fetch`:
- Request body: `{ "topic": string, "difficulty": "easy" | "medium" | "hard" }`
- Response body: `{ "questions": string[] }`

## Scripts
- `yarn dev` – start Vite dev server
- `yarn build` – production build
- `yarn preview` – preview production build

## Files
- `frontend/index.html` – HTML entry
- `frontend/src/main.jsx` – React root + Redux Provider
- `frontend/src/store.js` – Redux Toolkit store, slices, thunk
- `frontend/src/App.jsx` – UI with form/results/theme
- `frontend/styles.css` – CSS variables for dark/light themes

## Config
- Server URL defaults to `http://localhost:3000` (editable in the UI)
- The app posts to `${SERVER}/question.fetch` and expects `{ questions: string[] }`