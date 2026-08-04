import { Loader2, Tag, Trash2 } from "lucide-react";
import { Topbar } from "@/components/layout/Topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { getCategoryIconByKey, getCategoryColorByKey } from "@/lib/category-icons";
import { cn } from "@/lib/utils";
import { useCategories, useDeleteCategory } from "./hooks";
import { AddCategoryDialog } from "./components/AddCategoryDialog";

const kindLabels: Record<string, { label: string; variant: "default" | "accent" | "info" }> = {
  expense: { label: "Gasto", variant: "default" },
  income: { label: "Ingreso", variant: "accent" },
  both: { label: "Ambos", variant: "info" },
};

export function CategoriesPage() {
  const { data: categories = [], isLoading } = useCategories();
  const deleteCategory = useDeleteCategory();

  return (
    <>
      <Topbar
        title="Categorías"
        subtitle="Organiza tus movimientos por tipo de gasto o ingreso."
        action={<AddCategoryDialog />}
      />

      <div className="mt-6 px-6 pb-10 md:mt-8 md:px-10">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-20 text-sm text-muted">
            <Loader2 className="size-4 animate-spin" /> Cargando categorías...
          </div>
        ) : categories.length === 0 ? (
          <EmptyState
            icon={Tag}
            title="Todavía no tienes categorías"
            description="Crea categorías para organizar tus gastos e ingresos."
            action={<AddCategoryDialog />}
          />
        ) : (
          <Card>
            <CardContent className="p-0">
              <ul role="list">
                {categories.map((cat, i) => {
                  const Icon = getCategoryIconByKey(cat.icon);
                  const meta = kindLabels[cat.kind] ?? kindLabels.both;
                  return (
                    <li
                      key={cat.id}
                      className={`group flex items-center gap-3 px-5 py-3.5 transition-colors duration-200 hover:bg-surface-hover/50 ${
                        i !== categories.length - 1 ? "border-b border-border" : ""
                      }`}
                    >
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-kubo-sm bg-surface-hover">
                        <Icon className={cn("size-4", getCategoryColorByKey(cat.icon))} aria-hidden="true" />
                      </div>
                      <p className="flex-1 text-sm font-medium">{cat.name}</p>
                      <Badge variant={meta.variant}>{meta.label}</Badge>
                      <ConfirmDialog
                        trigger={
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`Eliminar categoría ${cat.name}`}
                            className="opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                          >
                            <Trash2 className="size-3.5 text-negative" />
                          </Button>
                        }
                        title="Eliminar categoría"
                        description={`Los movimientos con "${cat.name}" pasarán a mostrarse como "Otros". ¿Deseas continuar?`}
                        onConfirm={() => deleteCategory.mutate(cat.id)}
                        isPending={deleteCategory.isPending}
                      />
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
