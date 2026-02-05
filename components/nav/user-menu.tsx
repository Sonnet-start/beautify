"use client";

import { LogOut, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type UserMenuProps = {
  initials: string;
  name: string;
  onSignOut: () => Promise<void> | void;
};

export function UserMenu({ initials, name, onSignOut }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={open}
        title={name}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-full",
          "bg-primary/10 text-primary ring-1 ring-primary/25",
          "text-xs font-semibold tracking-wide",
          "transition hover:bg-primary/15 hover:shadow-sm",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        )}
      >
        {initials}
      </button>

      <div
        role="menu"
        className={cn(
          "absolute right-0 mt-2 w-44 origin-top-right rounded-xl border",
          "border-border/60 bg-background/95 p-1 shadow-xl",
          "backdrop-blur-md transition",
          open ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
        )}
      >
        <Link
          href="/profile"
          role="menuitem"
          onClick={() => setOpen(false)}
          className={cn(
            "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm",
            "text-foreground transition hover:bg-accent hover:text-accent-foreground"
          )}
        >
          <User className="h-4 w-4" />
          Профиль
        </Link>
        <button
          type="button"
          role="menuitem"
          onClick={() => {
            setOpen(false);
            onSignOut();
          }}
          className={cn(
            "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm",
            "text-foreground transition hover:bg-accent hover:text-accent-foreground"
          )}
        >
          <LogOut className="h-4 w-4" />
          Выйти
        </button>
      </div>
    </div>
  );
}
