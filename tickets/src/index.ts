// The purpose of this file is to start our express server and form necessary connections eg to Database

import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
  // check to ensure that the necessary environment variables have been set. We perform this check here instead of eg in a route , as
  // these secrets are crtical to the functioning of our application

  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY key must be defined');
  }

  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
    console.log('connecting to DB');
  } catch (error) {
    console.log(error);
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000!!!!!!!!');
  });
};

start();
