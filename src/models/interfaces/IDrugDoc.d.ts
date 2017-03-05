import * as mongoose from 'mongoose';
import { IDrugInteraction, IDrugInteractionDoc } from './IDrugInteractionDoc';

export interface IDrug {
  description: string;
  drugbankId: string;
  interactions: IDrugInteraction[];
  name: string;
}

export interface IDrugDoc extends mongoose.Document, IDrug {
  interactions: IDrugInteractionDoc[];
}
