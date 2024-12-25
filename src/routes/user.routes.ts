import express from 'express';
import {getLoggedUser, getUser, getUsers, createUser, deleteUser, updateUser} from '../controllers/user.controller';
import checkAuth from '../middleware/check-auth';

const router = express.Router();

router.post('/', createUser);
router.use(checkAuth);
router.get('/me', getLoggedUser);
router.put('/:id', updateUser);
router.use((req, res, next) => {
  checkAuth(req, res, next, true);
});
router.get('/', getUsers);
router.get('/:id', getUser);
router.delete('/:id', deleteUser);

export default router;
