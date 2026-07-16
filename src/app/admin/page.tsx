import React from "react";
import { redirect } from "next/navigation";
import { getSessionAdminId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import AdminDashboard from "@/components/AdminDashboard";
import { getSiteSettings } from "@/lib/site-settings";

export const revalidate = 0; // Disable static cache so admin shows real-time database state

export default async function AdminPage() {
  // 1. Verify admin session server-side
  const adminId = await getSessionAdminId();
  
  if (!adminId) {
    redirect("/admin/login");
  }

  const [allProducts, settings] = await Promise.all([
    prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    }),
    getSiteSettings(),
  ]);

  return <AdminDashboard initialProducts={allProducts} initialSettings={settings} />;
}
