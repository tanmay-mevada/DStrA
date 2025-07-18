'use client';

import { useEffect, useState } from 'react';

interface User {
  _id: string;
  email: string;
  role: string;
  lastSeen?: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Error loading users');
    }
  };

  const deleteUser = async (id: string) => {
    const confirm = window.confirm('Are you sure you want to delete this user?');
    if (!confirm) return;

    setLoading(id);
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchUsers(); // more consistent
      } else {
        alert('Failed to delete user');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Server error while deleting');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="max-w-4xl p-4 mx-auto mt-6">
      <h1 className="mb-4 text-2xl font-bold text-white">All Users</h1>
      <table className="w-full table-auto border border-gray-700 text-white">
        <thead>
          <tr className="bg-slate-800">
            <th className="px-3 py-2 text-left">Email</th>
            <th className="px-3 py-2 text-left">Role</th>
            <th className="px-3 py-2 text-left">Last Seen</th>
            <th className="px-3 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center py-4 text-gray-400">
                No users found.
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user._id} className="border-t border-gray-700">
                <td className="px-3 py-2">{user.email}</td>
                <td className="px-3 py-2 capitalize">{user.role}</td>
                <td className="px-3 py-2 text-sm text-gray-400">
                  {user.lastSeen ? new Date(user.lastSeen).toLocaleString() : '—'}
                </td>
                <td className="px-3 py-2">
                  <button
                    onClick={() => deleteUser(user._id)}
                    className="text-red-400 hover:text-red-600"
                    disabled={loading === user._id}
                  >
                    {loading === user._id ? 'Deleting...' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
