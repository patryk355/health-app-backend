import {Request, Response, NextFunction} from 'express';
import jwt, {JwtPayload} from 'jsonwebtoken';
import dotenv from 'dotenv';
import {RoleName} from '../types/role';

dotenv.config();

interface DecodedToken extends JwtPayload {
  role: RoleName;
}

const checkAuth = (req: Request, res: Response, next: NextFunction, checkIsAdmin = false) => {
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
    const decodedToken = jwt.verify(token, process.env.JWT_KEY) as DecodedToken;
    if (checkIsAdmin && decodedToken.role !== 'admin') {
      return res.status(401).json('Permission denied!');
    }
    next();
  } catch (err) {
    res.status(401).json('Authentication failed!');
  }
};

export default checkAuth;
