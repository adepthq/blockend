import { MongoClient } from 'mongodb';
import { Database } from '../config';

let client: MongoClient | null = null;

const connect = async (): Promise<MongoClient> => {
  if (client) {
    await client.close();
  }

  const { username, password, host, port } = Database;

  const uri = `mongodb://${username}:${password}@${host}:${port}/`;
  client = new MongoClient(uri);

  return client.connect();
};

const disconnect = async (): Promise<void> => {
  if (client) {
    client.close();
  }
};

export default {
  connect,
  disconnect,
};
