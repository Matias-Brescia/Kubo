# Changelog — Kubo

Historial de versiones del proyecto, de la más reciente a la más antigua. Cada versión es acumulativa: lo entregado en una versión sigue funcionando en las siguientes salvo que se indique lo contrario.

---

## v0.1

- Estructura del proyecto completa (React + TS + Vite + Tailwind + componentes tipo shadcn/ui)
- Diseño de marca: paleta, tipografía, logo (cubo isométrico)
- Sidebar de navegación (desktop + drawer móvil)
- Dashboard: balance, ingresos/gastos del mes, ahorro, presupuesto, tendencia, actividad reciente — sobre datos de ejemplo (`src/features/dashboard/data/mock.ts`)
- Diálogo "Registrar movimiento" funcional sobre estado local (sin persistencia)
- Modo oscuro / claro con persistencia
- 100% responsive
- Sin Supabase todavía. Transacciones, Presupuestos, Metas y Reportes enlazados en la navegación con una pantalla "próximamente"
