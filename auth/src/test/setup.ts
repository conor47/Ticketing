import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import { app } from '../app';

let mongo: any;
// Hook function that runs before all of our tests
beforeAll(async () => {
  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri);
});

// Hook function that runs before each
beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

// Hook function that runs after all tests
afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});
