# Changelog — Kubo

Historial de versiones del proyecto, de la más reciente a la más antigua. Cada versión es acumulativa: lo entregado en una versión sigue funcionando en las siguientes salvo que se indique lo contrario.

---

## v0.2

- Login y registro con Supabase Auth (email + contraseña), confirmación por correo
- Rutas protegidas — el dashboard y sus secciones requieren sesión activa
- Base de datos real en PostgreSQL vía Supabase, con Row Level Security (cada usuario solo ve y edita sus propios datos)
- CRUD completo de transacciones — crear, editar, eliminar, con categoría y tipo (ingreso/gasto)
- CRUD de categorías — categorías por defecto sembradas al registrarte, más las que tú crees
- Persistencia real — todo lo que registras sobrevive a un refresh, un logout, o abrir Kubo en otro dispositivo
- Dashboard conectado a datos reales — balance, ahorro del mes, mayor categoría de gasto y tendencia de 6 meses se calculan a partir de tus transacciones reales
- Sidebar con tu correo y botón de cerrar sesión
- Presupuestos, Metas y Reportes enlazados en la navegación con una pantalla "próximamente" (llegan en v0.3)

## v0.1

- Estructura del proyecto completa (React + TS + Vite + Tailwind + componentes tipo shadcn/ui)
- Diseño de marca: paleta, tipografía, logo (cubo isométrico)
- Sidebar de navegación (desktop + drawer móvil)
- Dashboard: balance, ingresos/gastos del mes, ahorro, presupuesto, tendencia, actividad reciente — sobre datos de ejemplo (`src/features/dashboard/data/mock.ts`)
- Diálogo "Registrar movimiento" funcional sobre estado local (sin persistencia)
- Modo oscuro / claro con persistencia
- 100% responsive
- Sin Supabase todavía. Transacciones, Presupuestos, Metas y Reportes enlazados en la navegación con una pantalla "próximamente"
