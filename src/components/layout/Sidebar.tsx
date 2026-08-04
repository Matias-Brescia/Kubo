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
          "group flex items-center gap-3 rounded-kubo-sm px-3 py-2 text-sm font-medium transition-all duration-200",
          isActive
            ? "bg-white/10 text-white"
            : "text-white/50 hover:bg-white/8 hover:text-white/90"
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            className={cn(
              "size-[17px] shrink-0 transition-colors duration-200",
              isActive ? "text-white" : "text-white/40 group-hover:text-white/70"
            )}
          />
          <span className="flex-1 truncate">{item.label}</span>
          {item.comingSoon && (
            <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] font-medium text-white/40">
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
  const displayName = (user?.user_metadata?.full_name as string | undefined) || user?.email?.split("@")[0] || "Usuario";

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-[#0F172A] py-5 md:flex">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-6 py-1">
        <Logo className="size-6" />
        <span className="text-sm font-semibold tracking-tight text-white">Kubo</span>
      </div>

      {/* Nav principal — scroll propio si el contenido crece, independiente del resto de la página */}
      <nav className="mt-6 flex flex-1 flex-col gap-0.5 overflow-y-auto px-3">
        {navItems.map((item) => (
          <NavRow key={item.path} item={item} />
        ))}
      </nav>

      {/* Footer — siempre visible, no se mueve ni se corta con el scroll del nav */}
      <div className="flex shrink-0 flex-col gap-0.5 border-t border-white/8 px-3 pt-3">
        <NavRow item={settingsItem} />
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 rounded-kubo-sm px-3 py-2 text-sm font-medium text-white/50 transition-all duration-200 hover:bg-white/8 hover:text-white/90"
        >
          {theme === "dark" ? (
            <Sun className="size-[17px] shrink-0 text-white/40" />
          ) : (
            <Moon className="size-[17px] shrink-0 text-white/40" />
          )}
          {theme === "dark" ? "Modo claro" : "Modo oscuro"}
        </button>

        {/* User chip */}
        {user && (
          <div className="mt-2 flex items-center gap-2.5 rounded-kubo-sm bg-white/6 px-3 py-2.5">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-accent/20 text-xs font-semibold text-accent">
              {displayName[0]?.toUpperCase()}
            </div>
            <p className="min-w-0 flex-1 truncate text-xs text-white/50">{displayName}</p>
            <button
              onClick={signOut}
              aria-label="Cerrar sesión"
              className="flex size-6 shrink-0 items-center justify-center rounded-[6px] text-white/30 transition-colors duration-200 hover:text-red-400"
            >
              <LogOut className="size-3.5" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
