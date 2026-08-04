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
