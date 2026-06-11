"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  MapPin, 
  X,
  ExternalLink,
  Power,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DriverSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function DriverSidebar({ isOpen = true, onClose }: DriverSidebarProps) {
  const pathname = usePathname();
  const [isOnline, setIsOnline] = useState(true);

  const navigation = [
    {
      name: "Driver Dashboard",
      href: "/driver/dashboard",
      icon: LayoutDashboard,
      description: "Overview and earnings"
    },
    {
      name: "Active Route",
      href: "/driver/active-route",
      icon: MapPin,
      description: "Turn-by-turn navigation"
    }
  ];

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-sidebar transition-transform duration-300 ease-in-out lg:static lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      {/* Driver Brand Header */}
      <div className="flex h-16 items-center justify-between border-b border-border px-6">
        <Link href="/driver/dashboard" className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <span className="font-heading font-black text-lg tracking-wider">D</span>
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-sm font-bold tracking-tight text-foreground">
              DIDOP Mobile
            </span>
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
              Fleet Driver Portal
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

      {/* Driver Status Toggle Widget (Online/Offline) */}
      <div className="border-b border-border p-4 bg-accent/30">
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-semibold text-muted-foreground">Duty Status</span>
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold border",
                isOnline 
                  ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                  : "bg-rose-50 text-rose-700 border-rose-100"
              )}
            >
              {isOnline ? "Active / Online" : "Offline / Off Duty"}
            </span>
          </div>
          <Button
            onClick={() => setIsOnline(!isOnline)}
            variant={isOnline ? "destructive" : "default"}
            size="sm"
            className="w-full gap-2 text-xs font-semibold"
          >
            <Power className="size-4" />
            <span>{isOnline ? "Go Off Duty" : "Go On Duty"}</span>
          </Button>
        </div>
      </div>

      {/* Driver Navigation */}
      <nav className="flex-1 space-y-2 px-4 py-6 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-start gap-3 rounded-lg px-4 py-3 transition-all text-base",
                isActive
                  ? "bg-primary/5 text-slate-900 font-semibold border-l-4 border-primary pl-[12px]"
                  : "text-slate-700 hover:bg-accent hover:text-slate-950 border-l-4 border-transparent font-medium"
              )}
            >
              <item.icon
                className={cn(
                  "size-5.5 mt-0.5 shrink-0 transition-colors",
                  isActive ? "text-primary" : "text-slate-600 group-hover:text-slate-900"
                )}
              />
              <div className="flex-1 min-w-0">
                <span className="block truncate">{item.name}</span>
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

      {/* Quick Switch Portal Bottom Option */}
      <div className="border-t border-border p-4 bg-sidebar-accent/10">
        <div className="relative group w-full">
          <Button variant="outline" size="sm" className="w-full justify-between text-xs font-semibold border-border">
            <span>Switch Portal</span>
            <ChevronDown className="size-3.5 text-muted-foreground transition-transform group-hover:rotate-180" />
          </Button>
          <div className="absolute left-0 bottom-full mb-2 w-full rounded-md border border-border bg-popover p-1 shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-150 z-50">
            <Link
              href="/admin/command-center"
              className="flex items-center justify-between rounded px-2.5 py-1.5 text-xs text-foreground hover:bg-accent hover:text-primary transition-colors"
            >
              <span>Admin Portal</span>
              <ExternalLink className="size-3" />
            </Link>
            <Link
              href="/customer/tracking"
              className="flex items-center justify-between rounded px-2.5 py-1.5 text-xs text-foreground hover:bg-accent hover:text-primary transition-colors"
            >
              <span>Customer Portal</span>
              <ExternalLink className="size-3" />
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary font-semibold text-sm">
            DR
          </div>
          <div className="min-w-0 flex-1">
            <span className="block truncate text-base font-semibold text-slate-900">
              Driver 402
            </span>
            <span className="block truncate text-sm font-medium text-slate-500">
              Express Delivery Fleet
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
