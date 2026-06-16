'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-1">
            <Link
              href="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                isActive('/') ? 'bg-blue-700' : 'hover:bg-blue-700'
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/students"
              className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                isActive('/students') ? 'bg-blue-700' : 'hover:bg-blue-700'
              }`}
            >
              Étudiants
            </Link>
            <Link
              href="/courses"
              className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                isActive('/courses') ? 'bg-blue-700' : 'hover:bg-blue-700'
              }`}
            >
              Cours
            </Link>
            <Link
              href="/enrollments"
              className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                isActive('/enrollments') ? 'bg-blue-700' : 'hover:bg-blue-700'
              }`}
            >
              Inscriptions
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
