import { Listener } from './base-listener';
import { Message } from 'node-nats-streaming';
import { TicketCreatedEvent } from './ticket-created-event';
import { Subjects } from './subjects';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = 'payments-service';

  onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    console.log(`event data !`, data);
    // we manually acknowledge the event, telling nats not to re-emit the event anymore
    console.log(data.id);
    console.log(data.title);
    console.log(data.price);

    msg.ack();
  }
}
