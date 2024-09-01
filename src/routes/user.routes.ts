import express from 'express';
import {getUser} from '../controllers/user.controller';
import checkAuth from '../middleware/check-auth';

const router = express.Router();

router.use(checkAuth);
router.get('/:id', getUser);

export default router;
