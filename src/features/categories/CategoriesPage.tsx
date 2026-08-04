import { Loader2, Trash2 } from "lucide-react";
import { Topbar } from "@/components/layout/Topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { getCategoryIconByKey } from "@/lib/category-icons";
import { useCategories, useDeleteCategory } from "./hooks";
import { AddCategoryDialog } from "./components/AddCategoryDialog";

const kindLabels: Record<string, string> = {
  expense: "Gasto",
  income: "Ingreso",
  both: "Ambos",
};

export function CategoriesPage() {
  const { data: categories = [], isLoading } = useCategories();
  const deleteCategory = useDeleteCategory();

  return (
    <>
      <Topbar
        title="Categorías"
        subtitle="Organiza tus movimientos como quieras."
        action={<AddCategoryDialog />}
      />

      <div className="mt-6 px-6 md:mt-8 md:px-10">
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted">
                <Loader2 className="size-4 animate-spin" /> Cargando categorías...
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {categories.map((cat) => {
                  const Icon = getCategoryIconByKey(cat.icon);
                  return (
                    <li key={cat.id} className="group flex items-center gap-3 px-5 py-3.5">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-kubo-sm bg-surface-hover text-muted">
                        <Icon className="size-4" />
                      </div>
                      <p className="flex-1 text-sm font-medium">{cat.name}</p>
                      <Badge variant="default">{kindLabels[cat.kind]}</Badge>
                      <ConfirmDialog
                        trigger={
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Eliminar categoría"
                            className="opacity-0 transition-opacity group-hover:opacity-100"
                          >
                            <Trash2 className="size-4 text-negative" />
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
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
