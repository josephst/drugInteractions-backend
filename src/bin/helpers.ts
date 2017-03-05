import { IDrug, IDrugDoc } from '../models/interfaces/IDrugDoc.d';
import { IDrugInteraction } from '../models/interfaces/IDrugInteractionDoc';

export function stripDrugDoc(drug: IDrugDoc): IDrug {
  const interactions: IDrugInteraction[] = [];
  drug.interactions.forEach((interaction) => {
    const { description, targetId, targetName } = interaction;
    interactions.push({ description, targetId, targetName });
  });
  return ({
    description: drug.description,
    drugbankId: drug.drugbankId,
    interactions,
    name: drug.name,
  });
}
