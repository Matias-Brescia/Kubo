import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Pencil, Target, Trash2 } from "lucide-react";
import { Topbar } from "@/components/layout/Topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { AnimatedCurrency } from "@/components/shared/AnimatedCurrency";
import { formatCurrency } from "@/lib/currency";
import { getCategoryIconByKey } from "@/lib/category-icons";
import { useGoals, useDeleteGoal } from "./hooks";
import { GoalFormDialog } from "./components/GoalFormDialog";
import { AddContributionDialog } from "./components/AddContributionDialog";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("es-PE", { day: "2-digit", month: "short", year: "numeric" }).format(
    new Date(iso)
  );
}

export function GoalsPage() {
  const { data: goals = [], isLoading } = useGoals();
  const deleteGoal = useDeleteGoal();

  return (
    <>
      <Topbar
        title="Metas de ahorro"
        subtitle="Define objetivos y registra tus aportes."
        action={<GoalFormDialog />}
      />

      <div className="mt-6 px-6 md:mt-8 md:px-10">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted">
            <Loader2 className="size-4 animate-spin" /> Cargando metas...
          </div>
        ) : goals.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-surface-hover text-muted">
                <Target className="size-5" />
              </div>
              <p className="text-sm font-medium">Todavía no tienes metas de ahorro</p>
              <p className="max-w-xs text-sm text-muted">
                Crea un objetivo, como un viaje o un fondo de emergencia, y sigue tu avance.
              </p>
              <GoalFormDialog trigger={<Button className="mt-2">Crear mi primera meta</Button>} />
            </CardContent>
          </Card>
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
                    transition={{ duration: 0.3, ease: "easeOut", delay: i * 0.04 }}
                  >
                    <Card className="group p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className="flex size-9 shrink-0 items-center justify-center rounded-kubo-sm bg-surface-hover text-muted">
                            <Icon className="size-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{goal.name}</p>
                            {goal.targetDate && (
                              <p className="text-xs text-muted">Para {formatDate(goal.targetDate)}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                          <GoalFormDialog
                            goal={goal}
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
                            title="Eliminar meta"
                            description={`¿Seguro que quieres eliminar la meta "${goal.name}"?`}
                            onConfirm={() => deleteGoal.mutate(goal.id)}
                            isPending={deleteGoal.isPending}
                          />
                        </div>
                      </div>

                      <div className="mt-4">
                        <Progress value={pct} />
                        <div className="mt-2 flex items-center justify-between text-xs">
                          <span className="font-medium">
                            <AnimatedCurrency value={goal.currentAmount} /> de{" "}
                            {formatCurrency(goal.targetAmount)}
                          </span>
                          <span className={isComplete ? "font-medium text-accent" : "text-muted"}>
                            {isComplete ? "¡Completada! 🎉" : `${pct.toFixed(0)}%`}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4">
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
