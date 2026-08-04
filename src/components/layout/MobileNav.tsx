import * as Dialog from "@radix-ui/react-dialog";
import { Menu, X, Moon, Sun } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Logo } from "./Logo";
import { navItems, settingsItem } from "./nav-config";
import { cn } from "@/lib/utils";
import { useThemeContext } from "@/app/providers/ThemeProvider";
import { useState } from "react";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useThemeContext();

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          className="flex size-9 items-center justify-center rounded-kubo-sm border border-border text-foreground md:hidden"
          aria-label="Abrir menú"
        >
          <Menu className="size-4" />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/50 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-bg px-4 py-6 shadow-kubo-lg outline-none data-[state=open]:animate-in data-[state=open]:slide-in-from-left">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2.5">
              <Logo className="size-7" />
              <Dialog.Title asChild>
                <span className="text-[15px] font-semibold tracking-tight">Kubo</span>
              </Dialog.Title>
            </div>
            <Dialog.Close asChild>
              <button
                className="flex size-8 items-center justify-center rounded-kubo-sm text-muted hover:bg-surface-hover hover:text-foreground"
                aria-label="Cerrar menú"
              >
                <X className="size-4" />
              </button>
            </Dialog.Close>
          </div>

          <nav className="mt-8 flex flex-1 flex-col gap-1">
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
                      "flex items-center gap-3 rounded-kubo-sm px-3 py-2.5 text-sm font-medium",
                      isActive
                        ? "bg-surface-hover text-foreground"
                        : "text-muted hover:bg-surface-hover hover:text-foreground"
                    )
                  }
                >
                  <Icon className="size-[18px]" />
                  <span className="flex-1">{item.label}</span>
                  {item.comingSoon && (
                    <span className="rounded-full bg-surface px-1.5 py-0.5 text-[10px] font-medium text-muted">
                      pronto
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          <div className="flex flex-col gap-1 border-t border-border pt-4">
            <NavLink
              to={settingsItem.path}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-kubo-sm px-3 py-2.5 text-sm font-medium text-muted hover:bg-surface-hover hover:text-foreground"
            >
              <settingsItem.icon className="size-[18px]" />
              {settingsItem.label}
            </NavLink>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-3 rounded-kubo-sm px-3 py-2.5 text-sm font-medium text-muted hover:bg-surface-hover hover:text-foreground"
            >
              {theme === "dark" ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
              {theme === "dark" ? "Modo claro" : "Modo oscuro"}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
