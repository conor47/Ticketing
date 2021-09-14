import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';

import { TicketCreatedListener } from '../ticket-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { TicketCreatedEvent } from '@clmicrotix/common';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  // create an instance of the listener
  const listener = new TicketCreatedListener(natsWrapper.client);

  //   creat a fake data object
  const data: TicketCreatedEvent['data'] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // create a fake message object
  // @ts-ignore
  const message: Message = {
    ack: jest.fn(),
  };

  return {
    listener,
    data,
    message,
  };
};

it('creates and saves a ticket', async () => {
  const { listener, data, message } = await setup();

  // call the onMessage function with the data object and message object
  await listener.onMessage(data, message);
  // make assertions

  const ticket = await Ticket.findById(data.id);
  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});

it('acknowledges the message', async () => {
  const { data, listener, message } = await setup();
  // call the onMessage function with the data object and message object
  await listener.onMessage(data, message);
  // make assertions
  expect(message.ack).toHaveBeenCalled();
});
