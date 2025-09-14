# MCP Question Server

Minimal Node.js MCP server using Express and Mongoose. Exposes `/question.fetch` to retrieve questions by topic and difficulty.

## Prerequisites

- Node.js 18+
- MongoDB running locally or a connection string

## Setup

1. Copy environment template and edit as needed:

```bash
cp .env.example .env
```

2. Install dependencies:

```bash
npm install
```

3. Seed sample data:

```bash
npm run seed
```

4. Start the server:

```bash
npm start
```

Server runs on `http://localhost:3000` by default.

## Endpoints

- `GET /health` – health check
- `GET /mcp/schema` – MCP tool schema
- `POST /question.fetch` – fetch questions

Request body:

```json
{ "topic": "javascript", "difficulty": "easy" }
```

Response:

```json
{ "questions": ["What is a closure in JavaScript?"] }
```

## MCP Tool Schema

Available at `GET /mcp/schema` and in `mcp/mcp-schema.json`.

# exam-prep-mcp