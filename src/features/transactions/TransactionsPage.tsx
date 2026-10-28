import { Loader2, Pencil, ReceiptText, Trash2 } from "lucide-react";
import { Topbar } from "@/components/layout/Topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { useCurrency } from "@/app/providers/CurrencyProvider";
import { getCategoryIconByKey, getCategoryColorByKey } from "@/lib/category-icons";
import { cn } from "@/lib/utils";
import { parseLocalIso, todayLocal, yesterdayLocal } from "@/lib/date";
import { useDeleteTransaction, useTransactions } from "./hooks";
import { TransactionFormDialog } from "./components/TransactionFormDialog";

// Agrupar transacciones por fecha
function groupByDate(transactions: ReturnType<typeof useTransactions>["data"]) {
  const groups = new Map<string, typeof transactions>();
  for (const tx of transactions ?? []) {
    const key = tx.occurredOn.slice(0, 10);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(tx);
  }
  return [...groups.entries()].sort((a, b) => b[0].localeCompare(a[0]));
}

function formatGroupDate(iso: string) {
  if (iso === todayLocal()) return "Hoy";
  if (iso === yesterdayLocal()) return "Ayer";
  return new Intl.DateTimeFormat("es-PE", { weekday: "long", day: "numeric", month: "long" }).format(
    parseLocalIso(iso)
  );
}

export function TransactionsPage() {
  const { data: transactions = [], isLoading } = useTransactions();
  const deleteTransaction = useDeleteTransaction();
  const { formatSignedCurrency } = useCurrency();

  const groups = groupByDate(transactions);

  return (
    <>
      <Topbar
        title="Transacciones"
        subtitle="Historial completo de tus movimientos."
        action={<TransactionFormDialog />}
      />

      <div className="mt-6 px-6 pb-10 md:mt-8 md:px-10">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-20 text-sm text-muted">
            <Loader2 className="size-4 animate-spin" /> Cargando movimientos...
          </div>
        ) : transactions.length === 0 ? (
          <EmptyState
            icon={ReceiptText}
            title="Todavía no tienes movimientos"
            description="Registra tu primer gasto o ingreso para empezar a ver tu historial."
            action={
              <TransactionFormDialog
                trigger={<Button>Registrar movimiento</Button>}
              />
            }
          />
        ) : (
          <div className="flex flex-col gap-6">
            {groups.map(([date, txs]) => (
              <div key={date}>
                {/* Separador de fecha */}
                <div className="mb-2 flex items-center gap-3">
                  <p className="text-xs font-semibold tracking-wider text-muted first-letter:uppercase">
                    {formatGroupDate(date)}
                  </p>
                  <div className="h-px flex-1 bg-border" />
                </div>

                {/* Feed de transacciones del día */}
                <Card>
                  <CardContent className="p-0">
                    <ul>
                      {txs!.map((tx, i) => {
                        const Icon = getCategoryIconByKey(tx.categoryIcon);
                        return (
                          <li
                            key={tx.id}
                            className={cn(
                              "group relative flex items-center gap-3 px-4 py-3 transition-colors duration-200 hover:bg-surface-hover/50 md:px-5 md:py-3.5",
                              i !== txs!.length - 1 && "border-b border-border"
                            )}
                          >
                            <div className="flex size-9 shrink-0 items-center justify-center rounded-kubo-sm bg-surface-hover">
                              <Icon className={cn("size-4", getCategoryColorByKey(tx.categoryIcon))} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium">{tx.description}</p>
                              <div className="mt-0.5 flex items-center gap-1.5">
                                <Badge variant="default" className="px-1.5 py-px text-[10px]">
                                  {tx.categoryName}
                                </Badge>
                              </div>
                            </div>
                            <p
                              className={cn(
                                "shrink-0 font-mono text-sm font-semibold tabular-nums",
                                tx.kind === "income" ? "text-accent" : "text-foreground"
                              )}
                            >
                              {formatSignedCurrency(tx.kind === "income" ? tx.amount : -tx.amount)}
                            </p>
                            {/*
                              Acciones: ocultas hasta pasar el mouse o tocar la fila. Mientras están
                              ocultas no reciben toques ni ocupan espacio en móvil (se superponen
                              a la derecha de la fila al revelarse), y también aparecen con foco de
                              teclado (no con foco por mouse, para que no queden fijos tras cerrar un diálogo).
                            */}
                            <div className="pointer-events-none flex shrink-0 items-center gap-1 opacity-0 transition-opacity duration-200 has-[:focus-visible]:pointer-events-auto has-[:focus-visible]:opacity-100 group-hover:pointer-events-auto group-hover:opacity-100 max-md:absolute max-md:right-2 max-md:top-1/2 max-md:-translate-y-1/2 max-md:rounded-kubo-sm max-md:bg-surface max-md:p-0.5 max-md:shadow-kubo">
                              <TransactionFormDialog
                                transaction={tx}
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
                                title="Eliminar movimiento"
                                description={`¿Seguro que quieres eliminar "${tx.description}"? Esta acción no se puede deshacer.`}
                                onConfirm={() => deleteTransaction.mutate(tx.id)}
                                isPending={deleteTransaction.isPending}
                              />
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
