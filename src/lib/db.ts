import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'db.json');

export function getDb() {
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify({ projects: [], mediaFiles: [], exports: [] }, null, 2));
  }
  const fileContent = fs.readFileSync(dbPath, 'utf-8');
  return JSON.parse(fileContent);
}

export function writeDb(data: any) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
}
