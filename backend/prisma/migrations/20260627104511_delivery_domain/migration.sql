-- CreateEnum
CREATE TYPE "public"."DeliveryStatus" AS ENUM ('CREATED', 'PICKUP_PENDING', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'FAILED', 'CANCELLED', 'RETURNED');

-- CreateEnum
CREATE TYPE "public"."AssignmentStatus" AS ENUM ('UNASSIGNED', 'ASSIGNMENT_PENDING', 'ASSIGNED', 'DRIVER_ACCEPTED', 'DRIVER_REJECTED', 'REASSIGNMENT_REQUIRED');

-- CreateEnum
CREATE TYPE "public"."PriorityLevel" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "public"."ServiceLevel" AS ENUM ('STANDARD', 'SAME_DAY', 'EXPRESS');

-- CreateEnum
CREATE TYPE "public"."PackageType" AS ENUM ('DOCUMENT', 'BOX', 'ELECTRONICS', 'MEDICINE', 'FOOD', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."EventSource" AS ENUM ('CUSTOMER', 'SYSTEM', 'DRIVER', 'WAREHOUSE', 'ADMIN');

-- CreateEnum
CREATE TYPE "public"."DeliverySource" AS ENUM ('CUSTOMER', 'ADMIN', 'WAREHOUSE', 'API', 'MARKETPLACE');

-- CreateTable
CREATE TABLE "public"."TrackingCounter" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "year" INTEGER NOT NULL,
    "lastCounter" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrackingCounter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Delivery" (
    "id" TEXT NOT NULL,
    "trackingNumber" TEXT NOT NULL,
    "clientRequestId" TEXT,
    "customerId" TEXT NOT NULL,
    "pickupAddressId" TEXT NOT NULL,
    "deliveryAddressId" TEXT NOT NULL,
    "originWarehouseId" TEXT,
    "destinationWarehouseId" TEXT,
    "driverId" TEXT,
    "packageWeight" DOUBLE PRECISION NOT NULL,
    "packageLength" DOUBLE PRECISION,
    "packageWidth" DOUBLE PRECISION,
    "packageHeight" DOUBLE PRECISION,
    "packageType" "public"."PackageType" NOT NULL,
    "packageValue" DOUBLE PRECISION NOT NULL,
    "packageDescription" TEXT NOT NULL,
    "status" "public"."DeliveryStatus" NOT NULL DEFAULT 'CREATED',
    "assignmentStatus" "public"."AssignmentStatus" NOT NULL DEFAULT 'UNASSIGNED',
    "priorityLevel" "public"."PriorityLevel" NOT NULL,
    "serviceLevel" "public"."ServiceLevel" NOT NULL,
    "source" "public"."DeliverySource" NOT NULL,
    "scheduledPickupTime" TIMESTAMP(3),
    "estimatedPickupTime" TIMESTAMP(3),
    "estimatedDeliveryTime" TIMESTAMP(3),
    "estimatedArrivalTime" TIMESTAMP(3),
    "lastEtaCalculationAt" TIMESTAMP(3),
    "actualDeliveryTime" TIMESTAMP(3),
    "currentLatitude" DOUBLE PRECISION,
    "currentLongitude" DOUBLE PRECISION,
    "currentLocationUpdatedAt" TIMESTAMP(3),
    "specialInstructions" TEXT,
    "createdByUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Delivery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DeliveryEvent" (
    "id" TEXT NOT NULL,
    "deliveryId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "previousStatus" "public"."DeliveryStatus",
    "currentStatus" "public"."DeliveryStatus" NOT NULL,
    "source" "public"."EventSource" NOT NULL,
    "message" TEXT NOT NULL,
    "metadata" JSONB,
    "createdByUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DeliveryEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Delivery_trackingNumber_key" ON "public"."Delivery"("trackingNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Delivery_clientRequestId_key" ON "public"."Delivery"("clientRequestId");

-- CreateIndex
CREATE INDEX "Delivery_trackingNumber_idx" ON "public"."Delivery"("trackingNumber");

-- CreateIndex
CREATE INDEX "Delivery_customerId_idx" ON "public"."Delivery"("customerId");

-- CreateIndex
CREATE INDEX "Delivery_status_idx" ON "public"."Delivery"("status");

-- CreateIndex
CREATE INDEX "Delivery_assignmentStatus_idx" ON "public"."Delivery"("assignmentStatus");

-- CreateIndex
CREATE INDEX "Delivery_createdAt_idx" ON "public"."Delivery"("createdAt");

-- CreateIndex
CREATE INDEX "Delivery_estimatedDeliveryTime_idx" ON "public"."Delivery"("estimatedDeliveryTime");

-- CreateIndex
CREATE INDEX "Delivery_driverId_idx" ON "public"."Delivery"("driverId");

-- CreateIndex
CREATE INDEX "DeliveryEvent_deliveryId_idx" ON "public"."DeliveryEvent"("deliveryId");

-- CreateIndex
CREATE INDEX "DeliveryEvent_createdAt_idx" ON "public"."DeliveryEvent"("createdAt");

-- CreateIndex
CREATE INDEX "DeliveryEvent_eventType_idx" ON "public"."DeliveryEvent"("eventType");

-- AddForeignKey
ALTER TABLE "public"."Delivery" ADD CONSTRAINT "Delivery_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."CustomerProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Delivery" ADD CONSTRAINT "Delivery_pickupAddressId_fkey" FOREIGN KEY ("pickupAddressId") REFERENCES "public"."Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Delivery" ADD CONSTRAINT "Delivery_deliveryAddressId_fkey" FOREIGN KEY ("deliveryAddressId") REFERENCES "public"."Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Delivery" ADD CONSTRAINT "Delivery_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DeliveryEvent" ADD CONSTRAINT "DeliveryEvent_deliveryId_fkey" FOREIGN KEY ("deliveryId") REFERENCES "public"."Delivery"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DeliveryEvent" ADD CONSTRAINT "DeliveryEvent_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
