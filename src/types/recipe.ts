import {RowDataPacket} from 'mysql2';

export interface Recipe extends RowDataPacket {
  id: number;
  name: string;
  description: string;
  ingredients: string;
  steps: string;
  images: string;
  active: boolean;
  created_by: number | null;
}
