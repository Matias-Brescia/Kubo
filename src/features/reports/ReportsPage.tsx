import { Download, Loader2, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { Topbar } from "@/components/layout/Topbar";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/features/dashboard/components/StatCard";
import { useTransactions } from "@/features/transactions/hooks";
import { computeCategoryBreakdown, computeHistoricalTrend, exportTransactionsToCsv } from "./utils";
import { CategoryBreakdownChart } from "./components/CategoryBreakdownChart";
import { HistoricalTrendChart } from "./components/HistoricalTrendChart";

export function ReportsPage() {
  const { data: transactions = [], isLoading } = useTransactions();

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center gap-2 text-sm text-muted">
        <Loader2 className="size-4 animate-spin" /> Cargando reportes...
      </div>
    );
  }

  const breakdown = computeCategoryBreakdown(transactions);
  const historical = computeHistoricalTrend(transactions, 6);
  const currentMonth = historical[historical.length - 1];

  return (
    <>
      <Topbar
        title="Reportes"
        subtitle="Analiza tus finanzas del mes y su evolución histórica."
        action={
          <Button
            variant="secondary"
            onClick={() => exportTransactionsToCsv(transactions)}
            disabled={transactions.length === 0}
          >
            <Download className="size-4" />
            Exportar CSV
          </Button>
        }
      />

      <div className="mt-6 grid gap-5 px-6 md:mt-8 md:grid-cols-3 md:px-10">
        <StatCard
          icon={TrendingUp}
          label="Ingresos del mes"
          value={currentMonth?.income ?? 0}
          helper="Total de ingresos registrados este mes"
        />
        <StatCard
          icon={TrendingDown}
          label="Gastos del mes"
          value={currentMonth?.expense ?? 0}
          helper="Total de gastos registrados este mes"
        />
        <StatCard
          icon={Wallet}
          label="Ahorro neto"
          value={currentMonth?.net ?? 0}
          helper="Ingresos menos gastos de este mes"
        />
      </div>

      <div className="mt-5 grid gap-5 px-6 md:grid-cols-2 md:px-10">
        <CategoryBreakdownChart data={breakdown} />
        <HistoricalTrendChart data={historical} />
      </div>
    </>
  );
}
