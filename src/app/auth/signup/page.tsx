'use client';

import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '', role: 'student' });
  const [error, setError] = useState('');
  const [focused, setFocused] = useState({ email: false, password: false });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (!res.ok) return setError(data.error || 'Signup failed');

    router.push('/auth/login');
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-6 sm:py-10 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-sm sm:max-w-md p-6 sm:p-8 border rounded-xl shadow-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <h1 className="mb-4 sm:mb-6 text-2xl sm:text-3xl font-bold text-center text-gray-900 dark:text-white">
          Create Account
        </h1>

        {error && (
          <p className="mb-4 text-sm text-center text-red-600 dark:text-red-400">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Email Input with Floating Label */}
          <div className="relative">
            <input
              type="email"
              id="email"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 peer placeholder-transparent"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              onFocus={() => setFocused({ ...focused, email: true })}
              onBlur={() => setFocused({ ...focused, email: false })}
              required
            />
            <label
              htmlFor="email"
              className={`absolute left-3 sm:left-4 transition-all duration-200 pointer-events-none
                ${focused.email || form.email
                  ? '-top-2 text-xs bg-white dark:bg-gray-800 px-2 text-blue-600 dark:text-blue-400'
                  : 'top-2.5 sm:top-3 text-sm sm:text-base text-gray-500 dark:text-gray-400'
                }`}
            >
              Email
            </label>
          </div>

          {/* Password Input with Floating Label */}
          <div className="relative">
            <input
              type="password"
              id="password"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 peer placeholder-transparent"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              onFocus={() => setFocused({ ...focused, password: true })}
              onBlur={() => setFocused({ ...focused, password: false })}
              required
            />
            <label
              htmlFor="password"
              className={`absolute left-3 sm:left-4 transition-all duration-200 pointer-events-none
                ${focused.password || form.password
                  ? '-top-2 text-xs bg-white dark:bg-gray-800 px-2 text-blue-600 dark:text-blue-400'
                  : 'top-2.5 sm:top-3 text-sm sm:text-base text-gray-500 dark:text-gray-400'
                }`}
            >
              Password
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 sm:py-3 mt-4 sm:mt-6 text-sm sm:text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg transition-colors duration-200"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link
            href="/auth/login"
            className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            Log In
          </Link>
        </p>

        <div className="my-5 text-sm text-center text-gray-500 dark:text-gray-500">
          OR
        </div>

        <button
          onClick={() => signIn('google', { callbackUrl: '/' })}
          className="relative flex items-center justify-center w-full gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-2 text-xs sm:text-sm font-medium bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
        >
          <span className="flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
              />
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
              />
              <path
                fill="#FBBC05"
                d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
              />
              <path fill="none" d="M0 0h48v48H0z" />
            </svg>
          </span>
          <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
            Continue with Google
          </span>
        </button>
      </div>
    </div>
  );
}