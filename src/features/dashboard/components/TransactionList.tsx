import { AnimatePresence, motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useCurrency } from "@/app/providers/CurrencyProvider";
import { cn } from "@/lib/utils";
import { getCategoryIconByKey } from "@/lib/category-icons";
import type { Transaction } from "@/features/transactions/hooks";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("es-PE", { day: "2-digit", month: "short" }).format(
    new Date(iso)
  );
}

export function TransactionList({ transactions }: { transactions: Transaction[] }) {
  const { formatSignedCurrency } = useCurrency();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Actividad reciente</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {transactions.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted">
            Todavía no hay movimientos. Añade tu primer gasto o ingreso.
          </p>
        ) : (
          <ul className="flex flex-col">
            <AnimatePresence initial={false}>
              {transactions.map((tx, i) => {
                const Icon = getCategoryIconByKey(tx.categoryIcon);
                return (
                  <motion.li
                    key={tx.id}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className={cn(
                      "flex items-center gap-3 py-3",
                      i !== transactions.length - 1 && "border-b border-border"
                    )}
                  >
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
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
