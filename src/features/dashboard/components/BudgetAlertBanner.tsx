import { AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { useBudgets } from "@/features/budgets/hooks";
import { computeMonthSpentByCategory } from "@/features/budgets/utils";
import { useTransactions } from "@/features/transactions/hooks";

export function BudgetAlertBanner() {
  const { data: budgets = [] } = useBudgets();
  const { data: transactions = [] } = useTransactions();

  if (budgets.length === 0) return null;

  const spentByCategory = computeMonthSpentByCategory(transactions);
  const overBudget = budgets.filter(
    (b) => (spentByCategory.get(b.categoryId) ?? 0) > b.monthlyAmount
  );
  const nearLimit = budgets.filter((b) => {
    const spent = spentByCategory.get(b.categoryId) ?? 0;
    return spent <= b.monthlyAmount && spent / b.monthlyAmount >= 0.8;
  });

  if (overBudget.length === 0 && nearLimit.length === 0) return null;

  const message =
    overBudget.length > 0
      ? `Superaste el presupuesto de ${overBudget.map((b) => b.categoryName).join(", ")}.`
      : `Estás por llegar al límite en ${nearLimit.map((b) => b.categoryName).join(", ")}.`;

  return (
    <Link
      to="/presupuestos"
      className="flex items-center gap-3 rounded-kubo-sm border border-negative/30 bg-negative/10 px-4 py-3 text-sm text-negative transition-colors hover:bg-negative/15"
    >
      <AlertTriangle className="size-4 shrink-0" />
      <span className="flex-1">{message}</span>
      <span className="shrink-0 text-xs font-medium">Ver presupuestos →</span>
    </Link>
  );
}
