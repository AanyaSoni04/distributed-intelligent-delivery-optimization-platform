-- CreateEnum
CREATE TYPE "public"."DriverAvailability" AS ENUM ('AVAILABLE', 'BUSY', 'OFFLINE', 'BREAK');

-- CreateEnum
CREATE TYPE "public"."DriverVerificationStatus" AS ENUM ('PENDING', 'VERIFIED', 'SUSPENDED', 'REJECTED');

-- CreateEnum
CREATE TYPE "public"."DriverWorkingStatus" AS ENUM ('OFF_DUTY', 'ON_DUTY', 'ON_DELIVERY', 'RETURNING');

-- CreateEnum
CREATE TYPE "public"."DriverEventType" AS ENUM ('REGISTERED', 'ONLINE', 'OFFLINE', 'LOCATION_UPDATED', 'ASSIGNMENT_ACCEPTED', 'ASSIGNMENT_REJECTED', 'DELIVERY_COMPLETED', 'SHIFT_STARTED', 'SHIFT_ENDED', 'AVAILABILITY_CHANGED');

-- CreateTable
CREATE TABLE "public"."DriverProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "employeeCode" TEXT,
    "phoneNumber" TEXT NOT NULL,
    "emergencyContact" TEXT,
    "verificationStatus" "public"."DriverVerificationStatus" NOT NULL DEFAULT 'PENDING',
    "licenseNumber" TEXT,
    "licenseExpiry" TIMESTAMP(3),
    "insuranceExpiry" TIMESTAMP(3),
    "vehicleRegistrationExpiry" TIMESTAMP(3),
    "vehicleVerifiedAt" TIMESTAMP(3),
    "vehicleType" TEXT,
    "vehicleNumber" TEXT,
    "vehicleCapacity" DOUBLE PRECISION,
    "vehicleModel" TEXT,
    "vehicleColor" TEXT,
    "vehicleFuelType" TEXT,
    "currentLatitude" DOUBLE PRECISION,
    "currentLongitude" DOUBLE PRECISION,
    "lastLocationUpdate" TIMESTAMP(3),
    "locationSharingEnabled" BOOLEAN NOT NULL DEFAULT true,
    "locationSharingUpdatedAt" TIMESTAMP(3),
    "availabilityStatus" "public"."DriverAvailability" NOT NULL DEFAULT 'OFFLINE',
    "availabilityReason" TEXT,
    "workingStatus" "public"."DriverWorkingStatus" NOT NULL DEFAULT 'OFF_DUTY',
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "shiftStartTime" TIMESTAMP(3),
    "shiftEndTime" TIMESTAMP(3),
    "lastShiftStartedAt" TIMESTAMP(3),
    "lastShiftEndedAt" TIMESTAMP(3),
    "currentWarehouseId" TEXT,
    "deviceId" TEXT,
    "devicePlatform" TEXT,
    "appVersion" TEXT,
    "lastHeartbeatAt" TIMESTAMP(3),
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 5.0,
    "completedDeliveries" INTEGER NOT NULL DEFAULT 0,
    "cancelledDeliveries" INTEGER NOT NULL DEFAULT 0,
    "rejectedAssignments" INTEGER NOT NULL DEFAULT 0,
    "activeAssignments" INTEGER NOT NULL DEFAULT 0,
    "maxCapacity" INTEGER NOT NULL DEFAULT 5,
    "totalDistanceTravelled" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalWorkingMinutes" INTEGER NOT NULL DEFAULT 0,
    "totalIdleMinutes" INTEGER NOT NULL DEFAULT 0,
    "averageDeliveryTime" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DriverProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DriverLocationHistory" (
    "id" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "speed" DOUBLE PRECISION,
    "heading" DOUBLE PRECISION,
    "accuracy" DOUBLE PRECISION,
    "batteryLevel" DOUBLE PRECISION,
    "capturedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DriverLocationHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DriverEvent" (
    "id" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "eventType" "public"."DriverEventType" NOT NULL,
    "message" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DriverEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DriverProfile_userId_key" ON "public"."DriverProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "DriverProfile_employeeCode_key" ON "public"."DriverProfile"("employeeCode");

-- CreateIndex
CREATE INDEX "DriverProfile_userId_idx" ON "public"."DriverProfile"("userId");

-- CreateIndex
CREATE INDEX "DriverProfile_availabilityStatus_idx" ON "public"."DriverProfile"("availabilityStatus");

-- CreateIndex
CREATE INDEX "DriverProfile_workingStatus_idx" ON "public"."DriverProfile"("workingStatus");

-- CreateIndex
CREATE INDEX "DriverProfile_isOnline_idx" ON "public"."DriverProfile"("isOnline");

-- CreateIndex
CREATE INDEX "DriverProfile_currentWarehouseId_idx" ON "public"."DriverProfile"("currentWarehouseId");

-- CreateIndex
CREATE INDEX "DriverProfile_rating_idx" ON "public"."DriverProfile"("rating");

-- CreateIndex
CREATE INDEX "DriverLocationHistory_driverId_idx" ON "public"."DriverLocationHistory"("driverId");

-- CreateIndex
CREATE INDEX "DriverLocationHistory_capturedAt_idx" ON "public"."DriverLocationHistory"("capturedAt");

-- CreateIndex
CREATE INDEX "DriverEvent_driverId_idx" ON "public"."DriverEvent"("driverId");

-- CreateIndex
CREATE INDEX "DriverEvent_createdAt_idx" ON "public"."DriverEvent"("createdAt");

-- CreateIndex
CREATE INDEX "DriverEvent_eventType_idx" ON "public"."DriverEvent"("eventType");

-- AddForeignKey
ALTER TABLE "public"."Assignment" ADD CONSTRAINT "Assignment_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "public"."DriverProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DriverProfile" ADD CONSTRAINT "DriverProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DriverLocationHistory" ADD CONSTRAINT "DriverLocationHistory_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "public"."DriverProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DriverEvent" ADD CONSTRAINT "DriverEvent_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "public"."DriverProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
