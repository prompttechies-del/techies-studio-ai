import { NextResponse } from 'next/server';
import { getDb, writeDb } from '@/lib/db';

export async function GET() {
  try {
    const db = getDb();
    return NextResponse.json(db.exports || []);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to retrieve exports' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const db = getDb();
    
    const newExport = {
      id: body.id || `export_${Date.now()}`,
      name: body.name || 'export_clip.mp4',
      resolution: body.resolution || '1080p',
      size: body.size || '0.0 MB',
      exportDate: new Date().toLocaleString(),
      thumbnail: body.thumbnail || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop',
      url: body.url
    };

    db.exports = [newExport, ...(db.exports || [])];
    writeDb(db);
    
    return NextResponse.json(newExport);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save export' }, { status: 500 });
  }
}
