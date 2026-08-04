import { useMemo, useState } from "react";
import { PiggyBank, Target } from "lucide-react";
import { Topbar } from "@/components/layout/Topbar";
import { BalanceCard } from "./components/BalanceCard";
import { StatCard } from "./components/StatCard";
import { SpendingChart } from "./components/SpendingChart";
import { TransactionList } from "./components/TransactionList";
import { QuickAddDialog } from "./components/QuickAddDialog";
import { initialTransactions, trendData } from "./data/mock";
import type { Transaction } from "./types";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Buenos días";
  if (hour < 19) return "Buenas tardes";
  return "Buenas noches";
}

export function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);

  const { balance, income, expense } = useMemo(() => {
    const income = transactions
      .filter((t) => t.kind === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions
      .filter((t) => t.kind === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    return { balance: income - expense, income, expense };
  }, [transactions]);

  const handleAdd = (tx: Transaction) => {
    setTransactions((prev) => [tx, ...prev]);
  };

  return (
    <>
      <Topbar
        title={`${getGreeting()}, Matías`}
        subtitle="Así está tu dinero hoy."
        action={<QuickAddDialog onAdd={handleAdd} />}
      />

      <div className="mt-6 grid animate-fade-up gap-5 px-6 md:mt-8 md:grid-cols-3 md:px-10">
        <div className="md:col-span-2">
          <BalanceCard balance={balance} income={income} expense={expense} />
        </div>
        <div className="grid grid-cols-2 gap-5 md:grid-cols-1">
          <StatCard
            icon={PiggyBank}
            label="Ahorro del mes"
            value={Math.max(income - expense, 0)}
            progress={68}
            helper="68% de tu meta de S/ 1,500"
          />
          <StatCard
            icon={Target}
            label="Presupuesto usado"
            value={expense}
            progress={57}
            helper="57% del presupuesto mensual"
          />
        </div>
      </div>

      <div className="mt-5 grid gap-5 px-6 md:grid-cols-3 md:px-10">
        <div className="md:col-span-2">
          <SpendingChart data={trendData} />
        </div>
        <TransactionList transactions={transactions.slice(0, 6)} />
      </div>
    </>
  );
}
