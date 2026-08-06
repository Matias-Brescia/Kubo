/**
 * Helpers de "fecha de calendario" (YYYY-MM-DD).
 *
 * Problema que resuelven: `new Date("2026-08-02")` y `date.toISOString()`
 * interpretan/serializan la fecha como un instante UTC. En zonas horarias
 * con offset negativo (Perú, América en general), esto puede correr el
 * día mostrado o guardado en ±1 respecto a lo que el usuario eligió.
 *
 * Estas funciones tratan la fecha siempre como un día de calendario local,
 * sin pasar nunca por conversión UTC. Se usan en cualquier flujo que
 * guarde/lea columnas `date` de Supabase (occurred_on, next_occurrence, etc).
 */

/** Fecha de HOY como "YYYY-MM-DD", en hora local (no UTC). */
export function todayLocal(): string {
  return dateToLocalIso(new Date());
}

/** Convierte un objeto Date a "YYYY-MM-DD" usando sus componentes locales. */
export function dateToLocalIso(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Parsea "YYYY-MM-DD" a un Date a medianoche LOCAL (no UTC).
 * Usar esto en vez de `new Date(isoString)` para cualquier fecha de
 * calendario que venga de un input o de Supabase.
 */
export function parseLocalIso(iso: string): Date {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

/** Suma días a una fecha de calendario, devuelve otra "YYYY-MM-DD". */
export function addDaysIso(iso: string, days: number): string {
  const d = parseLocalIso(iso);
  d.setDate(d.getDate() + days);
  return dateToLocalIso(d);
}

/** Suma meses a una fecha de calendario, devuelve otra "YYYY-MM-DD". */
export function addMonthsIso(iso: string, months: number): string {
  const d = parseLocalIso(iso);
  d.setMonth(d.getMonth() + months);
  return dateToLocalIso(d);
}

/** Suma años a una fecha de calendario, devuelve otra "YYYY-MM-DD". */
export function addYearsIso(iso: string, years: number): string {
  const d = parseLocalIso(iso);
  d.setFullYear(d.getFullYear() + years);
  return dateToLocalIso(d);
}

/** true si `iso` (YYYY-MM-DD) es hoy o ya pasó, comparado en hora local. */
export function isIsoTodayOrPast(iso: string): boolean {
  return iso <= todayLocal();
}

/** Ayer, como "YYYY-MM-DD" local. */
export function yesterdayLocal(): string {
  return addDaysIso(todayLocal(), -1);
}

/**
 * Formato largo reutilizado en Goals, Recurring y el diálogo de
 * Transacciones: "2 ago 2026". Antes vivía copiado de forma idéntica
 * en cada uno de esos archivos.
 */
export function formatDateLong(iso: string): string {
  return new Intl.DateTimeFormat("es-PE", { day: "2-digit", month: "short", year: "numeric" }).format(
    parseLocalIso(iso)
  );
}
