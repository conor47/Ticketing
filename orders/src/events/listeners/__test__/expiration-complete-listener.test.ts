import mongoose from 'mongoose';
import { OrderStatus, ExpirationCompleteEvent } from '@clmicrotix/common';
import { Message } from 'node-nats-streaming';

import { ExpirationCompleteListener } from '../expiration-complete-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Order } from '../../../models/order';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    id: new mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();

  const order = Order.build({
    status: OrderStatus.Created,
    userId: 'asdas',
    expiresAt: new Date(),
    ticket,
  });

  await order.save();

  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id,
  };

  //   @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  
  return {listener, ticket, order ,data ,msg}


it('')
