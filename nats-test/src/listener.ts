import nats, { Message } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

console.clear();

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('Listener connected to nats');

  //   queue groups can be created inside a topic to prevent event duplication among replica services. Nats will choose just one member of
  //   the group to send the event to.

  //   we must build an options object and pass it in to the subscription. Setting manual acknowledgement mode to true allows us to
  //   manually verify that work has been carried out successfully. If some failure occurs we may want to receive the event again to re-process
  // it
  const options = stan.subscriptionOptions().setManualAckMode(true);
  const subscription = stan.subscribe(
    'ticket:created',
    'orders-service-queue-group',
    options
  );

  subscription.on('message', (msg: Message) => {
    const data = msg.getData();

    if (typeof data === 'string') {
      console.log(`received event #${msg.getSequence()}, with data ${data}`);
    }

    // we manually acknowledge the event, telling nats not to re-emit the event anymore
    msg.ack();
  });
});
