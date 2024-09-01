import {RowDataPacket} from 'mysql2';

export interface User extends RowDataPacket {
  id: number;
  email: string;
  username: string;
  password: string;
  role_id: number;
}
