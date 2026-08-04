import { type LucideIcon } from "lucide-react";
import { Card, CardContent } from "./card";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <Card className={className}>
      <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
        {Icon && (
          <div className="flex size-12 items-center justify-center rounded-kubo-sm bg-surface-hover text-muted">
            <Icon className="size-6" />
          </div>
        )}
        <p className="text-sm font-medium">{title}</p>
        {description && <p className="max-w-xs text-sm text-muted">{description}</p>}
        {action && <div className="mt-2">{action}</div>}
      </CardContent>
    </Card>
  );
}
