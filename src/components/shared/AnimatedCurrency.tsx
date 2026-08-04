import { useAnimatedNumber } from "@/hooks/useAnimatedNumber";
import { useCurrency } from "@/app/providers/CurrencyProvider";
import { cn } from "@/lib/utils";

interface AnimatedCurrencyProps {
  value: number;
  className?: string;
}

export function AnimatedCurrency({ value, className }: AnimatedCurrencyProps) {
  const animated = useAnimatedNumber(value);
  const { formatCurrency } = useCurrency();
  const formatted = formatCurrency(animated);
  const real = formatCurrency(value);

  return (
    <span
      className={cn("font-mono tabular-nums", className)}
      aria-label={real}
      aria-live="polite"
      aria-atomic="true"
    >
      {formatted}
    </span>
  );
}
