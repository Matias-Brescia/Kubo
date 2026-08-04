import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useProfile } from "@/features/settings/hooks";
import {
  formatCurrency as formatCurrencyBase,
  formatSignedCurrency as formatSignedCurrencyBase,
  DEFAULT_CURRENCY,
  type CurrencyCode,
} from "@/lib/currency";

interface CurrencyContextValue {
  currency: CurrencyCode;
  formatCurrency: (amount: number) => string;
  formatSignedCurrency: (amount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextValue | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const { data: profile } = useProfile();
  const currency = profile?.currency ?? DEFAULT_CURRENCY;

  const value = useMemo<CurrencyContextValue>(
    () => ({
      currency,
      formatCurrency: (amount: number) => formatCurrencyBase(amount, currency),
      formatSignedCurrency: (amount: number) => formatSignedCurrencyBase(amount, currency),
    }),
    [currency]
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}
