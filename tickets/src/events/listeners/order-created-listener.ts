import { Listener, OrderCreatedEvent, Subjects } from '@clmicrotix/common';
import { Message } from 'node-nats-streaming';

import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';
import { Ticket } from '../../../models/ticket';
import { queueGroupName } from './queue-group-name';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;

  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    //   find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);
    // if no ticket throw error
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    // mark the ticket as reserved by setting orderid property
    ticket.set({ orderId: data.id });

    // save the ticket
    await ticket.save();
    // publish a ticket updated event. The access modifier on the listener base class has been changed from private to protected meaning it
    // can be accessed directly in sub classes
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      orderId: ticket.orderId,
      version: ticket.version,
    });
    // acknowledge the message
    msg.ack();
  }
}
