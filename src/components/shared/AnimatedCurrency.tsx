import type { CSSProperties } from "react";
import { useAnimatedNumber } from "@/hooks/useAnimatedNumber";
import { useCurrency } from "@/app/providers/CurrencyProvider";
import { cn } from "@/lib/utils";

interface AnimatedCurrencyProps {
  value: number;
  className?: string;
  /**
   * Reduce el tamaño de la fuente cuando el monto no cabe en su contenedor.
   * El tamaño de `className` (text-3xl, etc.) actúa como máximo.
   */
  fit?: boolean;
}

export function AnimatedCurrency({ value, className, fit = false }: AnimatedCurrencyProps) {
  const animated = useAnimatedNumber(value);
  const { formatCurrency } = useCurrency();
  const formatted = formatCurrency(animated);
  const real = formatCurrency(value);

  if (fit) {
    return (
      <span
        className={cn("fit-container block", className)}
        aria-label={real}
        aria-live="polite"
        aria-atomic="true"
      >
        {/* Se mide con el monto final (`real`) para que la fuente no varíe mientras anima. */}
        <span
          className="fit-amount font-mono tabular-nums"
          style={{ "--chars": real.length } as CSSProperties}
        >
          {formatted}
        </span>
      </span>
    );
  }

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
