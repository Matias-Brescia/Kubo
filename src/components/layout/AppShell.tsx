import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-bg text-foreground">
      <Sidebar />
      <main className="flex-1 pb-16">{children}</main>
    </div>
  );
}
