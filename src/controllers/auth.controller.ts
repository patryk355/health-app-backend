import {Response, Request, NextFunction} from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import pool from '../db';
import {getRole} from '../utils/role';
import {User} from '../types/user';

export const auth = async (req: Request, res: Response, _next: NextFunction) => {
  if (!process.env.JWT_KEY) {
    return res.status(500).json('Internal Server Error');
  }

  const {email, password} = req.body;

  if (!email || !password) {
    return res.status(400).json('Email and password are required.');
  }

  let existingUser: User;

  try {
    const sql = 'SELECT id, username, email, password, role_id, favorite_products, favorite_recipes FROM `users` WHERE `email` = ?';
    const values = [email];
    const connection = await pool.getConnection();
    const [result] = await connection.execute<User[]>(sql, values);
    connection.release();
    if (result.length === 0) {
      return res.status(403).json('User does not exists.');
    }
    existingUser = result[0];
  } catch (err) {
    return res.status(500).json('Logging in failed, please try again later.');
  }

  if (!existingUser) {
    return res.status(403).json('User does not exists.');
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    return res.status(500).json('Could not log you in, please check your credentials and try again.');
  }

  if (!isValidPassword) {
    return res.status(403).json('Invalid credentials, could not log you in.');
  }

  const role = await getRole(existingUser.role_id);

  if (!role) {
    return res.status(403).json('User does not exists.');
  }

  let token;

  try {
    token = jwt.sign({
      userId: existingUser.id,
      email: existingUser.email,
      role: role
    }, process.env.JWT_KEY);
  } catch (err) {
    return res.status(500).json('Logging in failed, please try again.');
  }

  res.status(201).json({
    id: existingUser.id,
    email: existingUser.email,
    username: existingUser.username,
    role: role,
    favorite_products: existingUser.favorite_products,
    favorite_recipes: existingUser.favorite_recipes,
    token: token
  });
};
