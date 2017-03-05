import * as express from 'express';
import { drugModel } from '../../../models/Drug';
import { DBERR } from './index';
const router = express.Router();

router.get('/', (req, res) => {
  res.send('metadata about DB');
});

router.get('/count', async (req, res) => {
  try {
    const count = await drugModel.count({});
    res.status(200).json({ count });
  } catch (err) {
    res.status(503).json(DBERR);
  }
});

export { router }
