import { AnimatePresence, motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useCurrency } from "@/app/providers/CurrencyProvider";
import { cn } from "@/lib/utils";
import { getCategoryIconByKey, getCategoryColorByKey } from "@/lib/category-icons";
import { parseLocalIso } from "@/lib/date";
import type { Transaction } from "@/features/transactions/hooks";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("es-PE", { day: "2-digit", month: "short" }).format(
    parseLocalIso(iso)
  );
}
export function TransactionList({ transactions }: { transactions: Transaction[] }) {
  const { formatSignedCurrency } = useCurrency();
  return (
    <Card>
      <CardHeader className="pb-0">
        <CardTitle>Actividad reciente</CardTitle>
      </CardHeader>
      <CardContent className="p-0 pt-2">
        {transactions.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-muted">
            Sin movimientos recientes.
          </p>
        ) : (
          <ul>
            <AnimatePresence initial={false}>
              {transactions.map((tx, i) => {
                const Icon = getCategoryIconByKey(tx.categoryIcon);
                return (
                  <motion.li
                    key={tx.id}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className={cn(
                      "flex items-center gap-3 px-5 py-3 transition-colors duration-200 hover:bg-surface-hover/50",
                      i !== transactions.length - 1 && "border-b border-border"
                    )}
                  >
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-kubo-sm bg-surface-hover">
                      <Icon className={cn("size-4", getCategoryColorByKey(tx.categoryIcon))} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{tx.description}</p>
                      <p className="text-xs text-muted">{formatDate(tx.occurredOn)}</p>
                    </div>
                    <p
                      className={cn(
                        "shrink-0 font-mono text-sm font-semibold tabular-nums",
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
