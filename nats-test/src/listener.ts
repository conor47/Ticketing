import nats, { Message, Stan, StanOptions } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

console.clear();

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('Listener connected to nats');

  //   a method to gracefully shutdown a client and its connection to nats streaming server
  stan.on('close', () => {
    console.log('nats connection closed');
    process.exit();
  });

  //   queue groups can be created inside a topic to prevent event duplication among replica services. Nats will choose just one member of
  //   the group to send the event to.

  //   we must build an options object and pass it in to the subscription. Setting manual acknowledgement mode to true allows us to
  //   manually verify that work has been carried out successfully. If some failure occurs we may want to receive the event again to
  // re process it

  new TicketCreatedListener(stan).listen();
});

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());

abstract class Listener {
  abstract subject: string;
  abstract queueGroupName: string;
  abstract onMessage(data: any, msg: Message): void;
  private client: Stan;
  protected ackWait = 5 * 1000;

  constructor(client: Stan) {
    this.client = client;
  }

  subscriptionOptions() {
    return (
      this.client
        .subscriptionOptions()
        // allows us to re-deliver all messages to a listener
        .setDeliverAllAvailable()
        .setManualAckMode(true)
        .setAckWait(this.ackWait)
        .setDurableName(this.queueGroupName)
      // when we create a durable subscription nats will keep track of any durable subscriptions in a channel. It will track which events each
      // durable subscription has processed. Nats will track events that haven't been processed by each durable subscription, meaning say
      // a service comes back online nats knows to re-send any missed events
    );
  }

  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    );

    subscription.on('message', (msg: Message) => {
      console.log(`Message received ${this.subject} / ${this.queueGroupName}`);

      const parsedData = this.parseMessage(msg);
      this.onMessage(parsedData, msg);
    });
  }

  parseMessage(msg: Message) {
    const data = msg.getData();
    return typeof data === 'string'
      ? JSON.parse(data)
      : JSON.parse(data.toString('utf8'));
  }
}

class TicketCreatedListener extends Listener {
  subject = 'ticket:created';
  queueGroupName = 'payments-service';

  onMessage(data: any, msg: Message) {
    console.log(`event data !`, data);
    // we manually acknowledge the event, telling nats not to re-emit the event anymore
    msg.ack();
  }
}
