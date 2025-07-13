// src/app/components/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', emoji: '🏠' },
  { href: '/access-policies', label: 'Access Policies', emoji: '🔐' },
  { href: '/logs', label: 'Logs', emoji: '📜' },
  { href: '/users', label: 'Users & Roles', emoji: '👥' },
  { href: '/integrations', label: '+Apps/Integrations', emoji: '🔌' },
  { href: '/alerts', label: 'Security Alerts', emoji: '🚨' },
  { href: '/settings', label: 'Settings', emoji: '⚙️' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-4 hidden md:block">
      <div className="text-xl font-bold mb-8">🔐 MeshLockr</div>
      <nav className="space-y-2">
        {NAV_ITEMS.map(({ href, label, emoji }) => (
          <Link key={href} href={href}>
            <div
              className={`flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 transition ${
                pathname.startsWith(href) ? 'bg-gray-100 font-semibold text-blue-600' : ''
              }`}
            >
              <span>{emoji}</span>
              <span>{label}</span>
            </div>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
