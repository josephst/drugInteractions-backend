import * as express from 'express';
const router = express.Router();

router.get('/', (req, res, next) => {
  res.send('JSON API for drug interactions by Drugbank name');
});

export { router }
