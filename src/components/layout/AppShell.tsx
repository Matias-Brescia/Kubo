import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { useRunDueRecurringTransactions } from "@/features/recurring/hooks";

export function AppShell({ children }: { children: ReactNode }) {
  // Se ejecuta una vez por sesión: genera los movimientos recurrentes
  // vencidos (sueldo, suscripciones, etc.) sin importar en qué página
  // entre el usuario primero.
  useRunDueRecurringTransactions();

  return (
    <div className="flex h-screen overflow-hidden bg-bg text-foreground">
      <Sidebar />
      <main className="flex-1 overflow-y-auto pb-16">{children}</main>
    </div>
  );
}
