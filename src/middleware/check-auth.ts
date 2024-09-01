import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.method === 'OPTIONS') {
    return next();
  }
  if (typeof process.env.JWT_KEY !== 'string') {
    return res.status(500).json('Internal Server Error');
  }
  let token;
  try {
    token = req?.headers?.authorization?.split(' ')[1]; // Authorization: 'Bearer TOKEN'
    if (!token) {
      return res.status(401).json('Authentication failed!');
    }
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    next();
  } catch (err) {
    res.status(401).json('Authentication failed!');
  }
};

export default checkAuth;
