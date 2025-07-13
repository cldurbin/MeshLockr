'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Toaster } from 'sonner';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import clsx from 'clsx';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { userId } = auth();
  if (!userId) redirect('/sign-in');

  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Auto-close mobile sidebar on route change
  useEffect(() => {
    if (window.innerWidth < 768) setIsOpen(false);
  }, [pathname]);

  return (
    <>
      <div className="flex min-h-screen bg-gray-50 text-gray-900">
        {/* Desktop Sidebar */}
        <aside
          className={clsx(
            'hidden md:flex flex-col transition-all duration-300 ease-in-out bg-white border-r border-gray-200 shadow-md',
            isOpen ? 'w-64' : 'w-20'
          )}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h1
              className={clsx(
                'text-lg font-bold transition-opacity duration-200',
                isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
              )}
            >
              🔐 MeshLockr
            </h1>
            <button onClick={() => setIsOpen((prev) => !prev)} className="ml-auto text-gray-500 hover:text-gray-700">
              <Menu size={20} />
            </button>
          </div>
          <nav className="flex flex-col gap-2 px-4 py-4 text-sm">
            {NAV_ITEMS.map((item) => (
              <SidebarLink key={item.href} {...item} isOpen={isOpen} />
            ))}
          </nav>
        </aside>

        {/* Mobile Topbar */}
        <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-10 flex items-center justify-between px-4 py-3">
          <button onClick={() => setIsOpen(true)} className="text-gray-600">
            <Menu size={24} />
          </button>
          <span className="font-bold text-lg">🔐 MeshLockr</span>
        </div>

        {/* Mobile Slide-In Sidebar */}
        {isOpen && (
          <div
            className="md:hidden fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity duration-300"
            onClick={() => setIsOpen(false)}
          >
            <div
              className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-lg p-5 transform translate-x-0 transition-transform duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              <nav className="flex flex-col gap-4 text-sm">
                {NAV_ITEMS.map((item) => (
                  <SidebarLink key={item.href} {...item} isOpen />
                ))}
              </nav>
            </div>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 p-6 pt-16 md:pt-6 overflow-auto">{children}</main>
      </div>

      <Toaster />
    </>
  );
}

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', emoji: '🏠' },
  { href: '/policies', label: 'Access Policies', emoji: '🔐' },
  { href: '/logs', label: 'Logs', emoji: '📜' },
  { href: '/users', label: 'Users & Roles', emoji: '👥' },
  { href: '/integrations', label: '+Apps/Integrations', emoji: '🔌' },
  { href: '/alerts', label: 'Security Alerts', emoji: '🚨' },
  { href: '/settings', label: 'Settings', emoji: '⚙️' },
];

function SidebarLink({
  href,
  label,
  emoji,
  isOpen,
}: {
  href: string;
  label: string;
  emoji: string;
  isOpen: boolean;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-2 py-2 rounded hover:bg-gray-100 transition-colors"
    >
      <span>{emoji}</span>
      <span
        className={clsx(
          'transition-opacity duration-200',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
      >
        {label}
      </span>
    </Link>
  );
}
