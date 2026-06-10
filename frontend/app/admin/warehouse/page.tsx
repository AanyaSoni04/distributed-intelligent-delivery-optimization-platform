"use client";

import React, { useState, useMemo } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Search,
  Warehouse,
  TrendingUp,
  Percent,
  Users,
  MapPin,
  ChevronRight,
  Download,
  Edit,
  Activity,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Layers,
  Plus,
  Minus
} from "lucide-react";

// Hub Type Definition
interface HubDetails {
  id: string;
  name: string;
  code: string;
  location: string;
  region: string;
  capacity: string;
  capacityVal: number;
  utilization: number;
  activeDeliveries: number;
  driverCount: number;
  locationLink: string;
  turnoverRate: string;
  turnoverDiff: string;
  dockToStock: string;
  dockToStockStatus: "Optimal" | "Action Required" | "Stable";
  sla: string;
  avgEta: string;
  status: "Operational" | "High Load" | "Maintenance";
  mapTop: number; // percentage coordinate
  mapLeft: number; // percentage coordinate
}

const HUB_DATA: HubDetails[] = [
  {
    id: "WH-MUM-01",
    name: "Mumbai Gateway Hub",
    code: "MH-04",
    location: "Navi Mumbai, MH",
    region: "Mumbai",
    capacity: "120,000 units",
    capacityVal: 120000,
    utilization: 82,
    activeDeliveries: 412,
    driverCount: 148,
    locationLink: "Navi Mumbai, SEZ Zone 2",
    turnoverRate: "14.5 Days",
    turnoverDiff: "+2.1%",
    dockToStock: "3.8 Hours",
    dockToStockStatus: "Optimal",
    sla: "96.5%",
    avgEta: "54m",
    status: "Operational",
    mapTop: 59,
    mapLeft: 30
  },
  {
    id: "WH-DEL-04",
    name: "Okhla Distribution Center",
    code: "DL-01",
    location: "South Delhi, DL",
    region: "Delhi NCR",
    capacity: "95,000 units",
    capacityVal: 95000,
    utilization: 94,
    activeDeliveries: 856,
    driverCount: 124,
    locationLink: "Okhla Phase III, Industrial Area",
    turnoverRate: "11.2 Days",
    turnoverDiff: "+4.5%",
    dockToStock: "2.1 Hours",
    dockToStockStatus: "Optimal",
    sla: "98.2%",
    avgEta: "42m",
    status: "High Load",
    mapTop: 28,
    mapLeft: 46
  },
  {
    id: "WH-BLR-02",
    name: "Whitefield Fulfilment Hub",
    code: "KA-12",
    location: "Bengaluru, KA",
    region: "Bengaluru",
    capacity: "110,000 units",
    capacityVal: 110000,
    utilization: 65,
    activeDeliveries: 224,
    driverCount: 98,
    locationLink: "Whitefield, ITPL Main Road",
    turnoverRate: "16.8 Days",
    turnoverDiff: "-1.2%",
    dockToStock: "4.2 Hours",
    dockToStockStatus: "Stable",
    sla: "91.0%",
    avgEta: "68m",
    status: "Operational",
    mapTop: 76,
    mapLeft: 42
  },
  {
    id: "WH-HYD-09",
    name: "HITEC City Logistics Yard",
    code: "TS-02",
    location: "Hyderabad, TS",
    region: "Hyderabad",
    capacity: "60,000 units",
    capacityVal: 60000,
    utilization: 45,
    activeDeliveries: 112,
    driverCount: 52,
    locationLink: "HITEC City, Phase II Gachibowli",
    turnoverRate: "19.1 Days",
    turnoverDiff: "-0.5%",
    dockToStock: "5.5 Hours",
    dockToStockStatus: "Action Required",
    sla: "94.8%",
    avgEta: "48m",
    status: "Maintenance",
    mapTop: 66,
    mapLeft: 45
  },
  {
    id: "WH-MAA-07",
    name: "Chennai Port Gateway",
    code: "TN-09",
    location: "Chennai, TN",
    region: "Chennai",
    capacity: "80,000 units",
    capacityVal: 80000,
    utilization: 72,
    activeDeliveries: 195,
    driverCount: 85,
    locationLink: "Royapuram, Port Trust Area",
    turnoverRate: "15.2 Days",
    turnoverDiff: "+1.8%",
    dockToStock: "3.5 Hours",
    dockToStockStatus: "Optimal",
    sla: "97.1%",
    avgEta: "45m",
    status: "Operational",
    mapTop: 77,
    mapLeft: 50
  }
];

