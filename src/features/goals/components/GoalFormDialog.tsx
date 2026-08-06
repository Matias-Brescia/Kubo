import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormDialogShell } from "@/components/ui/form-dialog-shell";
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
    <FormDialogShell
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next && !isEditing) {
          reset({ name: "", icon: "target", targetAmount: 0, targetDate: "" });
          setIcon("target");
        }
      }}
      trigger={
        trigger ?? (
          <Button size="lg">
            <Plus className="size-4" />
            Nueva meta
          </Button>
        )
      }
      title={isEditing ? "Editar meta" : "Nueva meta de ahorro"}
    >
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
                    "flex size-9 items-center justify-center rounded-kubo-sm border transition-colors duration-200",
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
            className="font-mono tabular-nums"
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
    </FormDialogShell>
  );
}
