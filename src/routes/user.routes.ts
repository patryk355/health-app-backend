import express from 'express';
import {getLoggedUser, getUser} from '../controllers/user.controller';
import checkAuth from '../middleware/check-auth';

const router = express.Router();

router.use(checkAuth);
router.get('/me', getLoggedUser);
router.get('/:id', getUser);

export default router;
