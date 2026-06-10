"use client";

import React, { useState } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Truck,
  MapPin,
  Map,
  Plus,
  Minus,
  Navigation,
  Star,
  CheckCircle2,
  Clock,
  ClipboardList,
  Check,
  LogIn,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Sparkles,
  Download,
  RotateCcw,
  UserCheck
} from "lucide-react";

interface QueueItem {
  id: string;
  pickup: string;
  destination: string;
  priority: "EXPRESS" | "STANDARD";
  status: "In Transit" | "Pending" | "Delivered";
  eta: string;
}

export default function DriverDashboardPage() {
  const breadcrumbs = [
    { label: "Driver", href: "/driver/dashboard" },
    { label: "Dashboard" }
  ];

  // 1. Core State Management for interactive simulation
  const [missionStatus, setMissionStatus] = useState<"IN_TRANSIT" | "DELIVERED">("IN_TRANSIT");
  const [mapZoom, setMapZoom] = useState(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Dynamic KPI and Queue data based on missionStatus
  const completedCount = missionStatus === "DELIVERED" ? 9 : 8;
  const earningsAmount = missionStatus === "DELIVERED" ? 4820 : 4250;
  
  const queueData: QueueItem[] = [
    {
      id: "DID-2026-10231",
      pickup: "BKC Logistics Hub",
      destination: "Worli Sky Tower",
      priority: "EXPRESS",
      status: missionStatus === "DELIVERED" ? "Delivered" : "In Transit",
      eta: missionStatus === "DELIVERED" ? "Completed" : "15 mins"
    },
    {
      id: "DID-2026-10245",
      pickup: "Powai Warehouse 4",
      destination: "Hiranandani Gardens",
      priority: "STANDARD",
      status: "Pending",
      eta: "42 mins"
    },
    {
      id: "DID-2026-10250",
      pickup: "Navi Mumbai Port",
      destination: "Nerul Business Park",
      priority: "STANDARD",
      status: "Pending",
      eta: "1h 12m"
    }
  ];

  // 2. Telemetry and helper actions
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleMarkDelivered = () => {
    setMissionStatus("DELIVERED");
    showToast("Shipment DID-2026-10231 marked DELIVERED! +₹570 credited to shift earnings.");
  };

  const handleResetMission = () => {
    setMissionStatus("IN_TRANSIT");
    showToast("Active shipment reset to In Transit status for simulation testing.");
  };

  const handleZoomIn = () => {
    setMapZoom(prev => Math.min(prev + 0.25, 2));
    showToast("Map zoom level increased.");
  };

  const handleZoomOut = () => {
    setMapZoom(prev => Math.max(prev - 0.25, 1));
    showToast("Map zoom level decreased.");
  };

  const handleCenterLocation = () => {
    setMapZoom(1);
    showToast("Map centered on active courier coordinates.");
  };

  return (
    <PageContainer
      title="Driver Overview"
      subtitle="Shift details, active job assignments, and real-time navigation"
      breadcrumbs={breadcrumbs}
      actions={
        <div className="inline-flex items-center gap-1.5 rounded-full border border-gold bg-gold/10 px-3 py-1.5 text-xs font-semibold text-gold-foreground shadow-sm">
          <Sparkles className="size-3.5" />
          <span>Elite Driver Status</span>
        </div>
      }
    >
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-lg shadow-xl flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Check className="size-4 text-green-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="space-y-6 font-sans">

        {/* 1. Driver KPI Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Assigned Today */}
          <div className="bg-card p-5 rounded-xl border-l-4 border-primary shadow-sm">
            <p className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider mb-1">
              Assigned Today
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-heading text-2xl font-black text-foreground">12</span>
              <span className="text-primary text-[10px] font-bold uppercase tracking-wider">Units</span>
            </div>
          </div>

          {/* Card 2: Completed Today */}
          <div className="bg-card p-5 rounded-xl border-l-4 border-gold shadow-sm transition-all duration-300">
            <p className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider mb-1">
              Completed Today
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-heading text-2xl font-black text-foreground">{completedCount}</span>
              <span className="text-gold text-[10px] font-bold uppercase tracking-wider">Done</span>
            </div>
          </div>

          {/* Card 3: Earnings */}
          <div className="bg-card p-5 rounded-xl border-l-4 border-emerald-500 shadow-sm transition-all duration-300">
            <p className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider mb-1">
              Total Earnings
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-heading text-2xl font-black text-foreground">₹ {earningsAmount.toLocaleString("en-IN")}</span>
              <span className="text-green-600 text-[10px] font-bold">↑ 12%</span>
            </div>
          </div>

          {/* Card 4: Rating */}
          <div className="bg-card p-5 rounded-xl border-l-4 border-slate-350 shadow-sm">
            <p className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider mb-1">
              Driver Rating
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-heading text-2xl font-black text-foreground">4.9</span>
              <div className="flex text-gold">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="size-3.5 fill-current" />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Main Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Columns (Map & Queue) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 2. GPS Tracking Map */}
            <section className="bg-card border border-border rounded-2xl overflow-hidden relative h-[400px] shadow-sm">
              <div className="w-full h-full overflow-hidden relative">
                <img
                  alt="GPS tracking map grid of Mumbai"
                  className="w-full h-full object-cover transition-transform duration-300 origin-center"
                  style={{ transform: `scale(${mapZoom})` }}
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA9tywhADIT0l8ZN9GVHwg9XQUrkenCWWEBJSDbZdB04N3OmDohxuXZmx7CG7PPcRzuiZvCS4NMzUdvMjRPA0ygiMYDR1wfNLkgiizOUObvZwOT5oNz2jVaLXGfAew8nZUMcNCGERK2DzwZfzrJvkiyUGiBkWO9VUPP4TDGtEF-CfdbJS0HkT4cu0JwhP8y3qo_mMOvfNmRSP-KXDDNdXziXydoEyBo-aZ2Xjo1grCD_jkkfOJWJY8uvqs5sywpELGoaHuax2Eh4xU"
                />
              </div>

              {/* Floating Overlay Info */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-2 rounded-xl shadow-md border border-slate-150">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-800">
                    Live GPS Telemetry active
                  </span>
                </div>
              </div>

              {/* Map Floating Zoom controls */}
              <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
                <button
                  onClick={handleZoomIn}
                  className="w-10 h-10 bg-white shadow-md rounded-lg flex items-center justify-center hover:bg-slate-100 transition-colors border border-slate-200"
                  id="btn-map-zoom-in"
                  title="Zoom In"
                >
                  <Plus className="size-4.5 text-slate-700" />
                </button>
                <button
                  onClick={handleZoomOut}
                  className="w-10 h-10 bg-white shadow-md rounded-lg flex items-center justify-center hover:bg-slate-100 transition-colors border border-slate-200"
                  id="btn-map-zoom-out"
                  title="Zoom Out"
                >
                  <Minus className="size-4.5 text-slate-700" />
                </button>
                <button
                  onClick={handleCenterLocation}
                  className="w-10 h-10 bg-primary text-white shadow-md rounded-lg flex items-center justify-center hover:bg-primary-hover hover:scale-105 transition-all"
                  id="btn-map-center"
                  title="Center Location"
                >
                  <Navigation className="size-4.5 rotate-45" />
                </button>
              </div>
            </section>

            {/* 4. Delivery Queue Table */}
            <section className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-slate-50/50">
                <h3 className="font-heading text-base font-bold text-foreground">
                  Today's Delivery Queue
                </h3>
                <Button 
                  variant="ghost" 
                  onClick={() => showToast("Downloading routing queue report...")}
                  className="text-xs font-bold text-primary hover:underline h-8 px-2"
                  id="btn-download-queue-report"
                >
                  <Download className="size-3.5 mr-1" />
                  <span>Download Report</span>
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-sans text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 font-bold text-[10px] uppercase tracking-wider border-b border-border">
                      <th className="px-6 py-3.5">Delivery ID</th>
                      <th className="px-6 py-3.5">Pickup</th>
                      <th className="px-6 py-3.5">Destination</th>
                      <th className="px-6 py-3.5">Priority</th>
                      <th className="px-6 py-3.5">Status</th>
                      <th className="px-6 py-3.5 text-right">ETA</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border font-medium">
                    {queueData.map((item) => (
                      <tr 
                        key={item.id} 
                        className={cn(
                          "hover:bg-slate-50/50 transition-colors",
                          item.id === "DID-2026-10231" && missionStatus === "DELIVERED" ? "text-slate-400" : ""
                        )}
                      >
                        <td className="px-6 py-4 font-mono font-bold text-slate-700">{item.id}</td>
                        <td className="px-6 py-4">{item.pickup}</td>
                        <td className="px-6 py-4">{item.destination}</td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "px-2 py-0.5 text-[9px] font-extrabold rounded tracking-wide",
                            item.priority === "EXPRESS" 
                              ? "bg-rose-50 text-rose-700 border border-rose-100" 
                              : "bg-slate-100 text-slate-600 border border-slate-150"
                          )}>
                            {item.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5">
                            <span className={cn(
                              "w-1.5 h-1.5 rounded-full",
                              item.status === "Delivered" 
                                ? "bg-green-500" 
                                : item.status === "In Transit" 
                                  ? "bg-primary animate-pulse" 
                                  : "bg-slate-350"
                            )} />
                            <span>{item.status}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right font-bold">{item.eta}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* Right Columns (Active Assignment & Analytics) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* 3. Active Mission Card */}
            <section className="bg-card border border-border rounded-2xl p-6 shadow-sm border-t-8 border-primary relative overflow-hidden">
              <div className="flex justify-between items-start mb-5">
                <div>
                  <p className="text-[10px] font-bold uppercase text-primary tracking-widest font-sans">
                    Active Mission
                  </p>
                  <h3 className="font-heading text-lg font-black text-foreground mt-1">
                    {missionStatus === "DELIVERED" ? "No Active Assignment" : "DID-2026-10231"}
                  </h3>
                </div>
                <div className="bg-primary/10 p-2 rounded-lg text-primary shrink-0">
                  <Truck className="size-5" />
                </div>
              </div>

              {missionStatus === "DELIVERED" ? (
                <div className="space-y-4 my-8 text-center py-6">
                  <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-2 border border-green-100 shadow-inner">
                    <UserCheck className="size-6" />
                  </div>
                  <h4 className="font-bold text-xs text-slate-800">All shifts caught up!</h4>
                  <p className="text-[11px] text-muted-foreground max-w-[200px] mx-auto leading-relaxed">
                    Waiting for dispatcher to broadcast next routing manifest.
                  </p>
                  <div className="pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleResetMission}
                      className="h-8 text-[10px] font-bold uppercase tracking-wider gap-1.5"
                      id="btn-reset-simulation-mission"
                    >
                      <RotateCcw className="size-3" />
                      <span>Simulate Next Job</span>
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center gap-1 mt-1 shrink-0">
                        <div className="size-2 rounded-full border border-primary bg-white"></div>
                        <div className="w-0.5 flex-1 border-l-2 border-dotted border-slate-300"></div>
                        <div className="size-2 rounded-full bg-rose-500"></div>
                      </div>
                      <div className="space-y-3 flex-1 text-xs">
                        <div>
                          <p className="text-[9px] font-bold text-muted-foreground uppercase">Pickup</p>
                          <p className="font-bold text-slate-850">BKC Logistics Hub, Zone A, Gate 4</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-bold text-muted-foreground uppercase">Destination</p>
                          <p className="font-bold text-slate-850">Flat 402, Worli Sky Tower, Mumbai</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs">
                      <div>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase">Distance</p>
                        <p className="font-bold text-sm text-slate-800">4.2 km</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase">ETA</p>
                        <p className="font-bold text-sm text-slate-800">15 mins</p>
                      </div>
                    </div>
                  </div>

                  {/* Active Mission Action Controls */}
                  <div className="space-y-2.5">
                    <Button
                      onClick={handleMarkDelivered}
                      className="w-full bg-primary text-white font-bold py-3.5 rounded-xl shadow-md shadow-primary/20 text-xs uppercase tracking-wider"
                      id="btn-driver-mark-delivered"
                    >
                      Mark Delivered
                    </Button>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        disabled
                        className="py-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 border-slate-200 cursor-not-allowed"
                      >
                        Reject Job
                      </Button>
                      <Button
                        variant="outline"
                        disabled
                        className="py-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 border-slate-200 cursor-not-allowed"
                      >
                        Picked Up
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </section>

            {/* 5. Performance Metrics */}
            <section className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <h4 className="font-heading text-sm font-bold text-foreground mb-4">
                Performance Metrics
              </h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1 text-xs">
                    <span className="text-slate-650 font-medium">Delivery Success Rate</span>
                    <span className="font-bold text-slate-800">98%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: "98%" }}></div>
                  </div>
                </div>

                <div className="flex justify-between items-center py-2.5 border-y border-slate-100 text-xs font-semibold">
                  <span className="text-slate-650">Avg. Completion Time</span>
                  <span className="text-slate-800 font-bold">24m</span>
                </div>

                {/* Rating trend visual bars */}
                <div className="space-y-2 pt-1">
                  <p className="text-[9px] font-bold uppercase text-muted-foreground tracking-widest">
                    Recent Rating Trend
                  </p>
                  <div className="flex items-end justify-between h-14 bg-slate-50/50 p-2.5 rounded-lg border border-slate-100">
                    {[
                      { rating: "4.8", height: "80%" },
                      { rating: "4.8", height: "80%" },
                      { rating: "4.9", height: "90%" },
                      { rating: "5.0", height: "100%" },
                      { rating: "4.9", height: "90%" },
                      { rating: "5.0", height: "100%" }
                    ].map((bar, i) => (
                      <div 
                        key={i} 
                        className="w-[12%] bg-gold/70 hover:bg-gold rounded-sm transition-colors duration-150 relative group cursor-help"
                        style={{ height: bar.height }}
                      >
                        {/* Bar rating Tooltip on hover */}
                        <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[8px] font-bold px-1 py-0.5 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity">
                          {bar.rating}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* 6. Recent Activity */}
            <section className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <h4 className="font-heading text-sm font-bold text-foreground mb-4">
                Recent Activity
              </h4>
              <div className="space-y-5 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                {/* Item 1 */}
                <div className="flex gap-3.5 relative z-10 items-start">
                  <div className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center border border-primary/20 shrink-0">
                    <Check className="size-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Accepted DID-2026-10231</p>
                    <p className="text-[9px] text-muted-foreground mt-0.5">Today, 14:20 IST</p>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="flex gap-3.5 relative z-10 items-start">
                  <div className="w-6 h-6 bg-gold/15 text-gold-foreground rounded-full flex items-center justify-center border border-gold/10 shrink-0">
                    <ClipboardList className="size-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Assigned to Route #882</p>
                    <p className="text-[9px] text-muted-foreground mt-0.5">Today, 14:15 IST</p>
                  </div>
                </div>

                {/* Item 3 */}
                <div className="flex gap-3.5 relative z-10 items-start">
                  <div className="w-6 h-6 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center border border-slate-200 shrink-0">
                    <LogIn className="size-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Shift Started (Online)</p>
                    <p className="text-[9px] text-muted-foreground mt-0.5">Today, 08:00 IST</p>
                  </div>
                </div>
              </div>
            </section>

          </div>
        </div>

        {/* Footer Meta */}
        <footer className="mt-12 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center text-[9px] font-bold uppercase tracking-wider text-muted-foreground gap-4">
          <p>© 2026 Alexandria Logistics Systems • V4.2.1-PRO</p>
          <div className="flex gap-5">
            <a className="hover:text-primary transition-colors" href="#">Privacy Protocol</a>
            <a className="hover:text-primary transition-colors" href="#">Safety Standards</a>
            <a className="hover:text-primary transition-colors" href="#">Driver License Agreement</a>
          </div>
          <p>Last Sync: 23/10/2026 14:45:02</p>
        </footer>

      </div>
    </PageContainer>
  );
}
