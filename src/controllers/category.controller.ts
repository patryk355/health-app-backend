import {Response, Request} from 'express';
import pool from '../db';
import {Category} from '../types/category';

export const getCategories = async (req: Request, res: Response) => {
  try {
    const sql = 'SELECT id, name FROM `categories`';
    const connection = await pool.getConnection();
    const [result] = await connection.execute<Category[]>(sql);
    connection.release();
    if (result.length === 0) {
      return res.status(403).json('Categories not found.');
    }
    res.json(result);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json('Internal Server Error');
  }
};
