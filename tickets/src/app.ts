// The purpose of this file is for configuring our express server. The server is not started herer

import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import { NotFoundError, errorHandler, currentUser } from '@clmicrotix/common';
import { createTicketRouter } from './routes/new';
import { showTicketRouter } from './routes/show';
import { indexTicketRouter } from './routes';

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
    secure: process.env.NODE_ENV !== 'test',
  })
);
app.use(currentUser);

app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
