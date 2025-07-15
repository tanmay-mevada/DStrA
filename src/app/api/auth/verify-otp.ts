import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { User } from '@/models/user';

export async function POST(req: Request) {
  await connectDB();
  const { email, otpInput } = await req.json();

  const user = await User.findOne({ email });

  if (!user)
    return NextResponse.json({ error: 'User not found' }, { status: 404 });

  if (user.isVerified)
    return NextResponse.json({ error: 'User already verified' }, { status: 400 });

  if (user.otp !== otpInput || Date.now() > new Date(user.otpExpires).getTime())
    return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });

  user.isVerified = true;
  user.otp = null;
  user.otpExpires = null;
  await user.save();

  return NextResponse.json({ message: 'Signup verified successfully' });
}
