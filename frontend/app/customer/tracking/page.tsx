"use client";

import React, { useState, useEffect, useRef } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Search,
  MapPin,
  Truck,
  CheckCircle2,
  Package,
  Clock,
  Navigation,
  Zap,
  Share2,
  HelpCircle,
  Star,
  MessageSquare,
  Phone,
  Download,
  Check,
  ChevronRight,
  Send,
  AlertCircle,
  Play,
  RotateCcw,
  Sparkles,
  Camera,
  X
} from "lucide-react";

// Types for Chat Messages
interface ChatMessage {
  sender: "system" | "driver" | "customer";
  time: string;
  text: string;
}

export default function CustomerTrackingPage() {
  const breadcrumbs = [
    { label: "Customer", href: "/customer/tracking" },
    { label: "Delivery Tracking" }
  ];

  // 1. Core State Management
  const [searchQuery, setSearchQuery] = useState("DID-2026-10231");
  const [activeShipmentId, setActiveShipmentId] = useState("DID-2026-10231");
  const [searchError, setSearchError] = useState(false);

  // Simulation states
  const [isDelivered, setIsDelivered] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationProgress, setSimulationProgress] = useState(30); // Start at 30% progress (In Transit)
  const simulationInterval = useRef<NodeJS.Timeout | null>(null);

  // Interaction modals/drawers
  const [chatOpen, setChatOpen] = useState(false);
  const [callOpen, setCallOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Chat message logs
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { sender: "system", time: "22:35 IST", text: "Direct channel established with Courier Sarah K." },
    { sender: "driver", time: "22:36 IST", text: "Hi! I have loaded your package from Central Hub A-12 and I'm en-route. Please let me know if there are any specific gate instructions!" }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, chatOpen]);

  // Simulation Runner
  useEffect(() => {
    if (isSimulating) {
      simulationInterval.current = setInterval(() => {
        setSimulationProgress((prev) => {
          if (prev >= 100) {
            clearInterval(simulationInterval.current!);
            setIsSimulating(false);
            setIsDelivered(true);
            showToast("Delivery complete! Proof of Delivery is now available.");
            return 100;
          }
          return prev + 2;
        });
      }, 500);
    } else {
      if (simulationInterval.current) {
        clearInterval(simulationInterval.current);
      }
    }

    return () => {
      if (simulationInterval.current) {
        clearInterval(simulationInterval.current);
      }
    };
  }, [isSimulating]);

  // Sync isDelivered state with progress
  useEffect(() => {
    if (isDelivered) {
      setSimulationProgress(100);
    } else if (simulationProgress === 100) {
      setSimulationProgress(30);
    }
  }, [isDelivered]);

  // 2. Helper functions
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanQuery = searchQuery.trim().toUpperCase();
    if (cleanQuery === "DID-2026-10231" || cleanQuery === "2026-10231" || cleanQuery === "10231") {
      setActiveShipmentId("DID-2026-10231");
      setSearchError(false);
      showToast("Shipment found: DID-2026-10231 loaded.");
    } else {
      setSearchError(true);
      showToast("Shipment ID not found in simulation database.");
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const timestamp = new Date().toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    }) + " IST";

    const updatedMessages = [
      ...chatMessages,
      { sender: "customer" as const, time: timestamp, text: newMessage }
    ];
    setChatMessages(updatedMessages);
    setNewMessage("");

    // Simulate driver reply after 1.5 seconds
    setTimeout(() => {
      const driverReplies = [
        "Sure, copy that! Arriving in a couple of minutes.",
        "Got it! I am navigating around some lane delays but ETA remains stable.",
        "I'm close to the entrance. Heading inside the gate now.",
        "No problem at all! I will leave it by the reception desk as requested.",
        "Perfect, thanks for the update! See you shortly."
      ];
      const randomReply = driverReplies[Math.floor(Math.random() * driverReplies.length)];
      setChatMessages((prev) => [
        ...prev,
        { sender: "driver" as const, time: timestamp, text: randomReply }
      ]);
    }, 1500);
  };

  const copyShareLink = () => {
    const shareUrl = `${window.location.origin}/customer/tracking?id=${activeShipmentId}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      showToast("Tracking link copied to clipboard!");
      setShareOpen(false);
    }).catch(() => {
      showToast("Failed to copy link. Please copy manually.");
    });
  };

  // Interpolate Map vehicle marker location based on simulation progress
  // Start marker is at 33% left, 25% top
  // End marker is at 75% left, 66.6% top
  const startTop = 25;
  const startLeft = 33;
  const endTop = 66.6;
  const endLeft = 75;

  const vehicleTop = startTop + (endTop - startTop) * (simulationProgress / 100);
  const vehicleLeft = startLeft + (endLeft - startLeft) * (simulationProgress / 100);

  // Dynamic calculations based on simulation progress
  const initialDistance = 4.2; // km
  const currentDistance = isDelivered 
    ? 0 
    : Math.max(0, parseFloat((initialDistance * (1 - simulationProgress / 100)).toFixed(2)));
  
  const currentSpeed = isDelivered 
    ? 0 
    : isSimulating 
      ? Math.floor(25 + Math.random() * 8) 
      : 28;

  const currentETA = isDelivered 
    ? "Delivered" 
    : simulationProgress > 90 
      ? "Arriving Now" 
      : "23:15 IST";

  return (
    <PageContainer
      title="Delivery Tracking"
      subtitle="Follow your packages progress and estimate arrival times in real-time"
      breadcrumbs={breadcrumbs}
      actions={
        <form onSubmit={handleSearch} className="relative flex items-center gap-2">
          <div className="relative">
            <Search className="absolute top-3 left-3 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Enter ID (DID-2026-10231)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-64 rounded-md border border-input bg-card pl-9 pr-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all font-sans"
              id="input-tracking-search"
            />
          </div>
          <Button type="submit" size="sm" className="h-10 text-sm font-semibold" id="btn-tracking-search-submit">
            Search
          </Button>
        </form>
      }
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-lg shadow-xl flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Check className="size-4 text-green-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      {searchError ? (
        <div className="border border-dashed border-border rounded-xl p-12 text-center bg-card flex flex-col items-center justify-center max-w-xl mx-auto my-12">
          <AlertCircle className="size-12 text-destructive mb-4 animate-bounce" />
          <h3 className="text-base font-bold text-foreground font-heading mb-2">Shipment Not Found</h3>
          <p className="text-xs text-muted-foreground font-sans max-w-sm mb-6">
            The shipment ID you requested is not active. Please search for the active mock shipment <span className="font-bold text-primary">DID-2026-10231</span> to view the interactive tracking simulator.
          </p>
          <Button 
            variant="outline"
            onClick={() => {
              setSearchQuery("DID-2026-10231");
              setActiveShipmentId("DID-2026-10231");
              setSearchError(false);
            }}
            id="btn-error-reset-search"
          >
            Load Mock Shipment
          </Button>
        </div>
      ) : (
        <div className="space-y-6 max-w-7xl mx-auto font-sans pb-12">
          
          {/* Simulator Control Panel (Float/Sticky banner at top for easy testing) */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="size-9 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <Sparkles className="size-4.5" />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-sans">Interactive Simulation Controller</h4>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-tight">
                  Control the shipment lifecycle states and watch the map, summary, and timeline update in real time.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <Button
                variant={isSimulating ? "destructive" : "default"}
                size="sm"
                onClick={() => {
                  if (isDelivered) {
                    setIsDelivered(false);
                    setSimulationProgress(30);
                  }
                  setIsSimulating(!isSimulating);
                }}
                className="gap-1.5 h-8 text-xs font-semibold"
                id="btn-simulate-route"
              >
                {isSimulating ? (
                  <>
                    <X className="size-3.5" />
                    <span>Pause Route</span>
                  </>
                ) : (
                  <>
                    <Play className="size-3.5 fill-current" />
                    <span>{isDelivered ? "Restart Simulation" : "Simulate Courier Movement"}</span>
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsSimulating(false);
                  setIsDelivered(false);
                  setSimulationProgress(30);
                  showToast("Simulation reset back to In-Transit state.");
                }}
                className="gap-1.5 h-8 text-xs font-semibold"
                id="btn-reset-simulation"
              >
                <RotateCcw className="size-3.5" />
                <span>Reset Route</span>
              </Button>
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded px-2.5 py-1 h-8 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={isDelivered}
                  onChange={(e) => {
                    setIsSimulating(false);
                    setIsDelivered(e.target.checked);
                    if (e.target.checked) {
                      setSimulationProgress(100);
                      showToast("Status updated to Delivered.");
                    } else {
                      setSimulationProgress(30);
                      showToast("Status updated to In Transit.");
                    }
                  }}
                  className="rounded text-primary focus:ring-primary size-3.5"
                  id="chk-complete-delivery"
                />
                <span>Complete Delivery</span>
              </label>
            </div>
          </div>

          {/* 1. Delivery Header */}
          <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white border border-border p-6 rounded-2xl shadow-sm">
            <div>
              <p className="text-sm font-medium uppercase tracking-wide text-gold mb-1 font-sans">
                Logistics Reference
              </p>
              <h2 className="font-sans text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tabular-nums">
                {activeShipmentId}
              </h2>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <span className={cn(
                  "px-3.5 py-1 text-sm font-semibold tracking-wider rounded-full flex items-center gap-1.5 transition-colors duration-300",
                  isDelivered 
                    ? "bg-green-50 text-green-800 border border-green-200/60"
                    : "bg-primary/10 text-primary border border-primary/20"
                )}>
                  {!isDelivered && <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />}
                  {isDelivered ? "DELIVERED" : "IN TRANSIT"}
                </span>
                <span className="text-muted-foreground text-sm font-medium">
                  Last Updated: <span className="font-semibold text-foreground tabular-nums">22:45 IST</span>
                </span>
              </div>
            </div>
            
            <div className="flex gap-2.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShareOpen(true)}
                className="flex items-center gap-2 h-10 border-border bg-slate-50 text-slate-700 text-sm font-semibold"
                id="btn-share-link"
              >
                <Share2 className="size-4" />
                <span>Share Link</span>
              </Button>
              <Button
                size="sm"
                onClick={() => setSupportOpen(true)}
                className="flex items-center gap-2 h-10 text-sm font-semibold shadow-sm"
                id="btn-get-help"
              >
                <HelpCircle className="size-4" />
                <span>Get Help</span>
              </Button>
            </div>
          </section>

          {/* 2. Summary Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* ETA Card */}
            <div className="bg-card p-5 rounded-xl border-l-4 border-primary/20 shadow-sm flex flex-col justify-between max-w-full">
              <p className="text-sm uppercase tracking-wide font-medium text-muted-foreground font-sans">
                Current ETA
              </p>
              <p className="text-3xl md:text-4xl lg:text-5xl font-bold font-sans text-foreground tabular-nums mt-1">
                {currentETA}
              </p>
              <div className="mt-2 text-xs font-semibold text-green-700">
                {isDelivered ? "Fulfillment Completed" : "On Schedule"}
              </div>
            </div>

            {/* Distance Remaining Card */}
            <div className="bg-card p-5 rounded-xl border-l-4 border-gold/20 shadow-sm flex flex-col justify-between max-w-full">
              <p className="text-sm uppercase tracking-wide font-medium text-muted-foreground font-sans">
                Distance Remaining
              </p>
              <p className="text-3xl md:text-4xl lg:text-5xl font-bold font-sans text-foreground tabular-nums mt-1">
                {currentDistance} km
              </p>
              <div className="mt-2 text-xs text-muted-foreground font-medium">
                {isDelivered ? "At Destination" : "Through Urban Route 4"}
              </div>
            </div>

            {/* Driver Card */}
            <div className="bg-card p-5 rounded-xl border-l-4 border-slate-300 shadow-sm flex flex-col justify-between max-w-full">
              <p className="text-sm uppercase tracking-wide font-medium text-muted-foreground font-sans">
                Driver
              </p>
              <p className="text-3xl md:text-4xl lg:text-5xl font-bold font-sans text-foreground mt-1">
                Sarah K.
              </p>
              <div className="mt-2 text-xs text-muted-foreground font-medium font-sans">
                Vehicle ID: V-04
              </div>
            </div>

            {/* Priority Card */}
            <div className="bg-card p-5 rounded-xl border-l-4 border-primary/20 shadow-sm flex flex-col justify-between max-w-full">
              <p className="text-sm uppercase tracking-wide font-medium text-muted-foreground font-sans">
                Priority
              </p>
              <p className="text-3xl md:text-4xl lg:text-5xl font-bold font-sans text-foreground mt-1">
                Express
              </p>
              <div className="mt-2 text-xs text-gold font-bold uppercase tracking-wider font-sans">
                Priority Plus Handling
              </div>
            </div>
          </section>

          {/* Main Content Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: 3. Live Tracking Map */}
            <div className="lg:col-span-8 relative rounded-2xl overflow-hidden border border-border h-[450px] md:h-[550px] lg:h-[620px] bg-slate-100 shadow-sm">
              <img
                className="w-full h-full object-cover select-none"
                alt="High-fidelity satellite view map interface"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAk0EzwO18j9KSX8CbU4A3rlvLIID4b0Rr6uzImqOqur5ud7kNRgZ-P2Hd3gWwP3At74MIAVqKriP4sOK4JvI1enQBh0RstO8aw4UxPeKtmmdcvflO2rNJivSVgGjnnGzSjNjivrxZnGUdkQxUEaY7XONq8kRoeGDQjiYgDbH1oieGkPh6rscuYVU1I5oa77mP-beYeOWr_cJ0KAvjz_P6TyQyVOCMK3AdEgFtE5SP9j6UN_MAiy7B0bPD5P8wLI8F2kZ7QM7U5Cj0"
              />
              
              {/* Floating Speed Meter Overlay */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-3 rounded-xl shadow-lg border border-slate-150">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
                    <Truck className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Current Speed</p>
                    <p className="text-lg font-bold text-slate-850 font-sans tabular-nums">{currentSpeed} km/h</p>
                  </div>
                </div>
              </div>

              {/* Floating Progress Bar on Map */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-lg border border-slate-150 flex items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">
                    <span>Route Transit Completion</span>
                    <span className="tabular-nums">{Math.floor(simulationProgress)}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-primary h-full rounded-full transition-all duration-300"
                      style={{ width: `${simulationProgress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Custom Map Markers Overlay */}
              <div className="absolute inset-0 pointer-events-none">
                {/* 1. Origin Marker */}
                <div className="absolute top-[25%] left-[33%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  <div className="p-1.5 bg-green-500 rounded-full shadow-lg border-2 border-white pointer-events-auto cursor-help group relative">
                    <div className="size-2 bg-white rounded-full"></div>
                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-semibold px-2 py-0.5 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      Central Hub A-12 (Origin)
                    </div>
                  </div>
                </div>

                {/* 2. Destination Marker */}
                <div className="absolute top-[66.6%] left-[75%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  <div className="p-1.5 bg-gold rounded-full shadow-lg border-2 border-white pointer-events-auto cursor-help group relative">
                    <MapPin className="size-4.5 text-white" />
                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-semibold px-2 py-0.5 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      Delivery Location (Destination)
                    </div>
                  </div>
                </div>

                {/* 3. Live Courier Vehicle Marker (Interpolated position) */}
                <div 
                  className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center transition-all duration-300"
                  style={{ top: `${vehicleTop}%`, left: `${vehicleLeft}%` }}
                >
                  <div className="p-2 bg-primary rounded-full shadow-2xl border-2 border-white pointer-events-auto group cursor-help relative animate-bounce-slow">
                    <Truck className="size-5 text-white" />
                    {/* Ripple pulse effects */}
                    {!isDelivered && (
                      <>
                        <span className="absolute inset-0 rounded-full bg-primary/40 -z-10 animate-ping" />
                        <span className="absolute -inset-1 rounded-full bg-primary/20 -z-20 animate-pulse" />
                      </>
                    )}
                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold px-2.5 py-1 rounded shadow-lg opacity-100 transition-opacity whitespace-nowrap flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                      <span>Sarah K. (Courier)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Side Panel */}
            <aside className="lg:col-span-4 space-y-6">
              
              {/* 4. Delivery Timeline */}
              <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                <h3 className="font-sans text-xl font-bold text-foreground mb-6">
                  Delivery Timeline
                </h3>
                
                <div className="relative pl-1">
                  {/* Timeline track line */}
                  <div className="absolute left-3.5 top-2.5 bottom-2 w-0.5 bg-slate-100 -z-10" />
                  
                  {/* Timeline flow logic */}
                  <div className="space-y-6">
                    {/* 1. CREATED */}
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center shrink-0">
                        <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center shadow-sm">
                          <Check className="size-4" />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">CREATED</p>
                        <p className="text-xs text-muted-foreground mt-0.5 tabular-nums">22:15 IST • Order processed</p>
                      </div>
                    </div>

                    {/* 2. ASSIGNED */}
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center shrink-0">
                        <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center shadow-sm">
                          <Check className="size-4" />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">ASSIGNED</p>
                        <p className="text-xs text-muted-foreground mt-0.5 tabular-nums">22:31 IST • Driver assigned</p>
                      </div>
                    </div>

                    {/* 3. ACCEPTED */}
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center shrink-0">
                        <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center shadow-sm">
                          <Check className="size-4" />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">ACCEPTED</p>
                        <p className="text-xs text-muted-foreground mt-0.5 tabular-nums">22:34 IST • Driver accepted</p>
                      </div>
                    </div>

                    {/* 4. PICKED_UP */}
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center shrink-0">
                        <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center shadow-sm">
                          <Check className="size-4" />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">PICKED_UP</p>
                        <p className="text-xs text-muted-foreground mt-0.5 tabular-nums">22:39 IST • At Hub A-12</p>
                      </div>
                    </div>

                    {/* 5. IN_TRANSIT */}
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center shrink-0">
                        <div className={cn(
                          "w-7 h-7 rounded-full flex items-center justify-center shadow-sm transition-all duration-300",
                          isDelivered 
                            ? "bg-primary text-white" 
                            : "border-2 border-primary bg-white text-primary"
                        )}>
                          {isDelivered ? (
                            <Check className="size-4" />
                          ) : (
                            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-ping" />
                          )}
                        </div>
                      </div>
                      <div>
                        <p className={cn(
                          "text-sm font-semibold",
                          !isDelivered ? "text-primary font-bold" : "text-foreground"
                        )}>
                          IN_TRANSIT
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5 tabular-nums">
                          {isDelivered ? "Completed at 23:14 IST" : "Active Now • En-route to delivery"}
                        </p>
                      </div>
                    </div>

                    {/* 6. DELIVERED */}
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center shrink-0">
                        <div className={cn(
                          "w-7 h-7 rounded-full flex items-center justify-center shadow-sm transition-all duration-300",
                          isDelivered 
                            ? "bg-green-500 text-white" 
                            : "bg-slate-100 text-slate-400 border border-slate-200"
                        )}>
                          {isDelivered && <Check className="size-4" />}
                        </div>
                      </div>
                      <div>
                        <p className={cn(
                          "text-sm font-semibold transition-all",
                          isDelivered ? "text-green-700 font-bold" : "text-slate-400 opacity-60"
                        )}>
                          DELIVERED
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {isDelivered ? "Delivered & verified by customer" : "Pending arrival"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 5. Driver Information */}
              <div className="bg-card p-6 rounded-2xl border border-border shadow-sm relative overflow-hidden group">
                {/* Visual Accent top */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/50 to-gold/50" />
                
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      className="w-14 h-14 rounded-full object-cover border border-slate-200 shadow-sm"
                      alt="Headshot of courier Sarah K."
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZcTKjyFlQEWLzklf-zq9lf7IA4bKZ3ZwkqIf_075Djntm72aYzDcJGA3kZlvMfPC2wx2MHGzeY1e8DDMtgRrQiQpBdhGnc3jKjDgUA0TYYnLI0SZhls91rZJTSyLQsewP12w2tNbkid-IRbYN8S6Cso-sGHWAKMurQXgGt4rlW1pyN0huzC37wNWbBgIY_-XROi2rcNoMrU7gQ6jwPQ_eLkhbXLqDFK237Nd5SK9DAzweZLQRgr0_ngvtFfjbr4fQFnx663XKmk0"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 bg-green-500 w-3.5 h-3.5 rounded-full border-2 border-white"></span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-sans text-lg font-bold text-foreground">
                      Sarah K.
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className="flex items-center text-sm font-semibold text-gold shrink-0 tabular-nums">
                        <Star className="size-3.5 mr-0.5 fill-current" />
                        4.9/5
                      </span>
                      <span className="text-xs font-medium uppercase text-muted-foreground tracking-wide">
                        V-04 (Electric)
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-primary mt-1.5 font-mono tracking-wide tabular-nums">
                      KA-01-AB-1234
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mt-5">
                  <Button
                    variant="outline"
                    onClick={() => setChatOpen(true)}
                    className="h-10 font-semibold text-sm border-border bg-slate-50 text-primary hover:bg-slate-100"
                    id="btn-driver-message"
                  >
                    <MessageSquare className="size-4" />
                    <span>Message</span>
                  </Button>
                  <Button
                    onClick={() => setCallOpen(true)}
                    className="h-10 font-semibold text-sm text-white"
                    id="btn-driver-call"
                  >
                    <Phone className="size-4" />
                    <span>Contact</span>
                  </Button>
                </div>
              </div>

              {/* 6. Route Optimization Insights */}
              <div className="bg-slate-100 p-6 rounded-2xl border border-slate-200">
                <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-4 font-sans">
                  Live Route Intelligence
                </h4>
                <div className="space-y-3.5">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600 font-medium">Traffic Impact</span>
                    <span className="font-semibold text-green-700 bg-green-50 px-2.5 py-0.5 rounded-full border border-green-200/80">Low</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600 font-medium">ETA Confidence</span>
                    <span className="font-semibold text-slate-800 tabular-nums">94%</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600 font-medium">System Optimization</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold uppercase text-primary">Enabled</span>
                      <Zap className="size-3.5 text-primary animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>

          {/* Lower Section: 7. Activity Feed & 8. Proof Of Delivery */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            
            {/* 7. Activity Feed */}
            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-sans text-xl font-bold text-foreground">
                  Activity Log
                </h3>
                <Button 
                  variant="ghost" 
                  onClick={() => showToast("Mock PDF report download initialized.")}
                  className="text-sm font-semibold text-primary hover:underline h-9 px-2"
                  id="btn-download-report"
                >
                  <Download className="size-3.5 mr-1" />
                  <span>Download Report</span>
                </Button>
              </div>

              <div className="space-y-5">
                {isDelivered && (
                  <div className="flex gap-4 items-start">
                    <span className="font-mono text-xs text-green-700 font-semibold w-16 shrink-0 pt-0.5 tabular-nums">23:14</span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-green-700">Package Delivered</p>
                      <p className="text-xs font-normal text-muted-foreground mt-0.5">Completed at destination. Handed over directly and validated digitally.</p>
                    </div>
                  </div>
                )}
                <div className="flex gap-4 items-start">
                  <span className="font-mono text-xs text-muted-foreground w-16 shrink-0 pt-0.5 tabular-nums">22:39</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-800">Package Picked Up</p>
                    <p className="text-xs font-normal text-muted-foreground mt-0.5">Courier Sarah K. confirmed receipt at Central Hub A-12.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <span className="font-mono text-xs text-muted-foreground w-16 shrink-0 pt-0.5 tabular-nums">22:34</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-800">Driver Accepted Delivery</p>
                    <p className="text-xs font-normal text-muted-foreground mt-0.5">Sarah K. accepted the delivery routing request.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <span className="font-mono text-xs text-muted-foreground w-16 shrink-0 pt-0.5 tabular-nums">22:31</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-800">Driver Assigned</p>
                    <p className="text-xs font-normal text-muted-foreground mt-0.5">System matched order with nearby courier Sarah K.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <span className="font-mono text-xs text-muted-foreground w-16 shrink-0 pt-0.5 tabular-nums">22:15</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-800">Payment Verified</p>
                    <p className="text-xs font-normal text-muted-foreground mt-0.5 tabular-nums font-sans">Digital transaction of ₹2,450.00 authorized successfully.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <span className="font-mono text-xs text-muted-foreground w-16 shrink-0 pt-0.5 tabular-nums">22:10</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-800">Shipment Created</p>
                    <p className="text-xs font-normal text-muted-foreground mt-0.5">Order assigned to Alexandria Express Fleet.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 8. Proof Of Delivery Placeholder */}
            <div className={cn(
              "p-6 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center text-center",
              isDelivered 
                ? "bg-green-50/40 border-green-500/55 border-solid" 
                : "bg-slate-50/60 border-slate-200 border-dashed"
            )}>
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-all duration-300",
                isDelivered ? "bg-green-100 text-green-700" : "bg-slate-200 text-slate-400"
              )}>
                {isDelivered ? <CheckCircle2 className="size-6" /> : <Camera className="size-6" />}
              </div>
              <h3 className="font-sans text-xl font-bold text-foreground mb-2">
                Proof of Delivery
              </h3>
              
              {isDelivered ? (
                <div className="w-full space-y-4">
                  <p className="text-sm text-slate-655 max-w-sm mx-auto leading-relaxed">
                    Delivery successfully completed and verified at <span className="font-semibold tabular-nums">23:14 IST</span>. Digital signature and photographic evidence are listed below.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 w-full pt-4">
                    {/* Real signature mock */}
                    <div className="bg-white p-4 rounded-xl border border-green-200 shadow-sm flex flex-col items-center justify-center min-h-[140px] relative overflow-hidden">
                      <div className="absolute top-2 left-2.5 text-xs font-semibold text-green-700 uppercase tracking-wider">
                        Digital Signature
                      </div>
                      <div className="font-serif italic text-lg text-slate-805 tracking-wider my-auto select-none pt-4">
                        Sarah K. & Client
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-auto">
                        SHA-256 Verified
                      </div>
                    </div>
                    {/* Delivery image mock */}
                    <div className="bg-white rounded-xl border border-green-200 shadow-sm flex flex-col overflow-hidden min-h-[140px]">
                      <div className="h-full relative">
                        <img 
                          src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=300"
                          alt="Delivered parcel photo at door" 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2.5 bg-black/60 text-white text-[10px] font-semibold px-2.5 py-0.5 rounded uppercase tracking-wider">
                          Photo Proof
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-muted-foreground text-sm max-w-xs mx-auto leading-relaxed">
                    Waiting for delivery completion to generate digital signature and photographic evidence.
                  </p>
                  <div className="mt-8 grid grid-cols-2 gap-4 w-full opacity-35">
                    <div className="bg-slate-200/50 h-28 rounded-xl border border-slate-300 flex items-center justify-center">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Signature Area</span>
                    </div>
                    <div className="bg-slate-200/50 h-28 rounded-xl border border-slate-300 flex items-center justify-center">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Photo Proof</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Message Driver Drawer (Slide-out Overlay) */}
      {chatOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setChatOpen(false)}
          />
          {/* Drawer Panel */}
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300 border-l border-slate-100">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-primary text-white">
              <div className="flex items-center gap-3">
                <img
                  className="w-10 h-10 rounded-full object-cover border border-white/20"
                  alt="Sarah K."
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZcTKjyFlQEWLzklf-zq9lf7IA4bKZ3ZwkqIf_075Djntm72aYzDcJGA3kZlvMfPC2wx2MHGzeY1e8DDMtgRrQiQpBdhGnc3jKjDgUA0TYYnLI0SZhls91rZJTSyLQsewP12w2tNbkid-IRbYN8S6Cso-sGHWAKMurQXgGt4rlW1pyN0huzC37wNWbBgIY_-XROi2rcNoMrU7gQ6jwPQ_eLkhbXLqDFK237Nd5SK9DAzweZLQRgr0_ngvtFfjbr4fQFnx663XKmk0"
                />
                <div>
                  <h4 className="text-base font-semibold font-sans leading-tight">Sarah K.</h4>
                  <p className="text-xs text-white/70 leading-none">Courier Driver • Active Now</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setChatOpen(false)} 
                className="text-white hover:bg-white/10 h-8 w-8 rounded-full"
                id="btn-close-chat"
              >
                <X className="size-5" />
              </Button>
            </div>

            {/* Message History */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
              {chatMessages.map((msg, index) => (
                <div 
                  key={index}
                  className={cn(
                    "flex flex-col max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-xs",
                    msg.sender === "customer"
                      ? "bg-primary text-white ml-auto rounded-tr-none"
                      : msg.sender === "driver"
                        ? "bg-white text-slate-800 border border-slate-200 mr-auto rounded-tl-none"
                        : "bg-slate-200 text-slate-500 mx-auto text-xs tracking-wide uppercase px-2.5 py-1 rounded"
                  )}
                >
                  <p className="leading-relaxed">{msg.text}</p>
                  {msg.sender !== "system" && (
                    <span className={cn(
                      "text-[9px] mt-1 text-right block font-mono",
                      msg.sender === "customer" ? "text-white/60" : "text-slate-400"
                    )}>
                      {msg.time}
                    </span>
                  )}
                </div>
              ))}
              <div ref={chatBottomRef} />
            </div>

            {/* Input Message Form */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-100 bg-white flex items-center gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-2 text-base focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary font-sans h-10"
                id="input-chat-message"
              />
              <Button 
                type="submit" 
                size="icon" 
                className="rounded-full shrink-0 w-10 h-10 flex items-center justify-center"
                id="btn-chat-send"
              >
                <Send className="size-4.5" />
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Contact Call Dialog Modal */}
      {callOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={() => setCallOpen(false)}
          />
          <div className="relative w-full max-w-sm bg-slate-900 text-white rounded-2xl shadow-2xl p-6 border border-slate-800 z-10 animate-in fade-in zoom-in-95 duration-200 text-center space-y-6">
            <div className="w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-2 animate-pulse">
              <Phone className="size-7" />
            </div>
            
            <div>
              <h3 className="text-xl font-bold font-sans">Outgoing Call</h3>
              <p className="text-sm text-slate-400 mt-1">Connecting to Courier Sarah K.</p>
            </div>

            <div className="py-2">
              <p className="text-2xl font-bold font-mono tracking-widest text-slate-250 tabular-nums">+91 98765 43210</p>
              <p className="text-xs text-slate-450 uppercase tracking-widest mt-1">Vehicle Node V-04 Transceiver</p>
            </div>

            <div className="flex gap-3 pt-4 justify-center">
              <Button
                variant="destructive"
                onClick={() => {
                  setCallOpen(false);
                  showToast("Call ended.");
                }}
                className="w-36 rounded-full font-bold h-11 text-base"
                id="btn-hang-up"
              >
                End Call
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Share Link Dialog Modal */}
      {shareOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={() => setShareOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 border border-slate-100 z-10 animate-in fade-in zoom-in-95 duration-200 space-y-5">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-lg font-bold font-sans text-slate-800">Share Shipment Link</h3>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShareOpen(false)} 
                className="h-8 w-8 text-slate-400"
                id="btn-close-share"
              >
                <X className="size-4.5" />
              </Button>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              Anyone with this link can view the live telemetry coordinates, courier milestones, and progress updates for this active shipment manifest.
            </p>

            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-mono text-sm text-slate-700">
              <span className="truncate flex-1 select-all">
                {typeof window !== "undefined" ? `${window.location.origin}/customer/tracking?id=${activeShipmentId}` : ""}
              </span>
            </div>

            <div className="flex gap-2.5 pt-2">
              <Button
                variant="outline"
                className="flex-1 font-semibold text-sm h-10"
                onClick={() => setShareOpen(false)}
                id="btn-cancel-share"
              >
                Cancel
              </Button>
              <Button
                className="flex-1 font-semibold text-sm text-white h-10"
                onClick={copyShareLink}
                id="btn-confirm-copy"
              >
                Copy URL Link
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Get Help / Support Dialog Modal */}
      {supportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={() => setSupportOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 border border-slate-100 z-10 animate-in fade-in zoom-in-95 duration-200 space-y-5">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-lg font-bold font-sans text-slate-800">Support Operations</h3>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setSupportOpen(false)} 
                className="h-8 w-8 text-slate-400"
                id="btn-close-support"
              >
                <X className="size-4.5" />
              </Button>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              Need assistance with shipment <span className="font-semibold text-slate-800 font-mono">{activeShipmentId}</span>? Select an issue category below to connect with our regional dispatch desk:
            </p>

            <div className="space-y-2.5 pt-2">
              {[
                "Route discrepancy / Driver going wrong way",
                "Request delivery address correction",
                "Report package damage / fragile alert",
                "Other dispatch questions / SLA dispute"
              ].map((topic, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSupportOpen(false);
                    showToast(`Support ticket created for: "${topic}"`);
                  }}
                  className="w-full text-left px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl hover:bg-primary/5 hover:border-primary/20 text-sm text-slate-700 font-semibold transition-all flex items-center justify-between group"
                >
                  <span>{topic}</span>
                  <ChevronRight className="size-4 text-slate-400 group-hover:text-primary transition-colors" />
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                className="h-10 text-sm font-semibold"
                onClick={() => setSupportOpen(false)}
                id="btn-close-support-dialog"
              >
                Close Window
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
