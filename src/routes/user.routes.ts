import express from 'express';
import {getLoggedUser, getUser, createUser, deleteUser} from '../controllers/user.controller';
import checkAuth from '../middleware/check-auth';

const router = express.Router();

router.post('/', createUser);
router.use(checkAuth);
router.get('/me', getLoggedUser);
router.get('/:id', getUser);
router.delete('/:id', deleteUser);

export default router;
