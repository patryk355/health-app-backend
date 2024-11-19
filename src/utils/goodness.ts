import {RowDataPacket} from 'mysql2';
import pool from '../db';

interface Data extends RowDataPacket {
  product_id: number;
  goodness_id: number;
  amount: string;
}

export const getProductGoodness = async (productId: number) => {
  try {
    const sql = 'SELECT product_id, goodness_id, amount FROM `product_goodness` WHERE `product_id` = ?';
    const connection = await pool.getConnection();
    const [result] = await connection.execute<Data[]>(sql, [productId]);
    connection.release();
    return result;
  } catch (err) {
    console.error(`Error fetching goodness (product_id=${productId}):`, err);
    return [];
  }
};
