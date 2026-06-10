import React from "react";
import { PageContainer } from "@/components/layout/page-container";
import { Navigation, MapPin, Milestone, AlertTriangle } from "lucide-react";

export default function ActiveRoutePage() {
  const breadcrumbs = [{ label: "Driver", href: "/driver/dashboard" }, { label: "Active Route" }];

  return (
    <PageContainer
      title="Active Route"
      subtitle="Real-time navigation, stop itinerary, and parcel delivery confirmation"
      breadcrumbs={breadcrumbs}
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Route Stops Queue */}
        <div className="lg:col-span-1 rounded-xl border border-border bg-card p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Milestone className="size-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-sm text-foreground">Stops Queue</h3>
              <p className="text-xs text-muted-foreground">Order of package drop-offs</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Active Stop */}
            <div className="p-3.5 rounded-lg border-2 border-primary bg-primary/5 relative">
              <div className="absolute top-2.5 right-2.5 size-2 rounded-full bg-primary" />
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Current Stop (Stop #1)</span>
              <span className="block text-xs font-bold text-foreground mt-1">124 Main Street, Hub Sector B</span>
              <span className="block text-[10px] text-muted-foreground mt-0.5">Package ID: PKG-9102-A</span>
            </div>

            {/* Next Stops Skeletons */}
            {[2, 3, 4].map((stop) => (
              <div key={stop} className="p-3 rounded-lg border border-border/80 bg-muted/10 opacity-70">
                <span className="block text-[10px] font-semibold text-muted-foreground uppercase">Stop #{stop}</span>
                <div className="h-3.5 w-3/4 rounded bg-muted animate-pulse mt-1.5" />
                <div className="h-2.5 w-1/2 rounded bg-muted animate-pulse mt-1.5" />
              </div>
            ))}
          </div>
        </div>

        {/* Live Route GPS Map */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6 shadow-sm min-h-96 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 border border-amber-100 shadow-sm">
            <AlertTriangle className="size-3.5 text-amber-600" />
            <span>Heavy traffic reported on Route Sector B</span>
          </div>

          <div className="max-w-md z-10">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
              <Navigation className="size-6" />
            </div>
            <h3 className="font-heading font-bold text-base text-foreground mb-2">GPS Copilot Viewer</h3>
            <p className="text-xs text-muted-foreground mb-6 font-sans">
              Integrates the geographic routing trace, dynamic direction recalculations, and delivery confirmation signature pad.
            </p>
            <div className="h-32 w-64 rounded-lg bg-muted animate-pulse mx-auto" />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
