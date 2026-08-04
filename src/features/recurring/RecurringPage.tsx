import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Repeat, Trash2 } from "lucide-react";
import { Topbar } from "@/components/layout/Topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useCurrency } from "@/app/providers/CurrencyProvider";
import { getCategoryIconByKey } from "@/lib/category-icons";
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

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("es-PE", { day: "2-digit", month: "short", year: "numeric" }).format(
    new Date(iso)
  );
}

export function RecurringPage() {
  const { data: recurring = [], isLoading } = useRecurringTransactions();
  const deleteRecurring = useDeleteRecurring();
  const toggleRecurring = useToggleRecurring();
  const { formatSignedCurrency } = useCurrency();

  return (
    <>
      <Topbar
        title="Recurrentes"
        subtitle="Sueldos, suscripciones y otros movimientos que se repiten solos."
        action={<RecurringFormDialog />}
      />

      <div className="mt-6 px-6 md:mt-8 md:px-10">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted">
            <Loader2 className="size-4 animate-spin" /> Cargando recurrentes...
          </div>
        ) : recurring.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-surface-hover text-muted">
                <Repeat className="size-5" />
              </div>
              <p className="text-sm font-medium">Todavía no tienes movimientos recurrentes</p>
              <p className="max-w-xs text-sm text-muted">
                Registra tu sueldo, alquiler o suscripciones y Kubo los agrega automáticamente cada
                vez que abras la app.
              </p>
              <RecurringFormDialog
                trigger={<Button className="mt-2">Crear mi primer recurrente</Button>}
              />
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="flex flex-col p-0">
              <AnimatePresence initial={false}>
                {recurring.map((item, i) => {
                  const Icon = getCategoryIconByKey(item.categoryIcon);
                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeOut", delay: i * 0.03 }}
                      className={cn(
                        "flex items-center gap-3 px-5 py-4",
                        i !== recurring.length - 1 && "border-b border-border",
                        !item.isActive && "opacity-50"
                      )}
                    >
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-kubo-sm bg-surface-hover text-muted">
                        <Icon className="size-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{item.description}</p>
                        <p className="text-xs text-muted">
                          {frequencyLabels[item.frequency]} · Próximo {formatDate(item.nextOccurrence)}
                        </p>
                      </div>
                      <p
                        className={cn(
                          "shrink-0 font-mono text-sm font-medium tabular",
                          item.kind === "income" ? "text-accent" : "text-foreground"
                        )}
                      >
                        {formatSignedCurrency(item.kind === "income" ? item.amount : -item.amount)}
                      </p>
                      <div className="flex shrink-0 items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            toggleRecurring.mutate({ id: item.id, isActive: !item.isActive })
                          }
                        >
                          {item.isActive ? "Pausar" : "Reactivar"}
                        </Button>
                        <ConfirmDialog
                          trigger={
                            <Button variant="ghost" size="icon" aria-label="Eliminar">
                              <Trash2 className="size-4 text-negative" />
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
