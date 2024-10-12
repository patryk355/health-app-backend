import {RowDataPacket} from 'mysql2';

export interface Product extends RowDataPacket {
  id: number;
  name: string;
  description: string;
  advantages: string;
  disadvantages: string;
  contraindications: string;
  images: string;
  category_id: number;
}

// interface Mineral {
//   mineral_id: number;
//   amount: number;
// }
//
// interface Goodness {
//   goodness_id: number;
//   amount: number;
// }
//
// export interface ProductCreate {
//   name: string;
//   description: string;
//   advantages: string;
//   disadvantages: string;
//   contraindications: string;
//   images: string;
//   category_id: number;
//   minerals?: Mineral[];
//   goodness?: Goodness[];
// }
