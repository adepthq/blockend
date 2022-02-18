import { MongoClient } from 'mongodb';
import { Database } from '../config';
import Logger from './logger';

let client: MongoClient | null = null;

const connect = async (): Promise<MongoClient> => {
  if (client) {
    await client.close();
  }

  const { connstr } = Database;
  Logger.info(`Connecting to MongoDB: ${connstr}`);
  client = new MongoClient(connstr);

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
