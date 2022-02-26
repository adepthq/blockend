export type User = {
  _id?: number;
  name: string;
  walletAddress: string;
  email: string;
  password: string;
  token?: string;
  createdAt: Date;
  updatedAt: Date;
};
