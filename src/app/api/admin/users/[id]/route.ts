import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { User } from '@/models/user';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await connectDB();

  try {
    const deleted = await User.findByIdAndDelete(params.id);

    if (!deleted) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
