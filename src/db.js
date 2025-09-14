const mongoose = require('mongoose');

/**
 * Establish a connection to MongoDB using Mongoose.
 * @param {string} mongoUri - The MongoDB connection string.
 */
async function connectToDatabase(mongoUri) {
  if (!mongoUri) {
    throw new Error('MONGODB_URI is not set');
  }

  mongoose.set('strictQuery', true);

  await mongoose.connect(mongoUri, {
    // Use defaults; allow URI to specify db name
  });

  return mongoose.connection;
}

async function disconnectFromDatabase() {
  await mongoose.connection.close();
}

module.exports = { connectToDatabase, disconnectFromDatabase };

