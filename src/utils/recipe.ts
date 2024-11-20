import {RowDataPacket} from 'mysql2';
import pool from '../db';

interface Data extends RowDataPacket {
  product_id: number;
  recipe_id: number;
}

export const getRecipeProducts = async (recipeId: number) => {
  try {
    const sql = 'SELECT recipe_id, product_id FROM `recipe_product` WHERE recipe_id = ?';
    const connection = await pool.getConnection();
    const [result] = await connection.execute<Data[]>(sql, [recipeId]);
    connection.release();
    return result.map((item) => item.product_id);
  } catch (err) {
    console.error(`Error fetching recipe products (recipe_id=${recipeId}):`, err);
    return [];
  }
};
