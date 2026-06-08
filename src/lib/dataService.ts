import { supabase, isSupabaseConfigured } from './supabaseClient';

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  fullName: string;
  avatarUrl: string;
  role: 'free' | 'premium' | 'admin';
}

export interface Project {
  id: string;
  user_id?: string;
  name: string;
  lastEdited: string;
  duration: string;
  resolution: string;
  fileSize: string;
  status: string;
  thumbnail: string;
  videoUrl: string;
  captions?: any[];
  settings?: any;
}

export interface MediaFile {
  id: string;
  user_id?: string;
  name: string;
  size: string;
  type: string;
  uploadDate: string;
  thumbnail: string;
  url: string;
}

export interface ExportedVideo {
  id: string;
  user_id?: string;
  name: string;
  url: string;
  status: string;
  progress: number;
  date: string;
}

// Simulated user for Local Sandbox mode
const LOCAL_USER_KEY = 'ts_local_user';
const defaultMockUser: UserProfile = {
  id: 'usr_local_sandbox',
  email: 'creator@prompttechies.com',
  username: 'telugu_creator',
  fullName: 'Prompt Techies Local Creator',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop',
  role: 'premium',
};

// ==========================================
// 1. AUTHENTICATION SERVICES
// ==========================================

export const authService = {
  async getSession(): Promise<UserProfile | null> {
    if (isSupabaseConfigured && supabase) {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) return null;
      
      // Fetch profile details
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      return {
        id: session.user.id,
        email: session.user.email || '',
        username: profile?.username || session.user.email?.split('@')[0] || 'user',
        fullName: profile?.full_name || '',
        avatarUrl: profile?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop',
        role: profile?.role || 'free',
      };
    } else {
      // Local Sandbox mode auth sync
      if (typeof window !== 'undefined') {
        const localUser = localStorage.getItem(LOCAL_USER_KEY);
        if (localUser) {
          try {
            return JSON.parse(localUser);
          } catch {
            return defaultMockUser;
          }
        }
        // Save default mock user as initially logged in
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(defaultMockUser));
        return defaultMockUser;
      }
      return null;
    }
  },

  async signUp(email: string, password: string, username: string, fullName: string): Promise<{ user: UserProfile | null; error: string | null }> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            full_name: fullName,
          }
        }
      });
      if (error) return { user: null, error: error.message };
      if (!data.user) return { user: null, error: 'Sign up failed.' };

      const userProfile: UserProfile = {
        id: data.user.id,
        email,
        username,
        fullName,
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop',
        role: 'free',
      };
      return { user: userProfile, error: null };
    } else {
      const simulatedUser: UserProfile = {
        id: `usr_${Date.now()}`,
        email,
        username,
        fullName,
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop',
        role: 'free',
      };
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(simulatedUser));
      return { user: simulatedUser, error: null };
    }
  },

  async signIn(email: string, password?: string): Promise<{ user: UserProfile | null; error: string | null }> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: password || '',
      });
      if (error) return { user: null, error: error.message };
      if (!data.user) return { user: null, error: 'Sign in failed.' };

      // Get profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      const userProfile: UserProfile = {
        id: data.user.id,
        email: data.user.email || '',
        username: profile?.username || email.split('@')[0],
        fullName: profile?.full_name || '',
        avatarUrl: profile?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop',
        role: profile?.role || 'free',
      };
      return { user: userProfile, error: null };
    } else {
      const simulatedUser: UserProfile = {
        id: `usr_local_sandbox`,
        email,
        username: email.split('@')[0],
        fullName: email.split('@')[0].toUpperCase(),
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop',
        role: 'premium',
      };
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(simulatedUser));
      return { user: simulatedUser, error: null };
    }
  },

  async signInWithOTP(email: string): Promise<{ success: boolean; error: string | null }> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: typeof window !== 'undefined' ? window.location.origin : '',
        }
      });
      return { success: !error, error: error ? error.message : null };
    } else {
      // Simulate Magic Link send
      return { success: true, error: null };
    }
  },

  async signOut(): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    } else {
      localStorage.removeItem(LOCAL_USER_KEY);
    }
  },

  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: updates.username,
          full_name: updates.fullName,
          avatar_url: updates.avatarUrl,
        })
        .eq('id', userId);

      if (error) return null;
      return {
        id: userId,
        email: updates.email || '',
        username: updates.username || '',
        fullName: updates.fullName || '',
        avatarUrl: updates.avatarUrl || '',
        role: updates.role || 'free',
      };
    } else {
      const currentUser = await this.getSession();
      if (!currentUser) return null;
      const updated = { ...currentUser, ...updates };
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(updated));
      return updated;
    }
  }
};

// ==========================================
// 2. PROJECT DATABASE SERVICES
// ==========================================

