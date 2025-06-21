 'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import ThemeToggle from '@/components/ThemeToggle';
import { ShieldUser } from 'lucide-react';

const navItems = [
  { label: 'Chapters', href: '/chapters' },
  { label: 'Snippets', href: '/snippets' },
  { label: 'Programs', href: '/programs' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const user = session?.user;
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  return (
    <header className="sticky top-0 z-50 border-b shadow-sm bg-background dark:bg-backgroundDark border-border dark:border-borderDark">
      <div className="flex items-center justify-between w-full px-2 py-3 md:px-10">
        <Link href="/" className="text-2xl font-bold text-primary dark:text-darkPrimary">
          DStrA
        </Link>

        <nav className="flex items-center gap-3 text-sm sm:gap-5">
          {/* Static nav links */}
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-2 rounded transition font-medium ${
                pathname.startsWith(item.href)
                  ? 'bg-primary text-black'
                  : 'text-text dark:text-textDark hover:bg-surface dark:hover:bg-surfaceDark'
              }`}
            >
              {item.label}
            </Link>
          ))}

          {/* Admin Panel */}
          {user?.role === 'admin' && (
            <Link
              href="/admin"
              className="px-3 py-2 font-semibold rounded dark:text-text"
            >
            <ShieldUser className="w-7 h-7 text-text dark:text-textDark" />
            </Link>
          )}
          
          <ThemeToggle />
          {/* User Auth Area */}
          {status === 'loading' ? (
            <span className="text-gray-400">Loading...</span>
          ) : user ? (
            <div
              className="relative"
              tabIndex={0}
              onBlur={() => setTimeout(() => setDropdownOpen(false), 100)}
            >
              <button
                onClick={toggleDropdown}
                className="overflow-hidden transition border-2 border-gray-300 rounded-full w-9 h-9 dark:border-gray-600 hover:ring-2 ring-sky-400"
              >
                {user.image ? (
                  <img src={user.image} alt="Profile" className="object-cover w-full h-full" />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-sm font-bold text-gray-600 bg-gray-200 dark:bg-gray-700 dark:text-gray-300">
                    {user.name?.[0] || user.email?.[0]}
                  </div>
                )}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 z-50 w-48 mt-2 bg-white rounded-md shadow-lg dark:bg-zinc-800 ring-1 ring-black/10 dark:ring-white/10">
                  <Link
                    href="/account"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-700"
                  >
                    Manage Account
                  </Link>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      signOut({ callbackUrl: '/' });
                    }}
                    className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-100 dark:hover:bg-zinc-700"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              {pathname !== '/auth/login' && (
                <Link
                  href="/auth/login"
                  className="px-3 py-2 font-semibold text-black rounded bg-primary hover:bg-darkPrimary"
                >
                  Login
                </Link>
              )}
              {pathname !== '/auth/signup' && (
                <Link
                  href="/auth/signup"
                  className="px-3 py-2 font-semibold text-black bg-green-400 rounded hover:bg-green-500"
                >
                  Signup
                </Link>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
