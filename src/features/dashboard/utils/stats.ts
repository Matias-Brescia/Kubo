import { parseLocalIso } from "@/lib/date";
import type { Transaction } from "@/features/transactions/hooks";
import type { TrendPoint } from "../types";

const monthLabels = [
  "Ene", "Feb", "Mar", "Abr", "May", "Jun",
  "Jul", "Ago", "Set", "Oct", "Nov", "Dic",
];

function isSameMonth(iso: string, date: Date) {
  const d = parseLocalIso(iso);
  return d.getFullYear() === date.getFullYear() && d.getMonth() === date.getMonth();
}

export function computeDashboardStats(transactions: Transaction[]) {
  const now = new Date();

  const totalIncome = transactions
    .filter((t) => t.kind === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.kind === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const currentMonthTx = transactions.filter((t) => isSameMonth(t.occurredOn, now));
  const monthIncome = currentMonthTx
    .filter((t) => t.kind === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const monthExpense = currentMonthTx
    .filter((t) => t.kind === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const byCategory = new Map<string, number>();
  for (const t of currentMonthTx) {
    if (t.kind !== "expense") continue;
    byCategory.set(t.categoryName, (byCategory.get(t.categoryName) ?? 0) + t.amount);
  }
  let topCategory: { name: string; amount: number } | null = null;
  for (const [name, amount] of byCategory.entries()) {
    if (!topCategory || amount > topCategory.amount) topCategory = { name, amount };
  }

  const trend: TrendPoint[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthTx = transactions.filter((t) => isSameMonth(t.occurredOn, d));
    trend.push({
      label: monthLabels[d.getMonth()],
      income: monthTx.filter((t) => t.kind === "income").reduce((s, t) => s + t.amount, 0),
      expense: monthTx.filter((t) => t.kind === "expense").reduce((s, t) => s + t.amount, 0),
    });
  }

  return { balance, monthIncome, monthExpense, topCategory, trend };
}
