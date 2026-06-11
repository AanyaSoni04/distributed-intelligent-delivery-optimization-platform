"use client";

import React, { useState, useMemo } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Search,
  Truck,
  AlertTriangle,
  RefreshCw,
  CheckCircle2,
  Clock,
  User,
  Users,
  MapPin,
  ChevronRight,
  MoreVertical,
  Check,
  X,
  Plus,
  Minus,
  Sparkles,
  Zap,
  Phone,
  FileText,
  UserCheck,
  ArrowRight,
  Layers,
  Filter,
  AlertCircle
} from "lucide-react";

// Delivery Interface
interface OperationDelivery {
  id: string;
  customer: string;
  region: string;
  driver: string;
  driverInitials: string;
  status: "In Transit" | "Delayed" | "Unassigned" | "Delivered";
  eta: string;
  priority: "High" | "Medium" | "Urgent" | "Low";
  pickup: string;
  destination: string;
  distance: string;
  createdTime: string;
  assignedTime: string;
  pickedTime: string;
  transitCoords: string;
}

// Mock Database of Deliveries
const INITIAL_DELIVERIES: OperationDelivery[] = [
  {
    id: "DID-9921",
    customer: "Reliance Retail",
    region: "Maharashtra",
    driver: "Rajesh K.",
    driverInitials: "RK",
    status: "In Transit",
    eta: "14:30",
    priority: "High",
    pickup: "Mumbai Central Hub",
    destination: "Reliance Mall, Bandra",
    distance: "12.4 km",
    createdTime: "08:30 AM",
    assignedTime: "08:45 AM",
    pickedTime: "09:20 AM",
    transitCoords: "Bandra, Mumbai"
  },
  {
    id: "DID-8821",
    customer: "Flipkart Logistx",
    region: "Karnataka",
    driver: "Sunil S.",
    driverInitials: "SS",
    status: "Delayed",
    eta: "15:45",
    priority: "Medium",
    pickup: "Bengaluru East Hub",
    destination: "Flipkart Warehouse, Whitefield",
    distance: "18.2 km",
    createdTime: "09:00 AM",
    assignedTime: "09:15 AM",
    pickedTime: "09:40 AM",
    transitCoords: "Hennur, Bengaluru"
  },
  {
    id: "DID-9012",
    customer: "Apollo Pharma",
    region: "Telangana",
    driver: "Unassigned",
    driverInitials: "??",
    status: "Unassigned",
    eta: "--:--",
    priority: "Urgent",
    pickup: "Hyderabad Logistics Yard",
    destination: "Apollo Clinic, HITEC City",
    distance: "6.5 km",
    createdTime: "11:10 AM",
    assignedTime: "--:--",
    pickedTime: "--:--",
    transitCoords: "Awaiting Dispatch"
  },
  {
    id: "DID-9945",
    customer: "Amazon Fresh",
    region: "Maharashtra",
    driver: "Arjun M.",
    driverInitials: "AM",
    status: "In Transit",
    eta: "14:15",
    priority: "Low",
    pickup: "Pune Distribution Hub",
    destination: "Amazon Locker, Hinjewadi",
    distance: "9.8 km",
    createdTime: "08:15 AM",
    assignedTime: "08:30 AM",
    pickedTime: "09:00 AM",
    transitCoords: "Wakad, Pune"
  }
];

