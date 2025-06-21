// src/app/api/programs/route.ts
import connectDB from '@/lib/db';
import Program from '@/models/program';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  await connectDB();
  const programs = await Program.find().sort({ createdAt: -1 });
  return NextResponse.json(programs);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const data = await req.json();
  const newProgram = await Program.create(data);
  return NextResponse.json(newProgram, { status: 201 });
}
