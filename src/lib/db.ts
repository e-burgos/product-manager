import Dexie, { type Table } from 'dexie';

export interface Product {
  id?: number;
  title: string;
  description: string;
  totalAmount?: number;
}

export interface Variant {
  id?: number;
  productId: number;
  title: string;
  description: string;
  amount: number;
}

export class ProductDatabase extends Dexie {
  products!: Table<Product>;
  variants!: Table<Variant>;

  constructor() {
    super('ProductDB');
    this.version(1).stores({
      products: '++id, title',
      variants: '++id, productId, title',
    });
  }
}

export const db = new ProductDatabase();