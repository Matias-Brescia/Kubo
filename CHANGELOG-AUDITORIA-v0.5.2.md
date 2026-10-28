# Kubo v0.5.2

## Eliminado

- `src/components/ui/table.tsx` — sin ningún uso en el proyecto. Verificado con búsqueda exhaustiva de imports/JSX/rutas/schema, y con build ejecutado sin el archivo antes de removerlo.
- Dependencia `@radix-ui/react-dropdown-menu` (`package.json`) — sin ningún import en `src/`.
- Dependencia `@radix-ui/react-tabs` (`package.json`) — sin ningún import en `src/`.

## Simplificado

- 3 copias idénticas de una función de formateo de fecha (`GoalsPage.tsx`, `RecurringPage.tsx`, `TransactionFormDialog.tsx`) consolidadas en `formatDateLong()`, dentro de `lib/date.ts`.
- Alias `const today = todayLocal` / `const yesterday = yesterdayLocal` en `TransactionFormDialog.tsx` eliminados — llamaban directo a las funciones sin aportar nada; sustituidos por `todayLocal()`/`yesterdayLocal()` en los 9 puntos donde se usaban.

## Refactorizado

- Nuevo componente `src/components/ui/form-dialog-shell.tsx`: consolida el shell estructural (overlay, posicionamiento, header con título y botón de cerrar) que se repetía de forma idéntica en 6 diálogos de formulario.
- Migrados a `FormDialogShell`: `TransactionFormDialog`, `RecurringFormDialog`, `GoalFormDialog`, `BudgetFormDialog`, `AddCategoryDialog`, `AddContributionDialog`. Cada uno conserva su propio estado, validación (Zod) y campos — solo se consolidó la parte estructural que era idéntica.
- `TRANSACTIONS_KEY` (constante de invalidación de caché de TanStack Query): antes definida en 2 archivos por separado y usada como string literal suelto en un tercero. Ahora se exporta una sola vez desde `features/transactions/hooks.ts`; `features/recurring/hooks.ts` y `features/categories/hooks.ts` la importan.

## Corregido

- Botón de cerrar de los diálogos de formulario: 4 de los 6 no tenían `transition-colors duration-200` explícito (2 sí lo tenían). Al consolidar en `FormDialogShell` se aplicó un único comportamiento correcto en los 6.
- Clase `transition-colors duration-200 duration-150` (ambas presentes a la vez) en 2 puntos de `TransactionFormDialog.tsx` — Tailwind aplicaba la última declarada, dejando el timing real en 150ms en vez de los 200ms consistentes con el resto de la app. Corregido a `duration-200` único.
- `TRANSACTIONS_KEY` triplicada (ver Refactorizado) — riesgo latente de invalidación de caché desincronizada si alguna de las 3 copias cambiara de forma independiente. No había evidencia de que ya estuviera causando datos obsoletos en pantalla; se corrigió por prevención.

## Organización

- `tsconfig.app.json`: activado `strict: true`. Probado de forma aislada antes de aplicar — 0 errores nuevos, el código ya era compatible.
- `package.json`: `"version"` corregido de `0.2.0` a `0.5.2` (no se actualizaba desde v0.2).
- `README.md`: sección de estado sincronizada con la versión real del proyecto (mencionaba "v0.2" y funcionalidad ya entregada como "próximamente" desde v0.3).
- `CHANGELOG.md` creado en la raíz del proyecto — historial completo v0.1 a v0.5.2, para que quede sincronizado con el README en cada entrega futura.

## Riesgos conocidos

- La migración de los 6 diálogos de formulario es el cambio de mayor superficie de esta versión. Se verificó build tras cada migración individual (no en lote) y se comparó el JSX de cada uno contra el original antes de aplicar, pero al tratarse de componentes activos en producción con estado interno propio, cualquier diferencia de comportamiento sutil en la lógica de `onOpenChange`/reset de formulario debería confirmarse con una prueba manual de cada uno de los 6 flujos (crear transacción, crear recurrente, crear/editar meta, aportar a meta, crear/editar presupuesto, crear categoría) antes de considerar esta versión definitivamente estable — no se pudo ejecutar la aplicación para verificarlo en runtime.
- `strict: true` no se probó contra `noUncheckedIndexedAccess` en combinación con el resto del código de forma exhaustiva más allá del conteo de errores — solo se confirmó que `strict` por sí solo no rompe la compilación.
- El bundle principal (809 kB) sigue sin resolverse — es preexistente a esta auditoría y queda fuera del alcance de "no cambiar arquitectura por gusto".

## Archivos modificados

**Creados:**
- `src/components/ui/form-dialog-shell.tsx`
- `CHANGELOG.md`
- `AUDITORIA-v0.5.2.md` (este informe)

**Eliminados:**
- `src/components/ui/table.tsx`

**Modificados:**
- `src/lib/date.ts` — nuevo helper `formatDateLong()`
- `src/features/transactions/hooks.ts` — `TRANSACTIONS_KEY` exportada
- `src/features/transactions/components/TransactionFormDialog.tsx` — migrado a `FormDialogShell`, alias eliminados, `duration-150` residual corregido, usa `formatDateLong()`
- `src/features/recurring/hooks.ts` — importa `TRANSACTIONS_KEY` en vez de redefinirla
- `src/features/recurring/components/RecurringFormDialog.tsx` — migrado a `FormDialogShell`
- `src/features/recurring/RecurringPage.tsx` — usa `formatDateLong()` en vez de función local duplicada
- `src/features/goals/components/GoalFormDialog.tsx` — migrado a `FormDialogShell`
- `src/features/goals/components/AddContributionDialog.tsx` — migrado a `FormDialogShell`
- `src/features/goals/GoalsPage.tsx` — usa `formatDateLong()` en vez de función local duplicada
- `src/features/budgets/components/BudgetFormDialog.tsx` — migrado a `FormDialogShell`
- `src/features/categories/components/AddCategoryDialog.tsx` — migrado a `FormDialogShell`
- `src/features/categories/hooks.ts` — importa `TRANSACTIONS_KEY` en vez de usar string literal suelto
- `tsconfig.app.json` — `strict: true` activado
- `package.json` — versión corregida, 2 dependencias removidas
- `pnpm-lock.yaml` — regenerado tras remover dependencias
- `README.md` — sección de estado sincronizada con v0.5.2
