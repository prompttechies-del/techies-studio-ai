import { NextResponse } from 'next/server';
import { getDb, writeDb } from '@/lib/db';

export async function GET() {
  try {
    const db = getDb();
    return NextResponse.json(db.mediaFiles || []);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to retrieve media library' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const db = getDb();
    
    const newMedia = {
      id: body.id || `media_${Date.now()}`,
      name: body.name || 'Untitled File',
      size: body.size || '0.0 MB',
      type: body.type || 'video',
      uploadDate: new Date().toISOString().split('T')[0],
      thumbnail: body.thumbnail || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop',
      url: body.url,
      duration: body.duration,
      resolution: body.resolution,
      status: body.status || 'ready'
    };

    db.mediaFiles = [newMedia, ...(db.mediaFiles || [])];
    writeDb(db);
    
    return NextResponse.json(newMedia);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to register media' }, { status: 500 });
  }
}
