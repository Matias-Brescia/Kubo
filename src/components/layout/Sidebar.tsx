import { NavLink } from "react-router-dom";
import { LogOut, Moon, Sun } from "lucide-react";
import { Logo } from "./Logo";
import { navItems, settingsItem } from "./nav-config";
import { cn } from "@/lib/utils";
import { useThemeContext } from "@/app/providers/ThemeProvider";
import { useAuth } from "@/features/auth/AuthProvider";

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
  const { user, signOut } = useAuth();

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

        {user && (
          <div className="mt-2 flex items-center gap-2.5 rounded-kubo-sm border border-border bg-surface-hover px-3 py-2.5">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-accent/15 text-xs font-semibold text-accent">
              {user.email?.[0]?.toUpperCase()}
            </div>
            <p className="min-w-0 flex-1 truncate text-xs text-muted">{user.email}</p>
            <button
              onClick={signOut}
              aria-label="Cerrar sesión"
              className="flex size-6 shrink-0 items-center justify-center rounded-[6px] text-muted hover:bg-surface hover:text-negative"
            >
              <LogOut className="size-3.5" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
