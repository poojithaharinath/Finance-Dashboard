import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Transaction, Role, Filters } from "@/lib/types";
import { generateMockTransactions } from "@/lib/mock-data";

interface AppState {
  transactions: Transaction[];
  role: Role;
  darkMode: boolean;
  filters: Filters;
  setRole: (role: Role) => void;
  setDarkMode: (dark: boolean) => void;
  setFilters: (filters: Partial<Filters>) => void;
  addTransaction: (tx: Omit<Transaction, "id">) => void;
  updateTransaction: (id: string, tx: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
}

const defaultFilters: Filters = {
  search: "",
  category: "all",
  type: "all",
  sortBy: "date",
  sortOrder: "desc",
};

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      transactions: generateMockTransactions(),
      role: "admin",
      darkMode: false,
      filters: defaultFilters,
      setRole: (role) => set({ role }),
      setDarkMode: (darkMode) => set({ darkMode }),
      setFilters: (partial) =>
        set((state) => ({ filters: { ...state.filters, ...partial } })),
      addTransaction: (tx) =>
        set((state) => ({
          transactions: [
            { ...tx, id: Math.random().toString(36).substring(2, 10) },
            ...state.transactions,
          ],
        })),
      updateTransaction: (id, updates) =>
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        })),
      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),
    }),
    {
      name: "finance-dashboard",
      partialize: (state) => ({
        transactions: state.transactions,
        role: state.role,
        darkMode: state.darkMode,
      }),
    }
  )
);
