import {RowDataPacket} from 'mysql2';

export type RoleName = 'admin' | 'user';

export interface Role extends RowDataPacket {
  id: number;
  name: RoleName;
}
