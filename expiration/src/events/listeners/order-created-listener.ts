import { Listener } from '@clmicrotix/common';
import { OrderCreatedEvent } from '@clmicrotix/common';
import { Subjects } from '@clmicrotix/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;

  queueGroupName = queueGroupName;

  onMessage(data: OrderCreatedEvent['data'], msg: Message) {}
}
