import express from 'express';
import {getReceipts, deleteReceipt} from '../controllers/receipt.controller';
import checkAuth from '../middleware/check-auth';

const router = express.Router();

router.get('/', getReceipts);
router.use((req, res, next) => {
  checkAuth(req, res, next, true);
});
router.delete('/:id', deleteReceipt);

export default router;
