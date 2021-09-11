import nats, { Stan } from 'node-nats-streaming';

// wrapper class for initialsing Nats client similar to mongoose
class NatsWrapper {
  private _client?: Stan;

  get client() {
    if (!this._client) {
      throw new Error('Cannot access nats client before connecting');
    }
    return this._client;
  }

  // cluster id is defined in the nats depl file. It's passed as an arguement to the nats container
  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, { url });
    // logic for exiting our nats process
    natsWrapper.client.on('close', () => {
      console.log('NATS connection was closed');
      process.exit();
    });
    process.on('SIGTERM', () => natsWrapper.client.close());
    process.on('SIGINT', () => natsWrapper.client.close());

    return new Promise<void>((resolve, reject) => {
      this.client.on('connect', () => {
        console.log('Connected to NATS');
        resolve();
      });
      this.client.on('error', (err) => {
        reject(err);
      });
    });
  }
}

export const natsWrapper = new NatsWrapper();
