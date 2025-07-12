'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import ThemeToggle from '@/components/ThemeToggle';
import { ShieldUser, Menu, X } from 'lucide-react';

const navItems = [
  { label: 'Learn', href: '/learn' },
  { label: 'Chapters', href: '/chapters' },
  { label: 'Programs', href: '/programs' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const user = session?.user;

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);
  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);

  return (
    <header className="sticky top-0 z-50 border-b shadow-sm bg-background dark:bg-backgroundDark border-border dark:border-borderDark">
      <div className="flex items-center justify-between w-full px-4 py-3 md:px-10">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-primary dark:text-darkPrimary">
          DStrA
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-4 text-sm">
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

          {user?.role === 'admin' && (
            <Link href="/admin" className="px-2 py-2">
              <ShieldUser className="w-6 h-6 text-text dark:text-textDark" />
            </Link>
          )}

          <ThemeToggle />

          {/* Profile / Auth */}
          {status === 'loading' ? (
            <span className="text-gray-400">Loading...</span>
          ) : (
            <div
              className="relative"
              tabIndex={0}
              onBlur={() => setTimeout(() => setDropdownOpen(false), 100)}
            >
              <button
                onClick={toggleDropdown}
                className="overflow-hidden transition border-2 border-gray-300 rounded-full w-9 h-9 dark:border-gray-600 hover:ring-2 ring-sky-400"
              >
                {user?.image ? (
                  <img src={user.image} alt="Profile" className="object-cover w-full h-full" />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-lg font-bold text-gray-600 bg-gray-200 dark:bg-gray-700 dark:text-gray-300">
                    ?
                  </div>
                )}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 z-50 w-48 mt-2 bg-white rounded-md shadow-lg dark:bg-zinc-800 ring-1 ring-black/10 dark:ring-white/10">
                  {user ? (
                    <>
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
                    </>
                  ) : (
                    <>
                      <Link
                        href="/auth/login"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-700"
                      >
                        Login
                      </Link>
                      <Link
                        href="/auth/signup"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-700"
                      >
                        Signup
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-md text-text dark:text-textDark hover:bg-surface dark:hover:bg-surfaceDark"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-2 rounded transition font-medium ${
                pathname.startsWith(item.href)
                  ? 'bg-primary text-black'
                  : 'text-text dark:text-textDark hover:bg-surface dark:hover:bg-surfaceDark'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}

          {user?.role === 'admin' && (
            <Link
              href="/admin"
              className="block px-4 py-2 rounded hover:bg-surface dark:hover:bg-surfaceDark"
              onClick={() => setMobileMenuOpen(false)}
            >
              Admin Panel
            </Link>
          )}

          {user ? (
            <>
              <Link
                href="/account"
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                Manage Account
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  signOut({ callbackUrl: '/' });
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-zinc-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                Signup
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
