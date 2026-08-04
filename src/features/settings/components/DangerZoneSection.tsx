import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDeleteAccount } from "../hooks";

export function DangerZoneSection() {
  const navigate = useNavigate();
  const deleteAccount = useDeleteAccount();
  const [confirmText, setConfirmText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    try {
      await deleteAccount.mutateAsync();
      navigate("/login", { replace: true });
    } catch {
      setError("No pudimos eliminar tu cuenta. Intenta de nuevo o contáctanos.");
    }
  };

  return (
    <Card className="border-negative/30">
      <CardHeader>
        <CardTitle className="text-negative">Zona de peligro</CardTitle>
        <p className="mt-1 text-sm text-muted">
          Eliminar tu cuenta borra permanentemente tus transacciones, categorías, presupuestos y
          metas. Esta acción no se puede deshacer.
        </p>
      </CardHeader>
      <CardContent className="p-5 pt-4">
        <AlertDialog.Root
          onOpenChange={(open) => {
            if (!open) {
              setConfirmText("");
              setError(null);
            }
          }}
        >
          <AlertDialog.Trigger asChild>
            <Button variant="secondary" className="border-negative/40 text-negative hover:bg-negative/10">
              Eliminar mi cuenta
            </Button>
          </AlertDialog.Trigger>
          <AlertDialog.Portal>
            <AlertDialog.Overlay className="fixed inset-0 z-40 bg-black/60 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
            <AlertDialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-kubo border border-border bg-surface p-6 shadow-kubo-lg outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95">
              <AlertDialog.Title className="text-base font-semibold">
                ¿Eliminar tu cuenta de Kubo?
              </AlertDialog.Title>
              <AlertDialog.Description className="mt-2 text-sm leading-relaxed text-muted">
                Esta acción es permanente. Escribe <span className="font-medium text-foreground">ELIMINAR</span>{" "}
                para confirmar.
              </AlertDialog.Description>

              <Input
                className="mt-4"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="ELIMINAR"
                autoFocus
              />
              {error && <p className="mt-2 text-xs text-negative">{error}</p>}

              <div className="mt-6 flex justify-end gap-2">
                <AlertDialog.Cancel asChild>
                  <Button variant="secondary" disabled={deleteAccount.isPending}>
                    Cancelar
                  </Button>
                </AlertDialog.Cancel>
                <Button
                  variant="danger"
                  onClick={handleDelete}
                  disabled={confirmText !== "ELIMINAR" || deleteAccount.isPending}
                >
                  {deleteAccount.isPending && <Loader2 className="size-4 animate-spin" />}
                  Eliminar mi cuenta
                </Button>
              </div>
            </AlertDialog.Content>
          </AlertDialog.Portal>
        </AlertDialog.Root>
      </CardContent>
    </Card>
  );
}
