import {RowDataPacket} from 'mysql2';

export interface Goodness extends RowDataPacket {
  id: number;
  name: string;
  unit: string;
}
