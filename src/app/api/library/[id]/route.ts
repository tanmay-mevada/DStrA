import { NextRequest, NextResponse } from 'next/server';
import Library from '@/models/library';
import connectDB from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const lib = await Library.findById(params.id);
    if (!lib) return NextResponse.json({ message: 'Not found' }, { status: 404 });
    return NextResponse.json(lib);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const body = await req.json();
    const updated = await Library.findByIdAndUpdate(params.id, body, { new: true });
    if (!updated) return NextResponse.json({ message: 'Not Found' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    await Library.findByIdAndDelete(params.id);
    return NextResponse.json({ message: 'Deleted' });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
