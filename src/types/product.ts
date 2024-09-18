import {RowDataPacket} from 'mysql2';

export interface Product extends RowDataPacket {
  id: number;
  name: string;
  description: string;
  advantages: string;
  disadvantages: string;
  contraindications: string;
  images: string;
  goodness: string;
  minerals: string;
  category_id: number;
}
