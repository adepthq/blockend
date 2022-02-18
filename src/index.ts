import http from 'http';
import express, { Request, Response } from 'express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import morganMiddleware from './middleware/morganMiddleware';
import Logger from './lib/logger';
import { typeDefs, resolvers } from './controllers/graphql';
// Routes
import health from './controllers/health/router';
import auth from './controllers/auth/router';

async function main() {
  const app = express();

  // Utility middlewares
  app.use(morganMiddleware);

  const httpServer = http.createServer(app);

  app.get('/', (_: Request, res: Response): void => {
    res.json({ message: 'Hello World' });
  });

  app.use('/v1/health', health);
  app.use('/v1/auth', auth);

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    introspection: true,
    context: ({ req }) => ({
      user: req.user,
    }),
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({
    app,
    path: '/v1/graphql',
    cors: {
      origin: 'https://studio.apollographql.com',
      credentials: true,
    },
  });

  /** 404 Handling */
  app.use((_: Request, res: Response) => {
    const error = new Error('not found');

    return res.status(404).json({
      message: error.message,
    });
  });

  httpServer.listen(3001, () => Logger.info(`Server is running on 3001`));
}

main().catch(Logger.error);
