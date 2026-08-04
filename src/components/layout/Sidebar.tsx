import { NavLink } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { Logo } from "./Logo";
import { navItems, settingsItem } from "./nav-config";
import { cn } from "@/lib/utils";
import { useThemeContext } from "@/app/providers/ThemeProvider";

function NavRow({ item }: { item: (typeof navItems)[number] }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.path}
      end={item.path === "/"}
      className={({ isActive }) =>
        cn(
          "group flex items-center gap-3 rounded-kubo-sm px-3 py-2.5 text-sm font-medium transition-colors",
          isActive
            ? "bg-surface-hover text-foreground"
            : "text-muted hover:bg-surface-hover hover:text-foreground"
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            className={cn(
              "size-[18px] transition-colors",
              isActive ? "text-accent" : "text-muted group-hover:text-foreground"
            )}
          />
          <span className="flex-1">{item.label}</span>
          {item.comingSoon && (
            <span className="rounded-full bg-surface px-1.5 py-0.5 text-[10px] font-medium text-muted">
              pronto
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}

export function Sidebar() {
  const { theme, toggleTheme } = useThemeContext();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-bg px-4 py-6 md:flex">
      <div className="flex items-center gap-2.5 px-2">
        <Logo className="size-7" />
        <span className="text-[15px] font-semibold tracking-tight">Kubo</span>
      </div>

      <nav className="mt-8 flex flex-1 flex-col gap-1">
        {navItems.map((item) => (
          <NavRow key={item.path} item={item} />
        ))}
      </nav>

      <div className="flex flex-col gap-1 border-t border-border pt-4">
        <NavRow item={settingsItem} />
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 rounded-kubo-sm px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
        >
          {theme === "dark" ? (
            <Sun className="size-[18px]" />
          ) : (
            <Moon className="size-[18px]" />
          )}
          {theme === "dark" ? "Modo claro" : "Modo oscuro"}
        </button>
      </div>
    </aside>
  );
}
