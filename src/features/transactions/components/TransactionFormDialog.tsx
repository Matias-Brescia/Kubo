import { useEffect, useRef, useState, type ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CalendarDays, ChevronDown, Loader2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useCategories } from "@/features/categories/hooks";
import { useCreateTransaction, useUpdateTransaction } from "../hooks";
import { todayLocal, yesterdayLocal, parseLocalIso } from "@/lib/date";
import type { Transaction } from "../hooks";
import type { TransactionKind } from "@/lib/database.types";

const today = todayLocal;
const yesterday = yesterdayLocal;
function friendlyDate(iso: string) {
  const t = today();
  const y = yesterday();
  if (iso === t) return "Hoy";
  if (iso === y) return "Ayer";
  return new Intl.DateTimeFormat("es-PE", { day: "2-digit", month: "short", year: "numeric" }).format(
    parseLocalIso(iso)
  );
}

const schema = z.object({
  description: z.string().min(2, "Escribe una descripción"),
  amount: z.number({ error: "Ingresa un monto válido" }).positive("Ingresa un monto válido"),
  categoryId: z.string().min(1, "Elige una categoría"),
  kind: z.enum(["income", "expense"]),
});

type FormValues = z.infer<typeof schema>;

interface TransactionFormDialogProps {
  transaction?: Transaction;
  trigger?: ReactNode;
}

export function TransactionFormDialog({ transaction, trigger }: TransactionFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<TransactionKind>(transaction?.kind ?? "expense");
  const [occurredOn, setOccurredOn] = useState(transaction?.occurredOn ?? today());
  const [dateMenuOpen, setDateMenuOpen] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const dateMenuRef = useRef<HTMLDivElement>(null);
  const { data: categories = [] } = useCategories();
  const createTransaction = useCreateTransaction();
  const updateTransaction = useUpdateTransaction();
  const isEditing = !!transaction;
  const isPending = createTransaction.isPending || updateTransaction.isPending;

  // Cierra el menú de fecha al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dateMenuRef.current && !dateMenuRef.current.contains(e.target as Node)) {
        setDateMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
          occurredOn,
        },
      });
    } else {
      await createTransaction.mutateAsync({
        description: values.description,
        amount: values.amount,
        kind: values.kind,
        categoryId: values.categoryId,
        occurredOn,
      });
    }
    reset({ description: "", amount: 0, categoryId: categories[0]?.id ?? "", kind: "expense" });
    setKind("expense");
    setOccurredOn(today());
    setShowDatePicker(false);
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
          setOccurredOn(today());
          setShowDatePicker(false);
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
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-kubo border border-border bg-surface p-6 shadow-kubo-lg outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95">
          <div className="flex items-center justify-between">
            <Dialog.Title className="text-base font-semibold">
              {isEditing ? "Editar movimiento" : "Nuevo movimiento"}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                className="flex size-7 items-center justify-center rounded-kubo-sm text-muted transition-colors duration-200 hover:bg-surface-hover hover:text-foreground"
                aria-label="Cerrar"
              >
                <X className="size-4" />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-5 flex flex-col gap-4">
            {/* Tipo: Gasto / Ingreso */}
            <div className="grid grid-cols-2 gap-1 rounded-kubo-sm border border-border bg-surface-hover p-1">
              {(["expense", "income"] as TransactionKind[]).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setKind(k)}
                  className={cn(
                    "rounded-kubo-sm py-2 text-sm font-medium transition-all duration-200",
                    kind === k ? "bg-surface text-foreground shadow-kubo" : "text-muted hover:text-foreground"
                  )}
                >
                  {k === "expense" ? "Gasto" : "Ingreso"}
                </button>
              ))}
            </div>

            {/* Descripción */}
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

            {/* Monto */}
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

            {/* Categoría */}
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

            {/* Fecha — selector inteligente */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted">Fecha</label>
              <div ref={dateMenuRef} className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setDateMenuOpen((v) => !v);
                    setShowDatePicker(false);
                  }}
                  className="flex h-10 w-full items-center gap-2 rounded-kubo-sm border border-border bg-surface-hover px-3.5 text-sm text-foreground transition-all duration-200 hover:bg-surface-hover/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                >
                  <CalendarDays className="size-4 text-muted" />
                  <span className="flex-1 text-left">{friendlyDate(occurredOn)}</span>
                  <ChevronDown className="size-4 text-muted opacity-50" />
                </button>

                {/* Dropdown de opciones rápidas */}
                {dateMenuOpen && !showDatePicker && (
                  <div className="absolute left-0 top-full z-20 mt-1.5 w-full overflow-hidden rounded-kubo-sm border border-border bg-surface shadow-kubo-lg">
                    {[
                      { label: "Hoy", value: today() },
                      { label: "Ayer", value: yesterday() },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          setOccurredOn(opt.value);
                          setDateMenuOpen(false);
                        }}
                        className={cn(
                          "flex w-full items-center gap-2 px-4 py-2.5 text-sm transition-colors duration-200 duration-150 hover:bg-surface-hover",
                          occurredOn === opt.value ? "font-medium text-foreground" : "text-muted"
                        )}
                      >
                        {opt.label}
                        {occurredOn === opt.value && (
                          <span className="ml-auto text-xs text-accent">✓</span>
                        )}
                      </button>
                    ))}
                    <div className="h-px bg-border" />
                    <button
                      type="button"
                      onClick={() => {
                        setShowDatePicker(true);
                        setDateMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-muted transition-colors duration-200 duration-150 hover:bg-surface-hover hover:text-foreground"
                    >
                      <CalendarDays className="size-3.5" />
                      Elegir fecha...
                    </button>
                  </div>
                )}
              </div>

              {/* DatePicker nativo — solo si eligió "Elegir fecha" */}
              {showDatePicker && (
                <Input
                  type="date"
                  value={occurredOn}
                  max={today()}
                  onChange={(e) => setOccurredOn(e.target.value || today())}
                  className="mt-1"
                />
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

