import * as express from 'express';
import { drugModel } from '../../../models/Drug';
import { IDrug, IDrugDoc } from '../../../models/interfaces/IDrugDoc.d';
import { DBERR } from './index';
const router = express.Router();

router.get('/', (req, res, next) => {
  res.send('JSON API for drug interactions by Drugbank name');
});

router.get('/search/:name', async (req, res) => {
  try {
    const search = await drugModel.find({ name: { $regex: new RegExp(`^${req.params.name}`, 'i') } });
    if (search.length < 1) {
      // nothing found
      res.status(404).json({
        error: {
          code: 'MISSING',
          message: 'Could not find Drug with provided name',
          target: 'name',
        },
      });
    } else {
      const nameIdTuples = search.map((drug) => ({ drugbankId: drug.drugbankId, name: drug.name }));
      res.status(200).json(nameIdTuples);
    }
  } catch (err) {
    res.status(503).json(DBERR);
  }
});

export { router }
