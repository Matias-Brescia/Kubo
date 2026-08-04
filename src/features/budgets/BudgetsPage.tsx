import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Pencil, PiggyBank, Trash2 } from "lucide-react";
import { Topbar } from "@/components/layout/Topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { AnimatedCurrency } from "@/components/shared/AnimatedCurrency";
import { formatCurrency } from "@/lib/currency";
import { getCategoryIconByKey } from "@/lib/category-icons";
import { cn } from "@/lib/utils";
import { useTransactions } from "@/features/transactions/hooks";
import { useBudgets, useDeleteBudget } from "./hooks";
import { computeMonthSpentByCategory } from "./utils";
import { BudgetFormDialog } from "./components/BudgetFormDialog";

export function BudgetsPage() {
  const { data: budgets = [], isLoading } = useBudgets();
  const { data: transactions = [] } = useTransactions();
  const deleteBudget = useDeleteBudget();

  const spentByCategory = computeMonthSpentByCategory(transactions);
  const usedCategoryIds = budgets.map((b) => b.categoryId);

  return (
    <>
      <Topbar
        title="Presupuestos"
        subtitle="Define un límite mensual por categoría y sigue tu avance."
        action={<BudgetFormDialog usedCategoryIds={usedCategoryIds} />}
      />

      <div className="mt-6 px-6 md:mt-8 md:px-10">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted">
            <Loader2 className="size-4 animate-spin" /> Cargando presupuestos...
          </div>
        ) : budgets.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-surface-hover text-muted">
                <PiggyBank className="size-5" />
              </div>
              <p className="text-sm font-medium">Todavía no tienes presupuestos</p>
              <p className="max-w-xs text-sm text-muted">
                Crea un límite mensual por categoría para controlar tus gastos.
              </p>
              <BudgetFormDialog
                usedCategoryIds={usedCategoryIds}
                trigger={<Button className="mt-2">Crear mi primer presupuesto</Button>}
              />
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence initial={false}>
              {budgets.map((budget, i) => {
                const spent = spentByCategory.get(budget.categoryId) ?? 0;
                const pct = Math.min((spent / budget.monthlyAmount) * 100, 100);
                const remaining = budget.monthlyAmount - spent;
                const isOver = spent > budget.monthlyAmount;
                const Icon = getCategoryIconByKey(budget.categoryIcon);

                return (
                  <motion.div
                    key={budget.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3, ease: "easeOut", delay: i * 0.04 }}
                  >
                    <Card className="group p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className="flex size-9 shrink-0 items-center justify-center rounded-kubo-sm bg-surface-hover text-muted">
                            <Icon className="size-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{budget.categoryName}</p>
                            <p className="text-xs text-muted">
                              Límite {formatCurrency(budget.monthlyAmount)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                          <BudgetFormDialog
                            budget={budget}
                            trigger={
                              <Button variant="ghost" size="icon" aria-label="Editar">
                                <Pencil className="size-4" />
                              </Button>
                            }
                          />
                          <ConfirmDialog
                            trigger={
                              <Button variant="ghost" size="icon" aria-label="Eliminar">
                                <Trash2 className="size-4 text-negative" />
                              </Button>
                            }
                            title="Eliminar presupuesto"
                            description={`¿Seguro que quieres eliminar el presupuesto de "${budget.categoryName}"?`}
                            onConfirm={() => deleteBudget.mutate(budget.id)}
                            isPending={deleteBudget.isPending}
                          />
                        </div>
                      </div>

                      <div className="mt-4">
                        <Progress
                          value={pct}
                          className={cn(isOver && "[&>div]:bg-negative")}
                        />
                        <div className="mt-2 flex items-center justify-between text-xs">
                          <AnimatedCurrency
                            value={spent}
                            className={cn("font-medium", isOver && "text-negative")}
                          />
                          <span className={cn("text-muted", isOver && "text-negative")}>
                            {isOver
                              ? `Excedido por ${formatCurrency(Math.abs(remaining))}`
                              : `Quedan ${formatCurrency(remaining)}`}
                          </span>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </>
  );
}
