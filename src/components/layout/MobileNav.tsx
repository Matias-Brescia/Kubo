import * as Dialog from "@radix-ui/react-dialog";
import { LogOut, Menu, X, Moon, Sun } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Logo } from "./Logo";
import { navItems, settingsItem } from "./nav-config";
import { cn } from "@/lib/utils";
import { useThemeContext } from "@/app/providers/ThemeProvider";
import { useAuth } from "@/features/auth/AuthProvider";
import { useState } from "react";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useThemeContext();
  const { user, signOut } = useAuth();
  const displayName = (user?.user_metadata?.full_name as string | undefined) || user?.email?.split("@")[0] || "Usuario";

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          className="flex size-9 items-center justify-center rounded-kubo-sm border border-border text-muted transition-colors duration-200 hover:border-border/80 hover:text-foreground md:hidden"
          aria-label="Abrir menú"
        >
          <Menu className="size-4" />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-[#0F172A] px-3 py-5 shadow-kubo-lg outline-none data-[state=open]:animate-in data-[state=open]:slide-in-from-left">
          {/* Header */}
          <div className="flex items-center justify-between px-2 py-1">
            <div className="flex items-center gap-2.5">
              <Logo className="size-6" />
              <Dialog.Title asChild>
                <span className="text-sm font-semibold tracking-tight text-white">Kubo</span>
              </Dialog.Title>
            </div>
            <Dialog.Close asChild>
              <button
                className="flex size-8 items-center justify-center rounded-kubo-sm text-white/40 transition-colors duration-200 hover:bg-white/10 hover:text-white/90"
                aria-label="Cerrar menú"
              >
                <X className="size-4" />
              </button>
            </Dialog.Close>
          </div>

          {/* Nav Items */}
          <nav className="mt-6 flex flex-1 flex-col gap-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-kubo-sm px-3 py-2 text-sm font-medium transition-all duration-200",
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
                          "size-[17px] shrink-0",
                          isActive ? "text-white" : "text-white/40"
                        )}
                      />
                      <span className="flex-1">{item.label}</span>
                      {item.comingSoon && (
                        <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] font-medium text-white/40">
                          pronto
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="flex flex-col gap-0.5 border-t border-white/8 pt-3 mt-2">
            <NavLink
              to={settingsItem.path}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-kubo-sm px-3 py-2 text-sm font-medium transition-all duration-200",
                  isActive ? "bg-white/10 text-white" : "text-white/50 hover:bg-white/8 hover:text-white/90"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <settingsItem.icon className={cn("size-[17px] shrink-0", isActive ? "text-white" : "text-white/40")} />
                  {settingsItem.label}
                </>
              )}
            </NavLink>
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
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
