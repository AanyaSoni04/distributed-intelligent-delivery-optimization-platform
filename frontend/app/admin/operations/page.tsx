import React from "react";
import { PageContainer } from "@/components/layout/page-container";
import { Truck, Navigation, Route } from "lucide-react";

export default function DeliveryOperationsPage() {
  const breadcrumbs = [{ label: "Admin", href: "/admin/command-center" }, { label: "Delivery Operations" }];

  return (
    <PageContainer
      title="Delivery Operations"
      subtitle="Fleet management, courier assignments, and transit routes monitoring"
      breadcrumbs={breadcrumbs}
    >
      <div className="grid gap-6 md:grid-cols-2">
        {/* Active Fleet */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Truck className="size-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-foreground">Active Courier List</h3>
              <p className="text-xs text-muted-foreground">Status and active shifts</p>
            </div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-full bg-muted animate-pulse" />
                  <div className="space-y-1.5">
                    <div className="h-3 w-24 rounded bg-muted animate-pulse" />
                    <div className="h-2 w-16 rounded bg-muted animate-pulse" />
                  </div>
                </div>
                <div className="h-5 w-16 rounded-full bg-muted animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        {/* Route Schedules */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Route className="size-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-foreground">Assigned Routes</h3>
              <p className="text-xs text-muted-foreground">Stops optimization progress</p>
            </div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-lg bg-muted animate-pulse" />
                  <div className="space-y-1.5">
                    <div className="h-3 w-32 rounded bg-muted animate-pulse" />
                    <div className="h-2 w-20 rounded bg-muted animate-pulse" />
                  </div>
                </div>
                <div className="h-4 w-12 rounded bg-muted animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
