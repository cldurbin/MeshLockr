'use client';

import { usePathname } from 'next/navigation';
import { OrganizationSwitcher, UserButton, useOrganization } from '@clerk/nextjs';

const titleMap: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/access-policies': 'Access Policies',
  '/logs': 'Logs',
  '/users': 'Users & Roles',
  '/integrations': 'Apps & Integrations',
  '/alerts': 'Security Alerts',
  '/settings': 'Settings',
};

export default function Navbar() {
  const pathname = usePathname();
  const { organization } = useOrganization();

  const currentPage =
    Object.keys(titleMap).find((key) => pathname.startsWith(key)) ?? '';
  const pageTitle = titleMap[currentPage];
  const orgName = organization?.name ?? 'MeshLockr';

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b bg-white shadow-sm">
      <div className="text-lg font-semibold tracking-tight">
        {pageTitle ? `${orgName} – ${pageTitle}` : `${orgName} Admin`}
      </div>
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
// src/Components/Navbar.tsx