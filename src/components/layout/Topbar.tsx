import type { ReactNode } from "react";
import { MobileNav } from "./MobileNav";

interface TopbarProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function Topbar({ title, subtitle, action }: TopbarProps) {
  return (
    <header className="flex items-start justify-between gap-4 px-6 pt-8 md:px-10 md:pt-10">
      <div className="flex items-center gap-3">
        <MobileNav />
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="shrink-0 pt-1">{action}</div>}
    </header>
  );
}
