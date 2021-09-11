import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { TicketCreatedListener } from './events/ticket-created-listener';

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
