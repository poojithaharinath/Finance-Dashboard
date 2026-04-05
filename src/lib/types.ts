export type TransactionType = "income" | "expense";

export type Category =
  | "Food"
  | "Transport"
  | "Shopping"
  | "Bills"
  | "Entertainment"
  | "Salary"
  | "Freelance"
  | "Investment"
  | "Healthcare"
  | "Education";

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: Category;
}

export type Role = "admin" | "viewer";

export interface Filters {
  search: string;
  category: Category | "all";
  type: TransactionType | "all";
  sortBy: "date" | "amount";
  sortOrder: "asc" | "desc";
}
