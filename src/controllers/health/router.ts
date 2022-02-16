import express, { Response, Request } from 'express';

const router = express.Router();

router.use('/:route', (req: Request, res: Response) => {
  let { route } = req.params;
  console.log(`[${req.method}] ${route}`);

  if (route === '') {
    route = 'index';
  }

  // eslint-disable-next-line global-require
  const controller = require(`./${route}`);

  if (!controller) {
    console.error(`404 Not Found on route /v1/3pl/${route}`);
    return res.status(404).json({
      message: `not found`,
    });
  }

  return controller(req, res);
});

export default router;
