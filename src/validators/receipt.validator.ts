import {Receipt} from '../types/receipt';

export const validateCreateReceipt = (receipt: Receipt) => {
  const errors: string[] = [];

  if (!receipt?.name) {
    errors.push('Name is required.');
  }

  if (!receipt?.ingredients) {
    errors.push('Ingredients are required.');
  } else {
    if (!Array.isArray(receipt.ingredients)) {
      errors.push('Ingredients should be an array.');
    } else {
      if (receipt.ingredients.some((ingredient) => typeof ingredient !== 'string')) {
        errors.push('Ingredients should be an array of strings.');
      }
    }
  }

  if (!receipt?.steps) {
    errors.push('Steps are required.');
  } else {
    if (!Array.isArray(receipt.steps)) {
      errors.push('Steps should be an array.');
    } else {
      if (receipt.steps.some((step) => typeof step !== 'string')) {
        errors.push('Steps should be an array of strings.');
      }
    }
  }

  return errors;
};
