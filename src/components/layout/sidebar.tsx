"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  ContractsIcon,
  TemplatesIcon,
  ObligationsIcon,
  ApprovalsIcon,
  CalendarIcon,
  SettingsIcon,
  LogoIcon,
} from "@/components/ui/icons";
import { ChevronLeft, Menu } from "lucide-react";

const navItems = [
  { label: "Contracts", href: "/contracts", icon: ContractsIcon },
  { label: "Templates", href: "/templates", icon: TemplatesIcon },
  { label: "Obligations", href: "/obligations", icon: ObligationsIcon },
  { label: "Approvals", href: "/approvals", icon: ApprovalsIcon },
  { label: "Calendar", href: "/calendar", icon: CalendarIcon },
  { label: "Settings", href: "/settings", icon: SettingsIcon },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarContent = (
    <>
      <div className={cn("flex h-14 items-center border-b", collapsed ? "justify-center px-2" : "gap-2 px-4")}>
        <LogoIcon className="h-6 w-6 shrink-0 text-[#1b91fb]" />
        {!collapsed && <span className="text-sm font-semibold">SpotDraft</span>}
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                collapsed && "justify-center px-2",
                active
                  ? "bg-[#f0f7ff] text-[#1b91fb]"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && item.label}
            </Link>
          );
        })}
      </nav>
      <div className={cn("border-t p-3", collapsed && "flex justify-center")}>
        <div className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground", collapsed && "px-0 justify-center")}>
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#f0f7ff] text-xs font-medium text-[#1b91fb]">
            RM
          </div>
          {!collapsed && <div className="flex-1 truncate text-xs">Rituka Mane</div>}
        </div>
      </div>
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="hidden lg:flex absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border bg-background text-muted-foreground hover:text-foreground shadow-sm"
      >
        <ChevronLeft className={cn("h-3.5 w-3.5 transition-transform", collapsed && "rotate-180")} />
      </button>
    </>
  );

  return (
    <>
      <button
        className="fixed left-4 top-3.5 z-50 flex h-8 w-8 items-center justify-center rounded-lg border bg-background shadow-sm lg:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <Menu className="h-4 w-4" />
      </button>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/20 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r bg-sidebar transition-all duration-200 lg:static lg:z-auto",
          collapsed ? "w-16" : "w-60",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
