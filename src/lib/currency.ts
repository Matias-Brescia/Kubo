export const SUPPORTED_CURRENCIES = [
  { code: "PEN", label: "Sol peruano", symbol: "S/", locale: "es-PE" },
  { code: "USD", label: "Dólar estadounidense", symbol: "$", locale: "en-US" },
  { code: "EUR", label: "Euro", symbol: "€", locale: "es-ES" },
  { code: "MXN", label: "Peso mexicano", symbol: "$", locale: "es-MX" },
  { code: "COP", label: "Peso colombiano", symbol: "$", locale: "es-CO" },
  { code: "CLP", label: "Peso chileno", symbol: "$", locale: "es-CL" },
  { code: "ARS", label: "Peso argentino", symbol: "$", locale: "es-AR" },
] as const;

export type CurrencyCode = (typeof SUPPORTED_CURRENCIES)[number]["code"];

export const DEFAULT_CURRENCY: CurrencyCode = "PEN";

function localeFor(currency: string): string {
  return SUPPORTED_CURRENCIES.find((c) => c.code === currency)?.locale ?? "es-PE";
}

export function formatCurrency(amount: number, currency: CurrencyCode = DEFAULT_CURRENCY): string {
  return new Intl.NumberFormat(localeFor(currency), {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatSignedCurrency(
  amount: number,
  currency: CurrencyCode = DEFAULT_CURRENCY
): string {
  const sign = amount > 0 ? "+" : amount < 0 ? "−" : "";
  return `${sign}${formatCurrency(Math.abs(amount), currency)}`;
}

/** Solo para ejes de gráficos: números compactos sin símbolo de moneda. */
export function formatCompactNumber(amount: number): string {
  return new Intl.NumberFormat("es-PE", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(amount);
}
