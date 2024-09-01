import {Response, Request} from 'express';
import pool from '../db';
import {User} from '../types/user';

export const getUser = async (req: Request, res: Response) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json('User ID is required.');
  }

  try {
    const sql = 'SELECT id, username, email, role_id FROM `users` WHERE `id` = ?';
    const values = [id];
    const connection = await pool.getConnection();
    const [result] = await connection.execute<User[]>(sql, values);
    connection.release();
    if (result.length === 0) {
      return res.status(403).json('User does not exists.');
    }
    res.json(result[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json('Internal Server Error');
  }
};
