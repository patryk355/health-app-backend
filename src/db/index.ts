import mysql, {PoolOptions} from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const poolOptions: PoolOptions = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  timezone: '+01:00',
};

const pool = mysql.createPool(poolOptions);

export default pool;
