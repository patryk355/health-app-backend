import {Response, Request} from 'express';
import {ResultSetHeader} from 'mysql2';

import pool from '../db';
import {validateCreateProduct} from '../validators/product.validator';
import {Product} from '../types/product';

export const getProducts = async (_req: Request, res: Response) => {
  try {
    const sql = 'SELECT id, name, description, advantages, disadvantages, contraindications, images, category_id FROM `products`';
    const connection = await pool.getConnection();
    const [result] = await connection.execute<Product[]>(sql);
    connection.release();
    const _result = result.map((product) => {
      product.images = JSON.parse(product.images);
      return product;
    });
    res.status(201).json(_result);
  } catch (error) {
    console.error('Product :: getProducts', error);
    res.status(500).json('Internal Server Error');
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      advantages,
      disadvantages,
      contraindications,
      images,
      category_id
    } = req.body;

    const errors = validateCreateProduct(req.body);
    if (errors.length > 0) {
      return res.status(400).json(errors);
    }

    const sql1 = 'INSERT INTO `products` (name, description, advantages, disadvantages, contraindications, images, category_id) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const connection = await pool.getConnection();
    const [result] = await connection.execute<ResultSetHeader>(sql1, [
      name,
      description,
      advantages,
      disadvantages,
      contraindications,
      JSON.stringify(images),
      category_id
    ]);
    console.debug('createProduct :: Successfully created product:', result.insertId);
    connection.release();
    res.status(201).json({
      id: result.insertId,
    });
  } catch (error) {
    console.error('Product :: createProduct', error);
    res.status(500).json('Internal Server Error');
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const {
      id,
      name,
      description,
      advantages,
      disadvantages,
      contraindications,
      images,
      category_id
    } = req.body;

    // TODO: Validate data

    const sql = 'UPDATE `products` SET name = ?, description = ?, advantages = ?, disadvantages = ?, contraindications = ?, images = ?, category_id = ? WHERE id = ?';
    const connection = await pool.getConnection();
    await connection.execute(sql, [
      name,
      description,
      advantages,
      disadvantages,
      contraindications,
      JSON.stringify(images),
      category_id,
      id
    ]);
    connection.release();
    res.status(200).json('Product updated successfully.');
  } catch (error) {
    console.error('Product :: updateProduct', error);
    res.status(500).json('Internal Server Error');
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const {id} = req.params;

    if (!id) {
      return res.status(400).json('Invalid ID.');
    }

    const sql1 = 'SELECT id FROM `products` WHERE id = ?';
    const connection = await pool.getConnection();
    const [result] = await connection.execute<Product[]>(sql1, [id]);
    connection.release();
    if (result.length === 0) {
      return res.status(403).json('Product not found.');
    }
    const sql2 = 'DELETE FROM `products` WHERE id = ?';
    await connection.execute(sql2, [id]);
    connection.release();
    res.status(200).json('Product deleted successfully.');
  } catch (error) {
    console.error('Product :: deleteProduct', error);
    res.status(500).json('Internal Server Error');
  }
};
