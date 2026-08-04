const formatter = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatCurrency(amount: number): string {
  return formatter.format(amount);
}

export function formatSignedCurrency(amount: number): string {
  const sign = amount > 0 ? "+" : amount < 0 ? "−" : "";
  return `${sign}${formatter.format(Math.abs(amount))}`;
}

export function formatCompactNumber(amount: number): string {
  return new Intl.NumberFormat("es-PE", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(amount);
}
