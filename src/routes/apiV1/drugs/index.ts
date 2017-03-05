import * as express from 'express';
import { stripDrugDoc } from '../../../bin/helpers';
import { drugModel } from '../../../models/Drug';
import { IDrug, IDrugDoc } from '../../../models/interfaces/IDrugDoc.d';
import { router as idRoute } from './id';
import { router as metaRoute } from './meta';
import { router as nameRoute } from './name';
const router = express.Router();

export const DBERR = {
  error: {
    code: 'DBERR',
    message: 'Error while using Drug model',
  },
};

router.get('/', (req, res) => {
  res.send('JSON API for drug interactions');
});

/**
 * Delete all Drugs in DB
 */
router.delete('/', async (req, res) => {
  try {
    await drugModel.remove({});
    res.status(204).send();
  } catch (err) {
    res.status(503).send();
  }
});

/**
 * Add Drug to DB. Idempotent; will not allow adding same Drug (by Drugbank ID) twice.
 */
router.post('/', async (req, res) => {
  try {
    const drug = new drugModel(req.body);
    const drugbankId = drug.drugbankId;
    const existing = await drugModel.findOne({ drugbankId });
    if (existing) {
      res.status(409).json({
        error: {
          code: 'EXISTS',
          message: `Entry with Drugbank ID ${drugbankId} already exists`,
        },
      });
    } else {
      try {
        const result = await drug.save();
        res.status(201).json(stripDrugDoc(result));
      } catch (saveErr) {
        res.status(503).json({
          error: {
            code: 'SAVEERR',
            message: 'Could not save',
          },
        });
      }
    }
  } catch (err) {
    res.status(503).json(DBERR);
  }
});

router.use('/id', idRoute);
router.use('/name', nameRoute);
router.use('/meta', metaRoute);

export { router }
