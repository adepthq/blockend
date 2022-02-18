import express, { Request, Response } from 'express';
import morganMiddleware from './middleware/morganMiddleware';
import corsMiddleware from './middleware/corsMiddleware';
// Routes
import health from './controllers/health/router';
import auth from './controllers/auth/router';
import graphql from './controllers/graphql/router';

const app = express();

// Utility middlewares
app.use(morganMiddleware);
app.use(corsMiddleware);

app.get('/', (_: Request, res: Response): void => {
  res.json({ message: 'Hello World' });
});

app.use('/v1/health', health);
app.use('/v1/auth', auth);
app.use('/v1/graphql', graphql);

/** 404 Handling */
app.use((_: Request, res: Response) => {
  const error = new Error('not found');

  return res.status(404).json({
    message: error.message,
  });
});

app.listen('3001', () => {
  console.log('Server is running on port 3001');
});
