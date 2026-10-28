# Auditoría Kubo v0.5.2

Metodología: análisis estático completo (grep exhaustivo, comparación línea por línea, prueba de build con/sin cada archivo candidato a eliminación, y prueba temporal de configuraciones TypeScript). No se ejecutó la aplicación en navegador — todo hallazgo funcional está marcado como tal, y todo hallazgo de bug está basado en lectura de código, no en observación de comportamiento en runtime.

---

## Crítico

### 1. `TRANSACTIONS_KEY` definida en 3 lugares distintos — riesgo de caché desincronizada

`transactions/hooks.ts` y `recurring/hooks.ts` definían, cada uno por su cuenta, `const TRANSACTIONS_KEY = "transactions"`. `categories/hooks.ts` usaba directamente el string literal `"transactions"` en su llamada a `invalidateQueries`.

Esto no es un bug hoy — los tres valores coinciden. Pero es un riesgo real: si en el futuro alguien cambia la key en `transactions/hooks.ts` (por ejemplo, para namespacing: `"transactions:v2"`), los otros dos puntos quedan huérfanos **sin ningún error de compilación ni de lint que lo detecte**. El síntoma sería sutil y difícil de diagnosticar: tras crear/editar/eliminar una transacción, o un movimiento recurrente, o borrar una categoría, la lista de transacciones en pantalla mostraría datos obsoletos hasta el próximo refresh manual.

**Estado:** corregido. `TRANSACTIONS_KEY` ahora se exporta una sola vez desde `features/transactions/hooks.ts`; `recurring/hooks.ts` y `categories/hooks.ts` la importan. Verificado que no introduce dependencia circular (ninguno de los dos importa nada de vuelta desde `transactions/hooks.ts` salvo esta constante).

---

## Importante

### 2. `strict` no declarado en `tsconfig.app.json`

Ningún `tsconfig` del proyecto tenía `"strict": true` (ni ninguna de sus banderas individuales) declarado explícitamente. Esto significa que el proyecto compilaba con `strictNullChecks`, `noImplicitAny`, etc. todos en `false` por defecto — el compilador no protegía contra accesos a `null`/`undefined` no verificados ni contra tipos implícitos `any`.

Probé activar `strict: true` de forma aislada (sin tocar el resto del proyecto) y corrí `tsc --noEmit`: **0 errores nuevos**. El código ya era, de hecho, compatible con modo estricto — solo faltaba la declaración.

**Estado:** corregido. `strict: true` activado. Costo cero, beneficio real: blinda contra regresiones de tipos en versiones futuras.

*Nota:* también probé `noUncheckedIndexedAccess` (bandera más agresiva, detecta accesos a índices de array/objeto sin verificar). Esa sí introduce 7 errores nuevos. No la activé — corregir esos 7 puntos es trabajo de otra escala y no corresponde a "no cambiar comportamiento" sin revisión caso por caso. Documentado en Opcional.

### 3. `components/ui/table.tsx` — componente sin ningún uso

Creado en la sesión de v0.5 anticipando que `TransactionsPage` usaría una tabla; el usuario pidió explícitamente un feed tipo lista en su lugar, y el componente nunca se conectó a ninguna pantalla.

Verificación aplicada antes de tocarlo (las 6 comprobaciones pedidas):
- 0 imports en todo `src/` (`grep` exhaustivo por ruta y por nombre)
- 0 usos JSX de `<Table>`/`<TableRow>`/etc. en cualquier archivo
- React Router no lo referencia como componente de ninguna ruta
- Ningún archivo de `supabase/` lo menciona
- Build ejecutado con el archivo temporalmente removido: **compila limpio**
- Confirmado con el usuario antes de aplicar

**Estado:** eliminado, con confirmación explícita.

### 4. Dos dependencias declaradas sin ningún uso en el código

`@radix-ui/react-dropdown-menu` y `@radix-ui/react-tabs` estaban en `package.json` sin una sola importación en todo `src/`. Verifiqué también que ningún archivo de configuración (`tailwind.config.js`, `postcss.config.js`, `vite.config.ts`) las referenciara indirectamente, y que no fueran dependencia interna necesaria de otro paquete Radix sí usado.

**Estado:** removidas de `package.json`. Confirmado con `pnpm install --frozen-lockfile` que el lockfile quedó sincronizado sin ellas, y build posterior limpio.

### 5. `package.json` con `"version": "0.2.0"`

El campo de versión nunca se había actualizado desde v0.2, pese a que el proyecto ya está en v0.5.1 al momento de esta auditoría.

**Estado:** corregido a `0.5.2`.

### 6. `README.md` con sección de estado desactualizada desde v0.3

Documentado y resuelto como parte de esta versión: la sección `## Estado de esta entrega` seguía titulada "v0.2" y afirmaba que Presupuestos/Metas/Reportes estaban "próximamente" cuando llevan disponibles desde v0.3. El README se copiaba de versión en versión sin actualizar esa sección desde entonces.

**Estado:** corregido. README sincronizado con el estado real, y se introduce `CHANGELOG.md` en la raíz del proyecto como historial acumulado — acordado como práctica a mantener desde esta versión en adelante.

---

