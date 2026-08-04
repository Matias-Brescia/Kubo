# Kubo

Finanzas personales, sin fricción. Registra un gasto en menos de 5 segundos.

## Filosofía

Kubo no compite por cantidad de funciones — compite por simplicidad. Mucho espacio, pocas opciones, una acción principal siempre a la vista. La meta de diseño es que se sienta como un producto Apple o Linear: silencioso, preciso, con las cifras como protagonistas.

## Stack

- **React 19 + TypeScript** — Vite como build tool
- **Tailwind CSS** — sistema de tokens propio (ver `src/index.css` y `tailwind.config.js`)
- **Componentes tipo shadcn/ui** construidos sobre Radix UI (`src/components/ui`)
- **React Router** — navegación entre secciones
- **React Hook Form + Zod** — validación del formulario de registro rápido
- **Recharts** — tendencia de ingresos vs. gastos
- **Framer Motion** — micro-interacciones (entrada de cifras, transacciones)
- **Lucide** — iconografía
- **Geist Sans / Geist Mono** — tipografía. Los montos siempre usan Geist Mono con `tabular-nums`, como un ledger.

## Arquitectura

Organización modular por features, no por tipo de archivo (nada de MVC):

```
src/
  app/providers/       Providers globales (tema)
  components/layout/    Sidebar, Topbar, navegación móvil
  components/ui/        Primitivos reutilizables (Button, Card, Input...)
  components/shared/    Componentes compartidos entre features
  features/dashboard/   Todo lo relativo al dashboard: componentes, datos, tipos
  hooks/                 Hooks compartidos
  lib/                   Utilidades (cn, formato de moneda)
```

Cada nueva feature (transacciones, presupuestos, metas, reportes) vivirá en su propia carpeta bajo `src/features/`, siguiendo el mismo patrón que `dashboard/`. Nada se duplica: los primitivos de `components/ui` y las utilidades de `lib/` son la base común.

## Cómo correr el proyecto

```bash
npm install
npm run dev
```

Abre `http://localhost:5173`.

Para generar el build de producción:

```bash
npm run build
npm run preview
```

> Todavía no hay backend: el dashboard funciona sobre datos de ejemplo y estado en memoria.

## Novedades de esta versión — v0.1

- Estructura del proyecto completa (React + TS + Vite + Tailwind + componentes tipo shadcn/ui)
- Diseño de marca: paleta, tipografía, logo (cubo isométrico)
- Sidebar de navegación (desktop + drawer móvil)
- Dashboard: balance, ingresos/gastos del mes, ahorro, presupuesto, tendencia, actividad reciente — sobre datos de ejemplo (`src/features/dashboard/data/mock.ts`)
- Diálogo "Registrar movimiento" funcional sobre estado local (sin persistencia)
- Modo oscuro / claro con persistencia
- 100% responsive
- Sin Supabase todavía. Transacciones, Presupuestos, Metas y Reportes enlazados en la navegación con una pantalla "próximamente"

## Próximas entregas

- **v0.2** — Backend real con Supabase: autenticación, base de datos, CRUD de transacciones y categorías.
