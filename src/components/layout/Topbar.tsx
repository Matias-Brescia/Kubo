import type { ReactNode } from "react";
import { MobileNav } from "./MobileNav";

interface TopbarProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function Topbar({ title, subtitle, action }: TopbarProps) {
  return (
    <header className="flex items-center justify-between gap-4 px-6 pt-6 md:px-10 md:pt-10">
      <div className="flex items-center gap-3">
        <MobileNav />
        <div>
          <h1 className="text-xl font-semibold tracking-tight md:text-2xl">{title}</h1>
          {subtitle && <p className="mt-0.5 text-sm text-muted">{subtitle}</p>}
        </div>
      </div>
      {action}
    </header>
  );
}
