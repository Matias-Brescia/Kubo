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
  type LucideIcon,
} from "lucide-react";

export const categoryIcon: Record<string, LucideIcon> = {
  Alimentación: UtensilsCrossed,
  Vivienda: Home,
  Transporte: Car,
  Suscripciones: Tv,
  Entretenimiento: Gamepad2,
  Salud: HeartPulse,
  Sueldo: Wallet,
  Freelance: Laptop,
  Otros: CircleDollarSign,
};

export function getCategoryIcon(category: string): LucideIcon {
  return categoryIcon[category] ?? CircleDollarSign;
}
