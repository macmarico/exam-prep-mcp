const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { connectToDatabase, disconnectFromDatabase } = require('../src/db');
const Question = require('../src/models/Question');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

async function seed() {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI must be set in environment');
  }
  await connectToDatabase(MONGODB_URI);

  const sampleQuestions = require('../src/sampleQuestions');

  await Question.deleteMany({});
  await Question.insertMany(sampleQuestions);

  // eslint-disable-next-line no-console
  console.log('Seeded sample questions.');
  await disconnectFromDatabase();
}

seed().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Seeding failed:', error);
  process.exit(1);
});

