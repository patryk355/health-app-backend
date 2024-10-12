import pool from '../db';
import {Category} from '../types/category';

export const getCategory = async (categoryId: number) => {
  try {
    const sql = 'SELECT name FROM `categories` WHERE `id` = ?';
    const values = [categoryId];
    const connection = await pool.getConnection();
    const [result] = await connection.execute<Category[]>(sql, values);
    connection.release();
    if (result.length === 0) {
      console.error('Category does not exist', categoryId);
      return null;
    }
    return result[0];
  } catch (err) {
    console.error(`Error fetching category (id=${categoryId}):`, err);
    return null;
  }
};
