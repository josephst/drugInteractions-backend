import mongoose = require('mongoose');
mongoose.Promise = global.Promise;

import { drugInteractionSchema } from './DrugInteraction';
import { IDrugDoc } from './interfaces/IDrugDoc';

export const drugSchema = new mongoose.Schema({
  description: {
    type: String,
  },
  drugbankId: {
    required: true,
    type: String,
  },
  interactions: {
    type: [drugInteractionSchema],
  },
  name: {
    required: true,
    type: String,
  },
}, {
  bufferCommands: false,
});

export const drugModel = mongoose.model<IDrugDoc>('Drug', drugSchema);
