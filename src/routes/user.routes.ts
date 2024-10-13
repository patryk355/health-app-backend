import express from 'express';
import {getLoggedUser, getUser, deleteUser} from '../controllers/user.controller';
import checkAuth from '../middleware/check-auth';

const router = express.Router();

router.use(checkAuth);
router.get('/me', getLoggedUser);
router.get('/:id', getUser);
router.delete('/:id', deleteUser);

export default router;
