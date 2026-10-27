import {
  // Comida
  UtensilsCrossed,
  Coffee,
  Pizza,
  ShoppingCart,
  CupSoda,
  // Transporte
  Car,
  Bus,
  Bike,
  Fuel,
  TrainFront,
  ParkingMeter,
  Wrench,
  // Hogar
  Home,
  Bed,
  Sofa,
  Lightbulb,
  Droplets,
  Wifi,
  Flame,
  Baby,
  // Salud
  HeartPulse,
  ShieldCheck,
  Pill,
  Stethoscope,
  Dumbbell,
  // Ocio
  Tv,
  Gamepad2,
  Music,
  Film,
  Ticket,
  PartyPopper,
  Headphones,
  Wine,
  // Educación
  GraduationCap,
  BookOpen,
  Languages,
  Backpack,
  // Compras
  Gift,
  Smartphone,
  ShoppingBag,
  Shirt,
  Gem,
  Package,
  Scissors,
  // Trabajo y dinero
  Wallet,
  Laptop,
  Briefcase,
  Building2,
  Banknote,
  PiggyBank,
  TrendingUp,
  Receipt,
  Landmark,
  CreditCard,
  // Viajes
  Plane,
  MapPin,
  Tent,
  Luggage,
  TreePalm,
  Target,
  // Mascotas
  PawPrint,
  Dog,
  Cat,
  Bone,
  // Neutro
  CircleDollarSign,
  type LucideIcon,
} from "lucide-react";

/**
 * Los 10 colores de categoría, definidos como tokens en `index.css`
 * (`--category-*`) y `tailwind.config.js`. Se guardan solo como nombre:
 * el valor real (y su ajuste de contraste en modo claro) vive en el CSS.
 */
type CategoryColor =
  | "food"
  | "transport"
  | "home"
  | "health"
  | "entertainment"
  | "education"
  | "shopping"
  | "work"
  | "travel"
  | "pets";

/**
 * Clases estáticas: Tailwind solo genera una clase si ve el string completo
 * en el código, así que no se pueden armar como `text-category-${color}`.
 */
const colorClass: Record<CategoryColor, string> = {
  food: "text-category-food",
  transport: "text-category-transport",
  home: "text-category-home",
  health: "text-category-health",
  entertainment: "text-category-entertainment",
  education: "text-category-education",
  shopping: "text-category-shopping",
  work: "text-category-work",
  travel: "text-category-travel",
  pets: "text-category-pets",
};

interface IconDef {
  icon: LucideIcon;
  /** `null` = neutro (sin color de categoría). */
  color: CategoryColor | null;
}

/**
 * Única fuente de verdad: cada ícono con su componente y su color de paleta.
 *
 * - Las claves se guardan en la base de datos (`categories.icon`,
 *   `goals.icon`): NO renombrarlas ni eliminarlas, o las filas existentes
 *   caerían al ícono por defecto.
 * - El orden es el del selector de íconos, agrupado por color/tema.
 * - La primera clave es el ícono por defecto al crear una categoría.
 */
