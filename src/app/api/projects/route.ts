import { NextResponse } from 'next/server';
import { getDb, writeDb } from '@/lib/db';

export async function GET() {
  try {
    const db = getDb();
    return NextResponse.json(db.projects || []);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to retrieve projects' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const db = getDb();
    
    const newProject = {
      id: body.id || `proj_${Date.now()}`,
      name: body.name || 'Untitled Project',
      lastEdited: 'Just now',
      duration: body.duration || '0:15',
      resolution: body.resolution || '1080p',
      fileSize: body.fileSize || '0.0 MB',
      status: body.status || 'ready',
      thumbnail: body.thumbnail || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop',
      videoUrl: body.videoUrl
    };

    const exists = db.projects?.some((p: any) => p.id === body.id);
    if (!exists) {
      db.projects = [newProject, ...(db.projects || [])];
      writeDb(db);
    }
    
    return NextResponse.json(newProject);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
