"use client";

import React, { useState, useEffect } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Clock,
  Timer,
  Target,
  Users,
  Sparkles,
  Download,
  Calendar,
  Info,
  Zap,
  CheckCircle,
  TrendingUp,
  MapPin,
  ArrowRight,
  User,
  Star,
  ChevronDown
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

// TypeScript Interfaces
interface DriverPerformance {
  id: string;
  name: string;
  avatar?: string;
  initials: string;
  zone: string;
  volume: number;
  avgDuration: number;
  successRate: number;
  safetyScore: number;
  customerRating: number;
}

export default function OptimizationAnalyticsPage() {
  // Hydration state check to prevent mismatch with Recharts
  const [mounted, setMounted] = useState(false);
  
  // Interactive page states
  const [timeRange, setTimeRange] = useState("Last 24 Hours");
  const [driverSort, setDriverSort] = useState<"overall" | "safety" | "volume" | "rating">("overall");
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 1. Mock Data for Recharts Bar Chart (Trend Analysis)
  const trendData = [
    { name: "Mon", deliveries: 8400 },
    { name: "Tue", deliveries: 9800 },
    { name: "Wed", deliveries: 11000 },
    { name: "Thu", deliveries: 9500 },
    { name: "Fri", deliveries: 12402 },
    { name: "Sat", deliveries: 10500 },
    { name: "Sun", deliveries: 11900 },
  ];

  // 2. Mock Data for Recharts Pie Chart (Status Distribution)
  const statusData = [
    { name: "Completed", value: 72, color: "var(--primary)" },
    { name: "In Transit", value: 18, color: "var(--gold)" },
    { name: "Pending", value: 10, color: "oklch(0.92 0.004 240)" },
  ];

  // 3. Mock Data for Top Performance Drivers Table
  const driversData: DriverPerformance[] = [
    {
      id: "8842-X",
      name: "Adrian Jenkins",
      initials: "AJ",
      zone: "Manhattan SE",
      volume: 48,
      avgDuration: 18.2,
      successRate: 99.4,
      safetyScore: 98,
      customerRating: 4.9,
    },
    {
      id: "1092-A",
      name: "Sarah Chen",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDmMyDavAmNEvepzQ8sVoBjwisvVsE-qWqtPX5cQFyhcS_77F6BPcRfT6FM3QGM5lsNl9_XrMCFKkUgyGa7Ps4eT5p782Fv-bXljv-xORY4WfmKfoT2AcVmJRWKEK-H66GMo2InrZz1R29FAAWBUg5m10sHXTguWeFLNQzQRYzTDxARf36vEcJse_Adefq6cL9bL090YTStBb7Xy0EvKAXZk6xioc13Bp-uLMpgbpaZIKqfMwPWWy5WQ1aJ-qH1CXhOIQzmBm7rNG8",
      initials: "SC",
      zone: "Brooklyn NW",
      volume: 42,
      avgDuration: 21.5,
      successRate: 98.1,
      safetyScore: 95,
      customerRating: 4.8,
    },
    {
      id: "5521-C",
      name: "Marcus Lowe",
      initials: "ML",
      zone: "Queens Central",
      volume: 56,
      avgDuration: 26.1,
      successRate: 97.8,
      safetyScore: 92,
      customerRating: 4.6,
    }
  ];

  // Sort drivers based on selected tab
  const getSortedDrivers = () => {
    switch (driverSort) {
      case "safety":
        return [...driversData].sort((a, b) => b.safetyScore - a.safetyScore);
      case "volume":
        return [...driversData].sort((a, b) => b.volume - a.volume);
      case "rating":
        return [...driversData].sort((a, b) => b.customerRating - a.customerRating);
      default:
        return driversData;
    }
  };

  return (
    <PageContainer
      title="Optimization & Analytics"
      subtitle="Comprehensive real-time analysis of logistics throughput, driver efficiency, and regional fulfillment metrics for the DIDOP network."
      breadcrumbs={[{ label: "Admin", href: "/admin/command-center" }, { label: "Optimization & Analytics" }]}
      actions={
        <div className="flex items-center gap-3">
          {/* Timeframe selector */}
          <div className="relative group">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs font-semibold border-slate-200">
              <Calendar className="size-3.5 text-muted-foreground" />
              <span>{timeRange}</span>
              <ChevronDown className="size-3.5 text-muted-foreground" />
            </Button>
            <div className="absolute right-0 mt-1 w-36 origin-top-right rounded-md border border-slate-100 bg-popover p-1 shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-150 z-50">
              {["Last 24 Hours", "Last 7 Days", "Last 30 Days"].map(range => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className="w-full text-left rounded px-2.5 py-1.5 text-xs text-foreground hover:bg-slate-100 transition-colors"
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          <Button size="sm" className="gap-1.5 font-semibold text-xs shadow-md">
            <Download className="size-3.5" />
            <span>Export Report</span>
          </Button>
        </div>
      }
    >
      <div className="space-y-8 pb-12">
        
        {/* Key SLA Metrics (Performance Overview KPI Cards) */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* SLA Compliance */}
          <div className="bg-card border border-border p-6 rounded-xl space-y-4 shadow-sm flex flex-col justify-between min-h-[160px] max-w-sm">
            <div className="flex justify-between items-start">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Clock className="size-5" />
              </div>
              <span className="text-base font-semibold text-green-700 bg-green-50 px-2.5 py-1 rounded-full border border-green-200">+2.4%</span>
            </div>
            <div>
              <h4 className="font-sans text-sm font-medium uppercase tracking-wide text-muted-foreground">SLA Compliance</h4>
              <p className="text-3xl md:text-4xl lg:text-5xl font-bold mt-2 text-foreground font-sans tabular-nums">98.2%</p>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-primary h-full rounded-full" style={{ width: "98.2%" }}></div>
            </div>
          </div>

          {/* Average Delivery Duration - Gold Highlight for Analytics Highlight */}
          <div className="bg-card border border-border p-6 rounded-xl space-y-4 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[160px] max-w-sm">
            <div className="flex justify-between items-start">
              <div className="p-2 bg-gold/10 rounded-lg text-gold-foreground">
                <Timer className="size-5" />
              </div>
              <span className="text-base font-semibold text-green-700 bg-green-50 px-2.5 py-1 rounded-full border border-green-200">-1.2m</span>
            </div>
            <div>
              <h4 className="font-sans text-sm font-medium uppercase tracking-wide text-muted-foreground">Avg. Delivery Duration</h4>
              <p className="text-3xl md:text-4xl lg:text-5xl font-bold mt-2 text-foreground font-sans tabular-nums">
                24.5<span className="text-base font-sans font-normal text-muted-foreground ml-1">min</span>
              </p>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              {/* Highlight using reserved muted gold */}
              <div className="bg-gold h-full rounded-full" style={{ width: "65%" }}></div>
            </div>
          </div>

          {/* ETA Accuracy */}
          <div className="bg-card border border-border p-6 rounded-xl space-y-4 shadow-sm flex flex-col justify-between min-h-[160px] max-w-sm">
            <div className="flex justify-between items-start">
              <div className="p-2 bg-slate-100 rounded-lg text-slate-650">
                <Target className="size-5" />
              </div>
              <span className="text-base font-semibold text-green-700 bg-green-50 px-2.5 py-1 rounded-full border border-green-200">+4.1%</span>
            </div>
            <div>
              <h4 className="font-sans text-sm font-medium uppercase tracking-wide text-muted-foreground">ETA Accuracy</h4>
              <p className="text-3xl md:text-4xl lg:text-5xl font-bold mt-2 text-foreground font-sans tabular-nums">94.8%</p>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-slate-500 h-full rounded-full" style={{ width: "94.8%" }}></div>
            </div>
          </div>

          {/* Driver Utilization */}
          <div className="bg-card border border-border p-6 rounded-xl space-y-4 shadow-sm flex flex-col justify-between min-h-[160px] max-w-sm">
            <div className="flex justify-between items-start">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Users className="size-5" />
              </div>
              <span className="text-sm font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">Optimal</span>
            </div>
            <div>
              <h4 className="font-sans text-sm font-medium uppercase tracking-wide text-muted-foreground">Driver Utilization</h4>
              <p className="text-3xl md:text-4xl lg:text-5xl font-bold mt-2 text-foreground font-sans tabular-nums">82.1%</p>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-primary/70 h-full rounded-full" style={{ width: "82.1%" }}></div>
            </div>
          </div>
        </section>

        {/* Route Optimization Impact Section */}
        <section className="bg-primary/5 border border-primary/10 rounded-2xl p-6 md:p-8 shadow-inner">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="size-5 text-primary" />
            <h3 className="font-sans text-2xl font-bold text-foreground">Route Optimization Impact</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2.5">
              <span className="font-sans text-sm font-medium uppercase tracking-wide text-muted-foreground">Distance Saved</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary font-sans tabular-nums">12,840</span>
                <span className="text-sm font-sans text-muted-foreground">km/month</span>
              </div>
              <p className="text-sm text-muted-foreground/75 mt-0.5">~15.2% reduction vs baseline mileage</p>
            </div>
            
            <div className="flex flex-col gap-2.5">
              <span className="font-sans text-sm font-medium uppercase tracking-wide text-muted-foreground">Fuel Savings</span>
              <div className="flex items-baseline gap-2">
                {/* Gold Highlight for analytics summary */}
                <span className="text-3xl md:text-4xl lg:text-5xl font-bold text-amber-800 font-sans tabular-nums">₹ 1.2 Lakhs</span>
              </div>
              <p className="text-sm text-muted-foreground/75 mt-0.5">Consolidated across 12 fleet hubs</p>
            </div>
            
            <div className="flex flex-col gap-2.5">
              <span className="font-sans text-sm font-medium uppercase tracking-wide text-muted-foreground">Avg ETA Improvement</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary font-sans tabular-nums">18%</span>
              </div>
              <p className="text-sm text-muted-foreground/75 mt-0.5">Accelerated high-density urban corridors</p>
            </div>
          </div>
        </section>

        {/* Regional Performance Table */}
        <section className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border bg-slate-50/50">
            <h3 className="font-sans text-2xl font-bold text-foreground">Regional Performance Comparison</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/70 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4.5 font-sans text-sm font-semibold uppercase tracking-wider text-muted-foreground">Region</th>
                  <th className="px-6 py-4.5 font-sans text-sm font-semibold uppercase tracking-wider text-muted-foreground">On-Time %</th>
                  <th className="px-6 py-4.5 font-sans text-sm font-semibold uppercase tracking-wider text-muted-foreground">Avg Duration</th>
                  <th className="px-6 py-4.5 font-sans text-sm font-semibold uppercase tracking-wider text-muted-foreground text-right">SLA Compliance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {[
                  { region: "Delhi NCR", onTime: "96.4%", duration: "28.5 min", sla: "98.1%" },
                  { region: "Mumbai", onTime: "94.2%", duration: "32.1 min", sla: "97.4%" },
                  { region: "Bengaluru", onTime: "91.8%", duration: "34.8 min", sla: "95.2%", warning: true },
                  { region: "Hyderabad", onTime: "95.1%", duration: "26.4 min", sla: "98.8%" },
                  { region: "Chennai", onTime: "95.9%", duration: "25.9 min", sla: "99.0%" }
                ].map((row) => (
                  <tr 
                    key={row.region} 
                    onClick={() => setSelectedRegion(selectedRegion === row.region ? null : row.region)}
                    className={cn(
                      "hover:bg-slate-50/40 cursor-pointer transition-colors",
                      selectedRegion === row.region ? "bg-primary/5 animate-pulse" : ""
                    )}
                  >
                    <td className="px-6 py-5 font-semibold text-base text-foreground">{row.region}</td>
                    <td className="px-6 py-5 text-base font-semibold tabular-nums">
                      <span className={row.warning ? "text-amber-700 font-bold" : "text-green-700 font-bold"}>
                        {row.onTime}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-base text-slate-700 tabular-nums">{row.duration}</td>
                    <td className="px-6 py-5 text-right text-base font-semibold text-slate-800 tabular-nums">{row.sla}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Main Charts Row */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Delivery Lifecycle Funnel */}
          <div className="lg:col-span-2 bg-card p-6 md:p-8 rounded-2xl border border-border shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-sans text-2xl font-bold text-foreground">Delivery Lifecycle Funnel</h3>
                <p className="text-sm text-muted-foreground">Conversion metrics through the logistics pipeline stages</p>
              </div>
              <Info className="size-5 text-muted-foreground/60" />
            </div>

            <div className="flex flex-col gap-3.5">
              {/* Funnel Step 1 */}
              <div className="flex items-center h-14 group cursor-default">
                <div className="w-28 md:w-32 font-sans text-sm font-medium uppercase tracking-wide text-muted-foreground shrink-0">Order Inbound</div>
                <div className="flex-grow bg-primary/10 hover:bg-primary/15 rounded-r-lg h-full flex items-center px-6 md:px-8 relative transition-all duration-200">
                  <span className="font-sans text-base font-semibold tabular-nums text-foreground">12,402</span>
                  <span className="absolute right-6 text-sm font-medium text-slate-500 tabular-nums">100% Volume</span>
                </div>
              </div>

              {/* Funnel Step 2 */}
              <div className="flex items-center h-14 group cursor-default">
                <div className="w-28 md:w-32 font-sans text-sm font-medium uppercase tracking-wide text-muted-foreground shrink-0">Assigned</div>
                <div className="w-[85%] bg-primary/25 hover:bg-primary/30 rounded-r-lg h-full flex items-center px-6 md:px-8 relative transition-all duration-200">
                  <span className="font-sans text-base font-semibold tabular-nums text-foreground">10,541</span>
                  <span className="absolute right-6 text-sm font-medium text-slate-500 tabular-nums">85% Assigned</span>
                </div>
              </div>

              {/* Funnel Step 3 */}
              <div className="flex items-center h-14 group cursor-default">
                <div className="w-28 md:w-32 font-sans text-sm font-medium uppercase tracking-wide text-muted-foreground shrink-0">In Transit</div>
                <div className="w-[78%] bg-primary/45 hover:bg-primary/50 rounded-r-lg h-full flex items-center px-6 md:px-8 relative transition-all duration-200">
                  <span className="font-sans text-base font-semibold tabular-nums text-foreground">9,673</span>
                  <span className="absolute right-6 text-sm font-medium text-slate-500 tabular-nums">78% Active</span>
                </div>
              </div>

              {/* Funnel Step 4 */}
              <div className="flex items-center h-14 group cursor-default">
                <div className="w-28 md:w-32 font-sans text-sm font-medium uppercase tracking-wide text-muted-foreground shrink-0">Delivered</div>
                <div className="w-[72%] bg-primary hover:bg-primary/95 text-primary-foreground rounded-r-lg h-full flex items-center px-6 md:px-8 relative transition-all duration-200 shadow-sm">
                  <span className="font-sans text-base font-semibold tabular-nums">8,929</span>
                  <span className="absolute right-6 text-sm font-medium text-primary-foreground/90 tabular-nums">92.3% Success Rate</span>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Status Distribution */}
          <div className="bg-card p-6 md:p-8 rounded-2xl border border-border shadow-sm flex flex-col justify-between">
            <h3 className="font-sans text-2xl font-bold text-foreground mb-4">Status Distribution</h3>
            
            {/* Recharts Pie Chart Donut */}
            <div className="relative flex-grow flex items-center justify-center min-h-[180px]">
              {mounted ? (
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`${value}%`, "Share"]}
                      contentStyle={{ background: "rgba(255, 255, 255, 0.95)", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "12px" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-36 h-36 rounded-full border-8 border-slate-100 border-t-primary animate-spin" />
              )}
              
              {/* Inner text for donut */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-sans font-bold text-foreground">12k+</span>
                <span className="text-sm font-sans font-semibold uppercase tracking-wide text-muted-foreground">Total Tasks</span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-2.5 mt-6 border-t border-slate-50 pt-4">
              {statusData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-base font-semibold">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-700">{item.name}</span>
                  </div>
                  <span className="text-slate-900 tabular-nums">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Expanded Assignment Engine & Trend Analysis Row */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Expanded Assignment Engine */}
          <div className="bg-card p-6 md:p-8 rounded-2xl border border-border shadow-sm flex flex-col space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Zap className="size-5 text-primary" />
                <h3 className="font-sans text-2xl font-bold text-foreground">Assignment Engine Insights</h3>
              </div>
              <span className="text-sm font-semibold text-green-700 bg-green-50 px-2.5 py-1 rounded-full border border-green-200 flex items-center gap-1">
                <CheckCircle className="size-3.5 text-green-700" />
                Active Optimization
              </span>
            </div>

            {/* Stats block */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50/60 rounded-xl border border-slate-100">
                <span className="text-sm font-medium uppercase tracking-wide text-muted-foreground">System Latency</span>
                <div className="flex items-end gap-1.5 mt-1.5">
                  <span className="text-3xl font-bold text-foreground font-sans tabular-nums">42ms</span>
                  <span className="text-base font-semibold text-green-700 mb-0.5">&darr; 12%</span>
                </div>
              </div>

              <div className="p-4 bg-slate-50/60 rounded-xl border border-slate-100">
                <span className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Compute Load</span>
                <div className="flex items-end gap-1.5 mt-1.5">
                  <span className="text-3xl font-bold text-foreground font-sans tabular-nums">88.4%</span>
                  <span className="text-base font-semibold text-green-700 mb-0.5">&uarr; 4%</span>
                </div>
              </div>

              <div className="p-4 bg-slate-50/60 rounded-xl border border-slate-100">
                <span className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Re-Optimization</span>
                <div className="flex items-end gap-1.5 mt-1.5">
                  <span className="text-3xl font-bold text-foreground font-sans tabular-nums">1.2%</span>
                  <span className="text-base font-semibold text-green-700 mb-0.5">&darr; 0.8%</span>
                </div>
              </div>

              <div className="p-4 bg-slate-50/60 rounded-xl border border-slate-100">
                <span className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Load Balance</span>
                <div className="flex items-end gap-1.5 mt-1.5">
                  <span className="text-3xl font-bold text-foreground font-sans tabular-nums">94.8%</span>
                  <span className="text-base font-semibold text-slate-500 mb-0.5">STABLE</span>
                </div>
              </div>
            </div>

            {/* Heatmap progress visualization */}
            <div className="space-y-2">
              <h5 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">System Compute Heatmap</h5>
              <div className="w-full bg-slate-100 h-8 rounded-lg flex overflow-hidden border border-slate-200/50">
                <div className="bg-primary/20 h-full w-[40%] border-r border-white/40" title="Node A Load"></div>
                <div className="bg-primary/45 h-full w-[25%] border-r border-white/40" title="Node B Load"></div>
                <div className="bg-primary/65 h-full w-[20%] border-r border-white/40" title="Node C Load"></div>
                {/* Muted gold overlay segment representing high analytics demand queue */}
                <div className="bg-gold h-full w-[10%] border-r border-white/40" title="Premium Compute Segment"></div>
                <div className="bg-primary h-full w-[5%]" title="Node E Load"></div>
              </div>
              <p className="text-sm text-slate-500 italic font-sans">Real-time CPU/GPU core allocation across optimization clusters.</p>
            </div>
          </div>

          {/* Delivery Trend Analysis */}
          <div className="bg-card p-6 md:p-8 rounded-2xl border border-border shadow-sm flex flex-col space-y-6 justify-between">
            <div className="flex items-center gap-2.5">
              <TrendingUp className="size-5 text-gold-foreground" />
              <h3 className="font-sans text-2xl font-bold text-foreground">Trend Analysis</h3>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-xs font-bold font-sans uppercase text-muted-foreground">Deliveries Per Day (Last 7 Days)</h4>
                  <span className="text-xs font-bold text-primary font-heading">Avg: 11.2k</span>
                </div>

                {/* Recharts Bar Chart */}
                <div className="h-32 w-full">
                  {mounted ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={trendData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
                        <Tooltip 
                          cursor={{ fill: "rgba(0,0,0,0.03)" }}
                          contentStyle={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "11px" }}
                        />
                        <Bar dataKey="deliveries" radius={[4, 4, 0, 0]}>
                          {trendData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              // Highlight Friday (index 4) as peak delivery day in gold/primary accent
                              fill={entry.name === "Fri" ? "var(--primary)" : "var(--primary-container)"} 
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full w-full bg-slate-50 animate-pulse rounded" />
                  )}
                </div>
              </div>

              {/* Peak hours row */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-xs font-bold font-sans uppercase text-muted-foreground">Peak Delivery Hours</h4>
                  <span className="text-[10px] text-muted-foreground font-sans">Active Zone: 14:02 IST</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-1 rounded bg-gold/10 text-gold-foreground text-[10px] font-bold border border-gold/15">09:00 - 11:00</span>
                  <span className="px-2.5 py-1 rounded bg-primary/10 text-primary text-[10px] font-bold border border-primary/15">14:00 - 17:00 (Peak)</span>
                  <span className="px-2.5 py-1 rounded bg-gold/10 text-gold-foreground text-[10px] font-bold border border-gold/15">19:00 - 21:00</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Asymmetric Bento Row (Hotspots Map Section) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Regional Performance Map */}
          <div className="md:col-span-2 bg-slate-100 rounded-2xl overflow-hidden relative group min-h-[350px] border border-border shadow-sm">
            <img 
              alt="Digital heat map of metropolitan delivery density hubs"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQa1X0ZEGQ_UjpCDusZElaxi_U6U8A4HYMD3NH1kL4hRwWunaqYM-Ha8lxW3NSQ5uHCXPRlK6xTTAYIwrbNQso37g65ZUuNvXosFunsPwPclznk6y8fPmLca5_F-iOp4aqrIuSXq1tdfHGiehCpDYNpAVtggq0Q6OpGaFVoYWzk__YtZyGLqFRfxFBB0O82XzqMhFV-eRhOwg1jA-dQHK0zsQXIek9P6Nt3lhq_uzoWZVvAHYYdyRanCCzLMgzyrnMMX4adzIQ2Nk" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent p-6 md:p-8 flex flex-col justify-end">
              <div className="bg-white/95 backdrop-blur-md p-5 rounded-xl w-full max-w-sm border border-slate-100 shadow-xl">
                <h4 className="font-heading font-bold text-base text-slate-800 flex items-center gap-1.5">
                  <MapPin className="size-4.5 text-primary animate-bounce" />
                  <span>Regional Hotspots Map</span>
                </h4>
                <p className="text-xs text-slate-600 mt-2 font-sans leading-relaxed">
                  Metropolitan Central is experiencing a **15% surge** in delivery density. Dispatch optimization is suggested for Zone B and Sector F.
                </p>
                <div className="mt-4 flex gap-4 pt-3 border-t border-slate-100">
                  <div className="text-left">
                    <p className="text-lg font-heading font-black text-primary">420</p>
                    <p className="text-[9px] font-sans font-bold uppercase text-slate-500">Deliveries/Hr</p>
                  </div>
                  <div className="w-[1px] bg-slate-200 h-8 mt-1"></div>
                  <div className="text-left">
                    {/* Gold Highlight for analytics summary */}
                    <p className="text-lg font-heading font-black text-gold-foreground">92%</p>
                    <p className="text-[9px] font-sans font-bold uppercase text-slate-500">Density Score</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mini Assignment Recap */}
          <div className="bg-card p-6 md:p-8 rounded-2xl border border-border shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <h3 className="font-heading text-lg font-bold text-foreground">Live Hub Re-Optimization</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Dynamic dispatch rerouting algorithms are actively adapting for the North-West corridor due to heavy rain delay patterns currently impacting Mumbai and Bengaluru routes.
              </p>
            </div>
            
            <div className="pt-6 border-t border-slate-50 mt-6">
              <h5 className="text-[10px] font-bold font-sans uppercase tracking-wider text-muted-foreground mb-4">Active Fleet Optimization</h5>
              <div className="flex -space-x-2.5">
                <div className="w-9 h-9 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-700 shadow-inner">DL</div>
                <div className="w-9 h-9 rounded-full border-2 border-white bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs shadow-inner">MU</div>
                {/* Gold Highlight avatar representing the premium routing test */}
                <div className="w-9 h-9 rounded-full border-2 border-white bg-gold text-gold-foreground flex items-center justify-center font-bold text-xs shadow-inner">BL</div>
                <div className="w-9 h-9 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-600 shadow-inner">+2</div>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom Data Table: Top Performance Drivers */}
        <section className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
            <h3 className="font-sans text-2xl font-bold text-foreground">Top Performance Drivers</h3>
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar font-sans text-base font-medium">
              {[
                { label: "Overall", key: "overall" },
                { label: "Safety Score", key: "safety" },
                { label: "Volume Completed", key: "volume" },
                { label: "Customer Rating", key: "rating" }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setDriverSort(tab.key as any)}
                  className={cn(
                    "px-3.5 py-1.5 rounded-full whitespace-nowrap transition-colors",
                    driverSort === tab.key 
                      ? "bg-primary text-primary-foreground font-semibold" 
                      : "hover:bg-slate-100 text-slate-600 hover:text-slate-800"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/70 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 font-sans text-sm font-semibold uppercase tracking-wider text-muted-foreground">Driver Detail</th>
                  <th className="px-6 py-4 font-sans text-sm font-semibold uppercase tracking-wider text-muted-foreground">Zone</th>
                  <th className="px-6 py-4 font-sans text-sm font-semibold uppercase tracking-wider text-muted-foreground">Volume</th>
                  <th className="px-6 py-4 font-sans text-sm font-semibold uppercase tracking-wider text-muted-foreground">Avg Duration</th>
                  <th className="px-6 py-4 font-sans text-sm font-semibold uppercase tracking-wider text-muted-foreground text-right">Success Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {getSortedDrivers().map((driver) => (
                  <tr key={driver.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        {driver.avatar ? (
                          <img 
                            src={driver.avatar} 
                            alt={`${driver.name} driver profile headshot`}
                            className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-100"
                          />
                        ) : (
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-inner",
                            driver.initials === "AJ" 
                              ? "bg-gold/10 text-gold-foreground" 
                              : "bg-slate-100 text-slate-700"
                          )}>
                            {driver.initials}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-base text-foreground">{driver.name}</p>
                          <p className="text-sm text-slate-500 tabular-nums">ID: {driver.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-base font-semibold text-slate-700">{driver.zone}</td>
                    <td className="px-6 py-5 text-base text-slate-600 tabular-nums">{driver.volume} Tasks</td>
                    <td className="px-6 py-5 text-base text-slate-600 tabular-nums">{driver.avgDuration} min</td>
                    <td className="px-6 py-5 text-right">
                      <span className="font-bold text-primary text-base tabular-nums">{driver.successRate}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-slate-50/30 border-t border-slate-100 text-center">
            <button className="text-base font-semibold font-sans uppercase tracking-widest text-primary hover:underline transition-all">
              View Detailed Fleet Performance
            </button>
          </div>
        </section>
      </div>
    </PageContainer>
  );
}
