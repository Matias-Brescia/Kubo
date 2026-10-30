import * as Dialog from "@radix-ui/react-dialog";
import { ArrowLeftRight, Pencil, PiggyBank, Target, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/Logo";

const steps = [
  {
    icon: ArrowLeftRight,
    title: "Ya tienes categorías listas",
    description:
      "Creamos categorías comunes de ingresos y gastos para que empieces a registrar movimientos de inmediato.",
  },
  {
    icon: Pencil,
    title: "Edita o elimina un movimiento",
    description: "Pasa el mouse sobre él para ver los botones; en el celular, tócalo.",
  },
  {
    icon: PiggyBank,
    title: "Controla tus gastos con presupuestos",
    description: "Define un límite mensual por categoría y Kubo te avisa cuando estés por superarlo.",
  },
  {
    icon: Target,
    title: "Ponte metas de ahorro",
    description: "Crea objetivos como un viaje o un fondo de emergencia y registra tus aportes.",
  },
];

export function OnboardingDialog({ open, onDismiss }: { open: boolean; onDismiss: () => void }) {
  return (
    <Dialog.Root open={open} onOpenChange={(next) => !next && onDismiss()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-kubo border border-border bg-surface p-6 shadow-kubo-lg outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <Logo className="size-7" />
              <span className="text-sm font-semibold tracking-tight">Kubo</span>
            </div>
            <Dialog.Close asChild>
              <button
                className="flex size-8 items-center justify-center rounded-kubo-sm text-muted transition-colors duration-200 hover:bg-surface-hover hover:text-foreground"
                aria-label="Cerrar bienvenida"
              >
                <X className="size-4" />
              </button>
            </Dialog.Close>
          </div>

          <Dialog.Title className="mt-5 text-xl font-semibold tracking-tight">
            Bienvenido a Kubo
          </Dialog.Title>
          <Dialog.Description className="mt-1.5 text-sm leading-relaxed text-muted">
            Un vistazo rápido antes de empezar.
          </Dialog.Description>

          <div className="mt-6 flex flex-col gap-4">
            {steps.map((step) => (
              <div key={step.title} className="flex gap-3.5">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-kubo-sm bg-accent/10 text-accent">
                  <step.icon className="size-4" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{step.title}</p>
                  <p className="mt-0.5 text-sm leading-relaxed text-muted">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <Button size="lg" className="mt-6 w-full" onClick={onDismiss}>
            Empezar
          </Button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
