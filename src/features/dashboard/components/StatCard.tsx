import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { AnimatedCurrency } from "@/components/shared/AnimatedCurrency";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  helper?: string;
}

export function StatCard({ icon: Icon, label, value, helper }: StatCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-kubo-sm bg-surface-hover text-accent">
          <Icon className="size-4" />
        </div>
        <p className="text-sm font-medium text-foreground">{label}</p>
      </div>
      <AnimatedCurrency value={value} className="mt-4 text-3xl font-semibold" />
      {helper && <p className="mt-3 text-xs text-muted">{helper}</p>}
    </Card>
  );
}
