import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';
import jwt from 'jsonwebtoken';

declare global {
  var signin: () => string[];
}

let mongo: any;
// Hook function that runs before all of our tests
beforeAll(async () => {
  // this may not be the best approach but we must set our environment variables when testing
  process.env.JWT_KEY = 'asdasfkn';
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri);
});

// Hook function that runs before each test`
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

// globally scoped function. Only globally scoped in the test environment. We must use a different method than used in the auth service.
// Since we do not want to make cross service requests when in a testing environment we need to create our own cookie
global.signin = () => {
  // Build a JWT payload

  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
  };

  // Create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build a session Object {jwt : my_jwt}
  const session = { jwt: token };

  // Turn session in JSON
  const sessionJson = JSON.stringify(session);

  // Encode JSON as Base64
  const base64 = Buffer.from(sessionJson).toString('base64');

  // Return a string thats a cookie with encoded data
  return [`express:sess=${base64}`];
};
