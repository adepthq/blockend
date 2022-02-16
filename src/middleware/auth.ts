import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Auth } from '../config';

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['x-access-token'] as string;

  if (!token) {
    res.status(401).send({ auth: false, message: 'No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, Auth.secret);
    req.user = decoded;
  } catch (error) {
    res.status(401).send({ auth: false, message: 'Failed to authenticate token.' });
  }

  return next();
};

export default verifyToken;
