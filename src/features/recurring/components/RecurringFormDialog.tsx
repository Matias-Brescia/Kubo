import { useState, type ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useCategories } from "@/features/categories/hooks";
import { useCreateRecurring } from "../hooks";
import type { TransactionKind, RecurringFrequency } from "@/lib/database.types";

const schema = z.object({
  description: z.string().min(2, "Escribe una descripción"),
  amount: z.number({ error: "Ingresa un monto válido" }).positive("Ingresa un monto válido"),
  categoryId: z.string().min(1, "Elige una categoría"),
  kind: z.enum(["income", "expense"]),
  frequency: z.enum(["weekly", "monthly", "yearly"]),
  startDate: z.string().min(1, "Elige una fecha"),
});

type FormValues = z.infer<typeof schema>;

const frequencyLabels: Record<RecurringFrequency, string> = {
  weekly: "Cada semana",
  monthly: "Cada mes",
  yearly: "Cada año",
};

export function RecurringFormDialog({ trigger }: { trigger?: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<TransactionKind>("expense");
  const { data: categories = [] } = useCategories();
  const createRecurring = useCreateRecurring();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      description: "",
      amount: 0,
      categoryId: categories[0]?.id ?? "",
      kind: "expense",
      frequency: "monthly",
      startDate: new Date().toISOString().slice(0, 10),
    },
  });

  const relevantCategories = categories.filter((c) => c.kind === kind || c.kind === "both");

  const onSubmit = async (values: FormValues) => {
    await createRecurring.mutateAsync(values);
    reset({
      description: "",
      amount: 0,
      categoryId: categories[0]?.id ?? "",
      kind: "expense",
      frequency: "monthly",
      startDate: new Date().toISOString().slice(0, 10),
    });
    setKind("expense");
    setOpen(false);
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setKind("expense");
      }}
    >
      <Dialog.Trigger asChild>
        {trigger ?? (
          <Button size="lg">
            <Plus className="size-4" />
            Nuevo recurrente
          </Button>
        )}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/50 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-kubo border border-border bg-surface p-6 shadow-kubo-lg outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95">
          <div className="flex items-center justify-between">
            <Dialog.Title className="text-base font-semibold">Nuevo recurrente</Dialog.Title>
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
            <div className="grid grid-cols-2 gap-1 rounded-kubo-sm border border-border bg-surface-hover p-1">
              {(["expense", "income"] as TransactionKind[]).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => {
                    setKind(k);
                    setValue("kind", k);
                  }}
                  className={cn(
                    "rounded-kubo-sm py-2 text-sm font-medium transition-colors duration-200",
                    kind === k ? "bg-surface text-foreground shadow-kubo" : "text-muted"
                  )}
                >
                  {k === "expense" ? "Gasto" : "Ingreso"}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted" htmlFor="description">
                Descripción
              </label>
              <Input
                id="description"
                autoFocus
                placeholder="Ej. Sueldo, Netflix, Alquiler..."
                {...register("description")}
              />
              {errors.description && (
                <p className="text-xs text-negative">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted" htmlFor="amount">
                  Monto
                </label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  inputMode="decimal"
                  placeholder="0.00"
                  className="font-mono tabular-nums"
                  onFocus={(e) => e.currentTarget.select()}
                  {...register("amount", { valueAsNumber: true })}
                />
                {errors.amount && <p className="text-xs text-negative">{errors.amount.message}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted" htmlFor="frequency">
                  Frecuencia
                </label>
                <Select id="frequency" {...register("frequency")}>
                  {(Object.keys(frequencyLabels) as RecurringFrequency[]).map((f) => (
                    <option key={f} value={f}>
                      {frequencyLabels[f]}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted" htmlFor="categoryId">
                Categoría
              </label>
              <Select id="categoryId" {...register("categoryId")}>
                {relevantCategories.map((c) => (
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
              <label className="text-xs font-medium text-muted" htmlFor="startDate">
                Primera fecha
              </label>
              <Input id="startDate" type="date" {...register("startDate")} />
              {errors.startDate && (
                <p className="text-xs text-negative">{errors.startDate.message}</p>
              )}
            </div>

            <Button type="submit" size="lg" disabled={createRecurring.isPending} className="mt-1">
              {createRecurring.isPending && <Loader2 className="size-4 animate-spin" />}
              Crear recurrente
            </Button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
