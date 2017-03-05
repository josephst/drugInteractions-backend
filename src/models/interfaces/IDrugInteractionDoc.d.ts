import * as mongoose from 'mongoose';

export interface IDrugInteraction {
  description: string;
  targetId: string;
  targetName: string;
}

export interface IDrugInteractionDoc extends mongoose.Document, IDrugInteraction {}
