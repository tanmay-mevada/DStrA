import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { User } from '@/models/user';

// GET single user
export async function GET(req: NextRequest, context: any) {
  await connectDB();

  const { id } = context.params;

  try {
    const user = await User.findById(id).select('-password');
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    console.error('GET single user error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// DELETE single user
export async function DELETE(req: NextRequest, context: any) {
  await connectDB();

  const { id } = context.params;

  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('DELETE user error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
