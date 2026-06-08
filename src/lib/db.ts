// Local Database Layer using browser's native IndexedDB
// Provides zero-cloud-cost persistent storage for projects, video/audio blobs, and exports.

const DB_NAME = "TechiesStudioDB";
const DB_VERSION = 1;

export interface DBProject {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  tracks: {
    video: Array<{
      id: string;
      mediaId: string;
      name: string;
      start: number; // offset on timeline
      cutStart: number; // cut start inside file
      duration: number; // active playing duration
      speed: number;
      scale: number;
      x: number;
      y: number;
      rotation: number;
      flipX: boolean;
      flipY: boolean;
    }>;
    audio: Array<{
      id: string;
      mediaId: string;
      name: string;
      start: number;
      cutStart: number;
      duration: number;
      volume: number;
      fadeIn: number;
      fadeOut: number;
    }>;
    subtitle: Array<{
      id: string;
      text: string;
      start: number;
      duration: number;
      words?: Array<{ word: string; start: number; end: number }>;
    }>;
  };
  settings: {
    resolution: string; // "1080p" | "720p" | "2k" | "4k"
    fps: number;
    aspectRatio: string; // "9:16" | "16:9" | "1:1"
  };
}

export interface DBMedia {
  id: string;
  name: string;
  type: string;
  size: number;
  duration: number;
  resolution: string;
  data: Blob;
  createdAt: string;
}

export interface DBExport {
  id: string;
  name: string;
  date: string;
  size: number;
  resolution: string;
  fps: number;
  data: Blob;
}

export function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("IndexedDB is only available in the browser"));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = request.result;
      
      // Projects store
      if (!db.objectStoreNames.contains("projects")) {
        db.createObjectStore("projects", { keyPath: "id" });
      }
      
      // Media files binary store (blobs)
      if (!db.objectStoreNames.contains("media")) {
        db.createObjectStore("media", { keyPath: "id" });
      }
      
      // Rendered export history
      if (!db.objectStoreNames.contains("exports")) {
        db.createObjectStore("exports", { keyPath: "id" });
      }
    };
  });
}

// --- Projects Store Actions ---

export async function saveProject(project: DBProject): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("projects", "readwrite");
    const store = tx.objectStore("projects");
    const req = store.put(project);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function getProject(id: string): Promise<DBProject | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("projects", "readonly");
    const store = tx.objectStore("projects");
    const req = store.get(id);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

export async function getAllProjects(): Promise<DBProject[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("projects", "readonly");
    const store = tx.objectStore("projects");
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

export async function deleteProject(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("projects", "readwrite");
    const store = tx.objectStore("projects");
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

// --- Media Store Actions ---

export async function saveMedia(media: DBMedia): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("media", "readwrite");
    const store = tx.objectStore("media");
    const req = store.put(media);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function getMedia(id: string): Promise<DBMedia | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("media", "readonly");
    const store = tx.objectStore("media");
    const req = store.get(id);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

export async function getAllMedia(): Promise<DBMedia[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("media", "readonly");
    const store = tx.objectStore("media");
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

export async function deleteMedia(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("media", "readwrite");
    const store = tx.objectStore("media");
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

// --- Exports Store Actions ---

export async function saveExport(exportRecord: DBExport): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("exports", "readwrite");
    const store = tx.objectStore("exports");
    const req = store.put(exportRecord);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function getAllExports(): Promise<DBExport[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("exports", "readonly");
    const store = tx.objectStore("exports");
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

export async function deleteExport(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("exports", "readwrite");
    const store = tx.objectStore("exports");
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}
