import React from "react";
import { PageContainer } from "@/components/layout/page-container";
import { Brain, TrendingUp, Sparkles, Award, BarChart3 } from "lucide-react";

export default function DeliveryIntelligencePage() {
  const breadcrumbs = [{ label: "Admin", href: "/admin/command-center" }, { label: "Delivery Intelligence" }];

  return (
    <PageContainer
      title="Delivery Intelligence"
      subtitle="AI-driven route forecasting, resource planning, and predictive analytics"
      breadcrumbs={breadcrumbs}
      actions={
        <div className="inline-flex items-center gap-1.5 rounded-full border border-gold bg-gold/10 px-3 py-1.5 text-xs font-semibold text-gold-foreground shadow-sm">
          <Sparkles className="size-3.5" />
          <span>Enterprise Premium Tier</span>
        </div>
      }
    >
      <div className="grid gap-6 md:grid-cols-3">
        {/* Gold Highlight Card 1 */}
        <div className="rounded-xl border border-gold/20 bg-card p-6 shadow-sm ring-1 ring-gold/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-16 w-16 bg-gold/5 rounded-bl-full pointer-events-none" />
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-gold/10 text-gold-foreground">
              <Award className="size-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-foreground">AI Routing Score</h3>
              <p className="text-xs text-muted-foreground">Premium efficiency index</p>
            </div>
          </div>
          <div className="mt-6">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-heading font-black text-gold-foreground">98.4%</span>
              <span className="text-xs font-medium text-emerald-600">+1.2% this week</span>
            </div>
            <p className="text-xs text-muted-foreground/80 mt-3 font-sans">
              Optimized stops assignment and dispatch scheduling saving estimated 240 driver hours.
            </p>
          </div>
        </div>

        {/* Gold Highlight Card 2 */}
        <div className="rounded-xl border border-gold/20 bg-card p-6 shadow-sm ring-1 ring-gold/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-16 w-16 bg-gold/5 rounded-bl-full pointer-events-none" />
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-gold/10 text-gold-foreground">
              <Brain className="size-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-foreground">Resource Forecast</h3>
              <p className="text-xs text-muted-foreground">Demands & driver sizing</p>
            </div>
          </div>
          <div className="mt-6">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-heading font-black text-gold-foreground">Optimized</span>
              <span className="text-xs font-medium text-muted-foreground">96% confidence</span>
            </div>
            <p className="text-xs text-muted-foreground/80 mt-3 font-sans">
              Dynamic workload forecasts suggest active courier surge required between 14:00 - 18:00 tomorrow.
            </p>
          </div>
        </div>

        {/* Gold Highlight Card 3 */}
        <div className="rounded-xl border border-gold/20 bg-card p-6 shadow-sm ring-1 ring-gold/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-16 w-16 bg-gold/5 rounded-bl-full pointer-events-none" />
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-gold/10 text-gold-foreground">
              <TrendingUp className="size-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-foreground">Fuel & Carbon Savings</h3>
              <p className="text-xs text-muted-foreground">Sustainability intelligence</p>
            </div>
          </div>
          <div className="mt-6">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-heading font-black text-gold-foreground">-14.2%</span>
              <span className="text-xs font-medium text-emerald-600">CO2 reduced</span>
            </div>
            <p className="text-xs text-muted-foreground/80 mt-3 font-sans">
              Intelligent clustering algorithms reduced fleet mileage by 1,480km during off-peak runs.
            </p>
          </div>
        </div>

        {/* Intelligence Scaffolding Grid Section */}
        <div className="md:col-span-3 rounded-xl border border-border bg-card p-6 shadow-sm min-h-80 flex flex-col items-center justify-center text-center">
          <div className="max-w-md">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
              <BarChart3 className="size-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-foreground mb-2">Predictive Modeling Charts</h3>
            <p className="text-sm text-muted-foreground mb-6 font-sans">
              Visualizes real-time and model-forecasted performance, warehouse turnaround times, and delivery SLAs.
            </p>
            <div className="flex items-end justify-center gap-2 h-24 max-w-xs mx-auto">
              <div className="w-6 bg-muted h-[20%] rounded animate-pulse" />
              <div className="w-6 bg-gold/30 h-[50%] rounded animate-pulse" />
              <div className="w-6 bg-muted h-[35%] rounded animate-pulse" />
              <div className="w-6 bg-muted h-[70%] rounded animate-pulse" />
              <div className="w-6 bg-gold h-[90%] rounded animate-pulse" />
              <div className="w-6 bg-muted h-[45%] rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
