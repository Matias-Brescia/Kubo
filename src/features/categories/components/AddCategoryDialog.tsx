import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useCreateCategory } from "../hooks";
import { availableCategoryIcons, getCategoryIconByKey } from "@/lib/category-icons";
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
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset({ name: "", kind: "expense", icon: availableCategoryIcons[0] });
      }}
    >
      <Dialog.Trigger asChild>
        <Button>
          <Plus className="size-4" />
          Nueva categoría
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-kubo border border-border bg-surface p-6 shadow-kubo-lg outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95">
          <div className="flex items-center justify-between">
            <Dialog.Title className="text-base font-semibold">Nueva categoría</Dialog.Title>
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
              <div className="grid grid-cols-6 gap-2">
                {availableCategoryIcons.map((icon) => {
                  const Icon = getCategoryIconByKey(icon);
                  return (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setValue("icon", icon)}
                      className={cn(
                        "flex size-9 items-center justify-center rounded-kubo-sm border transition-colors duration-200",
                        selectedIcon === icon
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

            <Button type="submit" size="lg" disabled={createCategory.isPending} className="mt-1">
              {createCategory.isPending && <Loader2 className="size-4 animate-spin" />}
              Crear categoría
            </Button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
