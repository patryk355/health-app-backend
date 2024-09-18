import {Response, Request} from 'express';
import pool from '../db';
import {Product} from '../types/product';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const sql = 'SELECT id, name, description, advantages, disadvantages, contraindications, images, goodness, minerals, category_id FROM `products`';
    const connection = await pool.getConnection();
    const [result] = await connection.execute<Product[]>(sql);
    connection.release();
    const _result = result.map((product) => {
      product.images = JSON.parse(product.images);
      product.goodness = JSON.parse(product.goodness);
      product.minerals = JSON.parse(product.minerals);
      return product;
    });
    res.json(_result);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json('Internal Server Error');
  }
};
