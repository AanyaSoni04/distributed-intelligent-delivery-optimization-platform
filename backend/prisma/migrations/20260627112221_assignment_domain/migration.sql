-- CreateEnum
CREATE TYPE "public"."AssignmentReason" AS ENUM ('AUTO', 'MANUAL', 'REASSIGNMENT', 'SYSTEM', 'HIGH_PRIORITY');

-- CreateEnum
CREATE TYPE "public"."AssignmentEventType" AS ENUM ('CREATED', 'ACCEPTED', 'REJECTED', 'EXPIRED', 'CANCELLED', 'REASSIGNED');

-- CreateTable
CREATE TABLE "public"."Assignment" (
    "id" TEXT NOT NULL,
    "deliveryId" TEXT NOT NULL,
    "driverId" TEXT,
    "warehouseId" TEXT,
    "status" "public"."AssignmentStatus" NOT NULL DEFAULT 'ASSIGNMENT_PENDING',
    "reason" "public"."AssignmentReason" NOT NULL,
    "strategyUsed" TEXT NOT NULL,
    "assignmentScore" DOUBLE PRECISION,
    "attemptNumber" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "expiredAt" TIMESTAMP(3),
    "isExpired" BOOLEAN NOT NULL DEFAULT false,
    "assignedAt" TIMESTAMP(3) NOT NULL,
    "acceptedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "assignedByUserId" TEXT NOT NULL,
    "acceptedByUserId" TEXT,
    "rejectedByUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Assignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AssignmentEvent" (
    "id" TEXT NOT NULL,
    "assignmentId" TEXT NOT NULL,
    "sequenceNumber" INTEGER NOT NULL,
    "eventType" "public"."AssignmentEventType" NOT NULL,
    "previousStatus" "public"."AssignmentStatus",
    "currentStatus" "public"."AssignmentStatus" NOT NULL,
    "source" "public"."EventSource" NOT NULL,
    "message" TEXT NOT NULL,
    "metadata" JSONB,
    "createdByUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AssignmentEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Assignment_deliveryId_idx" ON "public"."Assignment"("deliveryId");

-- CreateIndex
CREATE INDEX "Assignment_driverId_idx" ON "public"."Assignment"("driverId");

-- CreateIndex
CREATE INDEX "Assignment_status_idx" ON "public"."Assignment"("status");

-- CreateIndex
CREATE INDEX "Assignment_assignedAt_idx" ON "public"."Assignment"("assignedAt");

-- CreateIndex
CREATE INDEX "Assignment_expiresAt_idx" ON "public"."Assignment"("expiresAt");

-- CreateIndex
CREATE INDEX "Assignment_isExpired_idx" ON "public"."Assignment"("isExpired");

-- CreateIndex
CREATE INDEX "AssignmentEvent_assignmentId_idx" ON "public"."AssignmentEvent"("assignmentId");

-- CreateIndex
CREATE INDEX "AssignmentEvent_createdAt_idx" ON "public"."AssignmentEvent"("createdAt");

-- CreateIndex
CREATE INDEX "AssignmentEvent_eventType_idx" ON "public"."AssignmentEvent"("eventType");

-- CreateIndex
CREATE UNIQUE INDEX "AssignmentEvent_assignmentId_sequenceNumber_key" ON "public"."AssignmentEvent"("assignmentId", "sequenceNumber");

-- AddForeignKey
ALTER TABLE "public"."Assignment" ADD CONSTRAINT "Assignment_deliveryId_fkey" FOREIGN KEY ("deliveryId") REFERENCES "public"."Delivery"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Assignment" ADD CONSTRAINT "Assignment_assignedByUserId_fkey" FOREIGN KEY ("assignedByUserId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Assignment" ADD CONSTRAINT "Assignment_acceptedByUserId_fkey" FOREIGN KEY ("acceptedByUserId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Assignment" ADD CONSTRAINT "Assignment_rejectedByUserId_fkey" FOREIGN KEY ("rejectedByUserId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AssignmentEvent" ADD CONSTRAINT "AssignmentEvent_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "public"."Assignment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AssignmentEvent" ADD CONSTRAINT "AssignmentEvent_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
