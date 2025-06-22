// src/app/api/auth/signup/route.ts
import { NextResponse } from 'next/server';
import { User } from '@/models/user';
import connectDB from '@/lib/db';

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const existingUser = await User.findOne({ email: body.email });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const newUser = await User.create({
      email: body.email,
      password: body.password, // You should hash this
      role: 'student',
    });

    return NextResponse.json({ message: 'User created', user: newUser });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