export const projectService = {
  async getProjects(): Promise<Project[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) return [];
      return (data || []).map(p => ({
        id: p.id,
        user_id: p.user_id,
        name: p.name,
        lastEdited: p.last_edited,
        duration: p.duration,
        resolution: p.resolution,
        fileSize: p.file_size,
        status: p.status,
        thumbnail: p.thumbnail,
        videoUrl: p.video_url,
        captions: p.captions,
        settings: p.settings
      }));
    } else {
      const res = await fetch('/api/projects');
      if (!res.ok) return [];
      return await res.json();
    }
  },

  async createProject(project: Project): Promise<Project | null> {
    if (isSupabaseConfigured && supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      const payload = {
        id: project.id,
        user_id: user?.id || null,
        name: project.name,
        last_edited: project.lastEdited,
        duration: project.duration,
        resolution: project.resolution,
        file_size: project.fileSize,
        status: project.status,
        thumbnail: project.thumbnail,
        video_url: project.videoUrl,
        captions: project.captions || [],
        settings: project.settings || {}
      };
      
      const { error } = await supabase.from('projects').insert([payload]);
      if (error) return null;
      return project;
    } else {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project)
      });
      if (!res.ok) return null;
      return await res.json();
    }
  },

  async updateProject(id: string, updates: Partial<Project>): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      const dbPayload: any = {};
      if (updates.name !== undefined) dbPayload.name = updates.name;
      if (updates.lastEdited !== undefined) dbPayload.last_edited = updates.lastEdited;
      if (updates.duration !== undefined) dbPayload.duration = updates.duration;
      if (updates.resolution !== undefined) dbPayload.resolution = updates.resolution;
      if (updates.fileSize !== undefined) dbPayload.file_size = updates.fileSize;
      if (updates.status !== undefined) dbPayload.status = updates.status;
      if (updates.thumbnail !== undefined) dbPayload.thumbnail = updates.thumbnail;
      if (updates.videoUrl !== undefined) dbPayload.video_url = updates.videoUrl;
      if (updates.captions !== undefined) dbPayload.captions = updates.captions;
      if (updates.settings !== undefined) dbPayload.settings = updates.settings;

      const { error } = await supabase
        .from('projects')
        .update(dbPayload)
        .eq('id', id);
      return !error;
    } else {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'POST', // Use POST or PUT depending on route setup
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      return res.ok;
    }
  },

  async deleteProject(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      return !error;
    } else {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE'
      });
      return res.ok;
    }
  }
};

// ==========================================
// 3. MEDIA FILES DATABASE SERVICES
// ==========================================

export const mediaService = {
  async getMedia(): Promise<MediaFile[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('media_files')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) return [];
      return (data || []).map(m => ({
        id: m.id,
        user_id: m.user_id,
        name: m.name,
        size: m.size,
        type: m.type,
        uploadDate: m.upload_date,
        thumbnail: m.type === 'video' ? 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop' : '',
        url: m.url
      }));
    } else {
      const res = await fetch('/api/media');
      if (!res.ok) return [];
      return await res.json();
    }
  },

  async addMedia(media: MediaFile): Promise<MediaFile | null> {
    if (isSupabaseConfigured && supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      const payload = {
        id: media.id,
        user_id: user?.id || null,
        name: media.name,
        size: media.size,
        type: media.type,
        upload_date: media.uploadDate,
        url: media.url
      };

      const { error } = await supabase.from('media_files').insert([payload]);
      if (error) return null;
      return media;
    } else {
      const res = await fetch('/api/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(media)
      });
      if (!res.ok) return null;
      return await res.json();
    }
  },

  async deleteMedia(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('media_files').delete().eq('id', id);
      return !error;
    } else {
      const res = await fetch(`/api/media/${id}`, {
        method: 'DELETE'
      });
      return res.ok;
    }
  }
};

// ==========================================
// 4. EXPORT DATABASE SERVICES
// ==========================================

export const exportService = {
  async getExports(): Promise<ExportedVideo[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('exports')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) return [];
      return (data || []).map(e => ({
        id: e.id,
        user_id: e.user_id,
        name: e.name,
        url: e.url,
        status: e.status,
        progress: e.progress,
        date: e.date
      }));
    } else {
      const res = await fetch('/api/exports');
      if (!res.ok) return [];
      return await res.json();
    }
  },

  async addExport(exp: ExportedVideo): Promise<ExportedVideo | null> {
    if (isSupabaseConfigured && supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      const payload = {
        id: exp.id,
        user_id: user?.id || null,
        name: exp.name,
        url: exp.url,
        status: exp.status,
        progress: exp.progress,
        date: exp.date
      };

      const { error } = await supabase.from('exports').insert([payload]);
      if (error) return null;
      return exp;
    } else {
      const res = await fetch('/api/exports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(exp)
      });
      if (!res.ok) return null;
      return await res.json();
    }
  },

  async updateExport(id: string, progress: number, status: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('exports')
        .update({ progress, status })
        .eq('id', id);
      return !error;
    } else {
      // Typically local progress is tracked client-state, but we can hit endpoints if exists
      return true;
    }
  }
};

// ==========================================
// 5. STORAGE BUCKET SERVICES
// ==========================================

export const storageService = {
  async uploadFile(bucket: string, filename: string, file: File, onProgress?: (pct: number) => void): Promise<string | null> {
    if (isSupabaseConfigured && supabase) {
      const cleanPath = `${Date.now()}_${filename.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      
      // Upload using Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(cleanPath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        console.error('Supabase upload error:', error);
        return null;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(cleanPath);

      return publicUrl;
    } else {
      // Local multipart file upload fallback
      const formData = new FormData();
      formData.append('file', file);

      return new Promise((resolve) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/upload', true);
        
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable && onProgress) {
            const percentComplete = Math.round((event.loaded / event.total) * 100);
            onProgress(percentComplete);
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200) {
            try {
              const resJson = JSON.parse(xhr.responseText);
              resolve(resJson.url || null);
            } catch {
              resolve(null);
            }
          } else {
            resolve(null);
          }
        };

        xhr.onerror = () => resolve(null);
        xhr.send(formData);
      });
    }
  }
};
