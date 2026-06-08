import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getDb, writeDb } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Write file to local disk
    const filePath = path.join(uploadDir, file.name);
    fs.writeFileSync(filePath, buffer);

    const videoUrl = `/uploads/${file.name}`;
    const fileSizeString = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;

    // Write to persistent database JSON file
    const db = getDb();
    const newProjectId = `proj_${Date.now()}`;
    const projName = file.name.replace(/\.[^/.]+$/, "");

    const newProject = {
      id: newProjectId,
      name: projName,
      lastEdited: 'Just now',
      duration: '0:15',
      resolution: '1080p',
      fileSize: fileSizeString,
      status: 'ready' as const,
      thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop',
      videoUrl: videoUrl
    };

    const newMedia = {
      id: `media_${Date.now()}`,
      name: file.name,
      size: fileSizeString,
      type: 'video' as const,
      uploadDate: new Date().toISOString().split('T')[0],
      thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop',
      url: videoUrl
    };

    db.projects = [newProject, ...(db.projects || [])];
    db.mediaFiles = [newMedia, ...(db.mediaFiles || [])];
    writeDb(db);

    return NextResponse.json({
      success: true,
      url: videoUrl,
      project: newProject,
      media: newMedia
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to process file upload' }, { status: 500 });
  }
}
