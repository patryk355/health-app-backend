import express from 'express';
import {getReceipts} from '../controllers/receipt.controller';

const router = express.Router();

router.get('/', getReceipts);

export default router;
