import { Request, Response } from 'express';
import AuthService from '../../services/authentication';
import Logger from '../../lib/logger';

type LoginArgs = {
  walletAddress: string;
};

const LoginController = async (req: Request, res: Response) => {
  Logger.info('LoginController');
  const params: LoginArgs = req.body.input;

  const user = await AuthService.authenticate(params.walletAddress);

  if (!user) {
    return res.status(401).send({ auth: false, message: 'No user found.' });
  }

  return res.status(200).json({
    ...user,
  });
};

export = LoginController;
