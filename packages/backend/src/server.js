import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { MongoClient } from 'mongodb';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/monorepo_db';

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

let dbClient;

async function connectToDatabase() {
  if (dbClient) return dbClient;
  dbClient = new MongoClient(mongoUri, { ignoreUndefined: true });
  await dbClient.connect();
  return dbClient;
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/items', async (req, res) => {
  try {
    const client = await connectToDatabase();
    const db = client.db();
    const items = await db.collection('items').find({}).toArray();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/items', async (req, res) => {
  try {
    const client = await connectToDatabase();
    const db = client.db();
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'name is required' });
    const result = await db.collection('items').insertOne({ name, createdAt: new Date() });
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

process.on('SIGINT', async () => {
  if (dbClient) await dbClient.close();
  process.exit(0);
});

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});

