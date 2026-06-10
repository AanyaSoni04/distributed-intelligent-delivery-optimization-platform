"use client";

import React from "react";
import Link from "next/link";
import { 
  Bell, 
  Menu, 
  Search, 
  Wifi, 
  ExternalLink,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminHeaderProps {
  onMenuToggle: () => void;
}

export function AdminHeader({ onMenuToggle }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border bg-background px-4 md:px-6 shadow-sm">
      {/* Mobile Toggle & Search */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuToggle}
          className="lg:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu className="size-5" />
        </Button>

        {/* Global Search Bar */}
        <div className="relative hidden md:block w-72 lg:w-96">
          <Search className="absolute top-2.5 left-3 size-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search deliveries, vehicles, warehouses..."
            className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all"
          />
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Connection Status Indicator */}
        <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 border border-emerald-100">
          <Wifi className="size-3.5 animate-pulse text-emerald-600" />
          <span className="hidden sm:inline font-sans">Platform Live</span>
        </div>

        {/* Quick Portal Switcher */}
        <div className="relative group">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs font-medium border-border">
            <span>Portal Switcher</span>
            <ChevronDown className="size-3.5 text-muted-foreground transition-transform group-hover:rotate-180" />
          </Button>
          <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md border border-border bg-popover p-1 shadow-lg ring-1 ring-black/5 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-150 z-50">
            <Link
              href="/customer/create-delivery"
              className="flex items-center justify-between rounded px-2.5 py-1.5 text-xs text-foreground hover:bg-accent hover:text-primary transition-colors"
            >
              <span>Customer Portal</span>
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

        {/* Notification Bell */}
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="size-5" />
          <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-primary" />
        </Button>

        {/* User Info Avatar Button */}
        <div className="flex items-center gap-2 border-l border-border pl-3 md:pl-4">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-heading font-semibold text-xs shadow-sm">
            AS
          </div>
        </div>
      </div>
    </header>
  );
}
