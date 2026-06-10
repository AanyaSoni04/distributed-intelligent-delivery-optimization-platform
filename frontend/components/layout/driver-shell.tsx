"use client";

import React, { useState } from "react";
import { DriverSidebar } from "./driver-sidebar";
import { Menu, Compass, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DriverShellProps {
  children: React.ReactNode;
}

export function DriverShell({ children }: DriverShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Backdrop for mobile driver sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Driver Sidebar Nav */}
      <DriverSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile-First Driver Top Bar */}
        <header className="flex h-16 w-full items-center justify-between border-b border-border bg-background px-4 md:px-6 shadow-sm">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
              aria-label="Toggle menu"
            >
              <Menu className="size-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Compass className="size-5 text-primary" />
              <span className="font-heading text-sm font-bold tracking-tight text-foreground">
                Driver Operations
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-100">
              <Wifi className="size-3 text-emerald-600" />
              <span>Network Active</span>
            </div>
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-heading font-bold text-xs">
              DR
            </div>
          </div>
        </header>

        {/* Dynamic page content wrapper */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-zinc-50/50">
          {children}
        </main>
      </div>
    </div>
  );
}
