// src/app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';
import { Inter } from 'next/font/google';
import Sidebar from '../Components/Sidebar';
import Navbar from '../Components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'MeshLockr Admin',
  description: 'Zero Trust Admin Panel',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} bg-gray-50 text-gray-900`}>
          <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex flex-col flex-1 overflow-y-auto">
              <Navbar />
              <main className="p-6">{children}</main>
            </div>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
