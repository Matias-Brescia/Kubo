import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { useRunDueRecurringTransactions } from "@/features/recurring/hooks";

export function AppShell({ children }: { children: ReactNode }) {
  // Se ejecuta una vez por sesión: genera los movimientos recurrentes
  // vencidos (sueldo, suscripciones, etc.) sin importar en qué página
  // entre el usuario primero.
  useRunDueRecurringTransactions();

  // Desktop (md+): altura fija de viewport; el sidebar queda quieto y solo
  // `main` hace scroll. Móvil: no hay sidebar, así que la página scrollea
  // normal — con un contenedor de altura fija + scroll interno, los
  // navegadores móviles no pueden colapsar su barra de URL y `100vh` incluye
  // el área tapada por ella.
  return (
    <div className="flex min-h-dvh bg-bg text-foreground md:h-screen md:overflow-hidden">
      <Sidebar />
      <main className="flex-1 pb-16 md:overflow-y-auto">{children}</main>
    </div>
  );
}
