import {Response, Request} from 'express';
import pool from '../db';
import {Mineral} from '../types/mineral';

export const getMinerals = async (req: Request, res: Response) => {
  try {
    const sql = 'SELECT id, name, unit FROM `minerals`';
    const connection = await pool.getConnection();
    const [result] = await connection.execute<Mineral[]>(sql);
    connection.release();
    if (result.length === 0) {
      return res.status(403).json('Minerals not found.');
    }
    res.json(result);
  } catch (error) {
    console.error('Error fetching minerals:', error);
    res.status(500).json('Internal Server Error');
  }
};
