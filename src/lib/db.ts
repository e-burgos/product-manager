import Dexie, { type Table } from "dexie";

export interface Budget {
  id?: number;
  title: string;
  description: string;
  totalAmount?: number;
}

export type Budgets = Budget[] | undefined;

export interface BudgetVariant {
  id?: number;
  budgetId: number;
  variantId: number;
  productId: number;
  title: string;
  description: string;
  quantity: number;
  amount: number;
}

export interface Product {
  id?: number;
  title: string;
  description: string;
  totalAmount?: number;
}

export type Products = Product[] | undefined;

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
  budgets!: Table<Budget>;
  budgetVariants!: Table<BudgetVariant>;

  constructor() {
    super("ProductDB");
    this.version(1).stores({
      products: "++id, title",
      variants: "++id, productId, title",
      budgets: "++id, title",
      budgetVariants: "++id, budgetId, productId, variantId, title",
    });
  }
}

export const db = new ProductDatabase();
