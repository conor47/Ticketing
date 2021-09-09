import nats from 'node-nats-streaming';

// we create a client. A client is what will connect to our nats-streaming server and exchange information with it

const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222',
});

// when the client successfully connects to the nat streaming server a connect event is emitted. We listen for this and then perform some action

stan.on('connect', () => {
  console.log('Publisher connected to nats');

  //   when sending data to nats streaming server we must send a string, we cannot send a plain javascript object
  const data = JSON.stringify({
    id: '123',
    title: 'concert',
    price: 20,
  });

  // Publish takes three arguements. First is the channel name to which the event is posted. Second is the data/message being posted.
  // Optional third is a callback function, executed when the event is published
  stan.publish('ticket:created', data, () => {
    console.log('event published');
  });
});
