// src/app/api/programs/[id]/route.ts
import { NextResponse } from 'next/server';
import Program from '@/models/program';
import connectDB from '@/lib/db';

export async function GET(
  _req: Request,
  context: { params: { id: string } }
) {
  await connectDB();
  const { id } = context.params;

  try {
    const program = await Program.findById(id);
    if (!program) {
      return NextResponse.json({ message: 'Program not found' }, { status: 404 });
    }

    return NextResponse.json(program); // ✅ This should return full `code`, `description` objects
  } catch (err) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  context: { params: { id: string } }
) {
  await connectDB();
  const { id } = context.params;
  const body = await req.json();

  try {
    const updated = await Program.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ message: 'Update failed' }, { status: 500 });
  }
}
