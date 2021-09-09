import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('returns a 404 if provided id does not exists', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({ title: 'sdfsd', price: 20 })
    .expect(404);
});

it('returns a 401 if user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .send({ title: 'sdfsd', price: 20 })
    .expect(401);
});

it('returns a 401 if the user does not own the ticket', async () => {});

it('returns a 400 if the user provides an invalid title or price', async () => {});

it('updates the ticket when given valid inputs', async () => {});
