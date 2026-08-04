import { Link } from "react-router-dom";
import { ArrowRight, Loader2, PiggyBank, TrendingDown } from "lucide-react";
import { Topbar } from "@/components/layout/Topbar";
import { BalanceCard } from "./components/BalanceCard";
import { StatCard } from "./components/StatCard";
import { SpendingChart } from "./components/SpendingChart";
import { TransactionList } from "./components/TransactionList";
import { TransactionFormDialog } from "@/features/transactions/components/TransactionFormDialog";
import { useTransactions } from "@/features/transactions/hooks";
import { useAuth } from "@/features/auth/AuthProvider";
import { computeDashboardStats } from "./utils/stats";
import { formatCurrency } from "@/lib/currency";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Buenos días";
  if (hour < 19) return "Buenas tardes";
  return "Buenas noches";
}

export function DashboardPage() {
  const { user } = useAuth();
  const { data: transactions = [], isLoading } = useTransactions();
  const stats = computeDashboardStats(transactions);

  const firstName = (user?.user_metadata?.full_name as string | undefined)?.split(" ")[0];

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center gap-2 text-sm text-muted">
        <Loader2 className="size-4 animate-spin" /> Cargando tu dashboard...
      </div>
    );
  }

  return (
    <>
      <Topbar
        title={`${getGreeting()}${firstName ? `, ${firstName}` : ""}`}
        subtitle="Así está tu dinero hoy."
        action={<TransactionFormDialog />}
      />

      <div className="mt-6 grid animate-fade-up gap-5 px-6 md:mt-8 md:grid-cols-3 md:px-10">
        <div className="md:col-span-2">
          <BalanceCard
            balance={stats.balance}
            income={stats.monthIncome}
            expense={stats.monthExpense}
          />
        </div>
        <div className="grid grid-cols-2 gap-5 md:grid-cols-1">
          <StatCard
            icon={PiggyBank}
            label="Ahorro del mes"
            value={Math.max(stats.monthIncome - stats.monthExpense, 0)}
            helper="Ingresos menos gastos de este mes"
          />
          <StatCard
            icon={TrendingDown}
            label="Mayor gasto del mes"
            value={stats.topCategory?.amount ?? 0}
            helper={stats.topCategory ? stats.topCategory.name : "Sin gastos este mes"}
          />
        </div>
      </div>

      <div className="mt-5 grid gap-5 px-6 md:grid-cols-3 md:px-10">
        <div className="md:col-span-2">
          <SpendingChart data={stats.trend} />
        </div>
        <div className="flex flex-col gap-3">
          <TransactionList transactions={transactions.slice(0, 6)} />
          {transactions.length > 0 && (
            <Link
              to="/transacciones"
              className="flex items-center justify-center gap-1.5 text-sm font-medium text-muted hover:text-foreground"
            >
              Ver todas las transacciones
              <ArrowRight className="size-3.5" />
            </Link>
          )}
        </div>
      </div>

      {transactions.length === 0 && (
        <p className="mt-4 px-6 text-center text-xs text-muted md:px-10">
          Balance total: {formatCurrency(stats.balance)} · empieza registrando tu primer movimiento.
        </p>
      )}
    </>
  );
}
