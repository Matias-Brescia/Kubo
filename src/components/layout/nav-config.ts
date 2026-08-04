import {
  LayoutGrid,
  ArrowLeftRight,
  Tags,
  PiggyBank,
  Target,
  BarChart3,
  Settings,
} from "lucide-react";

export interface NavItem {
  label: string;
  path: string;
  icon: typeof LayoutGrid;
  comingSoon?: boolean;
}

export const navItems: NavItem[] = [
  { label: "Dashboard", path: "/", icon: LayoutGrid },
  { label: "Transacciones", path: "/transacciones", icon: ArrowLeftRight },
  { label: "Categorías", path: "/categorias", icon: Tags },
  { label: "Presupuestos", path: "/presupuestos", icon: PiggyBank, comingSoon: true },
  { label: "Metas", path: "/metas", icon: Target, comingSoon: true },
  { label: "Reportes", path: "/reportes", icon: BarChart3, comingSoon: true },
];

export const settingsItem: NavItem = {
  label: "Ajustes",
  path: "/ajustes",
  icon: Settings,
  comingSoon: true,
};
