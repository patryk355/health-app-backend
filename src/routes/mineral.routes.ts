import express from 'express';
import {getMinerals} from '../controllers/mineral.controller';

const router = express.Router();

router.get('/', getMinerals);

export default router;
