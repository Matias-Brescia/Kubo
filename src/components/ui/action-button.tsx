import * as React from "react";
import { Plus } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ActionButtonProps extends Omit<ButtonProps, "children" | "size" | "asChild"> {
  label: string;
}

/**
 * Botón principal de acción de página ("Registrar movimiento", "Nueva meta"...),
 * el que va en la Topbar. Por debajo de `sm` se reduce a un botón cuadrado con
 * solo el "+"; el texto sigue disponible para lectores de pantalla (sr-only).
 *
 * Usa forwardRef y propaga props porque se usa como hijo de `Dialog.Trigger
 * asChild`, que le inyecta ref y handlers.
 */
const ActionButton = React.forwardRef<HTMLButtonElement, ActionButtonProps>(
  ({ label, className, ...props }, ref) => (
    <Button ref={ref} size="lg" className={cn("max-sm:w-12 max-sm:px-0", className)} {...props}>
      <Plus className="size-4" />
      <span className="max-sm:sr-only">{label}</span>
    </Button>
  )
);
ActionButton.displayName = "ActionButton";

export { ActionButton };
