import moment from 'moment';
import { Collection } from 'mongodb';
import jwt from 'jsonwebtoken';
import { User } from 'models/user';
import mongoclient from '../lib/mongoclient';
import { Auth } from '../config';

const getDBCollection = async (): Promise<Collection> => {
  const client = await mongoclient.connect();
  const db = client.db('blockheads');
  const collection = db.collection('users');

  return collection;
};

const findUserByWalletAddress = async (walletAddress: string): Promise<User | null> => {
  try {
    const collection = await getDBCollection();

    const user = (await collection.findOne({ walletAddress })) as User;

    return user;
  } catch (error) {
    console.log(error);
    return null;
  } finally {
    mongoclient.disconnect();
  }
};

const createUser = async (user: User): Promise<User> => {
  const collection = await getDBCollection();

  const newUser = await collection.insertOne(user);

  return {
    ...user,
    _id: newUser.insertedId,
  };
};

const generateToken = (user: User): string => {
  const token = jwt.sign(
    {
      // eslint-disable-next-line no-underscore-dangle
      id: user._id,
      walletAddress: user.walletAddress,
    },
    Auth.secret,
    {
      expiresIn: Auth.expiresIn,
    }
  );

  return token;
};

const authenticate = async (walletAddress: string): Promise<User | null> => {
  // Find user by wallet address
  let user = await findUserByWalletAddress(walletAddress);

  if (!user) {
    // Create user
    user = await createUser({
      name: '',
      walletAddress,
      email: '',
      password: '',
      createdAt: moment().toDate(),
      updatedAt: moment().toDate(),
    });
  }

  // Generate token
  const token = generateToken(user);

  return {
    ...user,
    token,
  };
};

export default {
  authenticate,
};
