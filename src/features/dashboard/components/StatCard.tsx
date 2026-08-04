import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/currency";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  helper?: string;
  progress?: number;
}

export function StatCard({ icon: Icon, label, value, helper, progress }: StatCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-2.5">
        <div className="flex size-8 items-center justify-center rounded-kubo-sm bg-surface-hover text-muted">
          <Icon className="size-4" />
        </div>
        <p className="text-sm font-medium text-muted">{label}</p>
      </div>
      <p className="mt-3 font-mono text-2xl font-semibold tabular">{formatCurrency(value)}</p>
      {typeof progress === "number" && (
        <div className="mt-3">
          <Progress value={progress} />
        </div>
      )}
      {helper && <p className="mt-2 text-xs text-muted">{helper}</p>}
    </Card>
  );
}
