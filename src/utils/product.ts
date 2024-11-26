import pool from '../db';
import {RowDataPacket} from 'mysql2';

interface Data extends RowDataPacket {
  product_id: number;
  recipe_id: number;
}

export const getProductRecipes = async (productId: number) => {
  try {
    const sql = 'SELECT recipe_id, product_id FROM `recipe_product` WHERE product_id = ?';
    const connection = await pool.getConnection();
    const [result] = await connection.execute<Data[]>(sql, [productId]);
    connection.release();
    return result.map((item) => item.recipe_id);
  } catch (error) {
    console.error(`Error fetching product recipes (product_id=${productId}):`, error);
    return [];
  }
};
