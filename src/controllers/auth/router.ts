import express, { Response, Request } from 'express';
import Logger from '../../lib/logger';

const router = express.Router();

router.use('/:route', (req: Request, res: Response) => {
  const { route } = req.params;
  Logger.info(`[${req.method}] ${route}`);

  // eslint-disable-next-line global-require
  const controller = require(`./${route}`);

  if (!controller) {
    Logger.error(`404 Not Found on route /v1/3pl/${route}`);
    return res.status(404).json({
      message: `not found`,
    });
  }

  return controller(req, res);
});

export default router;
