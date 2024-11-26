import {Recipe} from '../types/recipe';

export const validateCreateRecipe = (recipe: Recipe) => {
  const errors: string[] = [];

  if (!recipe?.name) {
    errors.push('Name is required.');
  }

  if (!recipe?.ingredients) {
    errors.push('Ingredients are required.');
  } else {
    if (!Array.isArray(recipe.ingredients)) {
      errors.push('Ingredients should be an array.');
    } else {
      if (recipe.ingredients.some((ingredient) => typeof ingredient !== 'string')) {
        errors.push('Ingredients should be an array of strings.');
      }
    }
  }

  if (!recipe?.steps) {
    errors.push('Steps are required.');
  } else {
    if (!Array.isArray(recipe.steps)) {
      errors.push('Steps should be an array.');
    } else {
      if (recipe.steps.some((step) => typeof step !== 'string')) {
        errors.push('Steps should be an array of strings.');
      }
    }
  }

  if (!recipe?.images) {
    errors.push('Images are required.');
  } else {
    if (!Array.isArray(recipe.images)) {
      errors.push('Images should be an array.');
    } else {
      if (recipe.images.some((image) => typeof image !== 'string')) {
        errors.push('Images should be an array of strings.');
      }
    }
  }

  return errors;
};
