import { NextResponse } from 'next/server';
import { getDb, writeDb } from '@/lib/db';

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();
    db.mediaFiles = (db.mediaFiles || []).filter((m: any) => m.id !== id);
    writeDb(db);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete media file' }, { status: 500 });
  }
}
