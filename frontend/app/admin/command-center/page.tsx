"use client";

import React, { useState } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  TrendingUp,
  Activity,
  CheckCircle,
  Clock,
  Plus,
  Minus,
  Layers,
  ArrowRight,
  Filter,
  Download,
  MapPin,
  AlertTriangle,
  X,
  PlusCircle,
  Sparkles,
  Search,
  Wifi,
  ChevronDown
} from "lucide-react";

interface Alert {
  id: string;
  type: "Delayed Delivery" | "Failed Assignment" | "Driver Offline";
  time: string;
  title: string;
  desc: string;
  severity: "error" | "warning" | "info";
}

interface Delivery {
  id: string;
  driver: string;
  driverInitials: string;
  vanId: string;
  origin: string;
  destination: string;
  status: "In Transit" | "At Warehouse" | "Delayed";
  eta: string;
  etaStatus: string;
  type: string;
}

export default function CommandCenterPage() {
  // 1. Interactive States
  const [zoom, setZoom] = useState<number>(1);
  const [showOverlay, setShowOverlay] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [showNewDispatch, setShowNewDispatch] = useState<boolean>(false);
  const [isLive, setIsLive] = useState<boolean>(true);

  // 2. Mock Data for Alerts
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "alert-1",
      type: "Delayed Delivery",
      time: "2m ago",
      title: "Route #4429 - Heavy Traffic",
      desc: "Driver James Wilson is 12 minutes behind scheduled arrival at Hub B.",
      severity: "error"
    },
    {
      id: "alert-2",
      type: "Failed Assignment",
      time: "14m ago",
      title: "System Error: Dispatch #091",
      desc: "No drivers within 5 miles for premium order at 404 N Michigan Ave.",
      severity: "warning"
    },
    {
      id: "alert-3",
      type: "Driver Offline",
      time: "28m ago",
      title: "Unit 772 Disconnected",
      desc: "Signal lost for vehicle ID-88291. Last known location: Zone 4 Warehouse.",
      severity: "info"
    }
  ]);

  // 3. Mock Data for Deliveries
  const [deliveries, setDeliveries] = useState<Delivery[]>([
    {
      id: "#ALX-8902",
      driver: "Sarah K.",
      driverInitials: "SK",
      vanId: "V-04",
      origin: "Hub Alpha",
      destination: "Client #882",
      status: "In Transit",
      eta: "14:22",
      etaStatus: "On Time",
      type: "Express"
    },
    {
      id: "#ALX-8901",
      driver: "Robert J.",
      driverInitials: "RJ",
      vanId: "V-21",
      origin: "Hub Gamma",
      destination: "Client #109",
      status: "At Warehouse",
      eta: "14:45",
      etaStatus: "Scanning",
      type: "Standard"
    },
    {
      id: "#ALX-8899",
      driver: "Mike W.",
      driverInitials: "MW",
      vanId: "B-02",
      origin: "Hub Alpha",
      destination: "Client #442",
      status: "Delayed",
      eta: "15:10",
      etaStatus: "+12m",
      type: "Express"
    }
  ]);

  // 4. Ingestion Form States
  const [newRecipient, setNewRecipient] = useState("");
  const [newOrigin, setNewOrigin] = useState("Hub Alpha");
  const [newDestination, setNewDestination] = useState("");
  const [newPriority, setNewPriority] = useState<"In Transit" | "At Warehouse">("In Transit");
  const [newDriver, setNewDriver] = useState("");

  // Dismiss alert handler
  const handleDismissAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  // Submit dispatch handler
  const handleCreateDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecipient || !newDestination || !newDriver) return;

    const initials = newDriver.split(" ").map(n => n[0]).join("").toUpperCase();
    const newId = `#ALX-${Math.floor(1000 + Math.random() * 9000)}`;

    const newDeliv: Delivery = {
      id: newId,
      driver: newDriver,
      driverInitials: initials || "DR",
      vanId: `V-${Math.floor(10 + Math.random() * 80)}`,
      origin: newOrigin,
      destination: newDestination,
      status: newPriority === "In Transit" ? "In Transit" : "At Warehouse",
      eta: "16:00",
      etaStatus: "Scheduled",
      type: "Express"
    };

    setDeliveries([newDeliv, ...deliveries]);
    setNewRecipient("");
    setNewDestination("");
    setNewDriver("");
    setShowNewDispatch(false);
  };

  // Filter deliveries
  const filteredDeliveries = deliveries.filter(d => {
    const matchesSearch =
      d.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.driver.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.origin.toLowerCase().includes(searchQuery.toLowerCase());

    if (statusFilter === "All") return matchesSearch;
    return matchesSearch && d.status === statusFilter;
  });

  return (
    <PageContainer
      title="Operations Command Center"
      subtitle="Real-time central fleet operations, dispatcher tracking, and active routing monitoring"
      breadcrumbs={[{ label: "Admin", href: "/admin/command-center" }, { label: "Command Center" }]}
      actions={
        <div className="flex items-center gap-2">
          {/* Live Sync Status */}
          <button
            onClick={() => setIsLive(!isLive)}
            className="flex items-center gap-1.5 rounded-full bg-slate-100 hover:bg-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors border border-slate-200"
          >
            <span className={cn("size-2 rounded-full", isLive ? "bg-emerald-500 animate-pulse" : "bg-slate-400")} />
            <span>{isLive ? "Live Sync Active" : "Sync Paused"}</span>
          </button>
        </div>
      }
    >
      <div className="space-y-12">
        {/* KPI Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Active Deliveries */}
          <div className="bg-card border border-border p-6 rounded-xl transition-all hover:translate-y-[-2px] hover:shadow-md duration-200 flex flex-col justify-between min-h-[140px] max-w-sm">
            <p className="font-sans text-sm font-bold uppercase tracking-wide text-muted-foreground">Active Deliveries</p>
            <div className="flex flex-col mt-3">
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold font-sans tabular-nums text-foreground">1,428</h3>
              <span className="text-base font-semibold text-green-700 mt-1.5">+12.4% vs last week</span>
            </div>
          </div>

          {/* Online Drivers */}
          <div className="bg-card border border-border p-6 rounded-xl transition-all hover:translate-y-[-2px] hover:shadow-md duration-200 flex flex-col justify-between min-h-[140px] max-w-sm">
            <p className="font-sans text-sm font-bold uppercase tracking-wide text-muted-foreground">Online Drivers</p>
            <div className="flex flex-col mt-3">
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold font-sans tabular-nums text-foreground">842</h3>
              <div className="flex items-center text-sm font-medium text-muted-foreground font-sans mt-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                Active and online now
              </div>
            </div>
          </div>

          {/* Assignment Success */}
          <div className="bg-card border border-border p-6 rounded-xl transition-all hover:translate-y-[-2px] hover:shadow-md duration-200 flex flex-col justify-between min-h-[140px] max-w-sm">
            <p className="font-sans text-sm font-bold uppercase tracking-wide text-muted-foreground">Assignment Success</p>
            <div className="flex flex-col mt-3">
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold font-sans tabular-nums text-foreground">99.2%</h3>
              <span className="text-sm font-medium text-muted-foreground font-sans mt-1.5">Target: 98%</span>
            </div>
          </div>

          {/* On-Time Delivery */}
          <div className="bg-card border border-border p-6 rounded-xl transition-all hover:translate-y-[-2px] hover:shadow-md duration-200 flex flex-col justify-between min-h-[140px] max-w-sm">
            <p className="font-sans text-sm font-bold uppercase tracking-wide text-muted-foreground">On-Time Delivery</p>
            <div className="flex flex-col mt-3">
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold font-sans tabular-nums text-foreground">94.7%</h3>
              <span className="text-base font-semibold text-red-700 mt-1.5">-2.1% vs average</span>
            </div>
          </div>

          {/* ETA Accuracy */}
          <div className="bg-card border border-border p-6 rounded-xl transition-all hover:translate-y-[-2px] hover:shadow-md duration-200 flex flex-col justify-between min-h-[140px] max-w-sm">
            <p className="font-sans text-sm font-bold uppercase tracking-wide text-muted-foreground">ETA Accuracy</p>
            <div className="flex flex-col mt-3">
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold font-sans tabular-nums text-foreground">±2m</h3>
              <span className="text-sm font-medium text-muted-foreground mt-1.5">Median deviation</span>
            </div>
          </div>
        </section>

        {/* Grid Layout for Map and Feed */}
        <div className="grid grid-cols-12 gap-8 min-h-[600px] h-auto">
          {/* Large Live Fleet Map */}
          <section className="col-span-12 lg:col-span-8 bg-card border border-border rounded-2xl overflow-hidden relative min-h-[450px] lg:min-h-0 shadow-sm flex flex-col">
            {/* Map Overlay Badge */}
            <div className="absolute top-6 left-6 z-10 bg-white/95 backdrop-blur px-4 py-2 rounded-full flex items-center gap-3 shadow-md border border-slate-100">
              <div className="flex -space-x-1.5">
                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center border-2 border-white text-[9px] text-white font-bold">4</div>
                {/* Analytics Highlights / Gold indicator reserved for highlights only */}
                <div className="w-5 h-5 rounded-full bg-gold flex items-center justify-center border-2 border-white text-[9px] text-gold-foreground font-bold">2</div>
              </div>
              <span className="font-sans text-xs font-bold tracking-tight text-slate-800">Fleet Overlay: Active Routes</span>
            </div>

            {/* Map Controls */}
            <div className="absolute top-6 right-6 z-10 flex flex-col gap-2">
              <button
                onClick={() => setZoom(prev => Math.min(prev + 0.1, 2))}
                className="bg-white hover:bg-slate-50 text-slate-800 p-2.5 rounded-lg shadow-md border border-slate-100 active:scale-95 transition-all"
                title="Zoom In"
              >
                <Plus className="size-4" />
              </button>
              <button
                onClick={() => setZoom(prev => Math.max(prev - 0.1, 0.8))}
                className="bg-white hover:bg-slate-50 text-slate-800 p-2.5 rounded-lg shadow-md border border-slate-100 active:scale-95 transition-all"
                title="Zoom Out"
              >
                <Minus className="size-4" />
              </button>
              <button
                onClick={() => setShowOverlay(!showOverlay)}
                className={cn(
                  "p-2.5 rounded-lg shadow-md border active:scale-95 transition-all",
                  showOverlay
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-white hover:bg-slate-50 text-slate-800 border-slate-100"
                )}
                title="Toggle Route Paths Overlay"
              >
                <Layers className="size-4" />
              </button>
            </div>

            {/* Map Visualization Box */}
            <div className="w-full flex-grow relative overflow-hidden bg-slate-50">
              <img
                alt="Aerial satellite map view of Chicago city grid"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxGlL3a9HbxOqvNQ9vRcawoeLtRPpiahmP5B99agFW8pE1wf0VzeX5-nJNRhhqLqQtrJ0uQNbuFjghXIYQDcr1k3ZbO9a7qvJLH9IkLGwadsU5l4G_8zJ66Hi8VvljJxJm6kknOYJQ6taTS4JUAE1f8NNFOnRzHKFoID7Tz4lui6pFWZNtu039xJbH8DVzV9GdIhwg6qXyntoo8KQk9FZaAUsf1Xo2Uo8vI3aCuw2IY_KjZiQ0wDy1TDwbO_oxtPAS8lZp2TGwHbI"
                className="w-full h-full object-cover opacity-85 grayscale hover:grayscale-0 transition-all duration-700"
                style={{
                  transform: `scale(${zoom})`,
                  transformOrigin: "center center",
                  transition: "transform 0.3s ease-out"
                }}
              />

              {/* SVG Dynamic Overlays */}
              {showOverlay && (
                <div className="absolute inset-0 pointer-events-none z-10">
                  <svg className="w-full h-full" viewBox="0 0 1000 600" preserveAspectRatio="none">
                    {/* Active Transit Path (Primary Blue) */}
                    <path
                      d="M100 200 Q 300 150 500 300 T 900 250"
                      fill="none"
                      opacity="0.75"
                      stroke="var(--primary)"
                      strokeDasharray="8 4"
                      strokeWidth="2.5"
                    />
                    {/* Delayed Transit Path (Muted Gold Highlights) */}
                    <path
                      d="M200 500 Q 400 450 600 550"
                      fill="none"
                      opacity="0.75"
                      stroke="var(--gold)"
                      strokeDasharray="6 3"
                      strokeWidth="2.5"
                    />

                    {/* Hub locations */}
                    <circle className="animate-pulse" cx="500" cy="300" fill="var(--primary)" r="9"></circle>
                    <circle cx="100" cy="200" fill="var(--primary)" r="7"></circle>
                    <circle cx="900" cy="250" fill="var(--primary)" r="7"></circle>

                    {/* Delayed Alert Driver Node (Gold Highlight) */}
                    <circle className="animate-ping" cx="400" cy="480" fill="var(--gold)" r="12" opacity="0.4"></circle>
                    <circle cx="400" cy="480" fill="var(--gold)" r="7"></circle>
                  </svg>
                </div>
              )}
            </div>
          </section>
          {/* Right-side Panel: Critical Alerts Feed */}
          <section className="col-span-12 lg:col-span-4 flex flex-col min-h-[450px] lg:min-h-0">
            <div className="bg-card border border-border rounded-2xl p-6 flex-grow flex flex-col overflow-hidden shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading text-2xl font-bold text-foreground">Critical Alerts</h2>
                <span className="bg-destructive/15 text-destructive text-sm font-semibold px-2.5 py-1 rounded uppercase tracking-wider font-sans">High Priority</span>
              </div>

              {/* Scrollable Alerts feed */}
              <div className="flex-1 space-y-4 overflow-y-auto pr-1">
                {alerts.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                    <CheckCircle className="size-8 text-emerald-500 mb-2" />
                    <p className="text-base font-bold text-foreground">No alerts active</p>
                    <p className="text-sm text-muted-foreground mt-0.5">All fleet components running at normal status.</p>
                  </div>
                ) : (
                  alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={cn(
                        "p-4 rounded-xl border-l-4 transition-all duration-200 relative group/alert",
                        alert.severity === "error"
                          ? "bg-destructive/5 hover:bg-destructive/10 border-destructive"
                          : alert.severity === "warning"
                            ? "bg-gold/5 hover:bg-gold/10 border-gold"
                            : "bg-slate-100/50 hover:bg-slate-100 border-slate-400"
                      )}
                    >
                      <div className="flex justify-between items-start mb-1.5">
                        <span className={cn(
                          "font-sans text-xs font-semibold uppercase tracking-wider",
                          alert.severity === "error"
                            ? "text-destructive"
                            : alert.severity === "warning"
                              ? "text-gold-foreground"
                              : "text-muted-foreground"
                        )}>
                          {alert.type}
                        </span>
                        <span className="text-xs text-muted-foreground font-sans">{alert.time}</span>
                      </div>

                      <p className="text-xl font-semibold text-foreground mb-1 font-sans">{alert.title}</p>
                      <p className="text-sm font-normal text-muted-foreground leading-relaxed font-sans">{alert.desc}</p>

                      {/* Interactive Hover Actions */}
                      <div className="mt-3 flex gap-2 opacity-0 group-hover/alert:opacity-100 focus-within:opacity-100 transition-opacity duration-150">
                        <button
                          onClick={() => handleDismissAlert(alert.id)}
                          className={cn(
                            "px-3 py-1.5 text-sm font-semibold rounded shadow-sm text-white",
                            alert.severity === "error" ? "bg-destructive hover:bg-destructive/90" : "bg-primary hover:bg-primary/90"
                          )}
                        >
                          Resolve
                        </button>
                        <button
                          onClick={() => handleDismissAlert(alert.id)}
                          className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-sm font-semibold rounded"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {alerts.length > 0 && (
                <button
                  onClick={() => setAlerts([])}
                  className="mt-6 w-full py-2.5 border border-slate-200 rounded-xl font-sans text-base font-semibold text-slate-700 hover:bg-slate-50 transition-all uppercase tracking-widest"
                >
                  Clear All Alerts
                </button>
              )}
            </div>
          </section>
        </div>

        {/* Bottom Section: Recent Deliveries Table */}
        <section className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h2 className="font-heading text-2xl font-semibold text-foreground mb-1">Recent Deliveries</h2>
              <p className="text-sm text-muted-foreground">Real-time status overview of the logistics throughput</p>
            </div>

            {/* Table actions and filters */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Table search bar */}
              <div className="relative w-48 sm:w-60">
                <Search className="absolute top-2.5 left-3 size-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Filter deliveries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 w-full rounded-md border border-slate-200 bg-background pl-9 pr-3 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all font-sans"
                />
              </div>

              {/* Status filter switcher */}
              <div className="flex border border-slate-200 rounded-md p-1 bg-slate-50 text-base font-medium">
                {["All", "In Transit", "At Warehouse", "Delayed"].map(status => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={cn(
                      "px-3 py-1 rounded-sm transition-colors",
                      statusFilter === status
                        ? "bg-white text-primary shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {status}
                  </button>
                ))}
              </div>

              <button className="h-10 px-4 bg-primary text-white text-base font-semibold rounded-md hover:bg-primary/95 transition-all flex items-center gap-1.5 shadow-sm font-sans">
                <Download className="size-4" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            {filteredDeliveries.length === 0 ? (
              <div className="py-12 text-center border border-dashed border-slate-100 rounded-xl">
                <p className="text-base font-bold text-slate-800">No matching shipments found</p>
                <p className="text-sm text-muted-foreground mt-0.5">Try resetting your filters or search terms.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="pb-4 font-sans text-sm font-semibold uppercase tracking-wider text-muted-foreground">Order ID</th>
                    <th className="pb-4 font-sans text-sm font-semibold uppercase tracking-wider text-muted-foreground">Driver / Courier</th>
                    <th className="pb-4 font-sans text-sm font-semibold uppercase tracking-wider text-muted-foreground">Origin &rarr; Destination</th>
                    <th className="pb-4 font-sans text-sm font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                    <th className="pb-4 font-sans text-sm font-semibold uppercase tracking-wider text-muted-foreground text-right">ETA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredDeliveries.map((delivery) => (
                    <tr
                      key={delivery.id}
                      className="group hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="py-5 font-sans text-base font-semibold tabular-nums text-primary">
                        {delivery.id}
                      </td>
                      <td className="py-5">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-inner",
                            delivery.status === "Delayed"
                              ? "bg-gold/10 text-gold-foreground"
                              : "bg-slate-100 text-slate-700"
                          )}>
                            {delivery.driverInitials}
                          </div>
                          <div>
                            <p className="text-base font-semibold text-foreground">{delivery.driver}</p>
                            <p className="text-sm text-muted-foreground font-sans">Vehicle: {delivery.vanId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-5">
                        <div className="flex items-center gap-2 text-base font-medium text-foreground">
                          <span>{delivery.origin}</span>
                          <span className="text-muted-foreground/45">&rarr;</span>
                          <span>{delivery.destination}</span>
                        </div>
                      </td>
                      <td className="py-5">
                        <span className={cn(
                          "px-2.5 py-1 text-sm font-medium rounded uppercase tracking-wider",
                          delivery.status === "In Transit"
                            ? "bg-blue-50 text-blue-700 border border-blue-100"
                            : delivery.status === "Delayed"
                              ? "bg-gold/10 text-gold-foreground border border-gold/20"
                              : "bg-slate-100 text-slate-700 border border-slate-200"
                        )}>
                          {delivery.status}
                        </span>
                      </td>
                      <td className="py-5 text-right">
                        <span className={cn(
                          "font-sans text-base font-semibold tabular-nums block",
                          delivery.status === "Delayed" ? "text-destructive" : "text-foreground"
                        )}>
                          {delivery.eta}
                        </span>
                        <span className="text-sm text-muted-foreground block mt-0.5 tabular-nums">
                          ({delivery.etaStatus})
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>

      {/* Contextual Floating Action Button: Open Dispatch Modal */}
      <button
        onClick={() => setShowNewDispatch(true)}
        className="fixed bottom-10 right-10 w-14 h-14 bg-primary text-primary-foreground hover:bg-primary/95 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 group z-[100]"
        title="Open New Dispatch Creator"
      >
        <PlusCircle className="size-6 transition-transform group-hover:rotate-90 duration-300" />
        <div className="absolute right-full mr-3 bg-slate-900 text-white text-xs font-bold py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-md">
          New Dispatch
        </div>
      </button>

      {/* Real-time Ingestion / New Dispatch Modal dialog */}
      {showNewDispatch && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          {/* Modal backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setShowNewDispatch(false)}
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-md bg-white rounded-2xl border border-slate-100 shadow-2xl z-10 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex h-14 items-center justify-between border-b border-slate-100 px-6 bg-slate-50">
              <h3 className="font-sans font-bold text-lg text-foreground">Create Dispatch Order</h3>
              <button
                onClick={() => setShowNewDispatch(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleCreateDispatch} className="p-6 space-y-4 text-base">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 uppercase tracking-wide">Client / Recipient</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Client #922"
                  value={newRecipient}
                  onChange={(e) => setNewRecipient(e.target.value)}
                  className="h-10 w-full rounded border border-slate-200 px-3 text-base placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 uppercase tracking-wide">Origin Hub</label>
                  <select
                    value={newOrigin}
                    onChange={(e) => setNewOrigin(e.target.value)}
                    className="h-10 w-full rounded border border-slate-200 px-2 text-base focus:outline-none focus:ring-1 focus:ring-primary font-sans"
                  >
                    <option value="Hub Alpha">Hub Alpha</option>
                    <option value="Hub Beta">Hub Beta</option>
                    <option value="Hub Gamma">Hub Gamma</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 uppercase tracking-wide">Destination Address</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 520 N LaSalle"
                    value={newDestination}
                    onChange={(e) => setNewDestination(e.target.value)}
                    className="h-10 w-full rounded border border-slate-200 px-3 text-base focus:outline-none focus:ring-1 focus:ring-primary font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 uppercase tracking-wide">Assign Courier</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alan T."
                    value={newDriver}
                    onChange={(e) => setNewDriver(e.target.value)}
                    className="h-10 w-full rounded border border-slate-200 px-3 text-base focus:outline-none focus:ring-1 focus:ring-primary font-sans"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 uppercase tracking-wide">Initial Status</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as "In Transit" | "At Warehouse")}
                    className="h-10 w-full rounded border border-slate-200 px-2 text-base focus:outline-none focus:ring-1 focus:ring-primary font-sans"
                  >
                    <option value="In Transit">In Transit</option>
                    <option value="At Warehouse">At Warehouse</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowNewDispatch(false)}
                  className="text-base font-semibold h-10 px-4"
                >
                  Cancel
                </Button>
                <Button type="submit" className="text-base font-semibold h-10 px-4">
                  Dispatch Shipment
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
