import express from 'express';
import {
  getRecipes,
  getRecipe,
  getRandomRecipe,
  createRecipe,
  deleteRecipe,
  updateRecipe
} from '../controllers/recipe.controller';
import checkAuth from '../middleware/check-auth';

const router = express.Router();

router.get('/', getRecipes);
router.get('/random', getRandomRecipe);
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
