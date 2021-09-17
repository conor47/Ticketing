// The purpose of this file is for configuring our express server. The server is not started herer

import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { NotFoundError, errorHandler } from '@clmicrotix/common';

const app = express();
// traffic is being proxied to our application through ingress-nginx. Express by default will not trust this proxy so we must explicitly
// tell it to
app.set('trust proxy', true);
app.use(json());
// bringing cookie session middleware into use
app.use(
  cookieSession({
    signed: false,
    // when jest runs tests it sets the NODE_ENV environment variable to test. We do this check as we want to be able to make
    // http requests as opposed to http requests when testing
    secure: false,
  })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
