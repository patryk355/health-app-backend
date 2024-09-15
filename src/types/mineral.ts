import {RowDataPacket} from 'mysql2';

export interface Mineral extends RowDataPacket {
  id: number;
  name: string;
  unit: string;
}
