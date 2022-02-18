import express, { Response, Request } from 'express';
import expressPlayGround from 'graphql-playground-middleware-express';

const router = express.Router();

router.post('/', (req: Request, res: Response) => {
  // eslint-disable-next-line global-require
  const controller = require(`./index`);

  return controller(req, res);
});

router.get('/playground', expressPlayGround({ endpoint: '/v1/graphql' }));

export default router;
