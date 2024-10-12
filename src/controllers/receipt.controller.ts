import {Response, Request} from 'express';
import pool from '../db';
import {Receipt} from '../types/receipt';

export const getReceipts = async (req: Request, res: Response) => {
  try {
    const {active} = req.query;
    let sql = 'SELECT id, name, description, ingredients, steps, active FROM `receipts`';
    if (active === 'false') {
      sql = 'SELECT id, name, description, ingredients, steps, active FROM `receipts` WHERE `active`=false';
    }
    const connection = await pool.getConnection();
    const [result] = await connection.execute<Receipt[]>(sql);
    connection.release();
    res.status(201).json(result);
  } catch (error) {
    console.error('Receipt :: getReceipts', error);
    res.status(500).json('Internal Server Error');
  }
};
