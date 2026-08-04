import { useEffect, useRef, useState } from "react";
import { animate } from "framer-motion";

/**
 * Anima un número desde su valor anterior hasta `value` en cada cambio.
 * Devuelve el valor intermedio para renderizar (ej. en un formateador de moneda).
 */
export function useAnimatedNumber(value: number, duration = 0.6): number {
  const [display, setDisplay] = useState(value);
  const previous = useRef(value);

  useEffect(() => {
    const controls = animate(previous.current, value, {
      duration,
      ease: "easeOut",
      onUpdate: (latest) => setDisplay(latest),
    });
    previous.current = value;
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return display;
}