export default function WarehouseManagementPage() {
  const breadcrumbs = [
    { label: "Admin", href: "/admin/command-center" },
    { label: "Warehouse Management" }
  ];

  // 1. Interactive States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedHubId, setSelectedHubId] = useState("WH-MUM-01");
  const [mapZoom, setMapZoom] = useState(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // 2. Filter list of hubs based on query
  const filteredHubs = useMemo(() => {
    return HUB_DATA.filter(hub => 
      hub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hub.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hub.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hub.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Find currently selected hub
  const activeHub = useMemo(() => {
    return HUB_DATA.find(hub => hub.id === selectedHubId) || HUB_DATA[0];
  }, [selectedHubId]);

  const selectHub = (id: string, name: string) => {
    setSelectedHubId(id);
    showToast(`Focused on Hub: ${name}`);
  };

  return (
    <PageContainer
      title="Warehouse & Hub Management"
      subtitle="Inventory sorting hubs, package ingestion, and truck loading bay status"
      breadcrumbs={breadcrumbs}
      actions={
        <div className="relative w-64 md:w-80">
          <Search className="absolute top-2.5 left-3 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search warehouses by name, code or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-full rounded-md border border-input bg-card pl-9 pr-3 text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all font-sans"
            id="input-warehouse-search"
          />
        </div>
      }
    >
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-lg shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <CheckCircle2 className="size-4 text-green-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="space-y-6 font-sans pb-12">
        
        {/* 1. Warehouse KPI Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Card 1: Total Warehouses */}
          <div className="bg-card p-5 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between">
            <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider mb-1">
              Total Warehouses
            </p>
            <div className="flex items-end justify-between mt-2">
              <span className="text-3xl font-heading font-black text-foreground">42</span>
              <div className="size-8 rounded bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <Warehouse className="size-4.5" />
              </div>
            </div>
          </div>

          {/* Card 2: Active Hubs */}
          <div className="bg-card p-5 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between">
            <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider mb-1">
              Active Hubs
            </p>
            <div className="flex items-end justify-between mt-2">
              <span className="text-3xl font-heading font-black text-foreground">18</span>
              <div className="size-8 rounded bg-gold/15 flex items-center justify-center text-gold-foreground group-hover:bg-gold group-hover:text-white transition-colors">
                <Activity className="size-4.5" />
              </div>
            </div>
          </div>

          {/* Card 3: Active Deliveries */}
          <div className="bg-card p-5 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between">
            <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider mb-1">
              Active Deliveries
            </p>
            <div className="flex items-end justify-between mt-2">
              <span className="text-3xl font-heading font-black text-foreground">1,240</span>
              <div className="flex items-center gap-1 text-green-600 font-bold text-xs pb-1 shrink-0">
                <TrendingUp className="size-3.5" />
                <span>+12%</span>
              </div>
            </div>
          </div>

          {/* Card 4: Capacity Utilization */}
          <div className="bg-card p-5 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between">
            <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider mb-1">
              Capacity Utilization
            </p>
            <div className="flex flex-col gap-2 mt-2">
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-heading font-black text-foreground">78%</span>
                <span className="text-[10px] text-muted-foreground">Threshold: 85%</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: "78%" }} />
              </div>
            </div>
          </div>

          {/* Card 5: Drivers Assigned */}
          <div className="bg-card p-5 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between">
            <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider mb-1">
              Drivers Assigned
            </p>
            <div className="flex items-end justify-between mt-2">
              <span className="text-3xl font-heading font-black text-foreground">4,800</span>
              <div className="size-8 rounded bg-slate-100 flex items-center justify-center text-slate-500">
                <Users className="size-4.5" />
              </div>
            </div>
          </div>
        </section>

        {/* 2 & 3 & 4. Main Map and details layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Layout (Network Map & Regional performance) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 2. National Hub Network Map */}
            <section className="bg-card border border-border rounded-2xl overflow-hidden relative min-h-[440px] shadow-sm">
              <div className="absolute top-6 left-6 z-10 bg-white/90 backdrop-blur-md p-4 rounded-xl border border-white shadow-lg max-w-xs">
                <h3 className="text-sm font-bold text-primary mb-0.5">National Network Density</h3>
                <p className="text-[10px] text-muted-foreground leading-normal">Live visual grid. Click any pulsing node to select and inspect the warehouse.</p>
              </div>

              {/* Map Zoom Controls */}
              <div className="absolute top-6 right-6 z-10 flex flex-col gap-1.5">
                <button
                  onClick={() => setMapZoom(prev => Math.min(prev + 0.2, 1.8))}
                  className="h-8 w-8 rounded-lg bg-white/95 backdrop-blur-md flex items-center justify-center text-slate-700 shadow border border-slate-200"
                  id="btn-map-zoom-in-wh"
                  title="Zoom In"
                >
                  <Plus className="size-4" />
                </button>
                <button
                  onClick={() => setMapZoom(prev => Math.max(prev - 0.2, 1))}
                  className="h-8 w-8 rounded-lg bg-white/95 backdrop-blur-md flex items-center justify-center text-slate-700 shadow border border-slate-200"
                  id="btn-map-zoom-out-wh"
                  title="Zoom Out"
                >
                  <Minus className="size-4" />
                </button>
              </div>

              <div className="w-full h-full min-h-[440px] bg-slate-100 overflow-hidden relative flex items-center justify-center">
                <img
                  alt="Logistics Map of India Subcontinent"
                  className="w-full h-full object-cover opacity-80 transition-transform duration-300 origin-center"
                  style={{ transform: `scale(${mapZoom})` }}
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuApIyTMsA6_lLEKXFDMxLWj-ejDTJiBz6E4_oWPT7NTBYHZqr-udrWO_7L8zEkhjxV-Z3nxbcRlO1we7NDdGV3KYohakDIKpuuHaQZ9KH9AnMv0tw_Wwia5L9bWjSi9OUdz2CwtMt86jPnonoPRtnk2sIDvkcv70FF13YXFNcg0B8tTbu_quwk7mV7k4xrc1vddK7GiSN2O-bV2QK3Z5q4LOh0Jpkt2UDHTNM-4lRr3DQyqoV5AyyQMFRgBO94MV-JdjSnW53OB98Q"
                />

                {/* Map dynamic pins */}
                {HUB_DATA.map((hub) => (
                  <button
                    key={hub.id}
                    onClick={() => selectHub(hub.id, hub.name)}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                    style={{ top: `${hub.mapTop}%`, left: `${hub.mapLeft}%` }}
                    id={`btn-map-pin-${hub.id}`}
                  >
                    <div className={cn(
                      "w-4 h-4 rounded-full flex items-center justify-center transition-all duration-300 relative",
                      selectedHubId === hub.id 
                        ? "bg-primary text-white scale-125 border border-white" 
                        : hub.status === "High Load" 
                          ? "bg-red-500 border border-white"
                          : hub.status === "Maintenance"
                            ? "bg-amber-500 border border-white"
                            : "bg-primary border border-white"
                    )}>
                      {selectedHubId === hub.id && <span className="absolute inset-0 rounded-full bg-primary/40 animate-ping" />}
                    </div>
                    {/* Hover Card */}
                    <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-slate-900/90 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-20">
                      {hub.name} ({hub.code})
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* 5. Regional Hub Performance */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-heading font-bold text-foreground">
                  Regional Hub Performance
                </h3>
                <span className="text-[10px] font-bold uppercase text-primary tracking-widest font-sans">
                  SLA Target: 95.0%
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
                {HUB_DATA.map((hub) => {
                  const isSelected = selectedHubId === hub.id;
                  const complianceNum = parseFloat(hub.sla.replace("%", ""));
                  const isSlaWarning = complianceNum < 95.0;

                  return (
                    <div
                      key={hub.id}
                      onClick={() => selectHub(hub.id, hub.name)}
                      className={cn(
                        "bg-card p-4 rounded-xl border shadow-sm transition-all duration-200 cursor-pointer select-none",
                        isSelected 
                          ? "border-primary bg-primary/5 ring-1 ring-primary/20 scale-[1.02]" 
                          : "border-border hover:border-slate-300 hover:bg-slate-50/30"
                      )}
                    >
                      <h4 className="text-xs font-bold text-slate-800 truncate">{hub.region}</h4>
                      <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{hub.code}</p>
                      
                      <div className="space-y-2 mt-4 text-[10px]">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">SLA</span>
                          <span className={cn(
                            "font-bold",
                            isSlaWarning ? "text-amber-600" : "text-green-600"
                          )}>
                            {hub.sla}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Avg ETA</span>
                          <span className="font-bold text-slate-800">{hub.avgEta}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Right Layout (Sidebar Hub focused details & Efficiency) */}
          <aside className="lg:col-span-4 space-y-6">
            
            {/* 3. Hub Focus Details */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm relative overflow-hidden">
              {/* Visual Indicator */}
              <div className={cn(
                "absolute top-0 left-0 right-0 h-1 bg-gradient-to-r",
                activeHub.status === "High Load" 
                  ? "from-red-500 to-red-400" 
                  : activeHub.status === "Maintenance"
                    ? "from-amber-500 to-amber-400"
                    : "from-primary/50 to-primary"
              )} />

              <h3 className="text-base font-heading font-bold text-foreground mb-5">
                Hub Focused Details
              </h3>

              <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                <div className="flex items-center gap-4.5 mb-4">
                  <div className="size-11 bg-primary/10 text-primary flex items-center justify-center rounded-lg shrink-0">
                    <Warehouse className="size-5.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide mb-0.5">Active Inspection</p>
                    <h4 className="text-xs font-bold text-slate-850 truncate">{activeHub.name} [{activeHub.code}]</h4>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-y-4 border-t border-slate-100 pt-4 text-xs font-medium font-sans">
                  <div>
                    <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-wide mb-0.5">Storage Capacity</p>
                    <p className="font-bold text-slate-800">{activeHub.capacity}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-wide mb-0.5">Daily Deliveries</p>
                    <p className="font-bold text-slate-800">{activeHub.activeDeliveries * 10} units</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-wide mb-0.5">Active Drivers</p>
                    <p className="font-bold text-slate-800">{activeHub.driverCount} Active</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-wide mb-0.5">Hub Location</p>
                    <p className="font-bold text-primary underline truncate cursor-help" onClick={() => showToast(`Opening map location for: ${activeHub.locationLink}`)}>
                      {activeHub.location}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Efficiency Metrics */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
              <h4 className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest font-sans">
                Efficiency Metrics
              </h4>
              
              <div className="space-y-3 font-sans">
                {/* Turnover Rate */}
                <div className="bg-slate-50/30 p-3.5 rounded-xl border border-slate-100 border-l-4 border-primary">
                  <p className="text-[9px] font-bold text-muted-foreground mb-1 uppercase tracking-wide">Turnover Rate</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-800">{activeHub.turnoverRate}</span>
                    <span className={cn(
                      "text-[9px] font-extrabold px-2 py-0.5 rounded-full shrink-0",
                      activeHub.turnoverDiff.startsWith("+") 
                        ? "bg-red-50 text-red-700" 
                        : "bg-green-50 text-green-700"
                    )}>
                      {activeHub.turnoverDiff}
                    </span>
                  </div>
                </div>

                {/* Dock-to-Stock */}
                <div className="bg-slate-50/30 p-3.5 rounded-xl border border-slate-100 border-l-4 border-gold">
                  <p className="text-[9px] font-bold text-muted-foreground mb-1 uppercase tracking-wide">Dock-to-Stock Time</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-800">{activeHub.dockToStock}</span>
                    <span className={cn(
                      "text-[9px] font-extrabold px-2 py-0.5 rounded-full shrink-0 uppercase tracking-wider",
                      activeHub.dockToStockStatus === "Optimal" 
                        ? "bg-green-50 text-green-700" 
                        : activeHub.dockToStockStatus === "Stable"
                          ? "bg-slate-100 text-slate-600"
                          : "bg-amber-50 text-amber-700"
                    )}>
                      {activeHub.dockToStockStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Lower Assets Table */}
        <section className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden pb-4">
          <div className="px-6 py-5 flex items-center justify-between border-b border-border bg-slate-50/50">
            <h3 className="font-heading text-base font-bold text-foreground">
              Active Inventory Assets
            </h3>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => showToast("Exporting Inventory Assets as CSV...")}
                className="h-8 text-xs font-semibold"
                id="btn-export-csv"
              >
                Export CSV
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => showToast("Opening Bulk Operations panel...")}
                className="h-8 text-xs font-semibold"
                id="btn-bulk-edit"
              >
                Bulk Edit
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            {filteredHubs.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-xs font-sans">
                No warehouses match your search query. Try searching for "Mumbai" or "WH".
              </div>
            ) : (
              <table className="w-full text-left border-collapse font-sans text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-bold text-[10px] uppercase tracking-wider border-b border-border">
                    <th className="px-6 py-3.5">Hub ID</th>
                    <th className="px-6 py-3.5">Name</th>
                    <th className="px-6 py-3.5">Location</th>
                    <th className="px-6 py-3.5">Capacity</th>
                    <th className="px-6 py-3.5">Utilization</th>
                    <th className="px-6 py-3.5">Active Deliveries</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border font-medium">
                  {filteredHubs.map((hub) => {
                    const isSelected = selectedHubId === hub.id;
                    return (
                      <tr
                        key={hub.id}
                        onClick={() => selectHub(hub.id, hub.name)}
                        className={cn(
                          "cursor-pointer hover:bg-slate-50/55 transition-colors group",
                          isSelected ? "bg-primary/5 font-semibold" : ""
                        )}
                      >
                        <td className="px-6 py-4 font-mono font-bold text-slate-700">{hub.id}</td>
                        <td className="px-6 py-4 font-semibold text-slate-800">{hub.name}</td>
                        <td className="px-6 py-4 text-slate-500">{hub.location}</td>
                        <td className="px-6 py-4 text-slate-500">{hub.capacity}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 max-w-[120px]">
                            <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                              <div 
                                className={cn(
                                  "h-full rounded-full",
                                  hub.utilization >= 90 
                                    ? "bg-red-500" 
                                    : hub.utilization <= 50 
                                      ? "bg-gold" 
                                      : "bg-primary"
                                )} 
                                style={{ width: `${hub.utilization}%` }} 
                              />
                            </div>
                            <span className={cn(
                              "text-[10px] font-bold tracking-tighter shrink-0",
                              hub.utilization >= 90 ? "text-red-600" : ""
                            )}>
                              {hub.utilization}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-700 font-bold">{hub.activeDeliveries}</td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide",
                            hub.status === "Operational" 
                              ? "bg-green-50 text-green-700 border border-green-100" 
                              : hub.status === "High Load" 
                                ? "bg-red-50 text-red-700 border border-red-100" 
                                : "bg-slate-150 text-slate-600 border border-slate-200"
                          )}>
                            {hub.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <ChevronRight className={cn(
                            "size-4 text-slate-350 transition-colors group-hover:text-primary",
                            isSelected ? "text-primary translate-x-0.5" : ""
                          )} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>
    </PageContainer>
  );
}
