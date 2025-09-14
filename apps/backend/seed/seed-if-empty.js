const dotenv = require('dotenv');
const { connectToDatabase, disconnectFromDatabase } = require('../src/db');
const Question = require('../src/models/Question');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

async function seedIfEmpty() {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI must be set in environment');
  }

  await connectToDatabase(MONGODB_URI);

  const existingCount = await Question.countDocuments();
  if (existingCount > 0) {
    // eslint-disable-next-line no-console
    console.log(`Seed skipped: ${existingCount} questions already present.`);
    await disconnectFromDatabase();
    return;
  }

  const sampleQuestions = require('../src/sampleQuestions');

  await Question.insertMany(sampleQuestions);
  // eslint-disable-next-line no-console
  console.log('Seeded sample questions (collection was empty).');
  await disconnectFromDatabase();
}

seedIfEmpty().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Seed-if-empty failed:', error);
  process.exit(1);
});

