import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ArrowLeftRight, PiggyBank, Target, BarChart3, Settings } from "lucide-react";
import { ThemeProvider } from "./app/providers/ThemeProvider";
import { AppShell } from "./components/layout/AppShell";
import { DashboardPage } from "./features/dashboard/DashboardPage";
import { ComingSoonPage } from "./components/shared/ComingSoonPage";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppShell>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route
              path="/transacciones"
              element={
                <ComingSoonPage
                  title="Transacciones"
                  icon={ArrowLeftRight}
                  description="Historial completo, filtros y búsqueda de todos tus movimientos."
                />
              }
            />
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
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
