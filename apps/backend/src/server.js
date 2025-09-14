const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectToDatabase } = require('./db');
const Question = require('./models/Question');
const sampleQuestions = require('./sampleQuestions');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mcp_questions';
const AUTO_SEED = String(process.env.AUTO_SEED || 'false').toLowerCase() === 'true';

// Connect to MongoDB
connectToDatabase(MONGODB_URI)
  .then(async () => {
    // eslint-disable-next-line no-console
    console.log('Connected to MongoDB');
    if (AUTO_SEED) {
      const count = await Question.countDocuments();
      if (count === 0) {
        await Question.insertMany(sampleQuestions);
        // eslint-disable-next-line no-console
        console.log('Seeded sample questions on startup');
      }
    }
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  });

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Serve MCP schema for discovery
// Note: keep the JSON colocated under /mcp and serve it here.
let mcpSchema;
try {
  // eslint-disable-next-line import/no-dynamic-require, global-require
  mcpSchema = require('../../mcp/mcp-schema.json');
} catch (_e) {
  mcpSchema = { tools: [] };
}

app.get('/mcp/schema', (_req, res) => {
  res.json(mcpSchema);
});

// The required tool endpoint: /question.fetch
// Accepts: { topic: string, difficulty: 'easy'|'medium'|'hard' }
// Returns: { questions: string[] }
app.post('/question.fetch', async (req, res) => {
  try {
    const { topic, difficulty } = req.body || {};

    if (!topic || !difficulty) {
      return res.status(400).json({ error: 'topic and difficulty are required', questions: [] });
    }

    const normalizedDifficulty = String(difficulty).toLowerCase();
    const allowedDifficulties = ['easy', 'medium', 'hard'];
    if (!allowedDifficulties.includes(normalizedDifficulty)) {
      return res
        .status(400)
        .json({ error: 'difficulty must be one of easy, medium, hard', questions: [] });
    }

    const normalizedTopic = String(topic).trim();

    const results = await Question.find({
      topic: normalizedTopic,
      difficulty: normalizedDifficulty,
    })
      .select('text -_id')
      .lean();

    const questions = results.map((q) => q.text);
    return res.json({ questions });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to fetch questions:', error);
    return res.status(500).json({ error: 'Internal server error', questions: [] });
  }
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on port ${PORT}`);
});

