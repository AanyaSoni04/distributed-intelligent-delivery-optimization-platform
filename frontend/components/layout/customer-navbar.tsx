"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Menu, 
  X, 
  PlusCircle, 
  MapPin, 
  ExternalLink,
  ChevronDown,
  User,
  LogOut,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CustomerNavbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    {
      name: "Create Delivery",
      href: "/customer/create-delivery",
      icon: PlusCircle
    },
    {
      name: "Delivery Tracking",
      href: "/customer/tracking",
      icon: MapPin
    }
  ];

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-border bg-background shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-8">
            <Link href="/customer/tracking" className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                <span className="font-heading font-black text-lg tracking-wider">D</span>
              </div>
              <div className="flex flex-col">
                <span className="font-heading text-sm font-bold tracking-tight text-foreground">
                  DIDOP Customer
                </span>
                <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                  Delivery Dashboard
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1.5">
              {navItems.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-3.5 py-2 text-base transition-colors",
                      isActive
                        ? "bg-primary/5 text-slate-900 font-semibold"
                        : "text-slate-700 hover:bg-accent hover:text-slate-950 font-medium"
                    )}
                  >
                    <item.icon className="size-4 shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Quick Switcher */}
            <div className="relative group">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs font-medium border-border">
                <span>Switch Portal</span>
                <ChevronDown className="size-3.5 text-muted-foreground transition-transform group-hover:rotate-180" />
              </Button>
              <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md border border-border bg-popover p-1 shadow-lg ring-1 ring-black/5 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-150 z-50">
                <Link
                  href="/admin/command-center"
                  className="flex items-center justify-between rounded px-2.5 py-1.5 text-xs text-foreground hover:bg-accent hover:text-primary transition-colors"
                >
                  <span>Admin Portal</span>
                  <ExternalLink className="size-3" />
                </Link>
                <Link
                  href="/driver/dashboard"
                  className="flex items-center justify-between rounded px-2.5 py-1.5 text-xs text-foreground hover:bg-accent hover:text-primary transition-colors"
                >
                  <span>Driver Portal</span>
                  <ExternalLink className="size-3" />
                </Link>
              </div>
            </div>

            {/* User Dropdown */}
            <div className="relative group">
              <Button variant="ghost" className="h-9 gap-2 px-2.5 hover:bg-accent">
                <div className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-primary font-heading font-semibold text-xs">
                  CS
                </div>
                <span className="text-xs font-semibold text-foreground">Client Workspace</span>
                <ChevronDown className="size-3.5 text-muted-foreground transition-transform group-hover:rotate-180" />
              </Button>
              <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md border border-border bg-popover p-1 shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-150 z-50">
                <div className="px-2.5 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider border-b border-border mb-1">
                  My Profile
                </div>
                <button className="flex w-full items-center gap-2 rounded px-2.5 py-1.5 text-xs text-foreground hover:bg-accent transition-colors">
                  <User className="size-3.5 text-muted-foreground" />
                  <span>Account Details</span>
                </button>
                <button className="flex w-full items-center gap-2 rounded px-2.5 py-1.5 text-xs text-foreground hover:bg-accent transition-colors">
                  <Settings className="size-3.5 text-muted-foreground" />
                  <span>Settings</span>
                </button>
                <button className="flex w-full items-center gap-2 rounded px-2.5 py-1.5 text-xs text-destructive hover:bg-destructive/5 transition-colors border-t border-border mt-1 pt-2">
                  <LogOut className="size-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Hamburguer Toggle */}
          <div className="flex md:hidden items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-3 space-y-1 shadow-inner">
          <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
            Navigation
          </div>
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/5 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <item.icon className="size-4.5" />
                <span>{item.name}</span>
              </Link>
            );
          })}

          <div className="border-t border-border mt-4 pt-3 space-y-1">
            <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
              Switch Workspace
            </div>
            <Link
              href="/admin/command-center"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between rounded px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              <span>Admin Portal</span>
              <ExternalLink className="size-3.5" />
            </Link>
            <Link
              href="/driver/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between rounded px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              <span>Driver Portal</span>
              <ExternalLink className="size-3.5" />
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
