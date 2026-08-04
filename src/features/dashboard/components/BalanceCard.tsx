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
    <Card className="relative overflow-hidden p-6 md:p-8">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-accent/10 blur-3xl"
      />
      <p className="text-sm font-medium text-muted">Balance total</p>
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="mt-2"
      >
        <AnimatedCurrency
          value={balance}
          className="text-4xl font-semibold tracking-tight md:text-5xl"
        />
      </motion.div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Metric
          icon={ArrowUpRight}
          label="Ingresos del mes"
          value={income}
          tone="accent"
        />
        <Metric
          icon={ArrowDownRight}
          label="Gastos del mes"
          value={expense}
          tone="negative"
        />
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
    <div className="flex items-center gap-2.5 rounded-kubo-sm border border-border bg-surface-hover px-3.5 py-2.5">
      <div
        className={cn(
          "flex size-7 items-center justify-center rounded-full",
          tone === "accent" ? "bg-accent/15 text-accent" : "bg-negative/15 text-negative"
        )}
      >
        <Icon className="size-4" />
      </div>
      <div>
        <p className="text-[11px] text-muted">{label}</p>
        <AnimatedCurrency value={value} className="text-sm font-medium" />
      </div>
    </div>
  );
}

