// src/app/components/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShieldCheck,
  ScrollText,
  Users,
  Puzzle,
  AlertTriangle,
  Settings,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/access-policies', label: 'Access Policies', icon: ShieldCheck },
  { href: '/logs', label: 'Logs', icon: ScrollText },
  { href: '/users', label: 'Users & Roles', icon: Users },
  { href: '/integrations', label: '+Apps/Integrations', icon: Puzzle },
  { href: '/alerts', label: 'Security Alerts', icon: AlertTriangle },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-4 hidden md:block">
      <div className="text-xl font-bold mb-8 flex items-center gap-2">
        <ShieldCheck size={20} className="text-blue-600" />
        MeshLockr
      </div>
      <nav className="space-y-2">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href}>
            <div
              className={`flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 transition ${
                pathname.startsWith(href) ? 'bg-gray-100 font-semibold text-blue-600' : ''
              }`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </div>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
