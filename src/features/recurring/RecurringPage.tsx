import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Repeat, Trash2 } from "lucide-react";
import { Topbar } from "@/components/layout/Topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { useCurrency } from "@/app/providers/CurrencyProvider";
import { getCategoryIconByKey, getCategoryColorByKey } from "@/lib/category-icons";
import { formatDateLong } from "@/lib/date";
import { cn } from "@/lib/utils";
import {
  useRecurringTransactions,
  useDeleteRecurring,
  useToggleRecurring,
} from "./hooks";
import { RecurringFormDialog } from "./components/RecurringFormDialog";
import type { RecurringFrequency } from "@/lib/database.types";

const frequencyLabels: Record<RecurringFrequency, string> = {
  weekly: "Semanal",
  monthly: "Mensual",
  yearly: "Anual",
};

export function RecurringPage() {
  const { data: recurring = [], isLoading } = useRecurringTransactions();
  const deleteRecurring = useDeleteRecurring();
  const toggleRecurring = useToggleRecurring();
  const { formatSignedCurrency } = useCurrency();

  return (
    <>
      <Topbar
        title="Recurrentes"
        subtitle="Sueldos, suscripciones y movimientos que se repiten solos."
        action={<RecurringFormDialog />}
      />

      <div className="mt-6 px-6 pb-10 md:mt-8 md:px-10">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-20 text-sm text-muted">
            <Loader2 className="size-4 animate-spin" /> Cargando recurrentes...
          </div>
        ) : recurring.length === 0 ? (
          <EmptyState
            icon={Repeat}
            title="Todavía no tienes movimientos recurrentes"
            description="Registra tu sueldo, alquiler o suscripciones y Kubo los agrega automáticamente."
            action={<RecurringFormDialog trigger={<Button>Crear mi primer recurrente</Button>} />}
          />
        ) : (
          <Card>
            <CardContent className="p-0">
              <AnimatePresence initial={false}>
                {recurring.map((item, i) => {
                  const Icon = getCategoryIconByKey(item.categoryIcon);
                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeOut", delay: i * 0.03 }}
                      className={cn(
                        "group flex items-center gap-3 px-5 py-3.5 transition-colors duration-200 hover:bg-surface-hover/50",
                        i !== recurring.length - 1 && "border-b border-border",
                        !item.isActive && "opacity-50"
                      )}
                    >
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-kubo-sm bg-surface-hover">
                        <Icon className={cn("size-4", getCategoryColorByKey(item.categoryIcon))} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{item.description}</p>
                        <div className="mt-0.5 flex items-center gap-1.5">
                          <Badge variant="default" className="px-1.5 py-px text-[10px]">
                            {frequencyLabels[item.frequency]}
                          </Badge>
                          <span className="text-xs text-muted">Próximo {formatDateLong(item.nextOccurrence)}</span>
                        </div>
                      </div>
                      <p
                        className={cn(
                          "shrink-0 font-mono text-sm font-semibold tabular-nums",
                          item.kind === "income" ? "text-accent" : "text-foreground"
                        )}
                      >
                        {formatSignedCurrency(item.kind === "income" ? item.amount : -item.amount)}
                      </p>
                      <div className="flex shrink-0 items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          aria-label={item.isActive ? "Pausar recurrente" : "Reactivar recurrente"}
                          onClick={() => toggleRecurring.mutate({ id: item.id, isActive: !item.isActive })}
                        >
                          {item.isActive ? "Pausar" : "Reactivar"}
                        </Button>
                        <ConfirmDialog
                          trigger={
                            <Button variant="ghost" size="icon" aria-label="Eliminar recurrente">
                              <Trash2 className="size-3.5 text-negative" />
                            </Button>
                          }
                          title="Eliminar recurrente"
                          description={`¿Seguro que quieres eliminar "${item.description}"? Los movimientos ya generados no se borrarán.`}
                          onConfirm={() => deleteRecurring.mutate(item.id)}
                          isPending={deleteRecurring.isPending}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
