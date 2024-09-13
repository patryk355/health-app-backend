import pool from '../db';
import {Role} from '../types/role';

export const getRole = async (roleId: number) => {
  try {
    const sql = 'SELECT name FROM `roles` WHERE `id` = ?';
    const values = [roleId];
    const connection = await pool.getConnection();
    const [result] = await connection.execute<Role[]>(sql, values);
    connection.release();
    if (result.length === 0) {
      console.error('Role does not exist');
      return null;
    }
    return result[0].name;
  } catch (err) {
    console.error('Error fetching role:', err);
    return null;
  }
};
