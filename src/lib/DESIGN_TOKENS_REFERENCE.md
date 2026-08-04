# Design Tokens Reference - Kubo v0.5

## Colores Semánticos

Usar en contextos específicos:

```tsx
// Success - acciones completadas, estados positivos
<div className="bg-success/10 text-success">✓ Completado</div>

// Warning - atención, límites alcanzados
<div className="bg-warning/10 text-warning">⚠ Advertencia</div>

// Info - información, datos nuevos
<div className="bg-info/10 text-info">ℹ Información</div>

// Negative - errores, acciones destructivas
<div className="bg-negative/10 text-negative">✗ Error</div>
```

## Colores de Categoría

Usar para iconos, badges e indicadores de categoría:

```tsx
// Comida → Naranja
<Icon className="text-category-food" />

// Transporte → Azul
<Icon className="text-category-transport" />

// Hogar → Verde
<Icon className="text-category-home" />

// Salud → Rojo
<Icon className="text-category-health" />

// Entretenimiento → Morado
<Icon className="text-category-entertainment" />

// Educación → Cyan
<Icon className="text-category-education" />

// Compras → Amarillo
<Icon className="text-category-shopping" />

// Trabajo → Índigo
<Icon className="text-category-work" />

// Viajes → Turquesa
<Icon className="text-category-travel" />

// Mascotas → Rosa
<Icon className="text-category-pets" />
```

## Tipografía

Escala completa de tamaños con line-heights incluidos:

```tsx
// Extra pequeño - labels, captions
<p className="text-xs">12px / 16px line-height</p>

// Pequeño - helper text, subtítulos
<p className="text-sm">14px / 20px line-height</p>

// Base - body text, párrafos
<p className="text-base">16px / 24px line-height</p>

// Grande - títulos secundarios
<p className="text-lg">18px / 28px line-height</p>

// Extra grande - títulos principales
<h1 className="text-2xl font-semibold">24px / 32px</h1>

// Títulos grandes
<h2 className="text-3xl font-semibold">30px / 36px</h2>
```

Pesos disponibles:
- `font-regular` (400) - texto normal
- `font-medium` (500) - énfasis moderado
- `font-semibold` (600) - énfasis fuerte

## Animaciones

Duración estándar: **200ms** (ease-out)

```tsx
// Transiciones suaves
<div className="transition-colors duration-200">
  Hover effect
</div>

// Entrada de elementos
<div className="animate-fade-up">Entrada suave</div>
<div className="animate-fade-in">Fade simple</div>
<div className="animate-scale-in">Entrada con escala</div>

// Para elementos que entran del lado
<div className="animate-slide-in-from-left">Menú lateral</div>
```

## Espaciado

Usar escala consistente:

```tsx
// Micro - entre inline elements
<div className="gap-1">Items</div>

// Pequeño - entre elementos relacionados
<div className="gap-2">Items</div>
<div className="gap-3">Items</div>

// Mediano - entre secciones
<div className="gap-4">Sections</div>
<div className="gap-5">Sections</div>

// Grande - entre bloques principales
<div className="gap-6">Blocks</div>
<div className="gap-8">Blocks</div>
```

Padding:
```tsx
// Cards compactas
<div className="p-4">Content</div>

// Cards normales
<div className="p-5">Content</div>

// Cards con más aire
<div className="p-6">Content</div>

// Grandes secciones
<div className="p-8">Content</div>
```

## Border Radius

```tsx
// Buttons, inputs, pequeños elementos
className="rounded-kubo-sm" // 12px

// Cards, paneles, elementos medianos
className="rounded-kubo" // 18px

// Elementos completamente redondeados
className="rounded-full"
```

## Shadows (Elevation)

```tsx
// Sombra sutil - cards normales
className="shadow-kubo"

// Sombra fuerte - modales, dropdowns
className="shadow-kubo-lg"
```

## Uso de categorías en componentes

### En transacciones:
```tsx
<div className={`flex items-center gap-2 text-category-${category}`}>
  <Icon className="size-4" />
  <span>{categoryName}</span>
</div>
```

### En badges:
```tsx
<div className={`bg-category-${category}/15 text-category-${category}`}>
  Categoría
</div>
```

### En gráficos:
```tsx
// El chart usará los colores de categoría automáticamente
const categoryColor = {
  food: 'hsl(var(--category-food))',
  // ...
}
```
