import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { AnimatedCurrency } from "@/components/shared/AnimatedCurrency";
import { cn } from "@/lib/utils";

interface BalanceCardProps {
  balance: number;
  income: number;
  expense: number;
}

export function BalanceCard({ balance, income, expense }: BalanceCardProps) {
  return (
    <Card className="relative overflow-hidden p-5 sm:p-6 md:p-8" variant="elevated">
      {/* Gradiente sutil que no distrae del contenido */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-accent/8 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 -left-8 size-48 rounded-full bg-info/5 blur-3xl"
      />

      <p className="text-xs font-semibold uppercase tracking-widest text-muted">Balance total</p>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="mt-3"
      >
        <AnimatedCurrency
          value={balance}
          fit
          className="text-4xl font-semibold tracking-tight md:text-5xl"
        />
      </motion.div>

      <div className="mt-5 grid gap-2 sm:mt-6 sm:flex sm:flex-wrap sm:gap-3">
        <Metric icon={ArrowUpRight} label="Ingresos del mes" value={income} tone="accent" />
        <Metric icon={ArrowDownRight} label="Gastos del mes" value={expense} tone="negative" />
      </div>
    </Card>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof ArrowUpRight;
  label: string;
  value: number;
  tone: "accent" | "negative";
}) {
  return (
    <div className="flex w-full items-center gap-3 rounded-kubo-sm border border-border bg-surface-hover px-3 py-2.5 sm:w-auto sm:px-4 sm:py-3">
      <div
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-full",
          tone === "accent" ? "bg-accent/15 text-accent" : "bg-negative/15 text-negative"
        )}
      >
        <Icon className="size-4" />
      </div>
      {/* Móvil: etiqueta a la izquierda y monto a la derecha, en una sola línea. */}
      <div className="flex min-w-0 flex-1 items-center justify-between gap-3 sm:block sm:flex-none">
        <p className="truncate text-xs text-muted">{label}</p>
        <AnimatedCurrency value={value} className="shrink-0 text-sm font-semibold" />
      </div>
    </div>
  );
}

