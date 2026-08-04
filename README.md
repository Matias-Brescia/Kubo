# Kubo

Finanzas personales, sin fricción. Registra un gasto en menos de 5 segundos.

## Filosofía

Kubo no compite por cantidad de funciones — compite por simplicidad. Mucho espacio, pocas opciones, una acción principal siempre a la vista. La meta de diseño es que se sienta como un producto Apple o Linear: silencioso, preciso, con las cifras como protagonistas.

## Stack

- **React 19 + TypeScript** — Vite como build tool
- **pnpm** como gestor de paquetes
- **Tailwind CSS** — sistema de tokens propio (ver `src/index.css` y `tailwind.config.js`)
- **Componentes tipo shadcn/ui** construidos sobre Radix UI (`src/components/ui`)
- **Supabase** (Auth + PostgreSQL) — autenticación y persistencia real
- **TanStack Query** — fetching, cache e invalidación de datos del servidor
- **React Router** — navegación entre secciones
- **React Hook Form + Zod** — validación de formularios
- **Recharts** — tendencia de ingresos vs. gastos
- **Framer Motion** — micro-interacciones
- **Lucide** — iconografía
- **Geist Sans / Geist Mono** — tipografía. Los montos siempre usan Geist Mono con `tabular-nums`, como un ledger.

## Arquitectura

Organización modular por features:

```
src/
  app/providers/         Providers globales (tema)
  components/layout/     Sidebar, Topbar, navegación móvil
  components/ui/         Primitivos reutilizables (Button, Card, Input, ConfirmDialog...)
  components/shared/     Componentes compartidos entre features
  features/auth/         Login, registro, sesión, rutas protegidas
  features/dashboard/    Dashboard: componentes, estadísticas derivadas
  features/transactions/ CRUD de transacciones (hooks de datos + UI)
  features/categories/   CRUD de categorías (hooks de datos + UI)
  hooks/                 Hooks compartidos
  lib/                   Utilidades (cn, formato de moneda, cliente de Supabase, tipos de la BD)
```

Cada feature nueva (presupuestos, metas, reportes) sigue este mismo patrón: sus propios `hooks.ts` para datos y una carpeta `components/` para su UI.

## Cómo correr el proyecto

### 1. Instala las dependencias

```bash
pnpm install
```

### 2. Crea tu proyecto de Supabase

Ve a [supabase.com](https://supabase.com), crea un proyecto nuevo (gratis) y espera a que termine de aprovisionarse.

### 3. Ejecuta el esquema de base de datos

Abre **SQL Editor** en el dashboard de tu proyecto, pega el contenido completo de `supabase/schema.sql` y ejecútalo. Esto crea las tablas `profiles`, `categories`, `transactions`, sus políticas de Row Level Security, y un trigger que siembra categorías por defecto cada vez que alguien se registra.

### 4. Configura las variables de entorno

```bash
cp .env.example .env
```

Completa `.env` con los datos de **Project Settings → API** de tu proyecto de Supabase:

```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-publica
```

### 5. Corre el proyecto

```bash
pnpm dev
```

Abre `http://localhost:5173`, crea una cuenta desde "Regístrate" y confirma tu correo (Supabase envía el enlace de confirmación automáticamente). Ya puedes iniciar sesión y usar Kubo con persistencia real.

Para producción:

```bash
pnpm build
pnpm preview
```

> **Nota:** si abres el proyecto sin configurar `.env`, Kubo muestra una pantalla con instrucciones en vez de fallar en blanco.
## Novedades de esta versión — v0.3

- **Presupuestos** — límite mensual por categoría, con barra de progreso calculada contra el gasto real del mes en curso y estado "excedido" en rojo terracota
- **Metas de ahorro** — objetivo con ícono elegible, fecha objetivo opcional, y diálogo de aporte/retiro
- **Reportes** — desglose de gasto por categoría, histórico de 6 meses (ingresos/gastos/ahorro neto), y exportación a CSV
- Rutas y navegación reales para Presupuestos/Metas/Reportes (ya no muestran "próximamente")
- Code-splitting con `React.lazy` + `Suspense` — todas las páginas salvo el Dashboard cargan bajo demanda, reduciendo el bundle inicial
- Números animados (`useAnimatedNumber` / `AnimatedCurrency`) en Dashboard, Presupuestos y Metas
- Todo lo de v0.1 y v0.2 se mantiene

> **Nota conocida:** el aporte/retiro de Metas actualiza `current_amount` con lectura-luego-escritura, no con un incremento atómico en base de datos. Para un solo usuario no debería causar problemas, pero dos aportes muy seguidos podrían pisarse entre sí.

## Próximas entregas

- **v0.4** — Ajustes de cuenta, multi-moneda, onboarding, alertas de presupuesto, movimientos recurrentes.
