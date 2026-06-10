import React from "react";
import { PageContainer } from "@/components/layout/page-container";
import { Activity, ShieldAlert, Cpu } from "lucide-react";

export default function CommandCenterPage() {
  const breadcrumbs = [{ label: "Admin", href: "/admin/command-center" }, { label: "Command Center" }];

  return (
    <PageContainer
      title="Command Center"
      subtitle="Real-time central dispatch and delivery operations control hub"
      breadcrumbs={breadcrumbs}
    >
      <div className="grid gap-6 md:grid-cols-3">
        {/* Skeleton Card 1 */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Activity className="size-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-foreground">Active Dispatch Metrics</h3>
              <p className="text-xs text-muted-foreground">Fleet status summary</p>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            <div className="h-4 w-full rounded bg-muted animate-pulse" />
            <div className="h-4 w-2/3 rounded bg-muted animate-pulse" />
          </div>
        </div>

        {/* Skeleton Card 2 */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ShieldAlert className="size-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-foreground">Incident Alerts</h3>
              <p className="text-xs text-muted-foreground">Unresolved delivery issues</p>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            <div className="h-4 w-full rounded bg-muted animate-pulse" />
            <div className="h-4 w-5/6 rounded bg-muted animate-pulse" />
          </div>
        </div>

        {/* Skeleton Card 3 */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Cpu className="size-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-foreground">Optimization Engine</h3>
              <p className="text-xs text-muted-foreground">Auto-routing scheduler load</p>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            <div className="h-4 w-full rounded bg-muted animate-pulse" />
            <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
          </div>
        </div>

        {/* Large Layout Scaffolding Area */}
        <div className="md:col-span-3 rounded-xl border border-border bg-card p-6 shadow-sm min-h-96 flex flex-col items-center justify-center text-center">
          <div className="max-w-md">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
              <Activity className="size-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-foreground mb-2">Live Map & Dispatch Board</h3>
            <p className="text-sm text-muted-foreground mb-6 font-sans">
              This space will host the real-time geographic distribution map, dispatch control queue, and active vehicle list.
            </p>
            <div className="flex flex-col gap-2.5 max-w-xs mx-auto">
              <div className="h-3 w-full rounded bg-muted animate-pulse" />
              <div className="h-3 w-5/6 rounded bg-muted animate-pulse" />
              <div className="h-3 w-4/5 rounded bg-muted animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
