import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Pencil, Target, Trash2 } from "lucide-react";
import { Topbar } from "@/components/layout/Topbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { AnimatedCurrency } from "@/components/shared/AnimatedCurrency";
import { useCurrency } from "@/app/providers/CurrencyProvider";
import { getCategoryIconByKey, getCategoryColorByKey } from "@/lib/category-icons";
import { cn } from "@/lib/utils";
import { parseLocalIso } from "@/lib/date";
import { useGoals, useDeleteGoal } from "./hooks";
import { GoalFormDialog } from "./components/GoalFormDialog";
import { AddContributionDialog } from "./components/AddContributionDialog";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("es-PE", { day: "2-digit", month: "short", year: "numeric" }).format(
    parseLocalIso(iso)
  );
}

export function GoalsPage() {
  const { data: goals = [], isLoading } = useGoals();
  const deleteGoal = useDeleteGoal();
  const { formatCurrency } = useCurrency();

  return (
    <>
      <Topbar
        title="Metas de ahorro"
        subtitle="Define objetivos y registra tus aportes."
        action={<GoalFormDialog />}
      />

      <div className="mt-6 px-6 pb-10 md:mt-8 md:px-10">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-20 text-sm text-muted">
            <Loader2 className="size-4 animate-spin" /> Cargando metas...
          </div>
        ) : goals.length === 0 ? (
          <EmptyState
            icon={Target}
            title="Todavía no tienes metas de ahorro"
            description="Crea un objetivo, como un viaje o un fondo de emergencia, y sigue tu avance."
            action={<GoalFormDialog trigger={<Button>Crear mi primera meta</Button>} />}
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence initial={false}>
              {goals.map((goal, i) => {
                const pct = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
                const isComplete = goal.currentAmount >= goal.targetAmount;
                const Icon = getCategoryIconByKey(goal.icon);

                return (
                  <motion.div
                    key={goal.id}
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
                            <Icon className={cn("size-4", getCategoryColorByKey(goal.icon))} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold">{goal.name}</p>
                            {goal.targetDate && (
                              <p className="text-xs text-muted">Para {formatDate(goal.targetDate)}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                          <GoalFormDialog
                            goal={goal}
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
                            title="Eliminar meta"
                            description={`¿Seguro que quieres eliminar la meta "${goal.name}"?`}
                            onConfirm={() => deleteGoal.mutate(goal.id)}
                            isPending={deleteGoal.isPending}
                          />
                        </div>
                      </div>

                      <div className="mt-5">
                        <Progress value={pct} color={isComplete ? "success" : "accent"} />
                        <div className="mt-2.5 flex items-center justify-between">
                          <span className="text-sm font-semibold">
                            <AnimatedCurrency value={goal.currentAmount} />
                          </span>
                          <div className="flex items-center gap-2">
                            {isComplete && <Badge variant="success">Completada</Badge>}
                            <span className="text-xs text-muted">
                              {isComplete
                                ? formatCurrency(goal.targetAmount)
                                : `de ${formatCurrency(goal.targetAmount)}`}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 border-t border-border pt-4">
                        <AddContributionDialog goal={goal} />
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


