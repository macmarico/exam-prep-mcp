# Frontend UI (React + Redux with Vite)

This app lives under `apps/frontend` and is part of the Yarn workspaces in the repo root.

## Run (dev)

```bash
cd apps/frontend
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
- `index.html` – HTML entry
- `src/main.jsx` – React root + Redux Provider
- `src/store.js` – Redux Toolkit store, slices, thunk
- `src/App.jsx` – UI with form/results/theme
- `styles.css` – CSS variables for dark/light themes

## Config
- Server URL defaults to `http://localhost:3000` (editable in the UI)
- The app posts to `${SERVER}/question.fetch` and expects `{ questions: string[] }`