import {getCategory} from '../utils/category';
import {Product} from '../types/product';

export const validateCreateProduct = (product: Product) => {
  const errors: string[] = [];

  if (!product?.name) {
    errors.push('Name is required.');
  }

  if (!product?.description) {
    errors.push('Description is required.');
  }

  if (typeof product?.category_id !== 'number') {
    errors.push('Category_id is invalid.');
  }

  getCategory(product.category_id)
    .then((category) => {
      if (!category) {
        errors.push('Category does not exist.');
      }
    })
    .catch(() => {
      errors.push('Category does not exist.');
    });

  if (!Array.isArray(product.images)) {
    errors.push('Images should be an array.');
  }

  return errors;
};
