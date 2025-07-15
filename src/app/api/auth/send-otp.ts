import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { User } from '@/models/user';
import bcrypt from 'bcryptjs';
import { sendOtpEmail } from '@/utils/sendOtpEmail';

export async function POST(req: Request) {
  await connectDB();
  const { email, password } = await req.json();

  const existing = await User.findOne({ email });
  if (existing && existing.isVerified) {
    return NextResponse.json({ error: 'User already exists' }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

  if (existing) {
    // Update temp user with new OTP
    existing.password = hashedPassword;
    existing.otp = otp;
    existing.otpExpires = otpExpires;
    await existing.save();
  } else {
    // Create temp unverified user
    await User.create({
      email,
      password: hashedPassword,
      otp,
      otpExpires,
      isVerified: false,
    });
  }

  await sendOtpEmail(email, otp);

  return NextResponse.json({ message: 'OTP sent' });
}
