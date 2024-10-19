import {Response, Request} from 'express';
import {ResultSetHeader} from 'mysql2';

import pool from '../db';
import {validateCreateReceipt} from '../validators/receipt.validator';
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
    const _result = result.map((receipt) => {
      receipt.ingredients = JSON.parse(receipt.ingredients);
      receipt.steps = JSON.parse(receipt.steps);
      return receipt;
    });
    res.status(201).json(_result);
  } catch (error) {
    console.error('Receipt :: getReceipts', error);
    res.status(500).json('Internal Server Error');
  }
};

export const createReceipt = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      ingredients,
      steps,
    } = req.body;

    const errors = validateCreateReceipt(req.body);
    if (errors.length > 0) {
      return res.status(400).json(errors);
    }

    const sql1 = 'INSERT INTO `receipts` (name, description, ingredients, steps, active) VALUES (?, ?, ?, ?, false)';
    const connection = await pool.getConnection();
    const [result] = await connection.execute<ResultSetHeader>(sql1, [
      name,
      description || '',
      JSON.stringify(ingredients),
      JSON.stringify(steps),
    ]);
    console.debug('createReceipt :: Successfully created receipt:', result.insertId);
    connection.release();
    res.status(201).json({id: result.insertId});
  } catch (error) {
    console.error('Receipt :: createReceipt', error);
    res.status(500).json('Internal Server Error');
  }
};

export const deleteReceipt = async (req: Request, res: Response) => {
  try {
    const {id} = req.params;

    if (!id) {
      return res.status(400).json('Invalid ID.');
    }

    const sql1 = 'SELECT id FROM `receipts` WHERE id = ?';
    const connection = await pool.getConnection();
    const [result] = await connection.execute<Receipt[]>(sql1, [id]);
    connection.release();
    if (result.length === 0) {
      return res.status(403).json('Receipt not found.');
    }
    const sql2 = 'DELETE FROM `receipts` WHERE id = ?';
    await connection.execute(sql2, [id]);
    connection.release();
    res.status(200).json('Receipt deleted successfully.');
  } catch (error) {
    console.error('Receipt :: deleteReceipt', error);
    res.status(500).json('Internal Server Error');
  }
};
