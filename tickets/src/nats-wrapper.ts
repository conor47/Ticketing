import nats, { Stan } from 'node-nats-streaming';

// wrapper class for initialsing Nats client similar to mongoose
class NatsWrapper {
  private _client?: Stan;

  // cluster id is defined in the nats depl file. It's passed as an arguement to the nats container
  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, { url });

    return new Promise<void>((resolve, reject) => {
      this._client!.on('connect', () => {
        console.log('Connected to NATS');
        resolve();
      });
      this._client!.on('error', (err) => {
        reject(err);
      });
    });
  }
}

export const natsWrapper = new NatsWrapper();
