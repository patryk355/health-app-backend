import express from 'express';
import {getProducts, getProduct, createProduct, updateProduct, deleteProduct} from '../controllers/product.controller';
import checkAuth from '../middleware/check-auth';

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProduct);
router.use((req, res, next) => {
  checkAuth(req, res, next, true);
});
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;
