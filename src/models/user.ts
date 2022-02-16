import { ObjectId } from 'mongodb';

export type User = {
  _id?: ObjectId;
  name: string;
  walletAddress: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};
