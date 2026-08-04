import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { Topbar } from "@/components/layout/Topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useCurrency } from "@/app/providers/CurrencyProvider";
import { getCategoryIconByKey } from "@/lib/category-icons";
import { cn } from "@/lib/utils";
import { useDeleteTransaction, useTransactions } from "./hooks";
import { TransactionFormDialog } from "./components/TransactionFormDialog";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

export function TransactionsPage() {
  const { data: transactions = [], isLoading } = useTransactions();
  const deleteTransaction = useDeleteTransaction();
  const { formatSignedCurrency } = useCurrency();

  return (
    <>
      <Topbar
        title="Transacciones"
        subtitle="Historial completo de tus movimientos."
        action={<TransactionFormDialog />}
      />

      <div className="mt-6 px-6 md:mt-8 md:px-10">
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted">
                <Loader2 className="size-4 animate-spin" /> Cargando movimientos...
              </div>
            ) : transactions.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-16 text-center">
                <p className="text-sm font-medium">Todavía no tienes movimientos</p>
                <p className="text-sm text-muted">Registra tu primer gasto o ingreso.</p>
                <TransactionFormDialog
                  trigger={
                    <Button className="mt-2">
                      <Plus className="size-4" /> Registrar movimiento
                    </Button>
                  }
                />
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {transactions.map((tx) => {
                  const Icon = getCategoryIconByKey(tx.categoryIcon);
                  return (
                    <li key={tx.id} className="group flex items-center gap-3 px-5 py-3.5">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-kubo-sm bg-surface-hover text-muted">
                        <Icon className="size-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{tx.description}</p>
                        <p className="text-xs text-muted">
                          {tx.categoryName} · {formatDate(tx.occurredOn)}
                        </p>
                      </div>
                      <p
                        className={cn(
                          "shrink-0 font-mono text-sm font-medium tabular",
                          tx.kind === "income" ? "text-accent" : "text-foreground"
                        )}
                      >
                        {formatSignedCurrency(tx.kind === "income" ? tx.amount : -tx.amount)}
                      </p>
                      <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <TransactionFormDialog
                          transaction={tx}
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
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
