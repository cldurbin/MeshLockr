// src/app/dashboard/page.tsx

// src/app/page.tsx
'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">🔒 MeshLockr Admin Dashboard</h1>
      <p className="mb-6 text-gray-700">You&#39;re signed in and ready to manage access policies and logs.</p>
      
      <nav className="space-y-4">
        <Link
          href="/dashboard"
          className="block w-fit bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          → Go to Dashboard
        </Link>
        <Link
          href="/logs"
          className="block w-fit bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          → View Logs
        </Link>
        <Link
          href="/access-policies"
          className="block w-fit bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          → Manage Access Policies
        </Link>
      </nav>
    </main>
  );
}


// This page displays a welcome message to the user and can be expanded with more dashboard features.
// It uses Clerk's `currentUser` to fetch the authenticated user's information.