import { ObjectId } from 'mongodb';

export type User = {
  _id?: ObjectId;
  name: string;
  walletAddress: string;
  email: string;
  password: string;
  token?: string;
  createdAt: Date;
  updatedAt: Date;
};
