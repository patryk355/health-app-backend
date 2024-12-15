import {Response, Request} from 'express';
import {ResultSetHeader} from 'mysql2';

import pool from '../db';
import {validateCreateRecipe} from '../validators/recipe.validator';
import {getRecipeProducts} from '../utils/recipe';
import {getUserDataFromToken} from '../utils/user';
import {Recipe} from '../types/recipe';

export const getRecipes = async (req: Request, res: Response) => {
  try {
    const {active} = req.query;
    let sql = 'SELECT id, name, description, ingredients, steps, active, created_by FROM `recipes`';
    if (active === 'false') {
      sql = 'SELECT id, name, description, ingredients, steps, active, created_by FROM `recipes` WHERE `active`=0';
    } else if (active === 'true') {
      sql = 'SELECT id, name, description, ingredients, steps, images, active, created_by FROM `recipes` WHERE `active`=1';
    }
    const connection = await pool.getConnection();
    const [result] = await connection.execute<Recipe[]>(sql);
    connection.release();
    const _result = result.map((recipe) => {
      recipe.ingredients = recipe.ingredients ? JSON.parse(recipe.ingredients) : [];
      recipe.steps = recipe.steps ? JSON.parse(recipe.steps) : [];
      recipe.images = recipe.images ? JSON.parse(recipe.images) : [];
      recipe.active = recipe.active === 1;
      return recipe;
    });
    res.status(201).json(_result);
  } catch (error) {
    console.error('Recipe :: getRecipes', error);
    res.status(500).json('Internal Server Error');
  }
};

export const getRecipe = async (req: Request, res: Response) => {
  try {
    const {id} = req.params;
    if (!id) {
      return res.status(400).json('Invalid recipe ID.');
    }
    const sql = 'SELECT id, name, description, ingredients, steps, images, active, created_by FROM `recipes` WHERE id = ?';
    const connection = await pool.getConnection();
    const [result] = await connection.execute<Recipe[]>(sql, [id]);
    connection.release();
    if (result.length === 0) {
      return res.status(403).json('Recipe not found.');
    }
    const _result = result[0];
    const productIds = await getRecipeProducts(parseInt(id));
    _result.ingredients = _result.ingredients ? JSON.parse(_result.ingredients) : [];
    _result.steps = _result.steps ? JSON.parse(_result.steps) : [];
    _result.images = _result.images ? JSON.parse(_result.images) : [];
    _result.products = productIds;
    _result.active = _result.active === 1;
    res.status(201).json(_result);
  } catch (error) {
    console.error('Recipe :: getRecipe', error);
    res.status(500).json('Internal Server Error');
  }
};

export const createRecipe = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      ingredients,
      steps,
      images,
      products,
    } = req.body;
    const userData = getUserDataFromToken(req);
    const userId = typeof userData?.userId === 'number' ? userData.userId : null;

    const errors = validateCreateRecipe(req.body);
    if (errors.length > 0) {
      return res.status(400).json(errors);
    }

    const sql1 = 'INSERT INTO `recipes` (name, description, ingredients, steps, images, created_by, active) VALUES (?, ?, ?, ?, ?, ?, false)';
    const connection = await pool.getConnection();
    const [result] = await connection.execute<ResultSetHeader>(sql1, [
      name,
      description || '',
      JSON.stringify(ingredients),
      JSON.stringify(steps),
      JSON.stringify(images),
      userId,
    ]);
    console.debug('createRecipe :: Successfully created recipe:', result.insertId);
    const sql2 = 'INSERT INTO `recipe_product` (recipe_id, product_id) VALUES (?, ?)';
    if (products && Array.isArray(products)) {
      for (const productId of products) {
        if (typeof productId === 'number') {
          await connection.execute<ResultSetHeader>(sql2, [
            result.insertId,
            productId,
          ]);
        }
      }
    }
    connection.release();
    res.status(201).json({id: result.insertId});
  } catch (error) {
    console.error('Recipe :: createRecipe', error);
    res.status(500).json('Internal Server Error');
  }
};

export const deleteRecipe = async (req: Request, res: Response) => {
  try {
    const {id} = req.params;

    if (!id) {
      return res.status(400).json('Invalid ID.');
    }

    const sql1 = 'SELECT id FROM `recipes` WHERE id = ?';
    const connection = await pool.getConnection();
    const [result] = await connection.execute<Recipe[]>(sql1, [id]);
    connection.release();
    if (result.length === 0) {
      return res.status(403).json('Recipe not found.');
    }
    const sql2 = 'DELETE FROM `recipes` WHERE id = ?';
    await connection.execute(sql2, [id]);
    connection.release();
    console.debug('deleteRecipe :: Successfully deleted recipe:', id);
    res.status(200).json('Recipe deleted successfully.');
  } catch (error) {
    console.error('Recipe :: deleteRecipe', error);
    res.status(500).json('Internal Server Error');
  }
};

export const updateRecipe = async (req: Request, res: Response) => {
  try {
    const {id} = req.params;
    if (!id) {
      return res.status(400).json('Invalid ID.');
    }
    const {
      name,
      description,
      ingredients,
      steps,
      images,
      products,
      active
    } = req.body;

    const errors = validateCreateRecipe(req.body);
    if (errors.length > 0) {
      return res.status(400).json(errors);
    }

    const connection = await pool.getConnection();

    const sql1 = 'SELECT id FROM `recipes` WHERE id = ?';
    const [recipes] = await connection.execute<Recipe[]>(sql1, [id]);
    if (recipes.length === 0) {
      return res.status(403).json('Recipe not found.');
    }

    const sql2 = 'UPDATE `recipes` SET name = ?, description = ?, ingredients = ?, steps = ?, images = ?, active = ? WHERE id = ?';
    const productIds = await getRecipeProducts(parseInt(id));
    const productIdsToDelete = productIds.filter((productId) => !products?.includes(productId));
    const productIdsToAdd = products?.filter((productId: number) => !productIds?.includes(productId));
    console.debug('updateRecipe :: productIdsToDelete:', productIdsToDelete);
    console.debug('updateRecipe :: productIdsToAdd:', productIdsToAdd);
    const [result] = await connection.execute<ResultSetHeader>(sql2, [
      name,
      description || '',
      JSON.stringify(ingredients),
      JSON.stringify(steps),
      JSON.stringify(images),
      typeof active === 'boolean' ? active : false,
      id,
    ]);
    console.debug('updateRecipe :: Successfully updated recipe:', result);

    const sql3 = 'INSERT INTO `recipe_product` (recipe_id, product_id) VALUES (?, ?)';
    if (productIdsToAdd && Array.isArray(productIdsToAdd)) {
      for (const productId of productIdsToAdd) {
        await connection.execute<ResultSetHeader>(sql3, [
          parseInt(id),
          productId,
        ]);
      }
    }

    const sql4 = 'DELETE FROM `recipe_product` WHERE recipe_id = ? AND product_id = ?';
    if (productIdsToDelete && Array.isArray(productIdsToDelete)) {
      for (const productId of productIdsToDelete) {
        await connection.execute<ResultSetHeader>(sql4, [
          parseInt(id),
          productId,
        ]);
      }
    }

    connection.release();
    res.status(201).json(true);
  } catch (error) {
    console.error('Recipe :: updateRecipe', error);
    res.status(500).json('Internal Server Error');
  }
};
