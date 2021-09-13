import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';

it('returns an error if the ticket does not exist', async () => {
  const ticketId = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId })
    .expect(404);
});

it('returns an error if the ticket is already reserved', async () => {
  // we first must create a ticket and save to the database
  const ticket = Ticket.build({
    title: 'concert',
    price: 10,
  });
  await ticket.save();

  // we then have to place and order on that ticket
  const order = Order.build({
    ticket,
    userId: 'aeqcnkas',
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });
  await order.save();

  //   we can now make a request for that ticket which as been reserved
  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it('reserves a ticket', async () => {});
