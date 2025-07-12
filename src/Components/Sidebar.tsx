// src/app/components/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShieldCheck, ScrollText } from 'lucide-react';

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/access-policies', label: 'Access Policies', icon: ShieldCheck },
  { href: '/logs', label: 'Logs', icon: ScrollText },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-4 hidden md:block">
      <div className="text-xl font-bold mb-8">🔐 MeshLockr</div>
      <nav className="space-y-2">
        {links.map(({ href, label, icon: Icon }) => (
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
