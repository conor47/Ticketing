import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';

declare global {
  var signin: () => Promise<string[]>;
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

// globally scoped function. Only globally scoped in the test environment. Performs a signin and returns a cookie
global.signin = async () => {
  const email = 'test@test.com';
  const password = 'password';

  const reponse = await request(app)
    .post('/api/users/signup')
    .send({ email, password })
    .expect(201);

  const cookie = reponse.get('Set-Cookie');
  return cookie;
};
