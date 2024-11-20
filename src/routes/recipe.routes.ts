import express from 'express';
import {
  getRecipes,
  createRecipe,
  deleteRecipe
} from '../controllers/recipe.controller';
import checkAuth from '../middleware/check-auth';

const router = express.Router();

router.get('/', getRecipes);
router.use((req, res, next) => {
  checkAuth(req, res, next, true);
});
router.post('/', createRecipe);
router.delete('/:id', deleteRecipe);

export default router;
