import mongoose from 'mongoose';
import { OrderCreatedEvent } from '@clmicrotix/common';
import { OrderStatus } from '@clmicrotix/common';
import { Message } from 'node-nats-streaming';

import { OrderCreatedListener } from '../order-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../../models/ticket';

const setup = async () => {
  // create an instance of the listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  //   create and save a ticket
  const ticket = await Ticket.build({
    title: 'concert',
    price: 99,
    userId: 'kajebrsjs',
  });
  await ticket.save();

  //   create fake data object
  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: 'asdasd',
    expiresAt: 'afadfad',
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  //   create fake message object

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, msg };
};

it('sets the orderId of the ticket', async () => {
  const { ticket, listener, msg, data } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).toEqual(data.id);
});

it('acknowledges the message', async () => {
  const { ticket, listener, msg, data } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
