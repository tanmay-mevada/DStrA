'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect, useRef } from 'react';
import ThemeToggle from '@/components/ThemeToggle';
import { ShieldUser, Menu, X, ChevronUp, ChevronDown } from 'lucide-react';

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
  const [isCollapsed, setIsCollapsed] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);
  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);
  const toggleCollapse = () => setIsCollapsed((prev) => !prev);

  // Handle clicking outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Collapsed state - floating essential items
  if (isCollapsed) {
    return (
      <>
        {/* Floating Essential Controls */}
        <div className="fixed top-2 right-2 z-50 flex items-center gap-2">
  {/* Show Navbar Button */}
  <button
    onClick={toggleCollapse}
    className="w-9 h-9 flex items-center justify-center rounded-full shadow-lg bg-primary text-white hover:bg-primary/90 transition-colors"
    title="Show navbar"
    aria-label="Show navbar"
  >
    <ChevronDown className="w-5 h-5" />
  </button>

  {/* Theme Toggle Button */}
  <div className="w-9 h-9 flex items-center justify-center rounded-full shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
    <div className="scale-[0.8]">
      <ThemeToggle />
    </div>
  </div>

  {/* Profile / Auth */}
  {status === 'loading' ? (
    <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse shadow-lg" />
  ) : (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="w-9 h-9 overflow-hidden flex items-center justify-center transition-all border-2 border-white dark:border-gray-600 rounded-full shadow-lg hover:ring-2 ring-sky-400 focus:ring-2 focus:ring-sky-400 focus:outline-none"
        aria-label="User menu"
        aria-expanded={dropdownOpen}
      >
        {user?.image ? (
          <img src={user.image} alt="Profile" className="object-cover w-full h-full" />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-lg font-bold text-gray-600 bg-gray-200 dark:bg-gray-700 dark:text-gray-300">
            {user?.name?.charAt(0).toUpperCase() || '?'}
          </div>
        )}
      </button>
    </div>
  )}
</div>


              {dropdownOpen && (
                <div className="absolute right-0 z-50 w-48 mt-2 bg-white rounded-md shadow-lg dark:bg-zinc-800 ring-1 ring-black/10 dark:ring-white/10">
                  {user ? (
                    <>
                      <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-600">
                        {user.email}
                      </div>
                      <Link
                        href="/account"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Manage Account
                      </Link>
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          signOut({ callbackUrl: '/' });
                        }}
                        className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/auth/login"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Login
                      </Link>
                      <Link
                        href="/auth/signup"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>
              )}

        {/* Mobile Floating Menu */}
        <div className="md:hidden fixed bottom-4 left-4 right-4 z-50">
          <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700">
            {/* Logo */}
            <Link href="/" className="text-lg font-bold text-primary dark:text-darkPrimary">
              DStrA
            </Link>

            <div className="flex items-center gap-2">
              {/* Mobile Menu Toggle */}
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle mobile menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              {/* Show Navbar Button */}
              <button
                onClick={toggleCollapse}
                className="p-2 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors"
                title="Show navbar"
                aria-label="Show navbar"
              >
                <ChevronUp className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-4 py-2 rounded transition-colors font-medium ${
                    pathname.startsWith(item.href)
                      ? 'bg-primary text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              {user?.role === 'admin' && (
                <Link
                  href="/admin"
                  className="block px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin Panel
                </Link>
              )}

              <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>

              {user ? (
                <>
                  <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                    {user.email}
                  </div>
                  <Link
                    href="/account"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Manage Account
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      signOut({ callbackUrl: '/' });
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </>
    );
  }

  // Full navbar (expanded state)
  return (
    <header className="sticky top-0 z-50 border-b shadow-sm bg-background dark:bg-backgroundDark border-border dark:border-borderDark">
      <div className="flex items-center justify-between w-full px-4 py-3 md:px-10">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-primary dark:text-darkPrimary">
          DStrA
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4 text-sm">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-2 rounded transition-colors font-medium ${
                pathname.startsWith(item.href)
                  ? 'bg-primary text-black'
                  : 'text-text dark:text-textDark hover:bg-surface dark:hover:bg-surfaceDark'
              }`}
            >
              {item.label}
            </Link>
          ))}

          {user?.role === 'admin' && (
            <Link 
              href="/admin" 
              className="px-2 py-2 rounded hover:bg-surface dark:hover:bg-surfaceDark transition-colors"
              title="Admin Panel"
            >
              <ShieldUser className="w-6 h-6 text-text dark:text-textDark" />
            </Link>
          )}

          <ThemeToggle />

{/* Profile / Auth */}
{status === 'loading' ? (
  <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
) : (
  <div className="relative" ref={dropdownRef}>
    <button
      onClick={toggleDropdown}
      className="overflow-hidden transition-all border-2 border-gray-300 rounded-full w-9 h-9 dark:border-gray-600 hover:ring-2 ring-sky-400 focus:ring-2 focus:ring-sky-400 focus:outline-none"
      aria-label="User menu"
      aria-expanded={dropdownOpen}
    >
      {user ? (
        user.image ? (
          <img src={user.image} alt="Profile" className="object-cover w-full h-full" />
        ) : (
          // Logged in but no image: show default avatar
          <img src="/default-avatar.png" alt="Default Avatar" className="object-cover w-full h-full" />
        )
      ) : (
        // Not logged in: show ?
        <div className="flex items-center justify-center w-full h-full text-lg font-bold text-gray-600 bg-gray-200 dark:bg-gray-700 dark:text-gray-300">
          ?
        </div>
      )}
    </button>

    {dropdownOpen && (
      <div className="absolute right-0 z-50 w-48 mt-2 bg-white rounded-md shadow-lg dark:bg-zinc-800 ring-1 ring-black/10 dark:ring-white/10">
        {user ? (
          <>
            <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-600">
              {user.email}
            </div>
            <Link
              href="/account"
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
              onClick={() => setDropdownOpen(false)}
            >
              Manage Account
            </Link>
            <button
              onClick={() => {
                setDropdownOpen(false);
                signOut({ callbackUrl: '/' });
              }}
              className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              href="/auth/login"
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
              onClick={() => setDropdownOpen(false)}
            >
              Login
            </Link>
            <Link
              href="/auth/signup"
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
              onClick={() => setDropdownOpen(false)}
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    )}
  </div>
)}


          {/* Hide Navbar Button */}
          <button
            onClick={toggleCollapse}
            className="p-2 rounded-md text-text dark:text-textDark hover:bg-surface dark:hover:bg-surfaceDark transition-colors"
            title="Hide navbar"
            aria-label="Hide navbar"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
        </nav>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-md text-text dark:text-textDark hover:bg-surface dark:hover:bg-surfaceDark transition-colors"
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          
          {/* Mobile Hide Button */}
          <button
            onClick={toggleCollapse}
            className="p-2 rounded-md text-text dark:text-textDark hover:bg-surface dark:hover:bg-surfaceDark transition-colors"
            title="Hide navbar"
            aria-label="Hide navbar"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2 border-t border-border dark:border-borderDark">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-2 rounded transition-colors font-medium ${
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
              className="block px-4 py-2 rounded hover:bg-surface dark:hover:bg-surfaceDark transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Admin Panel
            </Link>
          )}

          <div className="border-t border-border dark:border-borderDark my-2"></div>

          {user ? (
            <>
              <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                {user.email}
              </div>
              <Link
                href="/account"
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Manage Account
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  signOut({ callbackUrl: '/' });
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}