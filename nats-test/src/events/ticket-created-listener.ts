import { Listener } from './base-listener';
import { Message } from 'node-nats-streaming';

export class TicketCreatedListener extends Listener {
  subject = 'ticket:created';
  queueGroupName = 'payments-service';

  onMessage(data: any, msg: Message) {
    console.log(`event data !`, data);
    // we manually acknowledge the event, telling nats not to re-emit the event anymore
    msg.ack();
  }
}
