"use client";

import React, { useState, useEffect, useRef } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  MapPin,
  Navigation,
  Check,
  Phone,
  AlertTriangle,
  Lock,
  Camera,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
  Plus,
  Minus,
  Layers,
  X,
  Play,
  RotateCcw,
  Flag,
  User,
  ShieldAlert
} from "lucide-react";

export default function ActiveRoutePage() {
  const breadcrumbs = [
    { label: "Driver", href: "/driver/dashboard" },
    { label: "Active Route" }
  ];

  // 1. Core Workflow States
  // States: "IN_TRANSIT" -> "ARRIVED" -> "POD_UPLOADED" -> "DELIVERED"
  const [deliveryState, setDeliveryState] = useState<"IN_TRANSIT" | "ARRIVED" | "POD_UPLOADED" | "DELIVERED">("IN_TRANSIT");
  
  // Proof of delivery mock attachments
  const [hasPhoto, setHasPhoto] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  
  // Map zoom and position simulations
  const [mapZoom, setMapZoom] = useState(1);
  const [courierProgress, setCourierProgress] = useState(0); // 0 to 100
  const [isSimulating, setIsSimulating] = useState(false);
  const simulationInterval = useRef<NodeJS.Timeout | null>(null);

  // Modal overlays
  const [signatureModalOpen, setSignatureModalOpen] = useState(false);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [issueModalOpen, setIssueModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Dynamic values
  const currentETA = deliveryState === "DELIVERED" 
    ? "Delivered" 
    : deliveryState === "ARRIVED" || deliveryState === "POD_UPLOADED"
      ? "Arrived"
      : `${Math.max(1, Math.floor(12 * (1 - courierProgress / 100)))} mins`;

  const currentDistance = deliveryState === "DELIVERED" || deliveryState === "ARRIVED" || deliveryState === "POD_UPLOADED"
    ? "0.0 km"
    : `${(4.2 * (1 - courierProgress / 100)).toFixed(1)} km`;

  // Map route coordinate interpolation
  // BKC Logistics Hub (start): top 30%, left 20%
  // Worli Sky Tower (end): top 60%, left 65%
  const startTop = 30;
  const startLeft = 20;
  const endTop = 60;
  const endLeft = 65;

  const vehicleTop = startTop + (endTop - startTop) * (courierProgress / 100);
  const vehicleLeft = startLeft + (endLeft - startLeft) * (courierProgress / 100);

  // Notification helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Route movement simulation
  useEffect(() => {
    if (isSimulating) {
      simulationInterval.current = setInterval(() => {
        setCourierProgress((prev) => {
          if (prev >= 100) {
            clearInterval(simulationInterval.current!);
            setIsSimulating(false);
            setDeliveryState("ARRIVED");
            showToast("You have arrived at Worli Sky Tower. Proof of Delivery is now unlocked!");
            return 100;
          }
          return prev + 5;
        });
      }, 300);
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

  // Handle direct arrival click
  const handleArriveDestination = () => {
    setIsSimulating(false);
    setCourierProgress(100);
    setDeliveryState("ARRIVED");
    showToast("Route completed. Please collect customer signature and photo proof.");
  };

  const handleCenterLocation = () => {
    setMapZoom(1);
    showToast("Navigation view centered on active courier position.");
  };

  // Lock status check for POD section
  const isPodLocked = deliveryState === "IN_TRANSIT";

  // Check if Mark Delivered is active
  const isMarkDeliveredActive = hasPhoto && hasSignature && (deliveryState === "ARRIVED" || deliveryState === "POD_UPLOADED");

  // Handle finalize delivery
  const handleMarkDelivered = () => {
    if (!isMarkDeliveredActive) {
      if (deliveryState === "IN_TRANSIT") {
        showToast("Cannot complete delivery. You must arrive at the destination first.");
      } else {
        showToast("Cannot complete delivery. Photo proof and customer signature are required.");
      }
      return;
    }
    setDeliveryState("DELIVERED");
    setSuccessModalOpen(true);
  };

  const handleResetRoute = () => {
    setDeliveryState("IN_TRANSIT");
    setCourierProgress(0);
    setHasPhoto(false);
    setHasSignature(false);
    setIsSimulating(false);
    setSuccessModalOpen(false);
    showToast("Route states reset for simulator testing.");
  };

  return (
    <PageContainer
      title="Active Route Console"
      subtitle="Real-time turn-by-turn routing and delivery verification manifests"
      breadcrumbs={breadcrumbs}
      actions={
        <div className="flex items-center gap-2">
          {/* Auto Drive removed as per product constraints */}
          {deliveryState === "IN_TRANSIT" && (
            <Button
              size="sm"
              onClick={handleArriveDestination}
              className="gap-1.5 h-9 text-xs font-semibold"
              id="btn-force-arrive"
            >
              <Flag className="size-3.5" />
              <span>Arrive Now</span>
            </Button>
          )}
          {deliveryState === "DELIVERED" && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetRoute}
              className="gap-1.5 h-9 text-xs font-semibold border-primary text-primary"
              id="btn-restart-route"
            >
              <RotateCcw className="size-3.5" />
              <span>Restart Simulator</span>
            </Button>
          )}
        </div>
      }
    >
      {/* Toast Notifier */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-lg shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <CheckCircle2 className="size-4 text-green-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Responsive Layout (Mobile-First) */}
      <div className="space-y-6 max-w-7xl mx-auto pb-20 lg:pb-12 font-sans">
        
        {/* 1. Route Header Summary */}
        <section className="bg-white border border-border p-5 rounded-2xl shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                <span className={cn(
                  "px-2.5 py-0.5 rounded-full text-sm font-semibold uppercase tracking-wider",
                  deliveryState === "DELIVERED" 
                    ? "bg-green-100 text-green-800 border border-green-200/80"
                    : deliveryState === "ARRIVED" || deliveryState === "POD_UPLOADED"
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-250"
                      : "bg-primary/10 text-primary border border-primary/20"
                )}>
                  {deliveryState === "DELIVERED" 
                    ? "Delivered" 
                    : deliveryState === "ARRIVED" || deliveryState === "POD_UPLOADED"
                      ? "Arrived"
                      : "In Transit"}
                </span>
                <h2 className="text-xl font-bold font-sans tracking-tight text-foreground">
                  DID-2026-10231
                </h2>
              </div>
              <p className="text-muted-foreground text-sm font-medium font-sans">
                ETA: <span className="text-foreground font-bold tabular-nums">{currentETA}</span> (23:15 IST)
              </p>
            </div>

            <div className="flex gap-3 w-full md:w-auto">
              <div className="bg-slate-50 p-3 rounded-xl flex-1 md:min-w-[150px] border border-slate-100">
                <p className="text-sm uppercase tracking-wide font-medium text-muted-foreground font-sans mb-0.5">Pickup</p>
                <p className="text-base font-semibold truncate text-slate-800 font-sans">BKC Logistics Hub</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl flex-1 md:min-w-[150px] border border-slate-100 border-l-4 border-primary">
                <p className="text-sm uppercase tracking-wide font-medium text-muted-foreground font-sans mb-0.5">Destination</p>
                <p className="text-base font-semibold truncate text-slate-800 font-sans">Worli Sky Tower</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl hidden xl:block border border-slate-150 text-center min-w-[100px]">
                <p className="text-sm uppercase tracking-wide font-medium text-muted-foreground font-sans mb-0.5">Distance</p>
                <p className="text-base font-bold text-primary font-sans tabular-nums">{currentDistance}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* 2. Navigation Map (Central centerpiece on mobile) */}
          <div className="lg:col-span-8 relative rounded-3xl overflow-hidden h-[380px] md:h-[480px] lg:h-[580px] bg-slate-100 border border-border shadow-sm">
            <div className="w-full h-full overflow-hidden relative">
              <img
                alt="Route Navigation Map"
                className="w-full h-full object-cover transition-transform duration-300 origin-center"
                style={{ transform: `scale(${mapZoom})` }}
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0mFccakXOO2iCuYaVwulguMohcnTnl3g8jqGueg54z4VVVYY_uduyf30hTToEPqtPqok43PpHEmuPLbCpd9Y5fP3jSXcbo7IJGJQfbNTOeDt3n05e8eiA1WyQ6gMj-_GZifCKd6m5pomcec3a8gPMCC36ZA6jxDp8rAYTK8ojrIiVPy6eU2W5D5GmV9pqNI4XvXcsFS4WZFWluC3FxMdItJGo4hWObrZ8nbSyGf5QdKIQmBO3o6tvmbOmJjLM6_FHf0Mr0bMcn7Q"
              />
            </div>

            {/* Floating Navigation Arrow / Marker */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Origin Flag marker */}
              <div className="absolute top-[30%] left-[20%] -translate-x-1/2 -translate-y-1/2">
                <div className="p-1 bg-green-500 rounded-full border border-white shadow"></div>
              </div>
              {/* Destination Pin marker */}
              <div className="absolute top-[60%] left-[65%] -translate-x-1/2 -translate-y-1/2">
                <MapPin className="size-5.5 text-rose-600 animate-bounce-slow" />
              </div>
              
              {/* Courier Vehicle Marker */}
              <div
                className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
                style={{ top: `${vehicleTop}%`, left: `${vehicleLeft}%` }}
              >
                <div className="p-2 bg-primary rounded-full border-2 border-white shadow-lg relative">
                  <Navigation className="size-4.5 text-white rotate-90 fill-current" />
                  {!isPodLocked && (
                    <span className="absolute -inset-1.5 rounded-full bg-primary/20 animate-ping -z-10" />
                  )}
                </div>
              </div>
            </div>

            {/* Map Controls */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <button
                onClick={handleCenterLocation}
                className="h-9 w-9 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center text-primary shadow-sm hover:bg-slate-50 transition-colors border border-slate-200"
                id="btn-map-center-active"
                title="Recenter"
              >
                <Navigation className="size-4 rotate-45" />
              </button>
              <button
                onClick={() => setMapZoom(prev => Math.min(prev + 0.2, 1.8))}
                className="h-9 w-9 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center text-slate-700 shadow-sm hover:bg-slate-50 transition-colors border border-slate-200"
                id="btn-map-zoom-in-active"
                title="Zoom In"
              >
                <Plus className="size-4" />
              </button>
              <button
                onClick={() => setMapZoom(prev => Math.max(prev - 0.2, 1))}
                className="h-9 w-9 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center text-slate-700 shadow-sm hover:bg-slate-50 transition-colors border border-slate-200"
                id="btn-map-zoom-out-active"
                title="Zoom Out"
              >
                <Minus className="size-4" />
              </button>
            </div>

            {/* Floating Navigation Instructions (Next Maneuver Overlay) */}
            {deliveryState === "IN_TRANSIT" && (
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-xl shadow-lg border border-slate-150 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary shrink-0">
                    <Navigation className="size-4.5 rotate-90 fill-current" />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Next Maneuver</p>
                    <p className="text-xs font-bold text-slate-800">Turn Right onto Worli Sea Link</p>
                  </div>
                </div>
                <p className="text-sm font-black text-primary font-heading">400m</p>
              </div>
            )}

            {/* Floating Destination Arrived Overlay */}
            {(deliveryState === "ARRIVED" || deliveryState === "POD_UPLOADED") && (
              <div className="absolute bottom-4 left-4 right-4 bg-emerald-50/95 backdrop-blur-md p-3.5 rounded-xl shadow-lg border border-emerald-250 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg shrink-0">
                    <Check className="size-4.5" />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-emerald-700 uppercase tracking-wider">Arrived at Location</p>
                    <p className="text-xs font-bold text-slate-800">Please secure customer signature</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded uppercase font-sans">UNLOCKED</span>
              </div>
            )}
          </div>

          {/* Right Column (Sidebar controls & Workflow states) */}
          <aside className="lg:col-span-4 space-y-6">
            
            {/* 3. Workflow Status Timeline */}
            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
              <h2 className="text-base font-bold text-slate-800 font-sans mb-5 uppercase tracking-wide">
                Workflow Status
              </h2>
              
              <div className="relative pl-1">
                {/* Visual Line */}
                <div className="absolute left-3 top-2.5 bottom-2.5 w-0.5 bg-slate-100 -z-10" />

                <div className="space-y-4">
                  {/* Created */}
                  <div className="flex items-center gap-3.5">
                    <div className="w-6.5 h-6.5 rounded-full bg-primary flex items-center justify-center text-white shadow-sm shrink-0">
                      <Check className="size-3.5" />
                    </div>
                    <span className="text-base font-semibold text-slate-500 font-sans">Created</span>
                  </div>

                  {/* Assigned */}
                  <div className="flex items-center gap-3.5">
                    <div className="w-6.5 h-6.5 rounded-full bg-primary flex items-center justify-center text-white shadow-sm shrink-0">
                      <Check className="size-3.5" />
                    </div>
                    <span className="text-base font-semibold text-slate-500 font-sans">Assigned</span>
                  </div>

                  {/* Accepted */}
                  <div className="flex items-center gap-3.5">
                    <div className="w-6.5 h-6.5 rounded-full bg-primary flex items-center justify-center text-white shadow-sm shrink-0">
                      <Check className="size-3.5" />
                    </div>
                    <span className="text-base font-semibold text-slate-500 font-sans">Accepted</span>
                  </div>

                  {/* Picked Up */}
                  <div className="flex items-center gap-3.5">
                    <div className="w-6.5 h-6.5 rounded-full bg-primary flex items-center justify-center text-white shadow-sm shrink-0">
                      <Check className="size-3.5" />
                    </div>
                    <span className="text-base font-semibold text-slate-500 font-sans">Picked Up</span>
                  </div>

                  {/* In Transit */}
                  <div className="flex items-center gap-3.5">
                    <div className={cn(
                      "w-6.5 h-6.5 rounded-full flex items-center justify-center shrink-0 shadow-sm transition-all duration-300",
                      deliveryState === "DELIVERED"
                        ? "bg-primary text-white"
                        : "border-2 border-primary bg-white text-primary"
                    )}>
                      {deliveryState === "DELIVERED" ? (
                        <Check className="size-3.5" />
                      ) : (
                        <div className="size-1.5 bg-primary rounded-full animate-ping" />
                      )}
                    </div>
                    <span className={cn(
                      "text-base font-semibold font-sans",
                      deliveryState !== "DELIVERED" ? "text-primary font-bold" : "text-slate-500"
                    )}>
                      In Transit
                    </span>
                  </div>

                  {/* Delivered */}
                  <div className="flex items-center gap-3.5">
                    <div className={cn(
                      "w-6.5 h-6.5 rounded-full flex items-center justify-center shrink-0 shadow-sm transition-all duration-300",
                      deliveryState === "DELIVERED"
                        ? "bg-green-500 text-white"
                        : "bg-slate-100 text-slate-400 border border-slate-200"
                    )}>
                      {deliveryState === "DELIVERED" && <Check className="size-3.5" />}
                    </div>
                    <span className={cn(
                      "text-base font-semibold font-sans",
                      deliveryState === "DELIVERED" ? "text-green-600 font-bold" : "text-slate-400"
                    )}>
                      Delivered
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Customer Contact Card */}
            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
              <div className="flex items-center gap-4 mb-5">
                <img
                  className="w-12 h-12 rounded-xl object-cover border border-slate-100 shadow-sm"
                  alt="Customer Sarah Jenkins"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmVqN4y9Xa1NlS4GrU0eq9DvS8i9kWaf2MhbNU0iZvxUwJZoHyHEaX-_0G0HHlZu6oApqdTIszjnaIzdQ-ZASnwU-gSQmeuPcrb8NVce6EYyWf323kle9lM2LA1h1Y2TUoa4EzbfsmXIdtec1fIhQEDVtEbav2j1HZsXxQnZB_7mIA3hdhOHvu9bQ3j2BlBNYi5ShzgbkyTGzCmbwT5XeV13Q-TGpn7th-9EHNjufrBgxa7Bw0E8vM0dXDR8rJ_hB-Pxp5jdzLd8M"
                />
                <div>
                  <h3 className="font-sans text-base font-bold text-foreground">
                    Sarah Jenkins
                  </h3>
                  <p className="text-sm text-muted-foreground font-sans">
                    Flat 402, Worli Sky Tower
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={() => setCallModalOpen(true)}
                  className="h-10 text-xs font-semibold border-border bg-slate-50 text-primary hover:bg-slate-100"
                  id="btn-call-customer"
                >
                  <Phone className="size-4" />
                  <span>Call Customer</span>
                </Button>
                <Button
                  onClick={() => {
                    setMapZoom(1.5);
                    showToast("Centering map view on route details.");
                  }}
                  className="h-10 text-xs font-semibold text-white"
                  id="btn-navigate-customer"
                >
                  <Navigation className="size-4 rotate-45" />
                  <span>Navigate</span>
                </Button>
              </div>

              <Button
                variant="ghost"
                onClick={() => setIssueModalOpen(true)}
                className="w-full mt-3 h-10 border border-red-200/50 hover:bg-red-50 text-red-600 text-xs font-bold rounded-xl"
                id="btn-report-issue"
              >
                Report Route Issue
              </Button>
            </div>

            {/* 5. Proof Of Delivery Upload Area */}
            <div className={cn(
              "bg-card p-6 rounded-2xl border border-border shadow-sm transition-all duration-300",
              isPodLocked ? "opacity-60 grayscale cursor-not-allowed select-none" : ""
            )}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-sans font-semibold uppercase tracking-wide text-muted-foreground">
                  Proof of Delivery
                </h2>
                {isPodLocked && <Lock className="size-4 text-slate-400" />}
              </div>

              <div className="space-y-3 font-sans">
                {/* 5a. Photo Upload Box */}
                <button
                  disabled={isPodLocked}
                  onClick={() => setPhotoModalOpen(true)}
                  className={cn(
                    "w-full p-4 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all text-xs font-semibold",
                    hasPhoto 
                      ? "border-green-500 bg-green-50/20 text-green-700 hover:bg-green-50/40" 
                      : "border-slate-200 hover:border-primary/45 hover:bg-slate-50/40 text-slate-500",
                    isPodLocked ? "cursor-not-allowed hover:bg-transparent" : "cursor-pointer"
                  )}
                  id="btn-upload-photo"
                >
                  {hasPhoto ? (
                    <>
                      <CheckCircle2 className="size-5 text-green-600 animate-in zoom-in-75" />
                      <span>Photo Uploaded (Click to replace)</span>
                    </>
                  ) : (
                    <>
                      <Camera className="size-5 text-slate-400" />
                      <span>Upload Package Photo</span>
                    </>
                  )}
                </button>

                {/* 5b. Signature Box */}
                <button
                  disabled={isPodLocked}
                  onClick={() => setSignatureModalOpen(true)}
                  className={cn(
                    "w-full p-4 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all text-xs font-semibold",
                    hasSignature 
                      ? "border-green-500 bg-green-50/20 text-green-700 hover:bg-green-50/40" 
                      : "border-slate-200 hover:border-primary/45 hover:bg-slate-50/40 text-slate-500",
                    isPodLocked ? "cursor-not-allowed hover:bg-transparent" : "cursor-pointer"
                  )}
                  id="btn-capture-signature"
                >
                  {hasSignature ? (
                    <>
                      <CheckCircle2 className="size-5 text-green-600 animate-in zoom-in-75" />
                      <span>Signature Captured (Click to view)</span>
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-5 text-slate-400"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                        />
                      </svg>
                      <span>Get Customer Signature</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* 6. Mark Delivered Action Button */}
            <Button
              onClick={handleMarkDelivered}
              disabled={deliveryState === "DELIVERED"}
              className={cn(
                "w-full py-6 rounded-2xl font-sans text-base font-bold shadow-lg transition-all duration-300",
                isMarkDeliveredActive 
                  ? "bg-gradient-to-r from-primary to-primary-container text-white cursor-pointer hover:shadow-primary/25 hover:-translate-y-0.5" 
                  : "bg-slate-200 text-slate-450 border border-slate-300 cursor-not-allowed hover:scale-100",
                deliveryState === "DELIVERED" ? "bg-green-500 text-white cursor-not-allowed opacity-90 shadow-none border-0" : ""
              )}
              id="btn-mark-delivered-active"
            >
              {deliveryState === "DELIVERED" ? "Delivery Manifest Finalized" : "Mark Delivered"}
            </Button>

            {/* 7. Activity Timeline */}
            <div className="bg-slate-100 p-6 rounded-3xl border border-slate-200">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4 font-sans">
                Activity Timeline
              </h2>
              
              <div className="space-y-4 text-sm font-sans">
                {deliveryState === "DELIVERED" && (
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-semibold text-foreground font-sans">Delivery Confirmed</p>
                      <p className="text-xs font-normal text-green-700 font-sans">Fulfillment signed and captured</p>
                    </div>
                    <span className="font-sans text-xs font-medium text-green-700 tabular-nums">23:14</span>
                  </div>
                )}
                
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-semibold text-foreground font-sans">Transit Started</p>
                    <p className="text-xs font-normal text-muted-foreground font-sans">Moving towards Worli</p>
                  </div>
                  <span className="font-sans text-xs font-medium text-muted-foreground tabular-nums">22:45</span>
                </div>

                <div className="flex justify-between items-start opacity-70">
                  <div>
                    <p className="text-sm font-semibold text-foreground font-sans">Picked Up</p>
                    <p className="text-xs font-normal text-muted-foreground font-sans">BKC Logistics Hub</p>
                  </div>
                  <span className="font-sans text-xs font-medium text-muted-foreground tabular-nums">22:30</span>
                </div>

                <div className="flex justify-between items-start opacity-70">
                  <div>
                    <p className="text-sm font-semibold text-foreground font-sans">Accepted</p>
                    <p className="text-xs font-normal text-muted-foreground font-sans">Driver Confirmed</p>
                  </div>
                  <span className="font-sans text-xs font-medium text-muted-foreground tabular-nums">22:15</span>
                </div>

                <div className="flex justify-between items-start opacity-70">
                  <div>
                    <p className="text-sm font-semibold text-foreground font-sans">Assigned</p>
                    <p className="text-xs font-normal text-muted-foreground font-sans">Automated Dispatch</p>
                  </div>
                  <span className="font-sans text-xs font-medium text-muted-foreground tabular-nums">22:10</span>
                </div>
              </div>
            </div>

          </aside>
        </div>

      </div>

      {/* Floating Bottom Navigation (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-40 flex justify-around items-center px-2 py-2.5 bg-white/95 backdrop-blur-md shadow-lg border-t border-slate-200">
        <button 
          onClick={() => showToast("Timeline state: Accepted")}
          className="flex flex-col items-center justify-center text-slate-500 px-3 py-1"
        >
          <CheckCircle2 className="size-4 text-primary shrink-0" />
          <span className="font-bold text-[8px] uppercase tracking-wider mt-1">Accepted</span>
        </button>
        <button 
          onClick={() => showToast("Timeline state: Picked Up")}
          className="flex flex-col items-center justify-center text-slate-500 px-3 py-1"
        >
          <CheckCircle2 className="size-4 text-primary shrink-0" />
          <span className="font-bold text-[8px] uppercase tracking-wider mt-1">Picked Up</span>
        </button>
        <button 
          onClick={() => showToast("Timeline state: Transit")}
          className={cn(
            "flex flex-col items-center justify-center rounded-full px-4 py-1.5 text-xs font-semibold",
            deliveryState !== "DELIVERED" ? "bg-primary text-white shadow-sm" : "text-slate-500"
          )}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-4 shrink-0"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125a1.125 1.125 0 0 0 1.125-1.125V9.75M8.25 13.875h1.5a1.5 1.5 0 0 0 1.5-1.5v-1.5a1.5 1.5 0 0 0-1.5-1.5h-1.5m6.75 3h1.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5h-1.5m-10.5 0H16.5a1.5 1.5 0 0 1 1.5 1.5v3"
            />
          </svg>
          <span className="text-[8px] uppercase mt-0.5 font-bold tracking-wider">Transit</span>
        </button>
        <button 
          onClick={() => showToast(deliveryState === "DELIVERED" ? "Timeline state: Delivered" : "Timeline state: Pending Delivered")}
          className={cn(
            "flex flex-col items-center justify-center px-3 py-1",
            deliveryState === "DELIVERED" ? "text-green-600 font-bold" : "text-slate-500"
          )}
        >
          <CheckCircle2 className={cn("size-4 shrink-0", deliveryState === "DELIVERED" ? "text-green-500" : "text-slate-350")} />
          <span className="font-bold text-[8px] uppercase tracking-wider mt-1">Delivered</span>
        </button>
      </nav>

      {/* Signature Modal (Customer signature pad) */}
      {signatureModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={() => setSignatureModalOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 border border-slate-100 z-10 animate-in fade-in zoom-in-95 duration-200 space-y-5">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-xl font-bold font-sans text-slate-800">Customer Signature Pad</h3>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setSignatureModalOpen(false)} 
                className="h-8 w-8 text-slate-400"
                id="btn-close-sig"
              >
                <X className="size-4.5" />
              </Button>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              Please ask client Sarah Jenkins to sign in the canvas below to confirm receipt of shipment <span className="font-semibold text-slate-800 font-mono">DID-2026-10231</span>:
            </p>

            {/* Signature Draw Area */}
            <div className="bg-slate-50 rounded-xl h-40 border border-slate-200 flex flex-col items-center justify-center text-slate-400 relative overflow-hidden group cursor-crosshair">
              <div className="absolute inset-0 flex items-center justify-center opacity-80 pointer-events-none">
                <span className="font-serif italic text-2xl text-slate-650 tracking-widest my-auto select-none pt-4 decoration-slate-400">
                  Sarah Jenkins
                </span>
              </div>
              <span className="absolute bottom-2 right-3 text-[10px] font-bold text-slate-455 uppercase tracking-widest select-none">
                Touchscreen Capture Enabled
              </span>
            </div>

            <div className="flex gap-2.5 pt-2">
              <Button
                variant="outline"
                className="flex-1 font-semibold text-sm h-10"
                onClick={() => {
                  setHasSignature(false);
                  setSignatureModalOpen(false);
                  showToast("Signature cleared.");
                }}
                id="btn-clear-sig"
              >
                Clear
              </Button>
              <Button
                className="flex-1 font-semibold text-sm text-white h-10"
                onClick={() => {
                  setHasSignature(true);
                  setSignatureModalOpen(false);
                  showToast("Signature captured successfully.");
                  if (hasPhoto) {
                    setDeliveryState("POD_UPLOADED");
                  }
                }}
                id="btn-confirm-sig"
              >
                Confirm Signature
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Photo Proof Upload Modal */}
      {photoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={() => setPhotoModalOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 border border-slate-100 z-10 animate-in fade-in zoom-in-95 duration-200 space-y-5">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-xl font-bold font-sans text-slate-800">Fulfillment Photo Proof</h3>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setPhotoModalOpen(false)} 
                className="h-8 w-8 text-slate-400"
                id="btn-close-photo"
              >
                <X className="size-4.5" />
              </Button>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              Capture or upload a clear photo of the delivered parcel at the delivery location (doorstep, receptionist desk, or handoff) for compliance records:
            </p>

            {/* Photo preview container */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl h-44 overflow-hidden relative flex flex-col items-center justify-center text-slate-400">
              <img 
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=400"
                alt="Doorstep Package Delivery Proof" 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                Doorstep Handoff Preview
              </div>
            </div>

            <div className="flex gap-2.5 pt-2">
              <Button
                variant="outline"
                className="flex-1 font-semibold text-sm h-10"
                onClick={() => {
                  setHasPhoto(false);
                  setPhotoModalOpen(false);
                  showToast("Photo removed.");
                }}
                id="btn-clear-photo"
              >
                Remove
              </Button>
              <Button
                className="flex-1 font-semibold text-sm text-white h-10"
                onClick={() => {
                  setHasPhoto(true);
                  setPhotoModalOpen(false);
                  showToast("Delivery photo uploaded successfully.");
                  if (hasSignature) {
                    setDeliveryState("POD_UPLOADED");
                  }
                }}
                id="btn-confirm-photo"
              >
                Attach Photo
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal (Delivery finalized) */}
      {successModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in" />
          <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100 z-10 animate-in fade-in zoom-in-95 duration-200">
            <div className="h-1.5 w-full bg-green-500" />
            
            <div className="p-8 text-center space-y-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2 text-green-700 shadow-inner">
                <CheckCircle2 className="size-9" />
              </div>
              
              <div>
                <h3 className="text-xl font-bold font-sans text-slate-800">Delivery Completed</h3>
                <p className="text-sm text-muted-foreground mt-1 font-sans">Shipment <span className="font-semibold text-slate-800 font-mono">DID-2026-10231</span> finalized successfully.</p>
              </div>

              <div className="bg-slate-50 border border-slate-200/50 p-4 rounded-xl space-y-2.5 text-sm text-left font-sans font-medium">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Manifest ID</span>
                  <span className="font-mono font-semibold text-base text-slate-800 tabular-nums">DID-2026-10231</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Earnings Payout</span>
                  <span className="font-bold text-base text-green-700 tabular-nums">+₹570.00 INR</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium uppercase tracking-wide text-muted-foreground">SLA Compliance</span>
                  <span className="text-sm font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200/80 uppercase">On Time</span>
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <Button
                  variant="outline"
                  onClick={handleResetRoute}
                  className="flex-1 font-semibold text-sm h-10"
                  id="btn-success-reset"
                >
                  Restart Tour
                </Button>
                <Button
                  onClick={() => setSuccessModalOpen(false)}
                  className="flex-1 font-semibold text-sm text-white h-10"
                  id="btn-success-close"
                >
                  Close Console
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Call Customer Dialog Modal */}
      {callModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={() => setCallModalOpen(false)}
          />
          <div className="relative w-full max-w-sm bg-slate-900 text-white rounded-2xl shadow-2xl p-6 border border-slate-800 z-10 animate-in fade-in zoom-in-95 duration-200 text-center space-y-6">
            <div className="w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-2 animate-pulse">
              <Phone className="size-7" />
            </div>
            
            <div>
              <h3 className="text-xl font-bold font-sans">Outgoing Call</h3>
              <p className="text-sm text-slate-400 mt-1">Connecting to Sarah Jenkins (Customer)</p>
            </div>

            <div className="py-2">
              <p className="text-xl font-bold font-sans tracking-widest text-slate-200 tabular-nums">+91 99887 76655</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Encrypted Customer Contact Channel</p>
            </div>

            <div className="flex gap-3 pt-4 justify-center">
              <Button
                variant="destructive"
                onClick={() => {
                  setCallModalOpen(false);
                  showToast("Call ended.");
                }}
                className="w-32 rounded-full font-semibold h-10 text-white"
                id="btn-hang-up-active"
              >
                End Call
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Report Issue Dialog Modal */}
      {issueModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIssueModalOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 border border-slate-100 z-10 animate-in fade-in zoom-in-95 duration-200 space-y-5">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-xl font-bold font-sans text-slate-800 flex items-center gap-2">
                <ShieldAlert className="size-5 text-red-600" />
                <span>Report Route Issue</span>
              </h3>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIssueModalOpen(false)} 
                className="h-8 w-8 text-slate-400"
                id="btn-close-issue"
              >
                <X className="size-4.5" />
              </Button>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              Encountered a roadblock or delivery problem? Report it directly to the regional dispatch office to recalculate SLAs and update the customer:
            </p>

            <div className="space-y-2.5 pt-2 font-sans font-semibold">
              {[
                "Vehicle puncture / mechanical breakdown",
                "Severe traffic jam / route block (NH44 detour)",
                "Customer unavailable / door locked / gate closed",
                "Weather-related safety delay / monsoon rainfall"
              ].map((issue, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setIssueModalOpen(false);
                    showToast(`Dispatched alert: "${issue}" logged.`);
                  }}
                  className="w-full text-left px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl hover:bg-red-50 hover:border-red-200/55 text-sm text-slate-700 transition-all flex items-center justify-between group"
                >
                  <span>{issue}</span>
                  <ChevronRight className="size-4 text-slate-400 group-hover:text-red-600 transition-colors" />
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                className="h-10 text-sm font-semibold"
                onClick={() => setIssueModalOpen(false)}
                id="btn-close-issue-dialog"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
