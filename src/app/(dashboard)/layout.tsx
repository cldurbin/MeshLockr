// src/app/(dashboard)/layout.tsx

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import React from "react";
import { Toaster } from "sonner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <>
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-lg p-4">
          <h2 className="text-xl font-bold mb-6">🔐 MeshLockr</h2>
          <nav className="flex flex-col gap-2">
            <Link href="/dashboard" className="text-blue-600 hover:underline">
              Dashboard
            </Link>
            <Link href="/policies" className="text-blue-600 hover:underline">
              Access Policies
            </Link>
            <Link href="/logs" className="text-blue-600 hover:underline">
              Logs
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>

      {/* ✅ Toast Notifications */}
      <Toaster />
    </>
  );
}
