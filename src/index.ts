import express, { Request, Response } from 'express';
// Routes
import health from './controllers/health/router';

const app = express();

app.get('/', (_: Request, res: Response): void => {
  res.json({ message: 'Hello World' });
});

app.use('/v1/health', health);

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
