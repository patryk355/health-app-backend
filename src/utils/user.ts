import {Request} from 'express';
import jwt, {JwtPayload} from 'jsonwebtoken';
import {RoleName} from '../types/role';

interface DecodedToken extends JwtPayload {
  email: string;
  role: RoleName;
  userId: number;
}

export const getUserDataFromToken = (req: Request) => {
  if (typeof process.env.JWT_KEY !== 'string') {
    return null;
  }
  let token;
  try {
    token = req?.headers?.authorization?.split(' ')[1]; // Authorization: 'Bearer TOKEN'
    if (!token) {
      return null;
    }
    const decodedToken = jwt.verify(token, process.env.JWT_KEY) as DecodedToken;
    return decodedToken;
  } catch (err) {
    return null;
  }
};
