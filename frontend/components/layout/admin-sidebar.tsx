"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Brain, 
  LayoutDashboard, 
  Truck, 
  Settings,
  HelpCircle,
  Menu,
  X,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function AdminSidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname();

  const navigation = [
    {
      name: "Command Center",
      href: "/admin/command-center",
      icon: LayoutDashboard,
      description: "Real-time dispatch control"
    },
    {
      name: "Delivery Operations",
      href: "/admin/operations",
      icon: Truck,
      description: "Active fleet and routes"
    },
    {
      name: "Optimization & Analytics",
      href: "/admin/intelligence",
      icon: Brain,
      description: "AI optimization & metrics",
      badge: "Premium" // Reserving muted gold for premium status indicators!
    }
  ];

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-sidebar transition-transform duration-300 ease-in-out lg:static lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      {/* Brand Logo Header */}
      <div className="flex h-16 items-center justify-between border-b border-border px-6">
        <Link href="/admin/command-center" className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <span className="font-heading font-black text-lg tracking-wider">D</span>
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-sm font-bold tracking-tight text-foreground">
              DIDOP Portal
            </span>
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
              Administration
            </span>
          </div>
        </Link>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="size-5" />
          </Button>
        )}
      </div>

      {/* Main Nav Navigation */}
      <nav className="flex-1 space-y-1.5 px-4 py-6 overflow-y-auto">
        <div className="px-2 pb-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
          Operations Platform
        </div>
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-start gap-3 rounded-lg px-3 py-2.5 transition-all text-base",
                isActive
                  ? "bg-primary/5 text-slate-900 font-semibold border-l-2 border-primary pl-[10px]"
                  : "text-slate-700 hover:bg-accent hover:text-slate-950 border-l-2 border-transparent font-medium"
              )}
            >
              <item.icon
                className={cn(
                  "size-5 mt-0.5 shrink-0 transition-colors",
                  isActive ? "text-primary" : "text-slate-600 group-hover:text-slate-900"
                )}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="truncate">{item.name}</span>
                  {item.badge && (
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-gold/10 px-1.5 py-0.5 text-xs font-semibold text-gold-foreground font-sans">
                      <Sparkles className="size-2.5" />
                      {item.badge}
                    </span>
                  )}
                </div>
                <span
                  className={cn(
                    "block truncate text-sm font-normal mt-0.5",
                    isActive ? "text-primary/90" : "text-slate-500"
                  )}
                >
                  {item.description}
                </span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer / User Area */}
      <div className="border-t border-border p-4 bg-sidebar-accent/10">
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary font-semibold text-sm">
            AS
          </div>
          <div className="min-w-0 flex-1">
            <span className="block truncate text-base font-semibold text-slate-900">
              Aanya Soni
            </span>
            <span className="block truncate text-sm font-medium text-slate-500">
              Platform Admin
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
