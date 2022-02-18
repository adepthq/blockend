import { Request, Response } from 'express';
import moment from 'moment';
import Logger from '../../lib/logger';

const ServerHealthCheck = async (_: Request, res: Response) => {
  Logger.info('GraphQL');

  return res.status(200).json({
    dt: moment(),
    message: 'pong',
    version: '1.0.0',
  });
};

export = ServerHealthCheck;
