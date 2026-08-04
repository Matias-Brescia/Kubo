export type TransactionKind = "income" | "expense";

export interface Category {
  id: string;
  label: string;
  color: string;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  kind: TransactionKind;
  category: string;
  date: string;
}

export interface TrendPoint {
  label: string;
  income: number;
  expense: number;
}
