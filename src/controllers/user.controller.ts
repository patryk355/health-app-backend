import {Response, Request} from 'express';
import jwt from 'jsonwebtoken';
import {ResultSetHeader} from 'mysql2';
import bcrypt from 'bcryptjs';

import pool from '../db';
import {getRole} from '../utils/role';
import {validateCreateUser} from '../validators/user.validator';
import {User} from '../types/user';

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

export const createUser = async (req: Request, res: Response) => {
  try {
    const {email, username, password} = req.body;

    const errors = validateCreateUser(req.body);

    if (errors.length > 0) {
      return res.status(400).json(errors);
    }

    const sql1 = 'SELECT id FROM `users` WHERE email = ?';
    const connection = await pool.getConnection();
    const [result1] = await connection.execute<User[]>(sql1, [email]);
    connection.release();
    if (result1.length > 0) {
      return res.status(400).json('Email already exists.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql2 = 'INSERT INTO `users` (email, username, password, role_id) VALUES (?, ?, ?, 2)';
    const [result2] = await connection.execute<ResultSetHeader>(sql2, [
      email,
      username,
      hashedPassword,
    ]);
    console.debug('createUser :: Successfully created user:', result2.insertId);
    connection.release();
    res.status(201).json({id: result2.insertId});
  } catch (error) {
    console.error('User :: createUser', error);
    res.status(500).json('Internal Server Error');
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const {id} = req.params;

    if (!id) {
      return res.status(400).json('Invalid ID.');
    }

    const sql1 = 'SELECT id, role_id FROM `users` WHERE id = ?';
    const connection = await pool.getConnection();
    const [result] = await connection.execute<User[]>(sql1, [id]);
    connection.release();
    if (result.length === 0) {
      return res.status(403).json('User not found.');
    }
    const role = await getRole(result[0].role_id);
    if (role === 'admin') {
      return res.status(403).json('Not allowed to delete this user.');
    }
    const sql2 = 'DELETE FROM `users` WHERE id = ?';
    await connection.execute(sql2, [id]);
    connection.release();
    res.status(200).json('User deleted successfully.');
  } catch (error) {
    console.error('User :: deleteUser', error);
    res.status(500).json('Internal Server Error');
  }
};
