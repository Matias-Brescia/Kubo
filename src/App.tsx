import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PiggyBank, Target, BarChart3, Settings } from "lucide-react";
import { ThemeProvider } from "./app/providers/ThemeProvider";
import { AuthProvider } from "./features/auth/AuthProvider";
import { ProtectedRoute } from "./features/auth/ProtectedRoute";
import { GuestRoute } from "./features/auth/GuestRoute";
import { LoginPage } from "./features/auth/LoginPage";
import { RegisterPage } from "./features/auth/RegisterPage";
import { AppShell } from "./components/layout/AppShell";
import { DashboardPage } from "./features/dashboard/DashboardPage";
import { TransactionsPage } from "./features/transactions/TransactionsPage";
import { CategoriesPage } from "./features/categories/CategoriesPage";
import { ComingSoonPage } from "./components/shared/ComingSoonPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
              <Route path="/registro" element={<GuestRoute><RegisterPage /></GuestRoute>} />

              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <AppShell>
                      <Routes>
                        <Route path="/" element={<DashboardPage />} />
                        <Route path="/transacciones" element={<TransactionsPage />} />
                        <Route path="/categorias" element={<CategoriesPage />} />
                        <Route
                          path="/presupuestos"
                          element={
                            <ComingSoonPage
                              title="Presupuestos"
                              icon={PiggyBank}
                              description="Define límites por categoría y sigue tu progreso mes a mes."
                            />
                          }
                        />
                        <Route
                          path="/metas"
                          element={
                            <ComingSoonPage
                              title="Metas"
                              icon={Target}
                              description="Crea objetivos de ahorro y visualiza cuánto te falta."
                            />
                          }
                        />
                        <Route
                          path="/reportes"
                          element={
                            <ComingSoonPage
                              title="Reportes"
                              icon={BarChart3}
                              description="Analiza tus finanzas con reportes detallados y exportables."
                            />
                          }
                        />
                        <Route
                          path="/ajustes"
                          element={
                            <ComingSoonPage
                              title="Ajustes"
                              icon={Settings}
                              description="Personaliza tu cuenta, moneda y preferencias de Kubo."
                            />
                          }
                        />
                      </Routes>
                    </AppShell>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