const iconDefs: Record<string, IconDef> = {
  // Comida
  "utensils-crossed": { icon: UtensilsCrossed, color: "food" },
  coffee: { icon: Coffee, color: "food" },
  pizza: { icon: Pizza, color: "food" },
  "shopping-cart": { icon: ShoppingCart, color: "food" },
  "cup-soda": { icon: CupSoda, color: "food" },

  // Transporte
  car: { icon: Car, color: "transport" },
  bus: { icon: Bus, color: "transport" },
  bike: { icon: Bike, color: "transport" },
  fuel: { icon: Fuel, color: "transport" },
  "train-front": { icon: TrainFront, color: "transport" },
  "parking-meter": { icon: ParkingMeter, color: "transport" },
  wrench: { icon: Wrench, color: "transport" },

  // Hogar
  home: { icon: Home, color: "home" },
  bed: { icon: Bed, color: "home" },
  sofa: { icon: Sofa, color: "home" },
  lightbulb: { icon: Lightbulb, color: "home" },
  droplets: { icon: Droplets, color: "home" },
  wifi: { icon: Wifi, color: "home" },
  flame: { icon: Flame, color: "home" },
  baby: { icon: Baby, color: "home" },

  // Salud
  "heart-pulse": { icon: HeartPulse, color: "health" },
  "shield-check": { icon: ShieldCheck, color: "health" },
  pill: { icon: Pill, color: "health" },
  stethoscope: { icon: Stethoscope, color: "health" },
  dumbbell: { icon: Dumbbell, color: "health" },

  // Ocio
  tv: { icon: Tv, color: "entertainment" },
  "gamepad-2": { icon: Gamepad2, color: "entertainment" },
  music: { icon: Music, color: "entertainment" },
  film: { icon: Film, color: "entertainment" },
  ticket: { icon: Ticket, color: "entertainment" },
  "party-popper": { icon: PartyPopper, color: "entertainment" },
  headphones: { icon: Headphones, color: "entertainment" },
  wine: { icon: Wine, color: "entertainment" },

  // Educación
  "graduation-cap": { icon: GraduationCap, color: "education" },
  "book-open": { icon: BookOpen, color: "education" },
  languages: { icon: Languages, color: "education" },
  backpack: { icon: Backpack, color: "education" },

  // Compras
  gift: { icon: Gift, color: "shopping" },
  smartphone: { icon: Smartphone, color: "shopping" },
  "shopping-bag": { icon: ShoppingBag, color: "shopping" },
  shirt: { icon: Shirt, color: "shopping" },
  gem: { icon: Gem, color: "shopping" },
  package: { icon: Package, color: "shopping" },
  scissors: { icon: Scissors, color: "shopping" },

  // Trabajo y dinero
  wallet: { icon: Wallet, color: "work" },
  laptop: { icon: Laptop, color: "work" },
  briefcase: { icon: Briefcase, color: "work" },
  "building-2": { icon: Building2, color: "work" },
  banknote: { icon: Banknote, color: "work" },
  "piggy-bank": { icon: PiggyBank, color: "work" },
  "trending-up": { icon: TrendingUp, color: "work" },
  receipt: { icon: Receipt, color: "work" },
  landmark: { icon: Landmark, color: "work" },
  "credit-card": { icon: CreditCard, color: "work" },

  // Viajes
  plane: { icon: Plane, color: "travel" },
  "map-pin": { icon: MapPin, color: "travel" },
  tent: { icon: Tent, color: "travel" },
  luggage: { icon: Luggage, color: "travel" },
  "tree-palm": { icon: TreePalm, color: "travel" },
  target: { icon: Target, color: "travel" },

  // Mascotas
  "paw-print": { icon: PawPrint, color: "pets" },
  dog: { icon: Dog, color: "pets" },
  cat: { icon: Cat, color: "pets" },
  bone: { icon: Bone, color: "pets" },

  // Neutro
  "circle-dollar-sign": { icon: CircleDollarSign, color: null },
};

export function getCategoryIconByKey(icon: string): LucideIcon {
  const def: IconDef | undefined = iconDefs[icon];
  return def?.icon ?? CircleDollarSign;
}

/** Clase de color Tailwind del ícono. Fallback neutro para claves desconocidas. */
export function getCategoryColorByKey(icon: string): string {
  const def: IconDef | undefined = iconDefs[icon];
  return def?.color ? colorClass[def.color] : "text-muted";
}

/**
 * Mismo color pero como valor CSS directo, para contextos que no aceptan
 * clases de Tailwind (como el `fill` de un gráfico de recharts).
 */
export function getCategoryCssColorByKey(icon: string): string {
  const def: IconDef | undefined = iconDefs[icon];
  return def?.color ? `hsl(var(--category-${def.color}))` : "hsl(var(--muted))";
}

export const availableCategoryIcons = Object.keys(iconDefs);

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
  "piggy-bank",
  "luggage",
  "sofa",
  "briefcase",
  "party-popper",
];
