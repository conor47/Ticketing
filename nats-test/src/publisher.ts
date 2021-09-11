import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

// we create a client. A client is what will connect to our nats-streaming server and exchange information with it

console.clear();

const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222',
});

// when the client successfully connects to the nat streaming server a connect event is emitted. We listen for this and then perform some action

stan.on('connect', async () => {
  console.log('Publisher connected to nats');

  const publisher = new TicketCreatedPublisher(stan);
  try {
    await publisher.publish({
      id: '123',
      title: 'concert',
      price: 20,
    });
  } catch (error) {
    console.log(error);
  }
});

// Publish takes three arguements. First is the channel name to which the event is posted. Second is the data/message being posted.
// Optional third is a callback function, executed when the event is published
