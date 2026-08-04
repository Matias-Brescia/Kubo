import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/AuthProvider";

function storageKey(userId: string) {
  return `kubo:onboarding-seen:${userId}`;
}

/**
 * Un usuario ve el onboarding una sola vez: la primera vez que entra
 * sin transacciones todavía. Se recuerda por usuario en localStorage
 * (no hace falta una columna en la base de datos para esto).
 */
export function useOnboarding(hasTransactions: boolean) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!user || hasTransactions) return;
    const seen = localStorage.getItem(storageKey(user.id));
    if (!seen) setOpen(true);
  }, [user, hasTransactions]);

  const dismiss = () => {
    if (user) localStorage.setItem(storageKey(user.id), "1");
    setOpen(false);
  };

  return { open, dismiss };
}
