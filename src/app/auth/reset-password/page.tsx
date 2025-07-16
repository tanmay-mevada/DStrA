'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  // 🔍 Fetch email associated with the token
  useEffect(() => {
    if (!token) {
      toast.error('Invalid or missing token.');
      return;
    }

    const fetchEmail = async () => {
      try {
        const res = await fetch(`/api/auth/reset-password/validate?token=${token}`);
        const data = await res.json();

        if (res.ok) {
          setEmail(data.email);
        } else {
          toast.error(data.error || 'Invalid token.');
        }
      } catch (err) {
        console.error(err);
        toast.error('Could not validate token.');
      }
    };

    fetchEmail();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const text = await res.text();

      if (!res.ok) {
        // Handle empty or non-JSON response
        try {
          const data = JSON.parse(text);
          toast.error(data.error || 'Something went wrong.');
        } catch {
          toast.error('Something went wrong.');
        }
      } else {
        const data = JSON.parse(text);
        toast.success(data.message || 'Password reset successfully!');
        setTimeout(() => router.push('/auth/login'), 2000);
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-6 sm:py-10 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-sm sm:max-w-md p-6 sm:p-8 border rounded-xl shadow-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <h1 className="mb-4 sm:mb-6 text-2xl sm:text-3xl font-bold text-center text-gray-900 dark:text-white">
          Reset Your Password
        </h1>

        {email && (
          <p className="mb-4 text-sm text-center text-gray-700 dark:text-gray-300">
            Resetting password for: <span className="font-medium">{email}</span>
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="password"
              id="new-password"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 peer placeholder-transparent"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
            <label
              htmlFor="new-password"
              className={`absolute left-3 sm:left-4 transition-all duration-200 pointer-events-none ${
                password
                  ? '-top-2 text-xs bg-white dark:bg-gray-800 px-2 text-blue-600 dark:text-blue-400'
                  : 'top-2.5 sm:top-3 text-sm text-gray-500 dark:text-gray-400'
              }`}
            >
              New Password
            </label>
          </div>

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg transition-colors duration-200"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-gray-600 dark:text-gray-400">
          Remembered your password?{' '}
          <a
            href="/auth/login"
            className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            Log In
          </a>
        </p>
      </div>
    </div>
  );
}
