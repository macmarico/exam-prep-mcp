# Frontend UI for /question.fetch

This is a minimal static UI that interacts with a Node.js server exposing a `/question.fetch` endpoint.

## Quick Start

1. Ensure the backend server is running and exposes `POST /question.fetch`:
   - Request body: `{ "topic": string, "difficulty": "easy" | "medium" | "hard" }`
   - Response body: `{ "questions": string[] }`
2. Open `frontend/index.html` in a browser (via a static server is recommended).

### Serve locally (recommended)

Use any static file server from the repository root:

```bash
# Python 3
python3 -m http.server 5173 --directory frontend
# or Node (if installed)
npx serve frontend -l 5173 --single --yes
```

Then visit `http://localhost:5173/`.

## Configuration

- Server URL input defaults to `http://localhost:3000`. Change it in the UI if your backend runs elsewhere.
- Results will display the `questions` array from the response, treating non-strings defensively.

## Notes

- The UI performs a `POST` to `${SERVER}/question.fetch` with JSON body `{ topic, difficulty }`.
- Errors are shown inline; network and API errors are handled.
- No build tooling required; vanilla HTML/CSS/JS.