import React from "react";
import { DriverShell } from "@/components/layout/driver-shell";

export default function DriverPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DriverShell>{children}</DriverShell>;
}
