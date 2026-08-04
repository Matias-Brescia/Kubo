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
};

export function getCategoryIconByKey(icon: string): LucideIcon {
  return iconMap[icon] ?? CircleDollarSign;
}

export const availableCategoryIcons = Object.keys(iconMap);