export default function DeliveryOperationsPage() {
  const breadcrumbs = [
    { label: "Admin", href: "/admin/command-center" },
    { label: "Delivery Operations" }
  ];

  // 1. Interactive States
  const [deliveries, setDeliveries] = useState<OperationDelivery[]>(INITIAL_DELIVERIES);
  const [selectedDeliveryId, setSelectedDeliveryId] = useState("DID-9921");
  const [selectedRowIds, setSelectedRowIds] = useState<Record<string, boolean>>({ "DID-9921": true });
  
  // Filter States
  const [regionFilter, setRegionFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [driverFilter, setDriverFilter] = useState("All");
  
  // Modal controllers
  const [reassignOpen, setReassignOpen] = useState(false);
  const [escalateOpen, setEscalateOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Map zoom
  const [mapZoom, setMapZoom] = useState(1);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Find currently active delivery details
  const activeDelivery = useMemo(() => {
    return deliveries.find(d => d.id === selectedDeliveryId) || deliveries[0];
  }, [selectedDeliveryId, deliveries]);

  // Compute live KPI Card values based on state
  const activeDeliveriesCount = deliveries.filter(d => d.status === "In Transit").length;
  const delayedDeliveriesCount = deliveries.filter(d => d.status === "Delayed").length;
  const unassignedCount = deliveries.filter(d => d.status === "Unassigned").length;
  const priorityCount = deliveries.filter(d => d.priority === "High" || d.priority === "Urgent").length;

  // Filter deliveries for the table
  const filteredDeliveries = useMemo(() => {
    return deliveries.filter(d => {
      const matchRegion = regionFilter === "All" || d.region === regionFilter;
      const matchStatus = statusFilter === "All" || d.status === statusFilter;
      const matchDriver = driverFilter === "All" || 
        (driverFilter === "Assigned" && d.driver !== "Unassigned") || 
        (driverFilter === "Unassigned" && d.driver === "Unassigned");
      return matchRegion && matchStatus && matchDriver;
    });
  }, [deliveries, regionFilter, statusFilter, driverFilter]);

  // Toggle checkbox row selection
  const handleToggleRow = (id: string) => {
    setSelectedRowIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
    // Auto focus the details panel onto the clicked row
    setSelectedDeliveryId(id);
  };

  // Bulk actions
  const handleMarkHighPriority = () => {
    const selectedIds = Object.keys(selectedRowIds).filter(key => selectedRowIds[key]);
    if (selectedIds.length === 0) {
      showToast("No shipments selected.");
      return;
    }

    setDeliveries(prev => 
      prev.map(d => selectedIds.includes(d.id) ? { ...d, priority: "High" } : d)
    );
    showToast(`Marked ${selectedIds.length} shipment(s) as HIGH priority.`);
  };

  const handleEscalate = () => {
    const selectedIds = Object.keys(selectedRowIds).filter(key => selectedRowIds[key]);
    if (selectedIds.length === 0) {
      showToast("No shipments selected.");
      return;
    }
    setEscalateOpen(true);
  };

  const confirmEscalate = () => {
    const selectedIds = Object.keys(selectedRowIds).filter(key => selectedRowIds[key]);
    setDeliveries(prev => 
      prev.map(d => selectedIds.includes(d.id) ? { ...d, priority: "Urgent" } : d)
    );
    setEscalateOpen(false);
    showToast(`Operational Escalation triggered for ${selectedIds.length} delivery route(s).`);
  };

  const handleReassign = () => {
    const selectedIds = Object.keys(selectedRowIds).filter(key => selectedRowIds[key]);
    if (selectedIds.length === 0) {
      showToast("No shipments selected.");
      return;
    }
    setReassignOpen(true);
  };

  const confirmReassign = (driverName: string, initials: string) => {
    const selectedIds = Object.keys(selectedRowIds).filter(key => selectedRowIds[key]);
    setDeliveries(prev => 
      prev.map(d => selectedIds.includes(d.id) ? { 
        ...d, 
        driver: driverName, 
        driverInitials: initials,
        status: d.status === "Unassigned" ? "In Transit" : d.status 
      } : d)
    );
    setReassignOpen(false);
    showToast(`Reassigned ${selectedIds.length} route(s) to Courier: ${driverName}.`);
  };

  const clearFilters = () => {
    setRegionFilter("All");
    setStatusFilter("All");
    setDriverFilter("All");
    showToast("Filters cleared.");
  };

  return (
    <PageContainer
      title="Delivery Operations Center"
      subtitle="Fleet management, courier assignments, and transit route exception monitoring"
      breadcrumbs={breadcrumbs}
      actions={
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 text-muted-foreground text-xs bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
            <RefreshCw className="size-3.5 animate-spin-slow text-primary" />
            <span className="font-bold uppercase tracking-wider text-[9px] text-slate-600">Last updated: 14:32:01 IST</span>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => showToast("Exporting operational report to PDF/CSV...")}
            className="h-9 font-semibold text-xs border-border bg-slate-50 text-slate-700 hover:bg-slate-100"
            id="btn-export-report"
          >
            Export Report
          </Button>
        </div>
      }
    >
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-[60] bg-slate-900 text-white text-xs px-4 py-3 rounded-lg shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <CheckCircle2 className="size-4 text-green-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="space-y-10 font-sans">
        
        {/* 1. Operations KPI Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Card 1: Active Deliveries */}
          <div className="bg-card p-6 rounded-xl border border-border shadow-sm hover:translate-y-[-2px] transition-all flex flex-col justify-between group min-h-[140px] max-w-sm">
            <p className="font-sans text-sm font-medium uppercase tracking-wide text-muted-foreground">Active Deliveries</p>
            <div className="flex flex-col mt-3">
              <span className="text-3xl md:text-4xl lg:text-5xl font-bold font-sans tabular-nums text-foreground">{(activeDeliveriesCount + 1238).toLocaleString("en-IN")}</span>
              <span className="text-base font-semibold text-green-700 mt-1.5">+4.2% vs last hour</span>
            </div>
            <div className="w-full h-1 bg-primary/10 mt-4 rounded-full overflow-hidden">
              <div className="w-3/4 h-full bg-primary" />
            </div>
          </div>

          {/* Card 2: Delayed Deliveries */}
          <div className="bg-card p-6 rounded-xl border border-border shadow-sm hover:translate-y-[-2px] transition-all flex flex-col justify-between group min-h-[140px] max-w-sm">
            <p className="font-sans text-sm font-medium uppercase tracking-wide text-muted-foreground">Delayed Deliveries</p>
            <div className="flex flex-col mt-3">
              <span className="text-3xl md:text-4xl lg:text-5xl font-bold font-sans tabular-nums text-gold">{delayedDeliveriesCount + 16}</span>
              <span className="text-sm font-medium text-muted-foreground font-sans mt-1.5 flex items-center gap-1">
                <AlertTriangle className="size-4 text-gold" />
                SLA warning active
              </span>
            </div>
            <div className="w-full h-1 bg-gold/15 mt-4 rounded-full overflow-hidden">
              <div className="w-1/3 h-full bg-gold" />
            </div>
          </div>

          {/* Card 3: Failed Deliveries */}
          <div className="bg-card p-6 rounded-xl border border-border shadow-sm hover:translate-y-[-2px] transition-all flex flex-col justify-between group min-h-[140px] max-w-sm">
            <p className="font-sans text-sm font-medium uppercase tracking-wide text-red-700">Failed Deliveries</p>
            <div className="flex flex-col mt-3">
              <span className="text-3xl md:text-4xl lg:text-5xl font-bold font-sans tabular-nums text-red-650">{unassignedCount + 2}</span>
              <span className="text-sm font-semibold text-red-800 bg-red-100 px-2.5 py-0.5 rounded font-sans uppercase w-fit mt-1.5">
                CRITICAL STATUS
              </span>
            </div>
            <div className="w-full h-1 bg-red-100 mt-4 rounded-full overflow-hidden">
              <div className="w-1/5 h-full bg-red-500" />
            </div>
          </div>

          {/* Card 4: Priority Deliveries */}
          <div className="bg-card p-6 rounded-xl border border-border shadow-sm hover:translate-y-[-2px] transition-all flex flex-col justify-between group min-h-[140px] max-w-sm">
            <p className="font-sans text-sm font-medium uppercase tracking-wide text-muted-foreground">Priority Deliveries</p>
            <div className="flex flex-col mt-3">
              <span className="text-3xl md:text-4xl lg:text-5xl font-bold font-sans tabular-nums text-foreground">{priorityCount + 79}</span>
              <span className="text-sm font-medium text-muted-foreground font-sans mt-1.5">High / Urgent Priority</span>
            </div>
            <div className="w-full h-1 bg-slate-100 mt-4 rounded-full overflow-hidden">
              <div className="w-2/3 h-full bg-slate-700" />
            </div>
          </div>

          {/* Card 5: Reassignments */}
          <div className="bg-card p-6 rounded-xl border border-border shadow-sm hover:translate-y-[-2px] transition-all flex flex-col justify-between group min-h-[140px] max-w-sm">
            <p className="font-sans text-sm font-medium uppercase tracking-wide text-muted-foreground">Reassignments</p>
            <div className="flex flex-col mt-3">
              <span className="text-3xl md:text-4xl lg:text-5xl font-bold font-sans tabular-nums text-foreground">24</span>
              <span className="text-sm font-medium text-muted-foreground font-sans mt-1.5">Reassigned today</span>
            </div>
            <div className="w-full h-1 bg-slate-100 mt-4 rounded-full overflow-hidden">
              <div className="w-1/2 h-full bg-slate-400" />
            </div>
          </div>
        </section>

        {/* 2. Filters Section */}
        <section className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-wrap items-center gap-4 shadow-sm">
          <span className="text-sm font-semibold text-slate-600 uppercase tracking-wide pl-1">Filters</span>
          <div className="flex flex-wrap items-center gap-2 flex-1 font-sans text-base font-medium">
            {/* Region Filter */}
            <select 
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-1 focus:ring-primary focus:border-primary text-base font-medium"
            >
              <option value="All">Region: All</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Telangana">Telangana</option>
            </select>

            {/* Delivery Status Filter */}
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-1 focus:ring-primary focus:border-primary text-base font-medium"
            >
              <option value="All">All Statuses</option>
              <option value="In Transit">In Transit</option>
              <option value="Delayed">Delayed</option>
              <option value="Unassigned">Unassigned</option>
            </select>

            {/* Driver Status Filter */}
            <select 
              value={driverFilter}
              onChange={(e) => setDriverFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-1 focus:ring-primary focus:border-primary text-base font-medium"
            >
              <option value="All">Driver Status: Any</option>
              <option value="Assigned">Assigned Drivers</option>
              <option value="Unassigned">Unassigned</option>
            </select>

            {(regionFilter !== "All" || statusFilter !== "All" || driverFilter !== "All") && (
              <Button 
                variant="ghost" 
                onClick={clearFilters}
                className="h-9 text-base text-primary font-bold hover:underline"
              >
                Clear All
              </Button>
            )}
          </div>
        </section>

        {/* Main Operational Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: 3. Main Delivery Table */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
              <div className="px-6 py-4.5 border-b border-border flex justify-between items-center bg-slate-50/50">
                <h3 className="font-sans text-2xl font-bold text-foreground">
                  Main Delivery Grid
                </h3>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500">
                    <Filter className="size-4" />
                  </button>
                  <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500">
                    <MoreVertical className="size-4" />
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-sans text-base">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 font-semibold text-sm border-b border-border">
                      <th className="p-4 w-10 text-center">
                        <input 
                          type="checkbox" 
                          onChange={(e) => {
                            const checked = e.target.checked;
                            const newRowIds: Record<string, boolean> = {};
                            filteredDeliveries.forEach(d => {
                              newRowIds[d.id] = checked;
                            });
                            setSelectedRowIds(newRowIds);
                          }}
                          className="rounded text-primary focus:ring-primary size-4"
                        />
                      </th>
                      <th className="px-4 py-3.5">Delivery ID</th>
                      <th className="px-4 py-3.5">Customer</th>
                      <th className="px-4 py-3.5">Driver</th>
                      <th className="px-4 py-3.5 text-center">Status</th>
                      <th className="px-4 py-3.5">ETA</th>
                      <th className="px-4 py-3.5 text-center">Priority</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border font-medium">
                    {filteredDeliveries.map((delivery) => {
                      const isSelected = selectedDeliveryId === delivery.id;
                      const isChecked = !!selectedRowIds[delivery.id];

                      return (
                        <tr
                          key={delivery.id}
                          onClick={() => {
                            setSelectedDeliveryId(delivery.id);
                          }}
                          className={cn(
                            "cursor-pointer hover:bg-slate-50/50 transition-colors",
                            isSelected ? "bg-primary/5 font-semibold" : ""
                          )}
                        >
                          <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggleRow(delivery.id)}
                              className="rounded text-primary focus:ring-primary size-4"
                            />
                          </td>
                          <td className="px-4 py-5 font-mono text-base font-semibold tabular-nums text-primary">{delivery.id}</td>
                          <td className="px-4 py-5">
                            <p className="font-semibold text-base text-foreground">{delivery.customer}</p>
                            <p className="text-sm text-slate-500 font-normal">{delivery.region}</p>
                          </td>
                          <td className="px-4 py-5">
                            {delivery.driver === "Unassigned" ? (
                              <span className="text-base text-red-700 font-semibold italic">Unassigned</span>
                            ) : (
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                                  {delivery.driverInitials}
                                </div>
                                <span className="text-base text-slate-800 font-semibold">{delivery.driver}</span>
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-5 text-center">
                            <span className={cn(
                              "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium uppercase tracking-wide",
                              delivery.status === "In Transit"
                                ? "bg-blue-50 text-blue-800 border border-blue-200"
                                : delivery.status === "Delayed"
                                  ? "bg-gold/10 text-gold-foreground border border-gold/20"
                                  : "bg-red-50 text-red-800 border border-red-200"
                            )}>
                              {delivery.status === "In Transit" && (
                                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                              )}
                              {delivery.status}
                            </span>
                          </td>
                          <td className="px-4 py-5 font-mono text-base font-semibold tabular-nums text-slate-700">{delivery.eta}</td>
                          <td className="px-4 py-5 text-center">
                            <span className={cn(
                              "text-sm font-medium px-2.5 py-1 rounded uppercase",
                              delivery.priority === "Urgent"
                                ? "bg-red-100 text-red-800 border border-red-200"
                                : delivery.priority === "High"
                                  ? "bg-gold/10 text-gold-foreground border border-gold/20"
                                  : "bg-slate-100 text-slate-700 border border-slate-200"
                            )}>
                              {delivery.priority}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="px-6 py-4 bg-slate-50/50 border-t border-border flex justify-between items-center text-xs">
                <p className="text-muted-foreground">
                  Showing {filteredDeliveries.length} of {deliveries.length} active deliveries
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="h-8 px-2.5">
                    Prev
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 px-2.5">
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Exceptions, Mini-Map, and Lifecycle */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* 4. Live Exceptions Panel */}
            <section className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm border-l-4 border-red-500">
              <div className="p-4 bg-red-50/40 flex justify-between items-center border-b border-border">
                <h4 className="text-xs font-bold text-red-700 uppercase tracking-widest font-sans flex items-center gap-1.5">
                  <AlertCircle className="size-4 text-red-600" />
                  <span>Live Exceptions</span>
                </h4>
                <span className="text-[10px] font-extrabold text-white bg-red-600 px-2 py-0.5 rounded-full">
                  3
                </span>
              </div>
              <div className="p-2.5 space-y-2 max-h-80 overflow-y-auto">
                <div 
                  onClick={() => {
                    setSelectedDeliveryId("DID-8821");
                    showToast("Loaded exception event for DID-8821");
                  }}
                  className="p-3 rounded-xl bg-red-50/10 border border-red-150 hover:bg-red-50/20 transition-all cursor-pointer text-base"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-destructive">SLA VIOLATION</span>
                    <span className="text-xs text-muted-foreground font-sans">45m ago</span>
                  </div>
                  <p className="text-base font-semibold text-foreground">DID-8821 — Delayed 45m</p>
                  <p className="text-sm font-normal mt-0.5 text-muted-foreground">Impact: Critical Customer (Flipkart)</p>
                </div>

                <div className="p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-150 transition-all cursor-pointer text-base">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gold-foreground">SYSTEM ALERT</span>
                    <span className="text-xs text-muted-foreground font-sans">12m ago</span>
                  </div>
                  <p className="text-base font-semibold text-foreground">Driver Offline: Unit 402</p>
                  <p className="text-sm font-normal mt-0.5 text-muted-foreground">Signal lost near Pune Highway</p>
                </div>

                <div 
                  onClick={() => {
                    setSelectedDeliveryId("DID-9012");
                    showToast("Loaded assignment failure for DID-9012");
                  }}
                  className="p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-150 transition-all cursor-pointer text-base"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-destructive">ASSIGNMENT FAILED</span>
                    <span className="text-xs text-muted-foreground font-sans">Now</span>
                  </div>
                  <p className="text-base font-semibold text-foreground">Failed Assignment: DID-9012</p>
                  <p className="text-sm font-normal mt-0.5 text-muted-foreground">No active drivers in Hyderabad Sector 4</p>
                </div>
              </div>
            </section>

            {/* Exceptions Map (Mini-Map) */}
            <section className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm aspect-video relative">
              <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur p-2.5 rounded-xl shadow-md border border-slate-150">
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-700">
                  Live Tracking: {activeDelivery.id}
                </p>
              </div>
              <div className="w-full h-full bg-slate-100 overflow-hidden relative">
                <img
                  alt="Live tracking mini map grid of Mumbai"
                  className="w-full h-full object-cover opacity-80 transition-transform duration-300 origin-center"
                  style={{ transform: `scale(${mapZoom})` }}
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3b2i-weTIMCwIGK9_mzTOQD645E9fl9zxyfl_Gen3VzXMJis6oPeFccfni8DNnXySpOJhX5qCPOObDdBZHWbm0quTx4z03sfhV0p083FGc7BxIMb3D9o5roXfwIbnwbxZ9fR1pbsdEE25yahRut97RkccF-ZPuZZ6tvXwC0y7Ak2TaR6kIbYeCq3hgdSoAhyu9JHCpWjuqmi2wOMvGSoOhVK7t6-V7-Z5l_Ntp97BRDI4ymXlF4T5qYT5Zb_92R010ce014_A_sM"
                />
                
                {/* Simulated Vehicle Pin */}
                {activeDelivery.status !== "Unassigned" && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="relative">
                      <div className="absolute -inset-3 bg-primary/20 rounded-full animate-ping pointer-events-none" />
                      <div className="p-1.5 bg-primary rounded-full border border-white shadow-lg relative pointer-events-auto">
                        <Truck className="size-4.5 text-white" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Mini Map Zooms */}
              <div className="absolute bottom-4 right-4 flex gap-1.5">
                <button 
                  onClick={() => setMapZoom(prev => Math.min(prev + 0.15, 1.6))}
                  className="w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center text-slate-650 hover:bg-slate-50 border border-slate-200"
                >
                  <Plus className="size-3.5" />
                </button>
                <button 
                  onClick={() => setMapZoom(prev => Math.max(prev - 0.15, 1))}
                  className="w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center text-slate-650 hover:bg-slate-50 border border-slate-200"
                >
                  <Minus className="size-3.5" />
                </button>
              </div>
            </section>

            {/* 5. Delivery Lifecycle Timeline */}
            <section className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <h4 className="font-sans text-lg font-bold text-foreground mb-5">
                Fulfillment Lifecycle: {activeDelivery.id}
              </h4>
              
              <div className="relative pl-1">
                <div className="absolute left-3 top-2.5 bottom-2.5 w-0.5 bg-slate-100 -z-10" />

                <div className="space-y-4 font-sans text-sm">
                  {/* Step 1: Created */}
                  <div className="flex gap-3.5 items-start">
                    <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center shadow-sm shrink-0">
                      <Check className="size-3" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Created</p>
                      <p className="text-xs text-muted-foreground mt-0.5 tabular-nums">{activeDelivery.createdTime} • Ingested</p>
                    </div>
                  </div>

                  {/* Step 2: Assigned */}
                  <div className="flex gap-3.5 items-start">
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center shadow-sm shrink-0",
                      activeDelivery.driver !== "Unassigned" 
                        ? "bg-primary text-white" 
                        : "bg-slate-100 text-slate-400 border border-slate-200"
                    )}>
                      {activeDelivery.driver !== "Unassigned" ? (
                        <Check className="size-3" />
                      ) : (
                        <div className="size-1.5 bg-red-400 rounded-full animate-pulse" />
                      )}
                    </div>
                    <div>
                      <p className={cn(
                        "text-sm font-semibold",
                        activeDelivery.driver === "Unassigned" ? "text-red-750 font-bold animate-pulse" : "text-foreground"
                      )}>
                        Assigned
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 tabular-nums">
                        {activeDelivery.driver !== "Unassigned" 
                          ? `${activeDelivery.assignedTime} • ${activeDelivery.driver}` 
                          : "Pending driver assignment"}
                      </p>
                    </div>
                  </div>

                  {/* Step 3: Picked Up */}
                  <div className="flex gap-3.5 items-start">
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center shadow-sm shrink-0",
                      activeDelivery.driver !== "Unassigned" && activeDelivery.status !== "Unassigned"
                        ? "bg-primary text-white" 
                        : "bg-slate-100 text-slate-400 border border-slate-200"
                    )}>
                      {activeDelivery.driver !== "Unassigned" && activeDelivery.status !== "Unassigned" ? (
                        <Check className="size-3" />
                      ) : null}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Picked Up</p>
                      <p className="text-xs text-muted-foreground mt-0.5 tabular-nums">
                        {activeDelivery.driver !== "Unassigned" && activeDelivery.status !== "Unassigned"
                          ? `${activeDelivery.pickedTime} • ${activeDelivery.pickup}` 
                          : "Awaiting pickup at distribution center"}
                      </p>
                    </div>
                  </div>

                  {/* Step 4: In Transit (Active) */}
                  <div className="flex gap-3.5 items-start">
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center shrink-0 shadow-sm transition-all duration-300",
                      activeDelivery.status === "In Transit"
                        ? "border-2 border-primary bg-white text-primary"
                        : "bg-slate-100 text-slate-400 border border-slate-200"
                    )}>
                      {activeDelivery.status === "In Transit" && (
                        <div className="size-1.5 bg-primary rounded-full animate-ping" />
                      )}
                    </div>
                    <div>
                      <p className={cn(
                        "text-sm font-semibold",
                        activeDelivery.status === "In Transit" ? "text-primary font-bold" : "text-foreground"
                      )}>
                        In Transit
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 tabular-nums">
                        {activeDelivery.status === "In Transit" 
                          ? `Currently at ${activeDelivery.transitCoords}` 
                          : activeDelivery.status === "Delayed"
                            ? "Route delayed (NH44 Traffic block)"
                            : "Manifest queued"}
                      </p>
                    </div>
                  </div>

                  {/* Step 5: Delivered */}
                  <div className="flex gap-3.5 items-start opacity-50">
                    <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-400 border border-slate-200 flex items-center justify-center shrink-0">
                      {/* empty dot */}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Delivered</p>
                      <p className="text-xs text-muted-foreground mt-0.5 tabular-nums">Expected ETA: {activeDelivery.eta}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

        </div>

        {/* 6. Quick Actions Floating Panel (bottom center contextual) */}
        {Object.keys(selectedRowIds).some(key => selectedRowIds[key]) && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white/95 backdrop-blur-md px-6 py-3.5 rounded-2xl shadow-2xl border border-slate-200/80 z-50 animate-in slide-in-from-bottom-4 duration-300">
            <div className="px-4 border-r border-slate-200 shrink-0">
              <p className="text-sm font-semibold text-primary uppercase tracking-wide font-sans">
                {Object.keys(selectedRowIds).filter(key => selectedRowIds[key]).length} Selected
              </p>
              <p className="text-base font-bold text-slate-900 truncate max-w-[120px] tabular-nums font-sans">
                {Object.keys(selectedRowIds).filter(key => selectedRowIds[key]).join(", ")}
              </p>
            </div>
            
            <div className="flex items-center gap-2 flex-wrap font-sans">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReassign}
                className="bg-slate-50 border-slate-250 text-slate-700 hover:bg-slate-100 font-semibold h-10 text-base px-4"
                id="btn-reassign-driver"
              >
                Reassign Driver
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleEscalate}
                className="bg-slate-50 border-slate-250 text-red-650 hover:bg-red-50 hover:border-red-200 font-semibold h-10 text-base px-4"
                id="btn-escalate-issue"
              >
                Escalate Issue
              </Button>
              <Button
                onClick={handleMarkHighPriority}
                className="bg-primary text-white font-semibold h-10 text-base px-4"
                id="btn-mark-priority"
              >
                Mark High Priority
              </Button>
            </div>

            <button
              onClick={() => setSelectedRowIds({})}
              className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 transition-colors ml-2"
              id="btn-close-actions"
            >
              <X className="size-4.5" />
            </button>
          </div>
        )}

      </div>

      {/* Driver Reassignment Modal */}
      {reassignOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={() => setReassignOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 border border-slate-100 z-10 animate-in fade-in zoom-in-95 duration-200 space-y-5">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold font-heading text-slate-800 flex items-center gap-2">
                <UserCheck className="size-5 text-primary" />
                <span>Reassign Courier Route</span>
              </h3>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setReassignOpen(false)} 
                className="h-8 w-8 text-slate-400"
                id="btn-close-reassign"
              >
                <X className="size-4.5" />
              </Button>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Select an available courier driver in this zone cluster to assign route manifest <span className="font-bold text-slate-800 font-mono">{Object.keys(selectedRowIds).filter(key => selectedRowIds[key]).join(", ")}</span>:
            </p>

            <div className="space-y-2.5 pt-1 font-semibold text-xs">
              {[
                { name: "Priya N.", init: "PN", status: "Idle - 1.2 km away" },
                { name: "Sunil S.", init: "SS", status: "Active - Near BKC Hub" },
                { name: "Rajesh K.", init: "RK", status: "Online - Near Worli" },
                { name: "Arjun M.", init: "AM", status: "Online - Near Pune SEZ" }
              ].map((driverObj, i) => (
                <button
                  key={i}
                  onClick={() => confirmReassign(driverObj.name, driverObj.init)}
                  className="w-full text-left px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl hover:bg-primary/5 hover:border-primary/20 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                      {driverObj.init}
                    </div>
                    <div>
                      <p className="text-slate-800 text-xs font-bold">{driverObj.name}</p>
                      <p className="text-[10px] text-muted-foreground font-medium mt-0.5">{driverObj.status}</p>
                    </div>
                  </div>
                  <ChevronRight className="size-4 text-slate-400 group-hover:text-primary transition-colors" />
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setReassignOpen(false)}
                id="btn-cancel-reassign"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Escalate Issue Modal */}
      {escalateOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={() => setEscalateOpen(false)}
          />
          <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 border border-slate-100 z-10 animate-in fade-in zoom-in-95 duration-200 space-y-5 text-center">
            <div className="w-14 h-14 bg-red-100 text-red-650 rounded-full flex items-center justify-center mx-auto mb-2 border border-red-200 shadow-inner">
              <AlertCircle className="size-7 animate-bounce" />
            </div>
            
            <div>
              <h3 className="text-base font-bold font-heading text-slate-800">Operational Escalation</h3>
              <p className="text-xs text-muted-foreground mt-1.5 max-w-xs mx-auto leading-relaxed">
                Are you sure you want to trigger an SLA escalation for shipment <span className="font-bold text-slate-800 font-mono">{Object.keys(selectedRowIds).filter(key => selectedRowIds[key]).join(", ")}</span>? This broadcasts a high-priority alarm to regional supervisors.
              </p>
            </div>

            <div className="flex gap-2.5 pt-3 w-full">
              <Button
                variant="outline"
                className="flex-1 font-semibold text-xs h-10"
                onClick={() => setEscalateOpen(false)}
                id="btn-cancel-escalate"
              >
                Cancel
              </Button>
              <Button
                className="flex-1 font-semibold text-xs bg-red-600 hover:bg-red-700 text-white h-10"
                onClick={confirmEscalate}
                id="btn-confirm-escalate"
              >
                Yes, Escalate
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
