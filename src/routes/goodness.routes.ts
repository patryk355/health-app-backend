import express from 'express';
import {getGoodness} from '../controllers/goodness.controller';

const router = express.Router();

router.get('/', getGoodness);

export default router;