## Recomendado

### 7. Tres copias idénticas de una función de formateo de fecha

`GoalsPage.tsx` y `RecurringPage.tsx` tenían la función `formatDate` **byte por byte idéntica**. `TransactionFormDialog.tsx` tenía una función `friendlyDate` que reimplementaba el mismo `Intl.DateTimeFormat` como fallback tras comprobar "Hoy"/"Ayer".

**Estado:** consolidado. Nuevo helper `formatDateLong()` en `lib/date.ts` (el archivo ya existente para utilidades de fecha-calendario desde v0.5.1); los 3 sitios ahora lo importan.

### 8. Seis diálogos de formulario con ~280 caracteres de clases duplicadas de forma idéntica

`TransactionFormDialog`, `RecurringFormDialog`, `GoalFormDialog`, `BudgetFormDialog`, `AddCategoryDialog` y `AddContributionDialog` (este último no estaba en el conteo inicial de "5" — se detectó durante la implementación) repetían, carácter por carácter, el mismo `Dialog.Overlay` + `Dialog.Content` + header con título y botón de cerrar.

Al comparar los 6 en detalle encontré además una inconsistencia real no cosmética: el botón de cerrar tenía `transition-colors duration-200` explícito en 2 de los 6, ausente en los otros 4 (heredaban la transición por CSS global, pero con un string de clases distinto — riesgo de que una futura edición de uno no se replique en los demás).

**Estado:** consolidado en `components/ui/form-dialog-shell.tsx`. Cada formulario conserva su propio estado, validación (Zod) y campos — el shell solo encapsula la parte estructural que era idéntica. Se corrigió la inconsistencia del botón de cerrar de una vez, aplicando el comportamiento correcto en los 6 en lugar de tener que decidir cuál copiar a cuál.

Este cambio se aplicó con revisión manual de cada uno de los 6 archivos antes y después de la migración, y build verificado tras cada migración individual (no en lote), dado que implicaba tocar componentes activos en producción.

### 9. Alias de función innecesarios en `TransactionFormDialog`

`const today = todayLocal; const yesterday = yesterdayLocal;` — dos nombres para exactamente la misma función, usados 9 veces combinadas en el archivo. Residuo de la refactorización de v0.5.1, donde se hizo así para minimizar el diff en ese momento.

**Estado:** eliminados; el archivo ahora llama a `todayLocal()`/`yesterdayLocal()` directamente.

### 10. Residuo `duration-200 duration-150` en dos clases de `TransactionFormDialog`

Ambas clases estaban presentes a la vez en el mismo string. Tailwind aplica la última declaración en el CSS generado, así que el comportamiento real era 150ms, no 200ms — inconsistente con el resto de la app (que usa 200ms como estándar desde v0.5). Residuo de un `sed` normalizador de v0.5.1 que no reemplazó limpiamente.

**Estado:** corregido a `duration-200` único, en los 2 puntos donde aparecía.

---

## Opcional

### 11. `noUncheckedIndexedAccess` — 7 errores si se activa

Detecta accesos a arrays/objetos por índice sin verificar que el elemento exista (`arr[i]` tipado como `T` en vez de `T | undefined`). Encontré 7 puntos que fallarían con esta bandera activada. No los revisé ni corregí uno por uno — eso es trabajo de otra escala, y corresponde a una versión que sí tenga foco en ese tipo de correcciones, no a esta auditoría de mantenimiento general.

**Recomendación:** considerar para v0.6, revisando los 7 puntos con calma antes de activar la bandera.

### 12. Bundle principal de 809 kB — warning de Vite preexistente

`index-*.js` supera el límite de 500 kB recomendado por Vite. Esto **no se originó en esta auditoría** — ya estaba presente en v0.5 y v0.5.1. Resolverlo implicaría más `React.lazy()`/code-splitting o ajustar `build.chunkSizeWarningLimit`, ambas decisiones de build que cambian comportamiento de carga de la app y quedan fuera del alcance de "no cambiar arquitectura por gusto" sin una decisión explícita.

**Recomendación:** evaluar en una versión dedicada a performance, no como parte de una auditoría de limpieza general.

### 13. `--category-work` con contraste bajo en modo oscuro (2.14:1)

Detectado en la auditoría de contraste de v0.5.1 (no en esta), nunca reportado como bug por el usuario ni parte del alcance de ninguna versión hasta ahora. Se documenta aquí solo para que quede registrado en un único lugar de referencia.

---

## Resumen de impacto

- **0 cambios de funcionalidad, diseño o UX.** Todo lo aplicado es refactor estructural, consolidación de duplicados, o configuración.
- **Build limpio antes y después** de cada cambio, verificado de forma incremental (no en lote) para los cambios de mayor superficie (los 6 diálogos).
- **Lint: 9 warnings preexistentes, 0 nuevos**, antes y después.
- Ningún archivo se eliminó sin las 6 verificaciones pedidas explícitamente aplicadas y documentadas.
- El único hallazgo Crítico (`TRANSACTIONS_KEY`) era un riesgo latente, no un bug activo — se corrigió por prevención, no porque hubiera evidencia de que ya estuviera causando datos obsoletos en pantalla.
