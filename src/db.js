const mongoose = require('mongoose');
let memoryServerInstance = null;

/**
 * Establish a connection to MongoDB using Mongoose.
 * @param {string} mongoUri - The MongoDB connection string. Use 'memory' to start an in-memory server.
 */
async function connectToDatabase(mongoUri) {
  if (!mongoUri) {
    throw new Error('MONGODB_URI is not set');
  }

  mongoose.set('strictQuery', true);

  if (mongoUri === 'memory') {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    memoryServerInstance = await MongoMemoryServer.create();
    const memoryUri = memoryServerInstance.getUri('mcp_questions');
    await mongoose.connect(memoryUri, {});
  } else {
    await mongoose.connect(mongoUri, {
      // Use defaults; allow URI to specify db name
    });
  }

  return mongoose.connection;
}

async function disconnectFromDatabase() {
  await mongoose.connection.close();
  if (memoryServerInstance) {
    await memoryServerInstance.stop();
    memoryServerInstance = null;
  }
}

module.exports = { connectToDatabase, disconnectFromDatabase };

