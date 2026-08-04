import {
  UtensilsCrossed,
  Home,
  Car,
  Tv,
  Gamepad2,
  HeartPulse,
  Wallet,
  Laptop,
  CircleDollarSign,
  Target,
  Plane,
  GraduationCap,
  Gift,
  ShieldCheck,
  Smartphone,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  "utensils-crossed": UtensilsCrossed,
  home: Home,
  car: Car,
  tv: Tv,
  "gamepad-2": Gamepad2,
  "heart-pulse": HeartPulse,
  wallet: Wallet,
  laptop: Laptop,
  "circle-dollar-sign": CircleDollarSign,
  target: Target,
  plane: Plane,
  "graduation-cap": GraduationCap,
  gift: Gift,
  "shield-check": ShieldCheck,
  smartphone: Smartphone,
};

export function getCategoryIconByKey(icon: string): LucideIcon {
  return iconMap[icon] ?? CircleDollarSign;
}

/**
 * Clase de color Tailwind para el ícono de una categoría, usando los
 * tokens `category-*` definidos en tailwind.config.js (v0.5). Cada ícono
 * se asocia al color semántico que mejor representa su tipo de gasto.
 * Fallback a `text-muted` para íconos personalizados sin color asignado.
 */
const iconColorMap: Record<string, string> = {
  "utensils-crossed": "text-category-food",
  home: "text-category-home",
  car: "text-category-transport",
  tv: "text-category-entertainment",
  "gamepad-2": "text-category-entertainment",
  "heart-pulse": "text-category-health",
  wallet: "text-category-work",
  laptop: "text-category-work",
  "circle-dollar-sign": "text-muted",
  target: "text-category-travel",
  plane: "text-category-travel",
  "graduation-cap": "text-category-education",
  gift: "text-category-shopping",
  "shield-check": "text-category-health",
  smartphone: "text-category-shopping",
};

export function getCategoryColorByKey(icon: string): string {
  return iconColorMap[icon] ?? "text-muted";
}

/**
 * Variable CSS (var(--category-x)) equivalente al color de `getCategoryColorByKey`,
 * para usar en contextos que necesitan un color CSS directo en vez de una clase
 * Tailwind — como el `fill`/`stroke` de un gráfico de recharts.
 */
const iconCssVarMap: Record<string, string> = {
  "utensils-crossed": "var(--category-food)",
  home: "var(--category-home)",
  car: "var(--category-transport)",
  tv: "var(--category-entertainment)",
  "gamepad-2": "var(--category-entertainment)",
  "heart-pulse": "var(--category-health)",
  wallet: "var(--category-work)",
  laptop: "var(--category-work)",
  "circle-dollar-sign": "var(--muted)",
  target: "var(--category-travel)",
  plane: "var(--category-travel)",
  "graduation-cap": "var(--category-education)",
  gift: "var(--category-shopping)",
  "shield-check": "var(--category-health)",
  smartphone: "var(--category-shopping)",
};

export function getCategoryCssColorByKey(icon: string): string {
  return `hsl(${iconCssVarMap[icon] ?? "var(--muted)"})`;
}

export const availableCategoryIcons = Object.keys(iconMap);

export const availableGoalIcons = [
  "target",
  "plane",
  "home",
  "car",
  "graduation-cap",
  "gift",
  "shield-check",
  "smartphone",
  "laptop",
  "circle-dollar-sign",
];
