'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { User } from '@/models/user';
import connectDB from '@/lib/db';

export async function trackUserActivity(path: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return;

  await connectDB();

  await User.findOneAndUpdate(
    { email: session.user.email },
    {
      $set: { lastSeen: new Date() },
      $push: {
        pageVisits: {
          $each: [{ path, visitedAt: new Date() }],
          $slice: -50,
        },
      },
    }
  );
}
