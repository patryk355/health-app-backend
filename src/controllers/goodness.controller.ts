import {Response, Request} from 'express';
import pool from '../db';
import {Goodness} from '../types/goodness';

export const getGoodness = async (req: Request, res: Response) => {
  try {
    const sql = 'SELECT id, name, unit FROM `goodness`';
    const connection = await pool.getConnection();
    const [result] = await connection.execute<Goodness[]>(sql);
    connection.release();
    if (result.length === 0) {
      return res.status(403).json('Goodness not found.');
    }
    res.json(result);
  } catch (error) {
    console.error('Error fetching goodness:', error);
    res.status(500).json('Internal Server Error');
  }
};
