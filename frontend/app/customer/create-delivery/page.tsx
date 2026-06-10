import React from "react";
import { PageContainer } from "@/components/layout/page-container";
import { PlusCircle, ArrowRight, Package, MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CreateDeliveryPage() {
  const breadcrumbs = [{ label: "Customer", href: "/customer/tracking" }, { label: "Create Delivery" }];

  return (
    <PageContainer
      title="Create New Delivery"
      subtitle="Ingest package info and generate optimized delivery schedules"
      breadcrumbs={breadcrumbs}
    >
      <div className="mx-auto max-w-4xl grid gap-6 md:grid-cols-3">
        {/* Form Skeleton */}
        <div className="md:col-span-2 rounded-xl border border-border bg-card p-6 shadow-sm space-y-6">
          <h3 className="font-heading font-bold text-base text-foreground flex items-center gap-2">
            <Package className="size-5 text-primary" /> Delivery Particulars
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase">Sender Details</label>
              <div className="h-9 w-full rounded border border-input bg-muted/40 animate-pulse" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase">Recipient Details</label>
              <div className="h-9 w-full rounded border border-input bg-muted/40 animate-pulse" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1">
              <MapPin className="size-3.5" /> Destination Address
            </label>
            <div className="h-9 w-full rounded border border-input bg-muted/40 animate-pulse" />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase">Weight (kg)</label>
              <div className="h-9 w-full rounded border border-input bg-muted/40 animate-pulse" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase">Dimensions</label>
              <div className="h-9 w-full rounded border border-input bg-muted/40 animate-pulse" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase">Priority Class</label>
              <div className="h-9 w-full rounded border border-input bg-muted/40 animate-pulse" />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-border">
            <Button disabled className="gap-1.5 font-semibold">
              <span>Schedule Ingestion</span>
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-6 self-start">
          <h3 className="font-heading font-bold text-base text-foreground flex items-center gap-2">
            <Navigation className="size-4.5 text-primary" /> Delivery Options
          </h3>
          <div className="space-y-4 text-xs font-medium">
            <div className="p-3 rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer bg-muted/10">
              <span className="block font-bold text-foreground">Next-Day Express</span>
              <span className="block text-muted-foreground mt-0.5">Optimized dynamic route routing</span>
            </div>
            <div className="p-3 rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer bg-muted/10">
              <span className="block font-bold text-foreground">Standard Delivery</span>
              <span className="block text-muted-foreground mt-0.5">Scheduled fleet consolidation runs</span>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
