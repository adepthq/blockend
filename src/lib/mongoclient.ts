import { MongoClient } from 'mongodb';
import { Database } from '../config';

const connect = async (): Promise<MongoClient> => {
  const { username, password, host, port, database } = Database;

  const uri = `mongodb://${username}:${password}@${host}:${port}/${database}`;
  const client = new MongoClient(uri);

  return client.connect();
};

const disconnect = async (client: MongoClient): Promise<void> => {
  return client.close();
};

export default {
  connect,
  disconnect,
};
