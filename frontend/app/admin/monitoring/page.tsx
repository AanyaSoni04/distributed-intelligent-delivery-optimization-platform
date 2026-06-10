"use client";

import React, { useState, useEffect, useRef } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Gauge,
  ArrowUpDown,
  AlertTriangle,
  Cpu,
  RefreshCw,
  Clock,
  Truck,
  MapPin,
  CheckCircle2,
  Server,
  Database,
  Layers,
  HardDrive,
  Info,
  ChevronDown,
  TrendingUp
} from "lucide-react";
import {
  BarChart,
  Bar,
  ResponsiveContainer
} from "recharts";

interface KafkaEvent {
  time: string;
  type: string;
  detail: string;
  colorClass: string;
}

interface SystemLog {
  id: string;
  event: string;
  desc: string;
  time: string;
  status: "SUCCESS" | "INFO" | "WARNING" | "UPDATED";
  icon: React.ComponentType<any>;
}

export default function SystemMonitoringPage() {
  const [mounted, setMounted] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const kafkaScrollRef = useRef<HTMLDivElement>(null);

  // 1. Live Updating Kafka Streams Ticker
  const [kafkaEvents, setKafkaEvents] = useState<KafkaEvent[]>([
    { time: "[09:42:11]", type: "DELIVERY_CREATED", detail: "AWB-129482", colorClass: "text-slate-400" },
    { time: "[09:42:15]", type: "DRIVER_ASSIGNED", detail: "Unit-772", colorClass: "text-primary-foreground/70" },
    { time: "[09:42:20]", type: "LOCATION_UPDATED", detail: "Driver Sarah K. (V-04) ping", colorClass: "text-slate-400" },
    { time: "[09:42:25]", type: "ETA_UPDATED", detail: "AWB-129482 (+12m delay)", colorClass: "text-gold" }
  ]);

  // Simulated sparkline chart for Request Throughput
  const throughputData = [
    { value: 12 }, { value: 18 }, { value: 15 }, { value: 24 },
    { value: 30 }, { value: 22 }, { value: 28 }, { value: 35 },
    { value: 20 }, { value: 40 }, { value: 32 }, { value: 38 }
  ];

  // System Events logs
  const [logs, setLogs] = useState<SystemLog[]>([
    {
      id: "log-1",
      event: "DELIVERY_CREATED",
      desc: "AWB-129482 assigned to Cluster-A",
      time: "09:42:11 AM",
      status: "SUCCESS",
      icon: Truck
    },
    {
      id: "log-2",
      event: "DRIVER_ASSIGNED",
      desc: "Unit-772 assigned to Delivery #ALX-8902",
      time: "09:42:15 AM",
      status: "SUCCESS",
      icon: UserIcon
    },
    {
      id: "log-3",
      event: "LOCATION_UPDATED",
      desc: "Driver Sarah K. (V-04) coordinate ping received",
      time: "09:42:20 AM",
      status: "INFO",
      icon: MapPin
    },
    {
      id: "log-4",
      event: "ETA_UPDATED",
      desc: "Delivery #ALX-8899 recalibrated (+12m)",
      time: "09:42:25 AM",
      status: "UPDATED",
      icon: Clock
    }
  ]);

  useEffect(() => {
    setMounted(true);

    // Kafka dynamic live logs generator interval
    const interval = setInterval(() => {
      const logPool = [
        { type: "MSG_RECEIVED", detail: `TX-${Math.floor(100 + Math.random() * 900)} type=ORDER_EVENT`, colorClass: "text-slate-400" },
        { type: "PRODUCER_ACK", detail: `offset=${Math.floor(800000 + Math.random() * 90000)} partitions=2`, colorClass: "text-gold" },
        { type: "CONSUMER_COMMIT", detail: "grp=log-worker lag=2ms", colorClass: "text-blue-400" },
        { type: "SOCKET_PING", detail: `latency=${Math.floor(10 + Math.random() * 30)}ms`, colorClass: "text-slate-400" }
      ];

      const chosen = logPool[Math.floor(Math.random() * logPool.length)];
      const now = new Date();
      const timeStr = `[${now.toTimeString().split(" ")[0]}]`;
      
      setKafkaEvents(prev => {
        const next = [...prev, { time: timeStr, type: chosen.type, detail: chosen.detail, colorClass: chosen.colorClass }];
        if (next.length > 25) next.shift(); // Keep only last 25 elements
        return next;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  // Scroll to bottom of Kafka stream
  useEffect(() => {
    if (kafkaScrollRef.current) {
      kafkaScrollRef.current.scrollTop = kafkaScrollRef.current.scrollHeight;
    }
  }, [kafkaEvents]);

  // Refresh trigger handler
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      // Randomize API Latency or log order for interactivity
      setLogs(prev => [
        {
          id: `log-${Date.now()}`,
          event: "HEALTH_CHECK_OK",
          desc: "System monitoring gateway checks passed.",
          time: new Date().toLocaleTimeString(),
          status: "SUCCESS",
          icon: CheckCircle2
        },
        ...prev
      ]);
    }, 1000);
  };

  return (
    <PageContainer
      title="System Health & Latency"
      subtitle="Infrastructure health, system logs, API limits, and services state"
      breadcrumbs={[{ label: "Admin", href: "/admin/command-center" }, { label: "System Monitoring" }]}
      actions={
        <div className="flex items-center gap-3">
          {/* Status Badge */}
          <div className="px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full flex items-center gap-2 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-sans text-xs font-bold uppercase tracking-wider">All Systems Operational</span>
          </div>

          <Button 
            onClick={handleRefresh} 
            disabled={isRefreshing}
            size="sm" 
            className="gap-2 font-semibold text-xs shadow-md"
          >
            <RefreshCw className={cn("size-3.5", isRefreshing ? "animate-spin" : "")} />
            <span>Refresh Data</span>
          </Button>
        </div>
      }
    >
      <div className="space-y-8 pb-12">

        {/* Top Level Gauges (KPI Cards Grid) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* API Latency */}
          <div className="bg-card border border-border p-6 rounded-2xl flex flex-col justify-between group transition-all hover:bg-slate-50 duration-200 shadow-sm min-h-[160px]">
            <div className="flex justify-between items-start">
              <span className="text-muted-foreground font-sans text-xs font-bold uppercase tracking-wider">Avg API Latency</span>
              <Gauge className="size-5 text-primary" />
            </div>
            <div className="mt-4">
              <div className="text-4xl font-heading font-extrabold text-foreground">42ms</div>
              <div className="flex items-center gap-1 mt-1 text-emerald-600 font-medium">
                <TrendingUp className="size-3.5" />
                <span className="text-xs font-sans">12% vs last hour</span>
              </div>
            </div>
            <div className="mt-5 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: "42%" }}></div>
            </div>
          </div>

          {/* Request Throughput */}
          <div className="bg-card border border-border p-6 rounded-2xl flex flex-col justify-between group transition-all hover:bg-slate-50 duration-200 shadow-sm min-h-[160px]">
            <div className="flex justify-between items-start">
              <span className="text-muted-foreground font-sans text-xs font-bold uppercase tracking-wider">Request Throughput</span>
              <ArrowUpDown className="size-5 text-primary/75" />
            </div>
            <div className="mt-4">
              <div className="text-4xl font-heading font-extrabold text-foreground">
                8.4k<span className="text-sm font-sans font-normal text-muted-foreground ml-1">/s</span>
              </div>
              <span className="text-xs text-muted-foreground/70 block mt-1 font-sans">Stable system cluster load</span>
            </div>
            
            {/* Sparkline chart with Recharts */}
            <div className="mt-5 h-8 w-full shrink-0">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={throughputData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <Bar dataKey="value" fill="var(--primary-container)" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full w-full bg-slate-100 animate-pulse rounded" />
              )}
            </div>
          </div>

          {/* Error Rates */}
          <div className="bg-card border border-border p-6 rounded-2xl flex flex-col justify-between group transition-all hover:bg-slate-50 duration-200 shadow-sm min-h-[160px]">
            <div className="flex justify-between items-start">
              <span className="text-muted-foreground font-sans text-xs font-bold uppercase tracking-wider">Error Rate (5xx)</span>
              <AlertTriangle className="size-5 text-destructive" />
            </div>
            <div className="mt-4">
              <div className="text-4xl font-heading font-extrabold text-foreground">0.02%</div>
              <div className="flex items-center gap-1 mt-1 text-emerald-600 font-medium">
                <CheckCircle2 className="size-3.5" />
                <span className="text-xs font-sans">Below threshold (0.5%)</span>
              </div>
            </div>
            <div className="mt-5 flex justify-between items-end border-t border-slate-50 pt-2.5">
              <span className="text-[10px] font-mono text-muted-foreground font-bold">NOMINAL</span>
              <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></div>
            </div>
          </div>
        </section>

        {/* Event Logs & Kafka Stream (Asymmetric Grid) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Kafka Stream Viewer (Dark Monospace Terminal) */}
          <div className="lg:col-span-4 bg-slate-900 text-slate-100 p-6 rounded-2xl shadow-xl flex flex-col justify-between min-h-[300px]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-primary-foreground animate-ping" />
                <h3 className="font-mono text-xs uppercase tracking-widest text-primary-foreground font-bold">Kafka Monitoring</h3>
              </div>
              <span className="font-mono text-[9px] text-slate-500 font-semibold">TOPIC: DIDOP_MAIN</span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-mono mb-6">
              <div className="space-y-1">
                <div className="text-[9px] text-slate-500 uppercase font-bold">Events / Sec</div>
                <div className="text-base font-bold text-slate-200">1.2k/s</div>
              </div>
              <div className="space-y-1">
                <div className="text-[9px] text-slate-500 uppercase font-bold">Consumer Lag</div>
                <div className="text-base font-bold text-slate-200">12 ms</div>
              </div>
              <div className="space-y-1">
                <div className="text-[9px] text-slate-500 uppercase font-bold">Failed Msg</div>
                <div className="text-base font-bold text-emerald-400">0</div>
              </div>
              <div className="space-y-1">
                <div className="text-[9px] text-slate-500 uppercase font-bold">DLQ Retries</div>
                <div className="text-base font-bold text-emerald-400">0</div>
              </div>
            </div>

            {/* Scrollable ticker terminal */}
            <div 
              ref={kafkaScrollRef}
              className="flex-1 font-mono text-[10px] leading-relaxed overflow-y-auto max-h-[160px] space-y-1.5 border-t border-slate-800 pt-4 scroll-smooth"
            >
              {kafkaEvents.map((evt, idx) => (
                <div key={idx} className={cn("truncate flex gap-2.5", evt.colorClass)}>
                  <span className="text-slate-500 shrink-0">{evt.time}</span>
                  <span className="font-bold shrink-0">{evt.type}:</span>
                  <span className="text-slate-300 font-medium">{evt.detail}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Real-time Event Monitoring Log List */}
          <div className="lg:col-span-8 bg-card border border-border rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
            <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-slate-50/50">
              <h3 className="font-heading font-bold text-base text-foreground">Event Monitoring Log</h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => setLogs([])}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-[11px] font-semibold text-slate-600 rounded-lg transition-colors border border-slate-200"
                >
                  Clear
                </button>
                <button className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-[11px] font-semibold text-slate-600 rounded-lg transition-colors border border-slate-200">
                  Export .CSV
                </button>
              </div>
            </div>

            {/* Log event rows */}
            <div className="divide-y divide-slate-100 flex-grow">
              {logs.length === 0 ? (
                <div className="py-20 text-center">
                  <span className="text-xs font-bold text-slate-600 block">No system events logged</span>
                  <span className="text-[11px] text-muted-foreground block mt-0.5">Click Refresh Data to trigger ingestion.</span>
                </div>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="px-6 py-3.5 flex items-center justify-between group hover:bg-slate-50/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 border border-slate-200/50 shadow-inner">
                        <log.icon className="size-4.5" />
                      </div>
                      <div>
                        <div className="font-heading text-xs font-extrabold text-foreground">{log.event}</div>
                        <div className="text-[11px] text-muted-foreground font-sans mt-0.5">{log.desc}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-sans text-muted-foreground/60">{log.time}</div>
                      <div className={cn(
                        "text-[9px] font-mono font-bold mt-1",
                        log.status === "SUCCESS" ? "text-primary" : log.status === "UPDATED" ? "text-gold-foreground" : "text-slate-600"
                      )}>
                        {log.status}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Architecture Status */}
        <section className="mb-6">
          <h3 className="font-heading text-base font-bold text-foreground mb-4">Architecture Status</h3>
          <div className="bg-card border border-border rounded-xl p-4 flex flex-wrap gap-5 items-center justify-between shadow-sm">
            {[
              { name: "Delivery Service", ok: true },
              { name: "Driver Service", ok: true },
              { name: "Tracking Service", ok: true },
              { name: "Analytics Service", ok: true },
              { name: "Kafka Broker", ok: true },
              { name: "Redis Cluster", ok: true },
              { name: "PostgreSQL Master", ok: true }
            ].map((srv) => (
              <div key={srv.name} className="flex items-center gap-2 px-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shrink-0"></span>
                <span className="text-xs font-semibold text-slate-700 font-sans">{srv.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Service Intelligence */}
        <section className="space-y-6">
          <h3 className="font-heading text-lg font-bold text-foreground">Service Intelligence</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4.5">
            {/* Service 1 */}
            <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                <h4 className="font-sans font-bold text-xs text-foreground">Delivery Service</h4>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
              <div className="space-y-2 text-xs font-sans">
                <div className="flex justify-between"><span className="text-muted-foreground">Response</span><span className="font-mono font-bold text-slate-800">42ms</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Error Rate</span><span className="font-mono font-bold text-slate-800">0.01%</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Uptime</span><span className="font-mono font-bold text-emerald-600">99.99%</span></div>
              </div>
            </div>

            {/* Service 2 */}
            <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                <h4 className="font-sans font-bold text-xs text-foreground">Driver Service</h4>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
              <div className="space-y-2 text-xs font-sans">
                <div className="flex justify-between"><span className="text-muted-foreground">Response</span><span className="font-mono font-bold text-slate-800">38ms</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Error Rate</span><span className="font-mono font-bold text-slate-800">0.02%</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Uptime</span><span className="font-mono font-bold text-emerald-600">99.98%</span></div>
              </div>
            </div>

            {/* Service 3 */}
            <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                <h4 className="font-sans font-bold text-xs text-foreground">Tracking Service</h4>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
              <div className="space-y-2 text-xs font-sans">
                <div className="flex justify-between"><span className="text-muted-foreground">Response</span><span className="font-mono font-bold text-slate-800">55ms</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Error Rate</span><span className="font-mono font-bold text-slate-800">0.01%</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Uptime</span><span className="font-mono font-bold text-emerald-600">100.0%</span></div>
              </div>
            </div>

            {/* Service 4: Highlight / Gold Status Indicator */}
            <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                <h4 className="font-sans font-bold text-xs text-foreground">Assignment Service</h4>
                {/* Gold Highlight reserved for system intelligence exceptions */}
                <span className="w-2 h-2 rounded-full bg-gold"></span>
              </div>
              <div className="space-y-2 text-xs font-sans">
                <div className="flex justify-between"><span className="text-muted-foreground">Response</span><span className="font-mono font-bold text-slate-800">120ms</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Error Rate</span><span className="font-mono font-bold text-slate-800">0.05%</span></div>
                {/* Muted gold indicator */}
                <div className="flex justify-between"><span className="text-muted-foreground">Uptime</span><span className="font-mono font-bold text-gold-foreground">99.92%</span></div>
              </div>
            </div>

            {/* Service 5 */}
            <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                <h4 className="font-sans font-bold text-xs text-foreground">Analytics Service</h4>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
              <div className="space-y-2 text-xs font-sans">
                <div className="flex justify-between"><span className="text-muted-foreground">Response</span><span className="font-mono font-bold text-slate-800">210ms</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Error Rate</span><span className="font-mono font-bold text-slate-800">0.00%</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Uptime</span><span className="font-mono font-bold text-emerald-600">99.99%</span></div>
              </div>
            </div>
          </div>
        </section>

        {/* Infrastructure Status Cards */}
        <section className="space-y-6">
          <h3 className="font-heading text-lg font-bold text-foreground">Infrastructure Health</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Redis Cluster - Gold Highlight card */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6 border-b border-slate-50 pb-3">
                <div className="flex items-center gap-3">
                  <Cpu className="size-5 text-gold-foreground" />
                  <h4 className="font-heading font-bold text-sm text-foreground">Redis Cluster</h4>
                </div>
                {/* Gold indicator */}
                <span className="text-[10px] font-bold bg-gold/10 text-gold-foreground border border-gold/15 px-2.5 py-0.5 rounded uppercase font-sans">Healthy</span>
              </div>

              <div className="space-y-4 text-xs font-sans">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Cache Hit Rate</span>
                  <span className="font-mono font-bold text-slate-800">98.2%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Active Connections</span>
                  <span className="font-mono font-bold text-slate-800">1,402</span>
                </div>
                <div className="relative h-1.5 w-full bg-slate-100 rounded-full mt-6">
                  {/* Memory Usage filled in muted gold */}
                  <div className="absolute inset-y-0 left-0 bg-gold rounded-full" style={{ width: "64%" }} />
                  <div className="absolute -top-5.5 right-0 text-[10px] font-bold text-gold-foreground">Memory Usage: 64%</div>
                </div>
              </div>
            </div>

            {/* PostgreSQL Cluster */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6 border-b border-slate-50 pb-3">
                <div className="flex items-center gap-3">
                  <Database className="size-5 text-slate-600" />
                  <h4 className="font-heading font-bold text-sm text-foreground">PostgreSQL Master</h4>
                </div>
                <span className="text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-0.5 rounded uppercase font-sans">v15.2</span>
              </div>

              <div className="space-y-4 text-xs font-sans">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Query Latency</span>
                  <span className="font-mono font-bold text-slate-800">210ms</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Active Connections</span>
                  <span className="font-mono font-bold text-slate-800">82%</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-muted-foreground">Database Sync Load</span>
                  <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">NORMAL</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageContainer>
  );
}

// Minimal placeholder component for driver assignments log row
function UserIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
      />
    </svg>
  );
}
