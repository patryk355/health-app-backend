import express from 'express';
import {
  getRecipes,
  getRecipe,
  createRecipe,
  deleteRecipe,
  updateRecipe
} from '../controllers/recipe.controller';
import checkAuth from '../middleware/check-auth';

const router = express.Router();

router.get('/', getRecipes);
router.get('/:id', getRecipe);
router.use((req, res, next) => {
  checkAuth(req, res, next);
});
router.post('/', createRecipe);
router.use((req, res, next) => {
  checkAuth(req, res, next, true);
});
router.put('/:id', updateRecipe);
router.delete('/:id', deleteRecipe);

export default router;
