import { parseLocalIso, todayLocal } from "@/lib/date";
import type { Transaction } from "@/features/transactions/hooks";

const monthLabels = [
  "Ene", "Feb", "Mar", "Abr", "May", "Jun",
  "Jul", "Ago", "Set", "Oct", "Nov", "Dic",
];

function isSameMonth(iso: string, date: Date) {
  const d = parseLocalIso(iso);
  return d.getFullYear() === date.getFullYear() && d.getMonth() === date.getMonth();
}

export interface CategoryBreakdownItem {
  name: string;
  icon: string;
  amount: number;
}

/** Gasto del mes en curso agrupado por categoría, ordenado de mayor a menor. */
export function computeCategoryBreakdown(transactions: Transaction[]): CategoryBreakdownItem[] {
  const now = new Date();
  const byCategory = new Map<string, CategoryBreakdownItem>();

  for (const tx of transactions) {
    if (tx.kind !== "expense" || !isSameMonth(tx.occurredOn, now)) continue;
    const existing = byCategory.get(tx.categoryName);
    if (existing) {
      existing.amount += tx.amount;
    } else {
      byCategory.set(tx.categoryName, {
        name: tx.categoryName,
        icon: tx.categoryIcon,
        amount: tx.amount,
      });
    }
  }

  return [...byCategory.values()].sort((a, b) => b.amount - a.amount);
}

export interface HistoricalPoint {
  label: string;
  income: number;
  expense: number;
  net: number;
}

/** Ingresos, gastos y ahorro neto de los últimos `months` meses (incluyendo el actual). */
export function computeHistoricalTrend(transactions: Transaction[], months = 6): HistoricalPoint[] {
  const now = new Date();
  const points: HistoricalPoint[] = [];

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthTx = transactions.filter((t) => isSameMonth(t.occurredOn, d));
    const income = monthTx.filter((t) => t.kind === "income").reduce((s, t) => s + t.amount, 0);
    const expense = monthTx.filter((t) => t.kind === "expense").reduce((s, t) => s + t.amount, 0);
    points.push({ label: monthLabels[d.getMonth()], income, expense, net: income - expense });
  }

  return points;
}

/** Genera un CSV con todas las transacciones y dispara la descarga en el navegador. */
export function exportTransactionsToCsv(transactions: Transaction[]) {
  const header = ["Fecha", "Descripción", "Categoría", "Tipo", "Monto"];
  const rows = transactions.map((tx) => [
    tx.occurredOn,
    tx.description.replace(/"/g, '""'),
    tx.categoryName.replace(/"/g, '""'),
    tx.kind === "income" ? "Ingreso" : "Gasto",
    tx.amount.toFixed(2),
  ]);

  const csv = [header, ...rows]
    .map((row) => row.map((cell) => `"${cell}"`).join(","))
    .join("\n");

  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const today = todayLocal();
  link.href = url;
  link.download = `kubo-movimientos-${today}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
