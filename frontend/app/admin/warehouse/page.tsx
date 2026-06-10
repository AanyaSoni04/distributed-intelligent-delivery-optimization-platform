import React from "react";
import { PageContainer } from "@/components/layout/page-container";
import { Boxes, Warehouse, MapPin, ClipboardList } from "lucide-react";

export default function WarehouseManagementPage() {
  const breadcrumbs = [{ label: "Admin", href: "/admin/command-center" }, { label: "Warehouse Management" }];

  return (
    <PageContainer
      title="Warehouse Management"
      subtitle="Inventory sorting hubs, package ingestion, and truck loading bay status"
      breadcrumbs={breadcrumbs}
    >
      <div className="grid gap-6 md:grid-cols-3">
        {/* Hub Skeletons */}
        {[1, 2, 3].map((hub) => (
          <div key={hub} className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Warehouse className="size-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-foreground">Sorting Hub #{hub}02</h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="size-3" /> Regional Distribution Center
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                  <span className="text-muted-foreground">Ingestion Queue Load</span>
                  <span className="text-foreground">75% Capacity</span>
                </div>
                <div className="h-2 w-full rounded bg-muted overflow-hidden">
                  <div className="h-full bg-primary rounded" style={{ width: "75%" }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                  <span className="text-muted-foreground">Truck Loading Bays</span>
                  <span className="text-foreground">6 / 8 Bays Busy</span>
                </div>
                <div className="h-2 w-full rounded bg-muted overflow-hidden">
                  <div className="h-full bg-primary rounded" style={{ width: "80%" }} />
                </div>
              </div>

              <div className="flex justify-between items-center text-xs pt-2 font-medium">
                <span className="text-muted-foreground flex items-center gap-1">
                  <ClipboardList className="size-3.5" /> Pending sorting
                </span>
                <span className="h-4 w-12 rounded bg-muted animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </PageContainer>
  );
}
