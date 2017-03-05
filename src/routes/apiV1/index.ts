import * as express from 'express';
import { router as drugAPI } from './drugs/index';
const router = express.Router();

router.get('/', (req, res, next) => {
  res.send('drug api');
});

router.use('/drugs', drugAPI);

export { router }
