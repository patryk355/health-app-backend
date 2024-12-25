import {RowDataPacket} from 'mysql2';

export interface User extends RowDataPacket {
  id: number;
  email: string;
  username: string;
  password: string;
  role_id: number;
  favorite_products: string; // JSON (number[])
  favorite_recipes: string; // JSON (number[])
}

export interface CreateUser {
  email?: unknown;
  username?: unknown;
  password?: unknown;
}
