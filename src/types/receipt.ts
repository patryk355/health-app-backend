import {RowDataPacket} from 'mysql2';

export interface Receipt extends RowDataPacket {
  id: number;
  name: string;
  description: string;
  ingredients: string;
  steps: string;
  active: boolean;
}
