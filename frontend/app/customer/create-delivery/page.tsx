"use client";

import React, { useState, useEffect } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  MapPin,
  Navigation,
  Package,
  CheckCircle2,
  Timer,
  Clock,
  ArrowRight,
  X,
  Sparkles,
  Info
} from "lucide-react";

export default function CreateDeliveryPage() {
  // 1. Dynamic Form States
  const [deliveryName, setDeliveryName] = useState("");
  const [refNumber, setRefNumber] = useState("");
  const [packageType, setPackageType] = useState("Electronics");
  const [priority, setPriority] = useState<"STANDARD" | "EXPRESS" | "CRITICAL">("EXPRESS");

  // Pickup Location States
  const [pickupContact, setPickupContact] = useState("");
  const [pickupPhone, setPickupPhone] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [pickupCity, setPickupCity] = useState("Mumbai");
  const [pickupState, setPickupState] = useState("Maharashtra");
  const [pickupPincode, setPickupPincode] = useState("");

  // Dropoff Location States
  const [dropContact, setDropContact] = useState("");
  const [dropPhone, setDropPhone] = useState("");
  const [dropAddress, setDropAddress] = useState("");
  const [dropCity, setDropCity] = useState("Bengaluru");
  const [dropState, setDropState] = useState("Karnataka");
  const [dropPincode, setDropPincode] = useState("");

  // Package Details
  const [weight, setWeight] = useState<number>(5.5);
  const [dimensions, setDimensions] = useState("30 x 20 x 15");
  const [numPackages, setNumPackages] = useState<number>(1);
  const [packageValue, setPackageValue] = useState<number>(12500);

  // Success Modal Overlay Trigger
  const [showSuccess, setShowSuccess] = useState(false);

  // 2. Localized calculations
  const distance = 28; // fixed mock distance in km
  
  // Calculate pricing based on priority, weight, and packages
  const getFulfillmentCost = () => {
    const base = 150;
    const distanceCost = distance * 5; // ₹ 140
    const weightCost = Math.ceil(weight) * 15;
    const quantityCost = numPackages * 10;
    
    let priorityPremium = 0;
    if (priority === "EXPRESS") priorityPremium = 175;
    if (priority === "CRITICAL") priorityPremium = 400;

    return base + distanceCost + weightCost + quantityCost + priorityPremium;
  };

  // Get localized ETA (DD/MM/YYYY IST format)
  const getFulfillmentETA = () => {
    if (priority === "CRITICAL") {
      return "10/06/2026 (23:45 IST) - Within 90 mins";
    }
    if (priority === "EXPRESS") {
      return "11/06/2026 (12:00 IST) - Next-day Midday";
    }
    return "12/06/2026 (18:00 IST) - 48 Hours";
  };

  const handleCreateDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app, validate form fields
    setShowSuccess(true);
  };

  return (
    <PageContainer
      title="Create Delivery Request"
      subtitle="Complete the logistics manifest below. All data is processed through our real-time route optimization engine for maximum efficiency."
      breadcrumbs={[{ label: "Customer", href: "/customer/tracking" }, { label: "Create Delivery" }]}
    >
      <form onSubmit={handleCreateDelivery} className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-7xl mx-auto">
        
        {/* Left Side: Form Columns */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* Section 1: Delivery Information */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-7 w-1 bg-primary rounded-full"></div>
              <h2 className="text-xl font-bold font-sans text-foreground">1. Delivery Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-card border border-border p-6 rounded-xl shadow-sm">
              <div className="space-y-1.5">
                <label className="text-sm font-medium uppercase tracking-wide text-muted-foreground font-sans block">Delivery Name</label>
                <input 
                  type="text"
                  required
                  value={deliveryName}
                  onChange={(e) => setDeliveryName(e.target.value)}
                  placeholder="e.g., Q3 Electronics Batch A"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg p-3 font-sans text-base text-foreground placeholder:text-slate-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium uppercase tracking-wide text-muted-foreground font-sans block">Reference Number (Optional)</label>
                <input 
                  type="text"
                  value={refNumber}
                  onChange={(e) => setRefNumber(e.target.value)}
                  placeholder="e.g., REF-2026-001"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg p-3 font-sans text-base text-foreground placeholder:text-slate-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium uppercase tracking-wide text-muted-foreground font-sans block">Package Type</label>
                <select 
                  value={packageType}
                  onChange={(e) => setPackageType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg p-3 font-sans text-base text-foreground"
                >
                  <option value="Electronics">Electronics</option>
                  <option value="Documents">Documents</option>
                  <option value="Food">Food / Perishables</option>
                  <option value="Fragile">Fragile Goods</option>
                  <option value="Industrial Goods">Industrial Parts</option>
                  <option value="Other">Other Category</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium uppercase tracking-wide text-muted-foreground font-sans block">Priority</label>
                <div className="flex gap-2">
                  {(["STANDARD", "EXPRESS", "CRITICAL"] as const).map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setPriority(level)}
                      className={cn(
                        "flex-1 py-3 px-4 rounded-lg text-base font-semibold tracking-wide transition-all border",
                        priority === level
                          ? "bg-primary/10 text-primary border-primary ring-1 ring-primary"
                          : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
                      )}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Section 2 & 3: Locations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Section 2: Pickup Location */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-7 w-1 bg-gold rounded-full"></div>
                <h2 className="text-xl font-bold font-sans text-foreground">2. Pickup Location</h2>
              </div>
              
              <div className="bg-card border border-border p-5 rounded-xl shadow-sm space-y-4">
                {/* Static Map Picker */}
                <div className="h-28 rounded-lg overflow-hidden relative">
                  <img 
                    alt="Pickup location urban grid view"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBufXIEjtuCJTKXCnA7Tu9uV0NeyX0s0Xn05ElR1uCPuSQHkqbJj_vI8vzneEZBjmAILK1mNHa-RJvS5_fgNk_nBzfGKtztrZDzfSqSk0QzeqbL23k2aGnsoWEcyd3NwpmPr7s3OuFFjFyBXo_kBmrjhooqv0Sw-K9qLTVkTBYtjhfUMzMLBIt7NLMeetfwIBqpsuPUi0A_QqazWYvAFKxX3bTZY_ExBf9gtgKBZ3eZQ6hGy7P8cRK1WxEWFFsMSLPFkUdUYzR_vd0" 
                    className="w-full h-full object-cover grayscale opacity-80"
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <MapPin className="size-6 text-primary animate-pulse" />
                  </div>
                  <div className="absolute bottom-2 left-2 px-2.5 py-1 bg-white/95 rounded text-[10px] font-bold text-slate-800 shadow-sm border border-slate-150 uppercase tracking-widest font-sans">PICKUP ZONE A</div>
                </div>

                <div className="space-y-4 font-sans text-base">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Contact Name</label>
                    <input 
                      type="text" 
                      required
                      value={pickupContact}
                      onChange={(e) => setPickupContact(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-base" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Phone Number</label>
                    <input 
                      type="tel" 
                      required
                      placeholder="+91 XXXXX XXXXX"
                      value={pickupPhone}
                      onChange={(e) => setPickupPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-base" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Street Address</label>
                    <input 
                      type="text" 
                      required
                      value={pickupAddress}
                      onChange={(e) => setPickupAddress(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-base" 
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium uppercase tracking-wide text-muted-foreground">City</label>
                      <input 
                        type="text" 
                        required
                        value={pickupCity}
                        onChange={(e) => setPickupCity(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-base" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium uppercase tracking-wide text-muted-foreground">State</label>
                      <select 
                        value={pickupState}
                        onChange={(e) => setPickupState(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-base"
                      >
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Telangana">Telangana</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Pincode</label>
                      <input 
                        type="text" 
                        required
                        placeholder="400001"
                        value={pickupPincode}
                        onChange={(e) => setPickupPincode(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-base tabular-nums" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: Delivery Location */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-7 w-1 bg-primary rounded-full"></div>
                <h2 className="text-xl font-bold font-sans text-foreground">3. Delivery Location</h2>
              </div>
              
              <div className="bg-card border border-border p-5 rounded-xl shadow-sm space-y-4">
                {/* Static Map Picker */}
                <div className="h-28 rounded-lg overflow-hidden relative">
                  <img 
                    alt="Delivery location destination grid view"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrrRQQpOwVVRW7qh9mYObiEIit0eC29_xYVQY4Bb635ma0TfWAEQRaAVyqTMx4RNHIK4BTNkw9GaqkzRMIKBP09MtZOQDLETT85zjmE-SWkrDOc19AOhLQKwRtwPqLZOfqLurwFdHiBaIhXZOdK1I5dDBFdzHsiX2_T8SG6kLf2LRbW0dCi4lKhq3vyAWe-zzDmuSTzReBH-oiXA3DLlVsWDtmUBTrQJ4yVwMuQ-tpEAojKpMm3yQpIEy3clxqgTOyJMaF5fHCgmQ" 
                    className="w-full h-full object-cover grayscale opacity-80"
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    {/* Gold indicator matching destinationVote */}
                    <Navigation className="size-6 text-gold rotate-45" />
                  </div>
                  <div className="absolute bottom-2 left-2 px-2.5 py-1 bg-white/95 rounded text-[10px] font-bold text-slate-800 shadow-sm border border-slate-150 uppercase tracking-widest font-sans">DESTINATION B</div>
                </div>

                <div className="space-y-4 font-sans text-base">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Contact Name</label>
                    <input 
                      type="text" 
                      required
                      value={dropContact}
                      onChange={(e) => setDropContact(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-base" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Phone Number</label>
                    <input 
                      type="tel" 
                      required
                      placeholder="+91 XXXXX XXXXX"
                      value={dropPhone}
                      onChange={(e) => setDropPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-base" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Street Address</label>
                    <input 
                      type="text" 
                      required
                      value={dropAddress}
                      onChange={(e) => setDropAddress(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-base" 
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium uppercase tracking-wide text-muted-foreground">City</label>
                      <input 
                        type="text" 
                        required
                        value={dropCity}
                        onChange={(e) => setDropCity(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-base" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium uppercase tracking-wide text-muted-foreground">State</label>
                      <select 
                        value={dropState}
                        onChange={(e) => setDropState(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-base"
                      >
                        <option value="Karnataka">Karnataka</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Telangana">Telangana</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Pincode</label>
                      <input 
                        type="text" 
                        required
                        placeholder="560001"
                        value={dropPincode}
                        onChange={(e) => setDropPincode(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-base tabular-nums" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Section 4: Package Information */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-7 w-1 bg-slate-400 rounded-full"></div>
              <h2 className="text-xl font-bold font-sans text-foreground">4. Package Information</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 bg-card border border-border p-6 rounded-xl shadow-sm">
              <div className="space-y-1.5">
                <label className="text-sm font-medium uppercase tracking-wide text-muted-foreground block">Weight (kg)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    step="0.1"
                    min="0.1"
                    value={weight}
                    onChange={(e) => setWeight(parseFloat(e.target.value) || 0.1)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-base font-semibold tabular-nums pr-12" 
                  />
                  <span className="absolute right-3.5 top-3.5 text-xs font-bold text-slate-400 uppercase">KG</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium uppercase tracking-wide text-muted-foreground block">Dimensions (L x W x H cm)</label>
                <input 
                  type="text" 
                  value={dimensions}
                  onChange={(e) => setDimensions(e.target.value)}
                  placeholder="e.g. 10 x 10 x 10"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-base font-semibold tabular-nums" 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium uppercase tracking-wide text-muted-foreground block">Packages Count</label>
                <input 
                  type="number" 
                  min="1"
                  value={numPackages}
                  onChange={(e) => setNumPackages(parseInt(e.target.value) || 1)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-base font-semibold tabular-nums" 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium uppercase tracking-wide text-muted-foreground block">Package Value (₹)</label>
                <div className="relative">
                  <input 
                    type="number"
                    min="0" 
                    value={packageValue}
                    onChange={(e) => setPackageValue(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-base font-semibold tabular-nums pl-8" 
                  />
                  <span className="absolute left-3.5 top-3.5 text-sm font-bold text-slate-400">₹</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Cost Summary Card & Optimization Details */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24 h-fit">
          
          {/* Section 5: Delivery Estimate Card */}
          <div className="bg-primary text-primary-foreground overflow-hidden rounded-xl shadow-lg transition-transform duration-300 hover:scale-[1.02] border border-primary/20">
            <div className="bg-gradient-to-br from-primary to-primary/80 p-6 md:p-8">
              <span className="font-sans text-sm font-medium uppercase tracking-wide text-primary-foreground/90 block">Estimated Fulfillment Cost</span>
              <div className="flex items-baseline gap-2 mt-2 mb-4">
                <span className="text-3xl md:text-4xl lg:text-5xl font-bold font-sans tabular-nums">₹ {getFulfillmentCost()}</span>
                <span className="text-sm font-sans font-semibold uppercase tracking-wider text-primary-foreground/85">INR</span>
              </div>
              
              <div className="mb-6 border-b border-primary-foreground/15 pb-4">
                <span className="text-xs font-sans font-medium uppercase tracking-wide text-primary-foreground/75">Delivery ID Preview: </span>
                <span className="text-sm font-mono font-semibold tabular-nums">DID-2026-10231</span>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2.5 text-primary-foreground/85">
                    <Navigation className="size-4 rotate-45" />
                    <span className="font-medium">Distance</span>
                  </div>
                  <span className="font-semibold tabular-nums">{distance} km</span>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2.5 text-primary-foreground/85">
                    <Clock className="size-4" />
                    <span className="font-medium">ETA</span>
                  </div>
                  <span className="font-semibold tabular-nums">{priority === "CRITICAL" ? "45m" : priority === "EXPRESS" ? "12h" : "36h"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 6: Optimization Summary Card */}
          <div className="bg-card border border-border p-6 rounded-xl shadow-sm space-y-5">
            <h3 className="font-sans text-sm font-semibold uppercase tracking-wide text-foreground border-b border-slate-50 pb-2.5">Route Optimization Summary</h3>
            
            <div className="space-y-4">
              {/* Driver allocation status */}
              <div className="flex items-start gap-3 text-sm">
                {/* Gold indicator */}
                <div className="mt-0.5 size-7 rounded-full bg-gold/15 flex items-center justify-center text-gold-foreground shrink-0 border border-gold/10">
                  <CheckCircle2 className="size-4.5" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 font-sans">Active Driver Matching</h4>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">Found 12 optimal matches in Bengaluru West Zone fleet clusters.</p>
                </div>
              </div>

              {/* Assignment Time */}
              <div className="flex items-start gap-3 text-sm">
                <div className="mt-0.5 size-7 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 border border-primary/10">
                  <Timer className="size-4.5" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 font-sans">Expected Assign Window</h4>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">&lt; 3 minutes commitment from manifest Ingestion.</p>
                </div>
              </div>

              {/* Traffic details */}
              <div className="flex items-start gap-3 text-sm">
                <div className="mt-0.5 size-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0 border border-slate-200/50">
                  <Info className="size-4.5" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 font-sans">Traffic Factor: Moderate</h4>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">Calculations include current delay logs on NH44 Mumbai-Bengaluru.</p>
                </div>
              </div>
            </div>

            {/* Bottom Tag */}
            <div className="pt-3.5 border-t border-slate-100 flex items-center gap-2.5 text-gold-foreground">
              <Sparkles className="size-3.5" />
              <span className="text-[10px] font-sans font-bold uppercase tracking-wider">ROUTE OPTIMIZATION ENABLED</span>
            </div>
          </div>

          {/* Section 7: Action Buttons */}
          <div className="flex flex-col gap-3">
            <button 
              type="submit"
              className="w-full bg-primary text-primary-foreground py-4 px-8 rounded-xl font-sans text-base font-semibold uppercase tracking-wider shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 transition-all duration-200 active:scale-98"
            >
              CREATE DELIVERY
            </button>
            <button 
              type="button"
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-4 px-8 rounded-xl font-sans text-base font-semibold uppercase tracking-wider transition-all duration-200 active:scale-98 border border-slate-200"
            >
              SAVE AS DRAFT
            </button>
          </div>
        </div>
      </form>

      {/* Success Modal Overlay (Triggered on Create Delivery click) */}
      {showSuccess && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          {/* Backdrop overlay */}
          <div 
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-fade-in"
            onClick={() => setShowSuccess(false)}
          />
          
          {/* Modal Card */}
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100 z-10 animate-in fade-in zoom-in duration-200">
            <div className="h-1.5 w-full bg-primary" />
            
            <div className="p-8 text-center space-y-6">
              {/* Checkmark icon */}
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2 text-primary shadow-inner">
                <CheckCircle2 className="size-9" />
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-slate-800 font-sans">Delivery Created Successfully</h3>
                <p className="text-sm text-muted-foreground mt-1">Your manifest has been recorded and broadcasted to our logistics network.</p>
              </div>

              {/* Manifest summary */}
              <div className="bg-slate-50 border border-slate-200/50 p-4 rounded-xl space-y-2.5 text-sm text-left font-sans">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-muted-foreground uppercase">Delivery ID</span>
                  <span className="font-mono font-semibold text-sm text-primary tabular-nums">#DDP-294-8832</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-muted-foreground uppercase">Estimated ETA</span>
                  <span className="font-semibold text-sm text-slate-800 tabular-nums">{getFulfillmentETA().split(" - ")[0]}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-muted-foreground uppercase">Status</span>
                  <div className="flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-gold"></span>
                    </span>
                    <span className="text-xs font-semibold text-gold-foreground font-sans">ASSIGNMENT PENDING</span>
                  </div>
                </div>
              </div>

              {/* Close controls */}
              <div className="flex gap-3 pt-3">
                <button 
                  type="button"
                  onClick={() => setShowSuccess(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold uppercase tracking-wider font-sans transition-colors"
                >
                  Close Window
                </button>
                <button 
                  type="button"
                  onClick={() => setShowSuccess(false)}
                  className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg text-sm font-semibold uppercase tracking-wider font-sans hover:shadow-md transition-shadow"
                >
                  Track Package
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
}

// Simple avatar profile placeholder icon
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
