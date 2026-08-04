import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { AnimatedCurrency } from "@/components/shared/AnimatedCurrency";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  helper?: string;
  tone?: "accent" | "negative";
}

export function StatCard({ icon: Icon, label, value, helper, tone = "accent" }: StatCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex size-9 items-center justify-center rounded-kubo-sm",
            tone === "negative" ? "bg-negative/10 text-negative" : "bg-accent/10 text-accent"
          )}
        >
          <Icon className="size-4" />
        </div>
        <p className="text-sm font-medium text-foreground">{label}</p>
      </div>
      <AnimatedCurrency value={value} className="mt-4 text-3xl font-semibold" />
      {helper && <p className="mt-3 text-xs text-muted">{helper}</p>}
    </Card>
  );
}
