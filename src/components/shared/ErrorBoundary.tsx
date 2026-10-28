import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Última red de seguridad: si algo lanza un error al renderizar, en vez de
 * dejar la pantalla en blanco (o una pantalla de error genérica) muestra un
 * mensaje de Kubo con salida clara. Debe ser un componente de clase: React
 * solo ofrece `getDerivedStateFromError` / `componentDidCatch` ahí.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Queda en la consola del navegador para poder diagnosticarlo.
    console.error("Kubo: error no controlado", error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="flex min-h-dvh items-center justify-center bg-bg px-6 text-foreground">
        <div className="flex max-w-sm flex-col items-center gap-3 text-center">
          <div className="flex size-12 items-center justify-center rounded-kubo-sm bg-negative/10 text-negative">
            <AlertTriangle className="size-6" aria-hidden="true" />
          </div>
          <h1 className="text-lg font-semibold">Algo salió mal</h1>
          <p className="text-sm text-muted">
            Ocurrió un error inesperado. Lo que ya guardaste no se ve afectado. Recarga la página
            y, si el problema continúa, vuelve al inicio.
          </p>
          <div className="mt-2 flex gap-2">
            <Button onClick={() => window.location.reload()}>Recargar</Button>
            <Button variant="secondary" asChild>
              <a href="/">Ir al inicio</a>
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
