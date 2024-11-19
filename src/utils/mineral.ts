import {RowDataPacket} from 'mysql2';
import pool from '../db';

interface Data extends RowDataPacket {
  product_id: number;
  mineral_id: number;
  amount: string;
}

export const getProductMinerals = async (productId: number) => {
  try {
    const sql = 'SELECT product_id, mineral_id, amount FROM `product_mineral` WHERE `product_id` = ?';
    const connection = await pool.getConnection();
    const [result] = await connection.execute<Data[]>(sql, [productId]);
    connection.release();
    return result;
  } catch (err) {
    console.error(`Error fetching minerals (product_id=${productId}):`, err);
    return [];
  }
};
