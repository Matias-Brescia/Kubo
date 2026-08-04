import { useEffect, useState, type ReactNode } from "react";
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
import { useCreateTransaction, useUpdateTransaction } from "../hooks";
import type { Transaction } from "../hooks";
import type { TransactionKind } from "@/lib/database.types";

const schema = z.object({
  description: z.string().min(2, "Escribe una descripción"),
  amount: z.number({ error: "Ingresa un monto válido" }).positive("Ingresa un monto válido"),
  categoryId: z.string().min(1, "Elige una categoría"),
  kind: z.enum(["income", "expense"]),
});

type FormValues = z.infer<typeof schema>;

interface TransactionFormDialogProps {
  /** Cuando se pasa, el diálogo edita esa transacción en vez de crear una nueva */
  transaction?: Transaction;
  /** Trigger personalizado (ej. un botón de ícono en una fila). Por defecto usa el botón "Registrar movimiento". */
  trigger?: ReactNode;
}

export function TransactionFormDialog({ transaction, trigger }: TransactionFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<TransactionKind>(transaction?.kind ?? "expense");
  const { data: categories = [] } = useCategories();
  const createTransaction = useCreateTransaction();
  const updateTransaction = useUpdateTransaction();
  const isEditing = !!transaction;
  const isPending = createTransaction.isPending || updateTransaction.isPending;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      description: transaction?.description ?? "",
      amount: transaction?.amount ?? 0,
      categoryId: transaction?.categoryId ?? categories[0]?.id ?? "",
      kind: transaction?.kind ?? "expense",
    },
  });

  useEffect(() => {
    setValue("kind", kind);
  }, [kind, setValue]);

  const relevantCategories = categories.filter((c) => c.kind === kind || c.kind === "both");

  const onSubmit = async (values: FormValues) => {
    if (isEditing) {
      await updateTransaction.mutateAsync({
        id: transaction.id,
        input: {
          description: values.description,
          amount: values.amount,
          kind: values.kind,
          categoryId: values.categoryId,
          occurredOn: transaction.occurredOn,
        },
      });
    } else {
      await createTransaction.mutateAsync({
        description: values.description,
        amount: values.amount,
        kind: values.kind,
        categoryId: values.categoryId,
      });
    }
    reset({ description: "", amount: 0, categoryId: categories[0]?.id ?? "", kind: "expense" });
    setKind("expense");
    setOpen(false);
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next && !isEditing) {
          reset({ description: "", amount: 0, categoryId: categories[0]?.id ?? "", kind: "expense" });
          setKind("expense");
        }
      }}
    >
      <Dialog.Trigger asChild>
        {trigger ?? (
          <Button size="lg">
            <Plus className="size-4" />
            Registrar movimiento
          </Button>
        )}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/50 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-kubo border border-border bg-surface p-6 shadow-kubo-lg outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95">
          <div className="flex items-center justify-between">
            <Dialog.Title className="text-base font-semibold">
              {isEditing ? "Editar movimiento" : "Nuevo movimiento"}
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
            <div className="grid grid-cols-2 gap-1 rounded-kubo-sm border border-border bg-surface-hover p-1">
              {(["expense", "income"] as TransactionKind[]).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setKind(k)}
                  className={cn(
                    "rounded-[8px] py-2 text-sm font-medium transition-colors",
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
                placeholder="Ej. Almuerzo, Uber, Netflix..."
                {...register("description")}
              />
              {errors.description && (
                <p className="text-xs text-negative">{errors.description.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted" htmlFor="amount">
                Monto (S/)
              </label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                inputMode="decimal"
                placeholder="0.00"
                className="font-mono tabular"
                onFocus={(e) => e.currentTarget.select()}
                {...register("amount", { valueAsNumber: true })}
              />
              {errors.amount && <p className="text-xs text-negative">{errors.amount.message}</p>}
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

            <Button type="submit" size="lg" disabled={isPending} className="mt-1">
              {isPending && <Loader2 className="size-4 animate-spin" />}
              {isEditing ? "Guardar cambios" : "Guardar movimiento"}
            </Button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
