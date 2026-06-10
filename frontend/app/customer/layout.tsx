import React from "react";
import { CustomerShell } from "@/components/layout/customer-shell";

export default function CustomerPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CustomerShell>{children}</CustomerShell>;
}
