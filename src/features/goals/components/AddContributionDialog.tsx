import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormDialogShell } from "@/components/ui/form-dialog-shell";
import { cn } from "@/lib/utils";
import { useContributeToGoal } from "../hooks";
import type { Goal } from "../hooks";

const schema = z.object({
  amount: z.number({ error: "Ingresa un monto válido" }).positive("Ingresa un monto válido"),
});

type FormValues = z.infer<typeof schema>;

export function AddContributionDialog({ goal }: { goal: Goal }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"add" | "withdraw">("add");
  const contribute = useContributeToGoal();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { amount: 0 },
  });

  const onSubmit = async (values: FormValues) => {
    await contribute.mutateAsync({
      goal,
      amount: mode === "add" ? values.amount : -values.amount,
    });
    reset({ amount: 0 });
    setMode("add");
    setOpen(false);
  };

  return (
    <FormDialogShell
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          reset({ amount: 0 });
          setMode("add");
        }
      }}
      trigger={
        <Button size="sm" variant="secondary">
          Registrar aporte
        </Button>
      }
      title={goal.name}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="mt-5 flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-1 rounded-kubo-sm border border-border bg-surface-hover p-1">
          {(["add", "withdraw"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={cn(
                "rounded-kubo-sm py-2 text-sm font-medium transition-colors duration-200",
                mode === m ? "bg-surface text-foreground shadow-kubo" : "text-muted"
              )}
            >
              {m === "add" ? "Aportar" : "Retirar"}
            </button>
          ))}
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
            className="font-mono tabular-nums"
            autoFocus
            onFocus={(e) => e.currentTarget.select()}
            {...register("amount", { valueAsNumber: true })}
          />
          {errors.amount && <p className="text-xs text-negative">{errors.amount.message}</p>}
        </div>

        <Button type="submit" size="lg" disabled={contribute.isPending} className="mt-1">
          {contribute.isPending && <Loader2 className="size-4 animate-spin" />}
          {mode === "add" ? "Registrar aporte" : "Registrar retiro"}
        </Button>
      </form>
    </FormDialogShell>
  );
}
