import * as express from 'express';
import { router as api } from './apiV1/index';
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

router.use('/apiV1', api);

export { router }
