import Queue from 'bull';

interface Payload {
  orderId: string;
}

// here we are creating our queue. We specify a queue name and pass some options
const expirationQueue = new Queue<Payload>('order:expiration', {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

// processing functions for jobs in the queue
expirationQueue.process(async (job) => {
  console.log(
    'I want to publish an expiration complete event for orderId:',
    job.data.orderId
  );
});

export { expirationQueue };
