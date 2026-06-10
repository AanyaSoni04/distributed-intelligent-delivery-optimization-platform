import React from "react";
import { PageContainer } from "@/components/layout/page-container";
import { Compass, Calendar, Sparkles, Navigation, DollarSign } from "lucide-react";

export default function DriverDashboardPage() {
  const breadcrumbs = [{ label: "Driver", href: "/driver/dashboard" }, { label: "Dashboard" }];

  return (
    <PageContainer
      title="Driver Dashboard"
      subtitle="Shift overview, active job assignment, and earnings tracking"
      breadcrumbs={breadcrumbs}
      actions={
        <div className="inline-flex items-center gap-1.5 rounded-full border border-gold bg-gold/10 px-3 py-1.5 text-xs font-semibold text-gold-foreground shadow-sm">
          <Sparkles className="size-3.5" />
          <span>Premium Gold Courier</span>
        </div>
      }
    >
      <div className="grid gap-6 md:grid-cols-3">
        {/* Earnings Highlight - Gold accent */}
        <div className="rounded-xl border border-gold/20 bg-card p-6 shadow-sm ring-1 ring-gold/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-16 w-16 bg-gold/5 rounded-bl-full pointer-events-none" />
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-gold/10 text-gold-foreground">
              <DollarSign className="size-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-sm text-foreground">Weekly Shift Earnings</h3>
              <p className="text-xs text-muted-foreground">Premium tier payouts</p>
            </div>
          </div>
          <div className="mt-5">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-heading font-bold text-gold-foreground">$482.50</span>
              <span className="text-[10px] font-bold text-emerald-600">+$45.00 bonus</span>
            </div>
            <p className="text-[11px] text-muted-foreground/80 mt-2 font-sans">
              Calculated with optimized routing rewards and priority fulfillment milestones.
            </p>
          </div>
        </div>

        {/* Job Assignment Card */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm md:col-span-2">
          <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Compass className="size-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-sm text-foreground">Assigned Delivery Shift</h3>
              <p className="text-xs text-muted-foreground">Current route itinerary</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg border border-border/80 bg-accent/20">
              <div className="space-y-1">
                <span className="block text-xs font-bold text-foreground">Route ID: RT-NORTHEAST-94</span>
                <span className="block text-[10px] text-muted-foreground">12 total stops &bull; 48km total distance</span>
              </div>
              <div className="h-5 w-24 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <span className="text-[10px] font-bold">READY TO START</span>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1 space-y-1">
                <div className="h-3 w-1/2 rounded bg-muted animate-pulse" />
                <div className="h-2 w-1/3 rounded bg-muted animate-pulse" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="h-3 w-1/2 rounded bg-muted animate-pulse" />
                <div className="h-2 w-1/3 rounded bg-muted animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Daily Schedule */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm md:col-span-3">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="size-4.5 text-primary" />
            <h3 className="font-heading font-bold text-sm text-foreground">Weekly Duty Calendar</h3>
          </div>
          <div className="grid gap-3 sm:grid-cols-5 text-xs font-medium">
            {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day, idx) => (
              <div key={day} className="p-3 rounded border border-border bg-muted/10 text-center">
                <span className="block text-muted-foreground mb-1">{day}</span>
                <span className="block font-bold text-foreground">{idx % 2 === 0 ? "08:00 - 16:00" : "Off Duty"}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
