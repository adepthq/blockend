import { Request, Response } from 'express';
import moment from 'moment';

const ServerHealthCheck = async (_: Request, res: Response) => {
  console.log('Server Health Check');

  return res.status(200).json({
    dt: moment(),
    message: 'pong',
    version: '1.0.0',
  });
};

export = ServerHealthCheck;
