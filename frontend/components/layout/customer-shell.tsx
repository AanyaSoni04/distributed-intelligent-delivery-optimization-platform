"use client";

import React from "react";
import { CustomerNavbar } from "./customer-navbar";

interface CustomerShellProps {
  children: React.ReactNode;
}

export function CustomerShell({ children }: CustomerShellProps) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      {/* Top Navbar */}
      <CustomerNavbar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {children}
      </main>

      {/* Subtle Footer */}
      <footer className="border-t border-border py-4 text-center text-xs text-muted-foreground bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          &copy; {new Date().getFullYear()} DIDOP Portal. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
