# Changelog — Kubo

Historial de versiones del proyecto, de la más reciente a la más antigua. Cada versión es acumulativa: lo entregado en una versión sigue funcionando en las siguientes salvo que se indique lo contrario.

---

## v0.5

- **Refresh de UX/UI completo** — nueva paleta (fondo neutro, acento morado, sidebar oscuro fijo), aplicada vía CSS variables y tokens de Tailwind existentes (sin sistema paralelo)
- **Sistema de componentes ampliado** — Button, Card, Badge, Input, Progress, Select y Separator con variantes semánticas (success/warning/danger/info); nuevos componentes `EmptyState` y `Table`
- **10 colores de categoría** definidos como tokens (comida, transporte, hogar, salud, entretenimiento, educación, compras, trabajo, viajes, mascotas)
- **Rediseño de todas las pantallas** — Dashboard, Transacciones (feed tipo lista, no tabla), Presupuestos, Metas, Reportes, Ajustes, Sidebar y Topbar
- **Nuevo flujo de fecha en Transacciones** — por defecto usa "Hoy"; el selector solo aparece si el usuario quiere elegir otra fecha (Hoy / Ayer / Elegir fecha...)
- Animaciones más rápidas y consistentes (200ms, ease-out) en toda la app
- Revisión de accesibilidad (focus visible, aria-labels, touch targets) y responsive en los 3 breakpoints

## v0.4

- **Multi-moneda** — soporte para 7 monedas (PEN, USD, EUR, MXN, COP, CLP, ARS), configurable desde Ajustes; todos los montos de la app se formatean según la moneda elegida
- **Ajustes de cuenta** — sección Perfil (nombre, moneda), Seguridad (cambio de email/contraseña) y Zona de peligro (eliminar cuenta, con función `delete_own_account` en Supabase)
- **Onboarding** — modal de bienvenida para cuentas nuevas sin transacciones, con los 3 pasos clave de la app
- **Alertas de presupuesto** — aviso en el Dashboard cuando algún presupuesto llega al 80% o se excede, con enlace directo a Presupuestos
- **Movimientos recurrentes** — sueldos, suscripciones y cualquier gasto/ingreso que se repite (semanal, mensual, anual); se generan automáticamente al abrir la app cuando ya vencieron

## v0.3

- **Presupuestos** — límite mensual por categoría, con barra de progreso calculada contra el gasto real del mes en curso y estado "excedido" en rojo terracota
- **Metas de ahorro** — objetivo con ícono elegible, fecha objetivo opcional, y diálogo de aporte/retiro
- **Reportes** — desglose de gasto por categoría, histórico de 6 meses (ingresos/gastos/ahorro neto), y exportación a CSV
- Rutas y navegación reales para Presupuestos/Metas/Reportes (ya no muestran "próximamente")
- Code-splitting con `React.lazy` + `Suspense` — todas las páginas salvo el Dashboard cargan bajo demanda, reduciendo el bundle inicial
- Números animados (`useAnimatedNumber` / `AnimatedCurrency`) en Dashboard, Presupuestos y Metas

> **Nota conocida desde esta versión:** el aporte/retiro de Metas actualiza `current_amount` con lectura-luego-escritura, no con un incremento atómico en base de datos. Para un solo usuario no debería causar problemas, pero dos aportes muy seguidos podrían pisarse entre sí.

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
