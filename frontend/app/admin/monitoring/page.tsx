import React from "react";
import { PageContainer } from "@/components/layout/page-container";
import { Activity, Server, Radio, HardDrive } from "lucide-react";

export default function SystemMonitoringPage() {
  const breadcrumbs = [{ label: "Admin", href: "/admin/command-center" }, { label: "System Monitoring" }];

  return (
    <PageContainer
      title="System Monitoring"
      subtitle="Infrastructure health, system logs, API limits, and services state"
      breadcrumbs={breadcrumbs}
    >
      <div className="grid gap-6 md:grid-cols-4">
        {/* Metric 1 */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <Server className="size-4.5" />
            </div>
            <div>
              <span className="block text-xs font-semibold text-muted-foreground">Gateway Servers</span>
              <span className="block text-sm font-bold text-foreground mt-0.5">99.98% uptime</span>
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <Radio className="size-4.5" />
            </div>
            <div>
              <span className="block text-xs font-semibold text-muted-foreground">PubSub Channels</span>
              <span className="block text-sm font-bold text-foreground mt-0.5">14 active nodes</span>
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <HardDrive className="size-4.5" />
            </div>
            <div>
              <span className="block text-xs font-semibold text-muted-foreground">Databases Sync</span>
              <span className="block text-sm font-bold text-foreground mt-0.5">Synced (0.4ms lat)</span>
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <Activity className="size-4.5" />
            </div>
            <div>
              <span className="block text-xs font-semibold text-muted-foreground">API Latency</span>
              <span className="block text-sm font-bold text-foreground mt-0.5">120ms average</span>
            </div>
          </div>
        </div>

        {/* System Logs */}
        <div className="md:col-span-4 rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="font-heading font-bold text-base text-foreground mb-4">Platform Event Logs</h3>
          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-start gap-4 p-2 rounded hover:bg-accent/40 transition-colors">
              <span className="text-muted-foreground">2026-06-10 20:39:10</span>
              <span className="text-emerald-600 font-semibold">[INFO]</span>
              <span className="text-foreground">Optimization Engine completed batch route allocation for Region Northeast-A.</span>
            </div>
            <div className="flex items-start gap-4 p-2 rounded hover:bg-accent/40 transition-colors">
              <span className="text-muted-foreground">2026-06-10 20:39:02</span>
              <span className="text-emerald-600 font-semibold">[INFO]</span>
              <span className="text-foreground">Courier #412 connected to active-sockets. Latency: 22ms.</span>
            </div>
            <div className="flex items-start gap-4 p-2 rounded hover:bg-accent/40 transition-colors">
              <span className="text-muted-foreground">2026-06-10 20:38:45</span>
              <span className="text-amber-600 font-semibold">[WARN]</span>
              <span className="text-foreground">Re-routing initiated for Shipment #9201 due to traffic alert on I-95.</span>
            </div>
            <div className="flex items-start gap-4 p-2 rounded hover:bg-accent/40 transition-colors">
              <span className="text-muted-foreground">2026-06-10 20:38:12</span>
              <span className="text-emerald-600 font-semibold">[INFO]</span>
              <span className="text-foreground">Warehouse sorting hub (New York South) reports sync state matches main instance.</span>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
