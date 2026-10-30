import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { ThemeProvider } from "./app/providers/ThemeProvider";
import { CurrencyProvider } from "./app/providers/CurrencyProvider";
import { AuthProvider } from "./features/auth/AuthProvider";
import { ProtectedRoute } from "./features/auth/ProtectedRoute";
import { GuestRoute } from "./features/auth/GuestRoute";
import { LoginPage } from "./features/auth/LoginPage";
import { RegisterPage } from "./features/auth/RegisterPage";
import { AppShell } from "./components/layout/AppShell";

// Dashboard se carga de entrada (es la pantalla principal tras iniciar sesión).
import { DashboardPage } from "./features/dashboard/DashboardPage";

// El resto de páginas se cargan bajo demanda para reducir el bundle inicial.
const TransactionsPage = lazy(() =>
  import("./features/transactions/TransactionsPage").then((m) => ({ default: m.TransactionsPage }))
);
const RecurringPage = lazy(() =>
  import("./features/recurring/RecurringPage").then((m) => ({ default: m.RecurringPage }))
);
const CategoriesPage = lazy(() =>
  import("./features/categories/CategoriesPage").then((m) => ({ default: m.CategoriesPage }))
);
const BudgetsPage = lazy(() =>
  import("./features/budgets/BudgetsPage").then((m) => ({ default: m.BudgetsPage }))
);
const GoalsPage = lazy(() =>
  import("./features/goals/GoalsPage").then((m) => ({ default: m.GoalsPage }))
);
const ReportsPage = lazy(() =>
  import("./features/reports/ReportsPage").then((m) => ({ default: m.ReportsPage }))
);
const SettingsPage = lazy(() =>
  import("./features/settings/SettingsPage").then((m) => ({ default: m.SettingsPage }))
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
});

function RouteFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center gap-2 text-sm text-muted">
      <Loader2 className="size-4 animate-spin" /> Cargando...
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <AuthProvider>
            <CurrencyProvider>
              <Routes>
                <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
                <Route path="/registro" element={<GuestRoute><RegisterPage /></GuestRoute>} />

                <Route
                  path="/*"
                  element={
                    <ProtectedRoute>
                      <AppShell>
                        <Suspense fallback={<RouteFallback />}>
                          <Routes>
                            <Route path="/" element={<DashboardPage />} />
                            <Route path="/transacciones" element={<TransactionsPage />} />
                            <Route path="/recurrentes" element={<RecurringPage />} />
                            <Route path="/categorias" element={<CategoriesPage />} />
                            <Route path="/presupuestos" element={<BudgetsPage />} />
                            <Route path="/metas" element={<GoalsPage />} />
                            <Route path="/reportes" element={<ReportsPage />} />
                            <Route path="/ajustes" element={<SettingsPage />} />
                            {/* Cualquier URL que no exista lleva al Dashboard. */}
                            <Route path="*" element={<Navigate to="/" replace />} />
                          </Routes>
                        </Suspense>
                      </AppShell>
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </CurrencyProvider>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
