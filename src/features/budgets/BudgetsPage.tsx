import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Pencil, PiggyBank, Trash2 } from "lucide-react";
import { Topbar } from "@/components/layout/Topbar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { AnimatedCurrency } from "@/components/shared/AnimatedCurrency";
import { useCurrency } from "@/app/providers/CurrencyProvider";
import { Card } from "@/components/ui/card";
import { getCategoryIconByKey, getCategoryColorByKey } from "@/lib/category-icons";
import { cn } from "@/lib/utils";
import { useTransactions } from "@/features/transactions/hooks";
import { useBudgets, useDeleteBudget } from "./hooks";
import { computeMonthSpentByCategory } from "./utils";
import { BudgetFormDialog } from "./components/BudgetFormDialog";

export function BudgetsPage() {
  const { data: budgets = [], isLoading } = useBudgets();
  const { data: transactions = [] } = useTransactions();
  const deleteBudget = useDeleteBudget();
  const { formatCurrency } = useCurrency();

  const spentByCategory = computeMonthSpentByCategory(transactions);
  const usedCategoryIds = budgets.map((b) => b.categoryId);

  return (
    <>
      <Topbar
        title="Presupuestos"
        subtitle="Define un límite mensual por categoría y sigue tu avance."
        action={<BudgetFormDialog usedCategoryIds={usedCategoryIds} />}
      />

      <div className="mt-6 px-6 pb-10 md:mt-8 md:px-10">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-20 text-sm text-muted">
            <Loader2 className="size-4 animate-spin" /> Cargando presupuestos...
          </div>
        ) : budgets.length === 0 ? (
          <EmptyState
            icon={PiggyBank}
            title="Todavía no tienes presupuestos"
            description="Crea un límite mensual por categoría para controlar tus gastos."
            action={
              <BudgetFormDialog
                usedCategoryIds={usedCategoryIds}
                trigger={<Button>Crear mi primer presupuesto</Button>}
              />
            }
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence initial={false}>
              {budgets.map((budget, i) => {
                const spent = spentByCategory.get(budget.categoryId) ?? 0;
                const pct = Math.min((spent / budget.monthlyAmount) * 100, 100);
                const remaining = budget.monthlyAmount - spent;
                const isOver = spent > budget.monthlyAmount;
                const isNear = !isOver && pct >= 80;
                const Icon = getCategoryIconByKey(budget.categoryIcon);

                return (
                  <motion.div
                    key={budget.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2, ease: "easeOut", delay: i * 0.04 }}
                  >
                    <Card className="group p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex size-9 shrink-0 items-center justify-center rounded-kubo-sm bg-surface-hover">
                            <Icon className={cn("size-4", getCategoryColorByKey(budget.categoryIcon))} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold">{budget.categoryName}</p>
                            <p className="text-xs text-muted">
                              Límite {formatCurrency(budget.monthlyAmount)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                          <BudgetFormDialog
                            budget={budget}
                            trigger={
                              <Button variant="ghost" size="icon" aria-label="Editar">
                                <Pencil className="size-3.5" />
                              </Button>
                            }
                          />
                          <ConfirmDialog
                            trigger={
                              <Button variant="ghost" size="icon" aria-label="Eliminar">
                                <Trash2 className="size-3.5 text-negative" />
                              </Button>
                            }
                            title="Eliminar presupuesto"
                            description={`¿Seguro que quieres eliminar el presupuesto de "${budget.categoryName}"?`}
                            onConfirm={() => deleteBudget.mutate(budget.id)}
                            isPending={deleteBudget.isPending}
                          />
                        </div>
                      </div>

                      <div className="mt-5">
                        <Progress
                          value={pct}
                          color={isOver ? "danger" : isNear ? "warning" : "accent"}
                        />
                        <div className="mt-2.5 flex items-center justify-between">
                          <AnimatedCurrency
                            value={spent}
                            className={cn(
                              "text-sm font-semibold",
                              isOver ? "text-negative" : "text-foreground"
                            )}
                          />
                          <div className="flex items-center gap-2">
                            {isOver && <Badge variant="danger">Excedido</Badge>}
                            {isNear && !isOver && <Badge variant="warning">80%+</Badge>}
                            <span className={cn("text-xs text-muted", isOver && "text-negative")}>
                              {isOver
                                ? `+${formatCurrency(Math.abs(remaining))}`
                                : `quedan ${formatCurrency(remaining)}`}
                            </span>
                          </div>
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
