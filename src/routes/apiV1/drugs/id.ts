import * as express from 'express';
import { stripDrugDoc } from '../../../bin/helpers';
import { password, username } from '../../../config/config';
import { drugModel } from '../../../models/Drug';
import { IDrug, IDrugDoc } from '../../../models/interfaces/IDrugDoc.d';
import { IDrugInteraction } from '../../../models/interfaces/IDrugInteractionDoc';
import { DBERR } from './index';
const router = express.Router();

router.get('/', (req, res, next) => {
  res.send('JSON API for drug interactions by Drugbank ID');
});

router.get('/:id', async (req, res) => {
  try {
    const drug = await drugModel.findOne({ drugbankId: req.params.id });
    if (!drug) {
      res.status(404).json({
        error: {
          code: 'MISSING',
          message: 'Could not find Drug with DrugbankID',
          target: 'drugbankId',
        },
      });
    } else {
      res.status(200).json(stripDrugDoc(drug));
    }
  } catch (err) {
    res.status(503).json(DBERR);
  }
});

router.delete('/:id', async (req, res) => {
  const { username: reqUsername, password: reqPassword } = req.body;
  if (reqUsername !== username || reqPassword !== password) {
    res.status(403).json({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Not authorized to perform this action',
      },
    });
  } else {
    try {
      const deleted = await drugModel.findOneAndRemove({ drugbankId: req.params.id });
      if (!deleted) {
        res.status(404).json({
          error: {
            code: 'MISSING',
            message: 'Could not find Drug with DrugbankID',
            target: 'drugbankId',
          },
        });
      } else {
        res.status(204).send();
      }
    } catch (err) {
      res.status(503).json(DBERR);
    }
  }
});

export { router }
