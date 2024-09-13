import {Response, Request} from 'express';
import pool from '../db';
import {User} from '../types/user';
import jwt from 'jsonwebtoken';
import {getRole} from '../utils/role';

export const getLoggedUser = async (req: Request, res: Response) => {
  if (typeof process.env.JWT_KEY !== 'string') {
    return res.status(500).json('Internal Server Error');
  }
  const token = req?.headers?.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json('Authentication failed!');
  }
  try {
    const verifiedToken = jwt.verify(token, process.env.JWT_KEY);
    if (typeof verifiedToken === 'string') {
      return res.status(401).json('Authentication failed!');
    }
    const userId = verifiedToken.userId;
    const sql = 'SELECT id, username, email, role_id FROM `users` WHERE `id` = ?';
    const values = [userId];
    const connection = await pool.getConnection();
    const [result] = await connection.execute<User[]>(sql, values);
    connection.release();
    if (result.length === 0) {
      return res.status(403).json('User does not exists.');
    }
    const user = result[0];
    const role = await getRole(user.role_id);

    if (!role) {
      console.error('Role does not exist');
      return res.status(403).json('User does not exists.');
    }

    res.json({
      id: user.id,
      email: user.email,
      username: user.username,
      role: role,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json('Internal Server Error');
  }
};

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
