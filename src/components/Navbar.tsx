'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect, useRef } from 'react';
import ThemeToggle from '@/components/ThemeToggle';
import { ShieldUser, Menu, X, ChevronUp, ChevronDown, User } from 'lucide-react';
import { La_Belle_Aurore } from 'next/font/google';

const navItems = [
  { label: 'Learn', href: '/learn' },
  { label: 'Chapters', href: '/chapters' },
  { label: 'Programs', href: '/programs' },
  { label: 'About', href: '/about'},
  { label: 'Contact', href: '/contact' },
];

// Security: Validate and sanitize image URLs
const isValidImageUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);
    // Allow only HTTPS URLs from trusted domains
    return parsedUrl.protocol === 'https:' && 
           (parsedUrl.hostname.endsWith('.googleusercontent.com') || 
            parsedUrl.hostname.endsWith('.github.com') ||
            parsedUrl.hostname.endsWith('.gravatar.com') ||
            parsedUrl.hostname === 'avatars.githubusercontent.com');
  } catch {
    return false;
  }
};

// Security: Sanitize user name for display
const sanitizeUserName = (name: string): string => {
  return name.replace(/[<>\"'&]/g, '').substring(0, 50);
};

// Security: Sanitize email for display
const sanitizeEmail = (email: string): string => {
  return email.replace(/[<>\"'&]/g, '').substring(0, 100);
};

// Avatar component with proper error handling and security
const UserAvatar = ({ user, size = 'w-9 h-9' }: { user: any; size?: string }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  // Reset states when user changes
  useEffect(() => {
    setImageError(false);
    setImageLoading(true);
  }, [user?.image]);

  const renderAvatar = () => {
    // User is logged in and has a valid image
    if (user && user.image && isValidImageUrl(user.image) && !imageError) {
      return (
        <img
          src={user.image}
          alt="Profile"
          className={`object-cover w-full h-full ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
          onError={handleImageError}
          onLoad={handleImageLoad}
          loading="lazy"
        />
      );
    }

    // User is logged in but no image or image failed to load
    if (user) {
      return (
        <div className="flex items-center justify-center w-full h-full bg-gray-200 dark:bg-gray-700">
          <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </div>
      );
    }

    // User is not logged in
    return (
      <div className="flex items-center justify-center w-full h-full text-lg font-bold text-gray-600 bg-gray-200 dark:bg-gray-700 dark:text-gray-300">
        ?
      </div>
    );
  };

  return (
    <div className={`${size} rounded-full overflow-hidden relative`}>
      {renderAvatar()}
      {imageLoading && user?.image && isValidImageUrl(user.image) && !imageError && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
      )}
    </div>
  );
};

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const user = session?.user;

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const navbarRef = useRef<HTMLElement>(null);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);
  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);
  const toggleCollapse = () => setIsCollapsed((prev) => !prev);

  // Update CSS custom property for navbar height
  const updateNavbarHeight = () => {
    if (isCollapsed) {
      // When collapsed, navbar doesn't take space in document flow
      document.documentElement.style.setProperty('--navbar-height', '0px');
    } else {
      // When expanded, get the actual navbar height
      if (navbarRef.current) {
        const height = navbarRef.current.offsetHeight;
        document.documentElement.style.setProperty('--navbar-height', `${height}px`);
      } else {
        // Fallback height estimation based on your navbar structure
        const estimatedHeight = mobileMenuOpen ? 200 : 64; // Adjust based on your actual heights
        document.documentElement.style.setProperty('--navbar-height', `${estimatedHeight}px`);
      }
    }
  };

  // Update navbar height when state changes
  useEffect(() => {
    const timeoutId = setTimeout(updateNavbarHeight, 50); // Small delay for DOM updates
    return () => clearTimeout(timeoutId);
  }, [isCollapsed, mobileMenuOpen]);

  // Update navbar height on window resize
  useEffect(() => {
    const handleResize = () => {
      updateNavbarHeight();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isCollapsed, mobileMenuOpen]);

  // Initial navbar height setup
  useEffect(() => {
    // Set initial CSS variable
    document.documentElement.style.setProperty('--navbar-height', '0px');
    
    // Update after component mounts
    const timeoutId = setTimeout(updateNavbarHeight, 100);
    return () => clearTimeout(timeoutId);
  }, []);

  // Mobile scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show navbar when scrolling up, hide when scrolling down
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    // Only add scroll listener on mobile
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    
    const addScrollListener = () => {
      if (mediaQuery.matches) {
        window.addEventListener('scroll', handleScroll, { passive: true });
      }
    };

    const removeScrollListener = () => {
      window.removeEventListener('scroll', handleScroll);
    };

    addScrollListener();
    mediaQuery.addEventListener('change', (e) => {
      if (e.matches) {
        addScrollListener();
      } else {
        removeScrollListener();
        setIsVisible(true);
      }
    });

    return () => {
      removeScrollListener();
    };
  }, [lastScrollY]);

  // Handle clicking outside dropdown and mobile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setDropdownOpen(false);
        setMobileMenuOpen(false);
      }
    };

    if (dropdownOpen || mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [dropdownOpen, mobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  // Security: Safe logout function
  const handleLogout = () => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    signOut({ callbackUrl: '/' });
  };

  // Collapsed state - only for desktop
  if (isCollapsed) {
    return (
      <div className="fixed z-50 hidden md:block top-2 right-2">
        <div className="flex items-center gap-2">
          {/* Show Navbar Button */}
          <button
            onClick={toggleCollapse}
            className="flex items-center justify-center text-white transition-colors rounded-full shadow-lg w-9 h-9 bg-primary hover:bg-primary/90"
            title="Show navbar"
            aria-label="Show navbar"
          >
            <ChevronDown className="w-5 h-5" />
          </button>

          {/* Theme Toggle Button */}
          <div className="flex items-center justify-center bg-white border border-gray-200 rounded-full shadow-lg w-9 h-9 dark:bg-gray-800 dark:border-gray-700">
            <div className="scale-[0.8]">
              <ThemeToggle />
            </div>
          </div>

          {/* Profile / Auth */}
          {status === 'loading' ? (
            <div className="bg-gray-200 rounded-full shadow-lg w-9 h-9 dark:bg-gray-700 animate-pulse" />
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="transition-all border-2 border-white rounded-full shadow-lg dark:border-gray-600 hover:ring-2 ring-sky-400 focus:ring-2 focus:ring-sky-400 focus:outline-none"
                aria-label="User menu"
                aria-expanded={dropdownOpen}
              >
                <UserAvatar user={user} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 z-[60] w-48 mt-2 bg-white rounded-md shadow-lg dark:bg-zinc-800 ring-1 ring-black/10 dark:ring-white/10">
                  {user ? (
                    <>
                      <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-600">
                        {sanitizeEmail(user.email || '')}
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-sm text-left text-red-600 transition-colors hover:bg-gray-100 dark:hover:bg-zinc-700"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/auth/login"
                        className="block px-4 py-2 text-sm text-gray-700 transition-colors dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-700"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Login
                      </Link>
                      <Link
                        href="/auth/signup"
                        className="block px-4 py-2 text-sm text-gray-700 transition-colors dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-700"
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
        </div>
      </div>
    );
  }

  // Full navbar (expanded state)
  return (
    <header 
      ref={navbarRef}
      className={`sticky top-0 z-50 border-b shadow-sm bg-background dark:bg-backgroundDark border-border dark:border-borderDark transition-transform duration-300 ${
        !isVisible ? 'md:translate-y-0 -translate-y-full' : 'translate-y-0'
      }`}
    >
      <div className="flex items-center justify-between w-full px-4 py-3 md:px-10">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold font-techmono text-primary dark:text-darkPrimary">
          DStrA
        </Link>

        {/* Desktop Navigation */}
        <nav className="items-center hidden gap-4 text-sm md:flex">
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
              className="px-2 py-2 transition-colors rounded hover:bg-surface dark:hover:bg-surfaceDark"
              title="Admin Panel"
            >
              <ShieldUser className="w-6 h-6 text-text dark:text-textDark" />
            </Link>
          )}

          <ThemeToggle />

          {/* Profile / Auth */}
          {status === 'loading' ? (
            <div className="bg-gray-200 rounded-full w-9 h-9 dark:bg-gray-700 animate-pulse"></div>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="transition-all border-2 border-gray-300 rounded-full dark:border-gray-600 hover:ring-2 ring-sky-400 focus:ring-2 focus:ring-sky-400 focus:outline-none"
                aria-label="User menu"
                aria-expanded={dropdownOpen}
              >
                <UserAvatar user={user} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 z-50 w-48 mt-2 bg-white rounded-md shadow-lg dark:bg-zinc-800 ring-1 ring-black/10 dark:ring-white/10">
                  {user ? (
                    <>
                      <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-600">
                        {sanitizeEmail(user.email || '')}
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-sm text-left text-red-600 transition-colors hover:bg-gray-100 dark:hover:bg-zinc-700"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/auth/login"
                        className="block px-4 py-2 text-sm text-gray-700 transition-colors dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-700"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Login
                      </Link>
                      <Link
                        href="/auth/signup"
                        className="block px-4 py-2 text-sm text-gray-700 transition-colors dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-700"
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

          {/* Hide Navbar Button - Desktop only */}
          <button
            onClick={toggleCollapse}
            className="p-2 transition-colors rounded-md text-text dark:text-textDark hover:bg-surface dark:hover:bg-surfaceDark"
            title="Hide navbar"
            aria-label="Hide navbar"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
        </nav>

        {/* Mobile Navigation - Theme Toggle and Menu */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          
          <button
            onClick={toggleMobileMenu}
            className="p-2 transition-colors rounded-md text-text dark:text-textDark hover:bg-surface dark:hover:bg-surfaceDark"
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="px-4 pb-4 space-y-2 border-t md:hidden border-border dark:border-borderDark bg-background dark:bg-backgroundDark">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-2 rounded transition-colors font-medium ${
                pathname.startsWith(item.href)
                  ? 'bg-primary text-black'
                  : 'text-text dark:text-textDark hover:bg-surface dark:hover:bg-surfaceDark'
              }`}
              onClick={() => {
                setMobileMenuOpen(false);
                setDropdownOpen(false);
              }}
            >
              {item.label}
            </Link>
          ))}

          {user?.role === 'admin' && (
            <Link
              href="/admin"
              className="block px-4 py-2 transition-colors rounded hover:bg-surface dark:hover:bg-surfaceDark"
              onClick={() => {
                setMobileMenuOpen(false);
                setDropdownOpen(false);
              }}
            >
              Admin Panel
            </Link>
          )}

          <div className="my-2 border-t border-border dark:border-borderDark"></div>

          {/* Mobile User Section */}
          {user ? (
            <>
              <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                <div className="font-medium text-text dark:text-textDark">
                  {sanitizeUserName(user.name || 'User')}
                </div>
                <div className="text-xs truncate">
                  {sanitizeEmail(user.email || '')}
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-sm text-left text-red-600 transition-colors rounded hover:bg-surface dark:hover:bg-surfaceDark"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="block px-4 py-2 text-sm transition-colors rounded text-text dark:text-textDark hover:bg-surface dark:hover:bg-surfaceDark"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setDropdownOpen(false);
                }}
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="block px-4 py-2 text-sm transition-colors rounded text-text dark:text-textDark hover:bg-surface dark:hover:bg-surfaceDark"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setDropdownOpen(false);
                }}
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