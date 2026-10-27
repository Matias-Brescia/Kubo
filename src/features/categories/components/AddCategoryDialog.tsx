import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { FormDialogShell } from "@/components/ui/form-dialog-shell";
import { useCreateCategory } from "../hooks";
import {
  availableCategoryIcons,
  getCategoryIconByKey,
  getCategoryColorByKey,
} from "@/lib/category-icons";
import { cn } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2, "Escribe un nombre"),
  kind: z.enum(["income", "expense", "both"]),
  icon: z.string(),
});

type FormValues = z.infer<typeof schema>;

const kindLabels: Record<FormValues["kind"], string> = {
  expense: "Gasto",
  income: "Ingreso",
  both: "Ambos",
};

export function AddCategoryDialog() {
  const [open, setOpen] = useState(false);
  const createCategory = useCreateCategory();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", kind: "expense", icon: availableCategoryIcons[0] },
  });

  const selectedIcon = watch("icon");

  const onSubmit = async (values: FormValues) => {
    await createCategory.mutateAsync(values);
    reset({ name: "", kind: "expense", icon: availableCategoryIcons[0] });
    setOpen(false);
  };

  return (
    <FormDialogShell
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset({ name: "", kind: "expense", icon: availableCategoryIcons[0] });
      }}
      trigger={
        <Button>
          <Plus className="size-4" />
          Nueva categoría
        </Button>
      }
      title="Nueva categoría"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="mt-5 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted" htmlFor="name">
            Nombre
          </label>
          <Input id="name" autoFocus placeholder="Ej. Mascotas" {...register("name")} />
          {errors.name && <p className="text-xs text-negative">{errors.name.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted" htmlFor="kind">
            Tipo
          </label>
          <Select id="kind" {...register("kind")}>
            {(Object.keys(kindLabels) as FormValues["kind"][]).map((k) => (
              <option key={k} value={k}>
                {kindLabels[k]}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted">Ícono</label>
          <div className="grid max-h-48 grid-cols-6 gap-2 overflow-y-auto p-1">
            {availableCategoryIcons.map((icon) => {
              const Icon = getCategoryIconByKey(icon);
              const isSelected = selectedIcon === icon;
              return (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setValue("icon", icon)}
                  className={cn(
                    "flex size-9 items-center justify-center rounded-kubo-sm border transition-colors duration-200",
                    isSelected
                      ? "border-accent bg-accent/15"
                      : "border-border bg-surface-hover text-muted hover:text-foreground"
                  )}
                >
                  <Icon className={cn("size-4", isSelected && getCategoryColorByKey(icon))} />
                </button>
              );
            })}
          </div>
        </div>

        <Button type="submit" size="lg" disabled={createCategory.isPending} className="mt-1">
          {createCategory.isPending && <Loader2 className="size-4 animate-spin" />}
          Crear categoría
        </Button>
      </form>
    </FormDialogShell>
  );
}
