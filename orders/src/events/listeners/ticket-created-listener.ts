import { Message } from 'node-nats-streaming';

import { Subjects, Listener, TicketCreatedEvent } from '@clmicrotix/common';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queueGroupName';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  //   queue groups are groups in a nats channel which allow for nats to send an event to only one of the subscribed services. Prevents
  //  event duplication. The queue group name must be unique within the channel as must not change
  queueGroupName = queueGroupName;

  //   message contains some underlying information about the data being sent from nats streaming server. Importantly contains the ack method
  // for acknowledging that an event has been handled so nats does no re-transmit the event
  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    //   the logic we want to perform here is to save a copy of the ticket to our local tickets collection. This is a typical example
    // of cross service data duplication. We can now retrieve ticket information locally instead of having to make a cross-service request
    const { title, price, id } = data;
    const ticket = Ticket.build({
      // we require the id so that we can locate and identify specific tickets in the future. If we allow mongo to automatically create the id
      // the ids will not match.
      id,
      title,
      price,
    });
    await ticket.save();
    msg.ack();
  }
}
