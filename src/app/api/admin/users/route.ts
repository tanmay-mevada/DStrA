import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { User } from '@/models/user';

export async function GET() {
  try {
    await connectDB();

    const users = await User.find({})
      .select('-password')
      .sort({ lastSeen: -1 });
    
    const usersWithPasswordStatus = users.map(user => ({
      ...user.toObject(),
      password: user.password ? 'SET' : '', 
    }));
    
    return NextResponse.json(usersWithPasswordStatus);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}