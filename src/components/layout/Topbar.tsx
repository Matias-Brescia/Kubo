import type { ReactNode } from "react";
import { MobileNav } from "./MobileNav";

interface TopbarProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function Topbar({ title, subtitle, action }: TopbarProps) {
  return (
    <header className="flex items-start justify-between gap-4 px-6 pt-6 md:px-10 md:pt-10">
      <div className="flex items-start gap-3">
        <MobileNav />
        <div className="min-w-0">
          <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl md:text-3xl">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="shrink-0 pt-1">{action}</div>}
    </header>
  );
}
