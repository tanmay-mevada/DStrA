'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

export default function RequestResetPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/request-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');

      toast.success('Reset link sent! Check your email.');
      setEmail('');
    } catch (err: any) {
      toast.error(err.message || 'Failed to send reset link.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-6 sm:py-10 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-sm sm:max-w-md p-6 sm:p-8 border rounded-xl shadow-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <h1 className="mb-4 sm:mb-6 text-2xl sm:text-3xl font-bold text-center text-gray-900 dark:text-white">
          Forgot your password?
        </h1>
        <p className="text-sm text-center text-gray-600 dark:text-gray-400 mb-6">
          Enter your email and we’ll send you a reset link.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div className="relative">
            <input
              type="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              required
              className="w-full px-4 py-3 text-sm sm:text-base border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 peer placeholder-transparent"
            />
            <label
              htmlFor="email"
              className={`absolute left-3 sm:left-4 transition-all duration-200 pointer-events-none ${
                focused || email
                  ? '-top-2 text-xs bg-white dark:bg-gray-800 px-1 text-blue-600 dark:text-blue-400'
                  : 'top-3 text-sm text-gray-500 dark:text-gray-400'
              }`}
            >
              Email
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg transition-colors duration-200"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      </div>
    </div>
  );
}
