'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { trackUserActivity } from '@/lib/trackUserActivity';
import Spinner from '@/components/Spinner';
import toast from 'react-hot-toast';

interface PageVisit {
  _id: string;
  path: string;
  visitedAt: string;
}

interface User {
  _id: string;
  email: string;
  role: string;
  lastSeen?: string;
  pageVisits: PageVisit[];
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<string | null>(null);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [sortField, setSortField] = useState<'email' | 'lastSeen' | 'pageVisits'>('lastSeen');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  // Auth check + activity tracking
  useEffect(() => {
    if (status === 'loading') return;

    if (!session?.user || session.user.role !== 'admin') {
      toast.error('ACCESS DENIED - UNAUTHORIZED');
      router.replace('/');
    } else {
      trackUserActivity(pathname);
    }
  }, [session, status, router, pathname]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background dark:bg-backgroundDark">
        <Spinner />
      </div>
    );
  }

  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Sort users when state changes
  useEffect(() => {
    const sorted = [...users].sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortField) {
        case 'email':
          aValue = a.email.toLowerCase();
          bValue = b.email.toLowerCase();
          break;
        case 'lastSeen':
          aValue = new Date(a.lastSeen || 0).getTime();
          bValue = new Date(b.lastSeen || 0).getTime();
          break;
        case 'pageVisits':
          aValue = a.pageVisits?.length || 0;
          bValue = b.pageVisits?.length || 0;
          break;
        default:
          return 0;
      }

      return sortOrder === 'asc' ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
    });

    setFilteredUsers(sorted);
  }, [users, sortField, sortOrder]);

  if (!session?.user || session.user.role !== 'admin') {
    return null;
  }

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Error loading users');
    }
  };

  const deleteUser = async (id: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    if (!confirmDelete) return;

    setLoading(id);
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchUsers();
        toast.success('User deleted successfully');
      } else {
        toast.error('Failed to delete user');
      }
    } catch (err) {
      console.error('Delete error:', err);
      toast.error('Server error while deleting');
    } finally {
      setLoading(null);
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const SortButton = ({ field, children }: { field: typeof sortField; children: React.ReactNode }) => (
    <button
      onClick={() => {
        if (sortField === field) {
          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
          setSortField(field);
          setSortOrder('desc');
        }
      }}
      className="flex items-center gap-1 transition-colors text-text dark:text-textDark hover:text-primary dark:hover:text-darkPrimary"
    >
      {children}
      {sortField === field && (
        <span className="text-primary dark:text-darkPrimary">
          {sortOrder === 'asc' ? '↑' : '↓'}
        </span>
      )}
    </button>
  );

  return (
    <div className="min-h-screen transition-colors duration-200 bg-background dark:bg-backgroundDark">
      <div className="p-6 mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="mb-2 text-4xlfont-bold text-primary dark:text-darkPrimary">
              Users Analysis
            </h1>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-hidden shadow-xl rounded-xl bg-surface dark:bg-surfaceDark">
          {filteredUsers.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mb-4 text-4xl text-text dark:text-textDark">👥</div>
              <div className="mb-2 text-xl font-medium text-text dark:text-textDark">
                No users found
              </div>
              <div className="text-text dark:text-textDark/70">
                No users are registered yet
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-surface dark:bg-surfaceDark border-borderL dark:border-borderDark">
                  <tr>
                    <th className="px-6 py-4 text-sm font-semibold text-left text-text dark:text-textDark">
                      User
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-left">
                      <SortButton field="email">Email</SortButton>
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-left text-text dark:text-textDark">
                      Role
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-left">
                      <SortButton field="pageVisits">Activity</SortButton>
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-left">
                      <SortButton field="lastSeen">Last Seen</SortButton>
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-right text-text dark:text-textDark">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-borderL dark:divide-borderDark">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="transition-colors cursor-pointer hover:bg-surface dark:hover:bg-surfaceDark/80"
                      onClick={() => router.push(`/admin/users/${user._id}`)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex items-center justify-center w-10 h-10 font-bold text-white rounded-full bg-gradient-to-r from-primary to-darkPrimary">
                            {user.email[0].toUpperCase()}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-text dark:text-textDark">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 capitalize text-text dark:text-textDark">
                        {user.role}
                      </td>
                      <td className="px-6 py-4 text-sm text-text dark:text-textDark">
                        <div className="font-medium">
                          {user.pageVisits?.length || 0} visits
                        </div>
                        <div className="text-text dark:text-textDark/70">
                          {user.pageVisits?.length
                            ? `${new Set(user.pageVisits.map((v) => v.path)).size} unique pages`
                            : 'No activity'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-text dark:text-textDark">
                        {formatDate(user.lastSeen)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/admin/users/${user._id}`);
                            }}
                            className="px-3 py-1 text-sm font-medium text-primary hover:text-darkPrimary"
                          >
                            View Details
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteUser(user._id);
                            }}
                            className="px-3 py-1 text-sm font-medium text-red-600 hover:text-red-800"
                            disabled={loading === user._id}
                          >
                            {loading === user._id ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
