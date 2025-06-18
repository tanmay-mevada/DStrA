'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const res = await signIn('credentials', {
      redirect: true,
      callbackUrl: '/',
      email: form.email,
      password: form.password,
    });

    if (res?.error) {
      setError('Invalid email or password');
    }
  }

  return (
    <div className="flex items-center justify-center h-full px-4 py-20 bg-background dark:bg-backgroundDark">
      <div className="w-full max-w-md p-6 border rounded shadow-md bg-surface dark:bg-surfaceDark border-border dark:border-borderDark">
        <h1 className="flex items-center justify-center mb-4 text-2xl font-bold text-text dark:text-textDark">Log In</h1>

        {error && <p className="mb-2 text-sm text-red-600 dark:text-red-500">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border rounded bg-background dark:bg-backgroundDark text-text dark:text-textDark border-border dark:border-borderDark focus:outline-none"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border rounded bg-background dark:bg-backgroundDark text-text dark:text-textDark border-border dark:border-borderDark focus:outline-none"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <button
            type="submit"
            className="w-full py-2 font-semibold text-white transition rounded bg-primary dark:bg-darkPrimary hover:opacity-90"
          >
            Log In
          </button>
        </form>

        <div className="mt-4 text-sm text-center text-text dark:text-textDark">OR</div>

        <button
          onClick={() => signIn('google', { callbackUrl: '/' })}
          className="w-full py-2 mt-3 font-semibold text-white transition bg-red-500 rounded hover:bg-red-600"
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
}
