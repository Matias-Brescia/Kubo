import { useAnimatedNumber } from "@/hooks/useAnimatedNumber";
import { formatCurrency } from "@/lib/currency";
import { cn } from "@/lib/utils";

interface AnimatedCurrencyProps {
  value: number;
  className?: string;
}

export function AnimatedCurrency({ value, className }: AnimatedCurrencyProps) {
  const animated = useAnimatedNumber(value);
  return <span className={cn("font-mono tabular", className)}>{formatCurrency(animated)}</span>;
}
