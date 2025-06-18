'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '', role: 'student' });
  const [error, setError] = useState('');

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
    <div className="flex items-center justify-center h-full px-4 py-20 bg-background dark:bg-backgroundDark">
      <div className="w-full max-w-md p-6 border rounded shadow bg-surface dark:bg-surfaceDark border-border dark:border-borderDark">
        <h1 className="mb-4 text-2xl font-bold text-text dark:text-textDark">Create Account</h1>

        {error && <p className="mb-2 text-sm text-red-500">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border rounded bg-background dark:bg-backgroundDark text-text dark:text-textDark border-border dark:border-borderDark"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border rounded bg-background dark:bg-backgroundDark text-text dark:text-textDark border-border dark:border-borderDark"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          <button
            type="submit"
            className="w-full py-2 font-semibold text-white transition rounded bg-primary dark:bg-darkPrimary hover:opacity-90"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
