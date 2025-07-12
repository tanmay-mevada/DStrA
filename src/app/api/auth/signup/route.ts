// src/app/api/auth/signup/route.ts
import { NextResponse } from 'next/server';
import { User } from '@/models/user';
import connectDB from '@/lib/db';
import bcrypt from 'bcryptjs'; 

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const existingUser = await User.findOne({ email: body.email });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = bcrypt.hashSync(body.password, 10);

    const newUser = await User.create({
      email: body.email,
      password: hashedPassword,
      role: 'student',
    });

    return NextResponse.json({ message: 'User created', user: newUser });
  } catch (err) {
    console.error(err); // ✅ log error for debugging
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
