import React from "react";
import { PageContainer } from "@/components/layout/page-container";
import { Search, MapPin, Truck, CheckCircle, Package } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DeliveryTrackingPage() {
  const breadcrumbs = [{ label: "Customer", href: "/customer/tracking" }, { label: "Delivery Tracking" }];

  return (
    <PageContainer
      title="Delivery Tracking"
      subtitle="Follow your packages progress and estimate arrival times in real-time"
      breadcrumbs={breadcrumbs}
      actions={
        <div className="relative">
          <Search className="absolute top-2.5 left-3 size-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Enter tracking number..."
            className="h-9 w-64 rounded-md border border-input bg-background pl-9 pr-3 text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all"
          />
        </div>
      }
    >
      <div className="grid gap-6 md:grid-cols-3">
        {/* Tracking Details Skeleton */}
        <div className="md:col-span-2 rounded-xl border border-border bg-card p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Package className="size-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-foreground">Shipment #TRK-9820-21</h3>
                <p className="text-xs text-muted-foreground">Standard Priority Express</p>
              </div>
            </div>
            <div className="h-6 w-24 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center">
              <span className="text-[10px] font-bold text-emerald-700">IN TRANSIT</span>
            </div>
          </div>

          {/* Tracking Progress Bar */}
          <div className="space-y-4">
            <div className="relative flex items-center justify-between">
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-muted -z-10" />
              <div className="absolute left-0 right-1/2 top-1/2 -translate-y-1/2 h-1 bg-primary -z-10" />

              <div className="flex flex-col items-center">
                <div className="size-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold ring-4 ring-background">
                  <CheckCircle className="size-4" />
                </div>
                <span className="text-[10px] font-semibold text-foreground mt-2">Ingested</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="size-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold ring-4 ring-background">
                  <Truck className="size-4" />
                </div>
                <span className="text-[10px] font-semibold text-primary mt-2">Dispatched</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="size-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs font-bold ring-4 ring-background">
                  <MapPin className="size-4" />
                </div>
                <span className="text-[10px] font-semibold text-muted-foreground mt-2">Out for Delivery</span>
              </div>
            </div>
          </div>

          {/* Detailed Stops Skeleton */}
          <div className="space-y-4 pt-6 border-t border-border">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase">Tracking Milestones</h4>
            {[1, 2].map((stop) => (
              <div key={stop} className="flex gap-4 items-start text-xs font-medium">
                <div className="size-2 rounded-full bg-primary mt-1" />
                <div className="flex-1 space-y-1">
                  <div className="h-3 w-1/3 rounded bg-muted animate-pulse" />
                  <div className="h-2.5 w-1/4 rounded bg-muted animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Route Map Panel Placeholder */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm min-h-80 flex flex-col items-center justify-center text-center">
          <div className="max-w-md">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
              <MapPin className="size-6" />
            </div>
            <h3 className="font-heading font-bold text-base text-foreground mb-2">Transit Map Viewer</h3>
            <p className="text-xs text-muted-foreground mb-4 font-sans">
              Displays geographic routing, dispatcher stops, and live GPS location coordinates of the assigned courier vehicle.
            </p>
            <div className="h-20 w-full rounded bg-muted animate-pulse" />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
