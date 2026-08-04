import type { Transaction } from "@/features/transactions/hooks";

function isCurrentMonth(iso: string) {
  const now = new Date();
  const d = new Date(iso);
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
}

/** Suma los gastos del mes en curso agrupados por categoría. */
export function computeMonthSpentByCategory(transactions: Transaction[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const tx of transactions) {
    if (tx.kind !== "expense" || !tx.categoryId || !isCurrentMonth(tx.occurredOn)) continue;
    map.set(tx.categoryId, (map.get(tx.categoryId) ?? 0) + tx.amount);
  }
  return map;
}
