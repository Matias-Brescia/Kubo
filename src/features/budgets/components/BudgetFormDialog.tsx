import { useState, type ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useCategories } from "@/features/categories/hooks";
import { useCreateBudget, useUpdateBudget } from "../hooks";
import type { Budget } from "../hooks";

const schema = z.object({
  categoryId: z.string().min(1, "Elige una categoría"),
  monthlyAmount: z
    .number({ error: "Ingresa un monto válido" })
    .positive("Ingresa un monto válido"),
});

type FormValues = z.infer<typeof schema>;

interface BudgetFormDialogProps {
  budget?: Budget;
  /** Categorías que ya tienen presupuesto (para no duplicar al crear uno nuevo) */
  usedCategoryIds?: string[];
  trigger?: ReactNode;
}

export function BudgetFormDialog({ budget, usedCategoryIds = [], trigger }: BudgetFormDialogProps) {
  const [open, setOpen] = useState(false);
  const { data: categories = [] } = useCategories();
  const createBudget = useCreateBudget();
  const updateBudget = useUpdateBudget();
  const isEditing = !!budget;
  const isPending = createBudget.isPending || updateBudget.isPending;

  const expenseCategories = categories.filter((c) => c.kind === "expense" || c.kind === "both");
  const availableCategories = isEditing
    ? expenseCategories
    : expenseCategories.filter((c) => !usedCategoryIds.includes(c.id));

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      categoryId: budget?.categoryId ?? availableCategories[0]?.id ?? "",
      monthlyAmount: budget?.monthlyAmount ?? 0,
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (isEditing) {
      await updateBudget.mutateAsync({ id: budget.id, input: values });
    } else {
      await createBudget.mutateAsync(values);
    }
    reset({ categoryId: "", monthlyAmount: 0 });
    setOpen(false);
  };

  const noCategoriesLeft = !isEditing && availableCategories.length === 0;

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset({ categoryId: budget?.categoryId ?? "", monthlyAmount: budget?.monthlyAmount ?? 0 });
      }}
    >
      <Dialog.Trigger asChild>
        {trigger ?? (
          <Button size="lg">
            <Plus className="size-4" />
            Nuevo presupuesto
          </Button>
        )}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/50 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-kubo border border-border bg-surface p-6 shadow-kubo-lg outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95">
          <div className="flex items-center justify-between">
            <Dialog.Title className="text-base font-semibold">
              {isEditing ? "Editar presupuesto" : "Nuevo presupuesto"}
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

          {noCategoriesLeft ? (
            <p className="mt-5 text-sm text-muted">
              Ya tienes un presupuesto para todas tus categorías de gasto. Crea una categoría nueva
              si necesitas otra.
            </p>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="mt-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted" htmlFor="categoryId">
                  Categoría
                </label>
                <Select id="categoryId" disabled={isEditing} {...register("categoryId")}>
                  {availableCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </Select>
                {errors.categoryId && (
                  <p className="text-xs text-negative">{errors.categoryId.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted" htmlFor="monthlyAmount">
                  Límite mensual (S/)
                </label>
                <Input
                  id="monthlyAmount"
                  type="number"
                  step="0.01"
                  inputMode="decimal"
                  placeholder="0.00"
                  className="font-mono tabular-nums"
                  autoFocus
                  onFocus={(e) => e.currentTarget.select()}
                  {...register("monthlyAmount", { valueAsNumber: true })}
                />
                {errors.monthlyAmount && (
                  <p className="text-xs text-negative">{errors.monthlyAmount.message}</p>
                )}
              </div>

              <Button type="submit" size="lg" disabled={isPending} className="mt-1">
                {isPending && <Loader2 className="size-4 animate-spin" />}
                {isEditing ? "Guardar cambios" : "Crear presupuesto"}
              </Button>
            </form>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
