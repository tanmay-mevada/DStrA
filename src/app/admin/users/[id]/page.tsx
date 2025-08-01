'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams, usePathname } from 'next/navigation';
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
    password?: string;
    role: string;
    lastSeen?: string;
    pageVisits: PageVisit[];
    isVerified: boolean;
    resetToken?: string;
    resetTokenExpiry?: string;
    updatedAt?: string;
    createdAt?: string;
    __v?: number;
    otp?: string;
    otpExpires?: string;
}

export default function UserDetailPage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [showAllLogs, setShowAllLogs] = useState(false);

    const { data: session, status } = useSession();
    const router = useRouter();
    const params = useParams();
    const pathname = usePathname();
    const userId = params.id as string;

    useEffect(() => {
        if (status === 'loading') return;

        if (!session?.user || session.user.role !== 'admin') {
            toast.error("ACCESS DENIED - UNAUTHORIZED");
            router.replace('/');
            return;
        }

        trackUserActivity(pathname);

        if (userId) {
            fetchUser();
        }
    }, [session, status, router, userId, pathname]);

    const fetchUser = async () => {
        try {
            const res = await fetch(`/api/admin/users/${userId}`);
            if (!res.ok) {
                if (res.status === 404) {
                    toast.error('User not found');
                    router.push('/admin/users');
                    return;
                }
                throw new Error('Failed to fetch user');
            }
            const userData = await res.json();
            setUser(userData);
        } catch (error) {
            console.error('Error fetching user:', error);
            toast.error('Error loading user details');
            router.push('/admin/users');
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async () => {
        const confirm = window.confirm(`Are you sure you want to delete user ${user?.email}? This action cannot be undone.`);
        if (!confirm) return;

        setDeleteLoading(true);
        try {
            const res = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success('User deleted successfully');
                router.push('/admin/users');
            } else {
                toast.error('Failed to delete user');
            }
        } catch (err) {
            console.error('Delete error:', err);
            toast.error('Server error while deleting');
        } finally {
            setDeleteLoading(false);
        }
    };

    if (loading || status === 'loading') {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background dark:bg-backgroundDark">
                <Spinner />
            </div>
        );
    }

    if (!session?.user || session.user.role !== 'admin' || !user) {
        return null;
    }

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return '—';
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getUniquePages = (pageVisits: PageVisit[]) => {
        const pageCount: { [key: string]: number } = {};
        const pageLastVisit: { [key: string]: string } = {};

        pageVisits.forEach(visit => {
            pageCount[visit.path] = (pageCount[visit.path] || 0) + 1;
            if (!pageLastVisit[visit.path] || new Date(visit.visitedAt) > new Date(pageLastVisit[visit.path])) {
                pageLastVisit[visit.path] = visit.visitedAt;
            }
        });

        return Object.entries(pageCount)
            .map(([path, count]) => ({
                path,
                count,
                lastVisit: pageLastVisit[path]
            }))
            .sort((a, b) => new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime());
    };

    const getRecentVisits = (pageVisits: PageVisit[]) => {
        return [...pageVisits]
            .sort((a, b) => new Date(b.visitedAt).getTime() - new Date(a.visitedAt).getTime());
    };

    const StatusBadge = ({ condition, trueText, falseText, trueColor, falseColor }: {
        condition: boolean;
        trueText: string;
        falseText: string;
        trueColor: string;
        falseColor: string;
    }) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${condition ? trueColor : falseColor}`}>
            {condition ? trueText : falseText}
        </span>
    );

    const uniquePages = getUniquePages(user.pageVisits || []);
    const allVisits = getRecentVisits(user.pageVisits || []);

    return (
        <div className="min-h-screen transition-colors bg-background dark:bg-backgroundDark text-text dark:text-textDark">
            <div className="max-w-6xl p-4 mx-auto lg:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-primary">User Details</h1>
                        </div>
                    </div>

                    <button
                        onClick={deleteUser}
                        disabled={deleteLoading}
                        className="px-4 py-2 text-sm font-medium text-white transition-colors bg-red-500 rounded-lg hover:bg-red-600 disabled:opacity-50"
                    >
                        {deleteLoading ? 'Deleting...' : 'Delete User'}
                    </button>
                </div>

                {/* User Profile Section */}
                <div className="p-6 mb-6 bg-white border shadow-sm dark:bg-slate-800 rounded-xl border-borderL dark:border-slate-600 dark:shadow-lg">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                        <div className="flex items-center justify-center w-20 h-20 text-2xl font-bold text-white rounded-full shadow-lg bg-gradient-to-r from-primary to-darkPrimary">
                            {user.email[0].toUpperCase()}
                        </div>
                        <div className="flex-1">
                            <h2 className="mb-3 text-2xl font-bold text-text dark:text-white">{user.email}</h2>
                            <div className="flex flex-wrap gap-3 mb-4">
                                <StatusBadge
                                    condition={user.role === 'admin'}
                                    trueText="Administrator"
                                    falseText="Regular User"
                                    trueColor="bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400 dark:border dark:border-red-500/30"
                                    falseColor="bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 dark:border dark:border-blue-500/30"
                                />
                                <StatusBadge
                                    condition={user.isVerified}
                                    trueText="Verified Account"
                                    falseText="Google Linked Account"
                                    trueColor="bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400 dark:border dark:border-green-500/30"
                                    falseColor="bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400 dark:border dark:border-yellow-500/30"
                                />
                            </div>
                            <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
                                <div className="p-3 border rounded-lg bg-surface dark:bg-slate-700/50 dark:border-slate-600">
                                    <span className="text-gray-600 dark:text-gray-400">Last Seen: </span>
                                    <span className="font-medium text-text dark:text-white">{formatDate(user.lastSeen)}</span>
                                </div>
                                <div className="p-3 border rounded-lg bg-surface dark:bg-slate-700/50 dark:border-slate-600">
                                    <span className="text-gray-600 dark:text-gray-400">Joined: </span>
                                    <span className="font-medium text-text dark:text-white">{formatDate(user.createdAt)}</span>
                                </div>
                                <div className="p-3 border rounded-lg bg-surface dark:bg-slate-700/50 dark:border-slate-600">
                                    <span className="text-gray-600 dark:text-gray-400">Total Visits: </span>
                                    <span className="font-bold text-primary dark:text-primary">{user.pageVisits?.length || 0}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Account Information Section */}
                <div className="p-6 mb-6 bg-white border shadow-sm dark:bg-slate-800 rounded-xl border-borderL dark:border-slate-600 dark:shadow-lg">
                    <h3 className="mb-4 text-xl font-bold text-primary dark:text-primary">Account Information</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="p-4 border rounded-lg bg-surface dark:bg-slate-700/50 dark:border-slate-600">
                            <h4 className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">User ID</h4>
                            <p className="text-sm break-all font-techmono text-text dark:text-white">{user._id}</p>
                        </div>
                        <div className="p-4 border rounded-lg bg-surface dark:bg-slate-700/50 dark:border-slate-600">
                            <h4 className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">Email Address</h4>
                            <p className="text-sm text-text dark:text-white">{user.email}</p>
                        </div>
                        <div className="p-4 border rounded-lg bg-surface dark:bg-slate-700/50 dark:border-slate-600">
                            <h4 className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">User Role</h4>
                            <StatusBadge
                                condition={user.role === 'admin'}
                                trueText="Administrator"
                                falseText="Regular User"
                                trueColor="bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400 dark:border dark:border-red-500/30"
                                falseColor="bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 dark:border dark:border-blue-500/30"
                            />
                        </div>
                        <div className="p-4 border rounded-lg bg-surface dark:bg-slate-700/50 dark:border-slate-600">
                            <h4 className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">Account Status</h4>
                            <StatusBadge
                                condition={user.isVerified}
                                trueText="Verified"
                                falseText="Google Linked Account"
                                trueColor="bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400 dark:border dark:border-green-500/30"
                                falseColor="bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400 dark:border dark:border-yellow-500/30"
                            />
                        </div>
                    </div>
                </div>

                {/* Security Information Section */}
                <div className="p-6 mb-6 bg-white border shadow-sm dark:bg-slate-800 rounded-xl border-borderL dark:border-slate-600 dark:shadow-lg">
                    <h3 className="mb-4 text-xl font-bold text-primary dark:text-primary">Security Information</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="p-4 border rounded-lg bg-surface dark:bg-slate-700/50 dark:border-slate-600">
                            <h4 className="mb-3 text-sm font-medium text-gray-600 dark:text-gray-400">Password Status</h4>
                            <StatusBadge
                                condition={!!user.password}
                                trueText="Password Set"
                                falseText="No Password"
                                trueColor="bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400 dark:border dark:border-green-500/30"
                                falseColor="bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400 dark:border dark:border-red-500/30"
                            />
                        </div>
                        <div className="p-4 border rounded-lg bg-surface dark:bg-slate-700/50 dark:border-slate-600">
                            <h4 className="mb-3 text-sm font-medium text-gray-600 dark:text-gray-400">OTP Status</h4>
                            <StatusBadge
                                condition={!!user.otp}
                                trueText="OTP Active"
                                falseText="No Active OTP"
                                trueColor="bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 dark:border dark:border-blue-500/30"
                                falseColor="bg-gray-100 text-gray-700 dark:bg-gray-600/30 dark:text-gray-400 dark:border dark:border-gray-500/30"
                            />
                            {user.otp && (
                                <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                                    Expires: {formatDate(user.otpExpires)}
                                </p>
                            )}
                        </div>
                        {user.resetToken && (
                            <div className="p-4 border rounded-lg bg-surface dark:bg-slate-700/50 dark:border-slate-600 md:col-span-2">
                                <h4 className="mb-3 text-sm font-medium text-gray-600 dark:text-gray-400">Active Reset Token</h4>
                                <p className="p-3 mb-2 text-xs break-all bg-gray-100 border rounded font-techmono dark:bg-slate-600 dark:border-slate-500 text-text dark:text-white">
                                    {user.resetToken.substring(0, 40)}...
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                    Expires: {formatDate(user.resetTokenExpiry)}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Activity Section */}
                <div className="p-6 bg-white border shadow-sm dark:bg-surfaceDark rounded-xl border-borderL dark:border-borderDark">
                    <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
                        <h3 className="text-xl font-bold text-primary dark:text-darkPrimary">
                            User Activity {showAllLogs ? `(${allVisits.length} total visits)` : `(${uniquePages.length} unique pages)`}
                        </h3>
                        <button
                            onClick={() => setShowAllLogs(!showAllLogs)}
                            className="px-4 py-2 text-sm transition-colors border rounded-lg bg-surface dark:bg-surfaceDark hover:bg-primary hover:text-white dark:hover:bg-darkPrimary border-borderL dark:border-borderDark"
                        >
                            {showAllLogs ? 'Show Unique Pages' : 'See All Visit Logs'}
                        </button>
                    </div>

                    <div className="space-y-3 overflow-y-auto max-h-96">
                        {showAllLogs ? (
                            allVisits.length > 0 ? (
                                allVisits.map((visit, index) => (
                                    <div key={visit._id} className={`flex flex-col gap-2 p-4 rounded-lg sm:flex-row sm:justify-between sm:items-center ${index % 2 === 0 ? 'bg-surface dark:bg-surfaceDark/50' : 'bg-transparent'}`}>
                                        <span className="text-sm font-medium break-all font-techmono">{visit.path}</span>
                                        <span className="text-sm opacity-70 whitespace-nowrap">{formatDate(visit.visitedAt)}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="py-12 text-center opacity-70">
                                    <p>No activity recorded for this user</p>
                                </div>
                            )
                        ) : (
                            uniquePages.length > 0 ? (
                                uniquePages.map(({ path, count, lastVisit }) => (
                                    <div key={path} className="flex flex-col gap-3 p-4 rounded-lg bg-surface dark:bg-surfaceDark/50 sm:flex-row sm:justify-between sm:items-center">
                                        <div className="flex-1">
                                            <div className="mb-1 text-sm font-medium break-all font-techmono">{path}</div>
                                            <div className="text-sm opacity-70">
                                                <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary dark:bg-darkPrimary/20 dark:text-darkPrimary">
                                                    {count} visit{count !== 1 ? 's' : ''}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-sm opacity-70 whitespace-nowrap">
                                            Last: {formatDate(lastVisit)}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-12 text-center opacity-70">
                                    <p>No pages visited by this user</p>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}