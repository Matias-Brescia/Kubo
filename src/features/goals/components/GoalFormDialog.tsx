import { useState, type ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getCategoryIconByKey, availableGoalIcons } from "@/lib/category-icons";
import { cn } from "@/lib/utils";
import { useCreateGoal, useUpdateGoal } from "../hooks";
import type { Goal } from "../hooks";

const schema = z.object({
  name: z.string().min(2, "Ponle un nombre a tu meta"),
  icon: z.string().min(1),
  targetAmount: z
    .number({ error: "Ingresa un monto válido" })
    .positive("Ingresa un monto válido"),
  targetDate: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface GoalFormDialogProps {
  goal?: Goal;
  trigger?: ReactNode;
}

export function GoalFormDialog({ goal, trigger }: GoalFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [icon, setIcon] = useState(goal?.icon ?? "target");
  const createGoal = useCreateGoal();
  const updateGoal = useUpdateGoal();
  const isEditing = !!goal;
  const isPending = createGoal.isPending || updateGoal.isPending;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: goal?.name ?? "",
      icon: goal?.icon ?? "target",
      targetAmount: goal?.targetAmount ?? 0,
      targetDate: goal?.targetDate ?? "",
    },
  });

  const chooseIcon = (value: string) => {
    setIcon(value);
    setValue("icon", value);
  };

  const onSubmit = async (values: FormValues) => {
    const input = {
      name: values.name,
      icon: values.icon,
      targetAmount: values.targetAmount,
      targetDate: values.targetDate || null,
    };
    if (isEditing) {
      await updateGoal.mutateAsync({ id: goal.id, input });
    } else {
      await createGoal.mutateAsync(input);
    }
    reset({ name: "", icon: "target", targetAmount: 0, targetDate: "" });
    setIcon("target");
    setOpen(false);
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next && !isEditing) {
          reset({ name: "", icon: "target", targetAmount: 0, targetDate: "" });
          setIcon("target");
        }
      }}
    >
      <Dialog.Trigger asChild>
        {trigger ?? (
          <Button size="lg">
            <Plus className="size-4" />
            Nueva meta
          </Button>
        )}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/50 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-kubo border border-border bg-surface p-6 shadow-kubo-lg outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95">
          <div className="flex items-center justify-between">
            <Dialog.Title className="text-base font-semibold">
              {isEditing ? "Editar meta" : "Nueva meta de ahorro"}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                className="flex size-7 items-center justify-center rounded-kubo-sm text-muted hover:bg-surface-hover hover:text-foreground"
                aria-label="Cerrar"
              >
                <X className="size-4" />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-5 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted" htmlFor="name">
                Nombre de la meta
              </label>
              <Input
                id="name"
                autoFocus
                placeholder="Ej. Viaje a Cusco, Fondo de emergencia..."
                {...register("name")}
              />
              {errors.name && <p className="text-xs text-negative">{errors.name.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted">Ícono</label>
              <div className="grid grid-cols-5 gap-1.5">
                {availableGoalIcons.map((key) => {
                  const Icon = getCategoryIconByKey(key);
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => chooseIcon(key)}
                      className={cn(
                        "flex size-9 items-center justify-center rounded-kubo-sm border transition-colors",
                        icon === key
                          ? "border-accent bg-accent/15 text-accent"
                          : "border-border bg-surface-hover text-muted hover:text-foreground"
                      )}
                    >
                      <Icon className="size-4" />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted" htmlFor="targetAmount">
                Monto objetivo (S/)
              </label>
              <Input
                id="targetAmount"
                type="number"
                step="0.01"
                inputMode="decimal"
                placeholder="0.00"
                className="font-mono tabular"
                onFocus={(e) => e.currentTarget.select()}
                {...register("targetAmount", { valueAsNumber: true })}
              />
              {errors.targetAmount && (
                <p className="text-xs text-negative">{errors.targetAmount.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted" htmlFor="targetDate">
                Fecha objetivo (opcional)
              </label>
              <Input id="targetDate" type="date" {...register("targetDate")} />
            </div>

            <input type="hidden" {...register("icon")} />

            <Button type="submit" size="lg" disabled={isPending} className="mt-1">
              {isPending && <Loader2 className="size-4 animate-spin" />}
              {isEditing ? "Guardar cambios" : "Crear meta"}
            </Button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
