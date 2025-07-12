// src/app/components/Navbar.tsx
'use client';

import { usePathname } from 'next/navigation';
import { OrganizationSwitcher, UserButton } from '@clerk/nextjs';

const titleMap: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/access-policies': 'Access Policies',
  '/logs': 'Logs',
};

export default function Navbar() {
  const pathname = usePathname();
  const title =
    Object.keys(titleMap).find((key) => pathname.startsWith(key)) !== undefined
      ? titleMap[pathname]
      : 'MeshLockr Admin';

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b bg-white shadow-sm">
      <div className="text-lg font-semibold tracking-tight">{title}</div>
      <div className="flex items-center gap-4">
        <OrganizationSwitcher
          appearance={{
            elements: {
              organizationSwitcherTrigger: 'py-1 px-2 border rounded-md',
            },
          }}
        />
        <UserButton afterSignOutUrl="/" />
      </div>
    </header>
  );
}
