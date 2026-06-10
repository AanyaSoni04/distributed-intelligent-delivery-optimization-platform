import React from "react";
import Link from "next/link";
import { Shield, Users, Truck, Sparkles, Navigation } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 md:p-8">
      {/* Upper Accent Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative z-10 max-w-4xl w-full text-center space-y-8 animate-fade-in">
        {/* Brand Banner */}
        <div className="inline-flex items-center gap-2 rounded-full border border-gold bg-gold/10 px-4 py-1.5 text-xs font-semibold text-gold-foreground shadow-sm">
          <Sparkles className="size-3.5" />
          <span>Enterprise Logistics Platform</span>
        </div>

        {/* Headings */}
        <div className="space-y-3">
          <h1 className="text-4xl md:text-6xl font-heading font-black tracking-tight text-foreground">
            DIDOP
          </h1>
          <p className="text-lg md:text-xl font-heading font-medium text-muted-foreground max-w-2xl mx-auto">
            Distributed Intelligent Delivery Optimization Platform
          </p>
          <p className="text-sm text-muted-foreground/85 max-w-lg mx-auto font-sans">
            Streamlined logistics orchestration, real-time routing intelligence, and autonomous courier coordination.
          </p>
        </div>

        {/* Portal Cards Selector */}
        <div className="grid gap-6 sm:grid-cols-3 max-w-3xl mx-auto pt-6">
          {/* Admin Portal */}
          <Link
            href="/admin/command-center"
            className="group rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md hover:border-primary/50 hover:bg-primary/5 transition-all text-left flex flex-col justify-between min-h-48"
          >
            <div>
              <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Shield className="size-5" />
              </div>
              <h3 className="font-heading font-bold text-lg text-foreground mb-1 group-hover:text-primary transition-colors">
                Admin Portal
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Central command, operations routing optimization, fleet supervision, and system monitoring.
              </p>
            </div>
            <span className="text-[10px] font-bold text-primary tracking-wider uppercase inline-flex items-center gap-1 mt-4">
              Enter Dashboard <Navigation className="size-2.5 rotate-90" />
            </span>
          </Link>

          {/* Customer Portal */}
          <Link
            href="/customer/tracking"
            className="group rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md hover:border-primary/50 hover:bg-primary/5 transition-all text-left flex flex-col justify-between min-h-48"
          >
            <div>
              <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Users className="size-5" />
              </div>
              <h3 className="font-heading font-bold text-lg text-foreground mb-1 group-hover:text-primary transition-colors">
                Customer Portal
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Create and schedule shipments, view delivery tracking maps, and manage courier history.
              </p>
            </div>
            <span className="text-[10px] font-bold text-primary tracking-wider uppercase inline-flex items-center gap-1 mt-4">
              Enter Portal <Navigation className="size-2.5 rotate-90" />
            </span>
          </Link>

          {/* Driver Portal */}
          <Link
            href="/driver/dashboard"
            className="group rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md hover:border-primary/50 hover:bg-primary/5 transition-all text-left flex flex-col justify-between min-h-48"
          >
            <div>
              <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Truck className="size-5" />
              </div>
              <h3 className="font-heading font-bold text-lg text-foreground mb-1 group-hover:text-primary transition-colors">
                Driver Portal
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Driver shift assignment calendar, turn-by-turn route directions, and delivery logs.
              </p>
            </div>
            <span className="text-[10px] font-bold text-primary tracking-wider uppercase inline-flex items-center gap-1 mt-4">
              Enter Console <Navigation className="size-2.5 rotate-90" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
