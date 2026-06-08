"use client";

import React, { useState, useEffect, useRef } from "react";
import { isSupabaseConfigured, supabase } from "@/lib/supabaseClient";
import { authService, projectService, mediaService, exportService, storageService } from "@/lib/dataService";
import type { UserProfile } from "@/lib/dataService";
import {
  ArrowUpRight,
  Award,
  Crown,
  X,
  Menu,
  Video,
  Volume2,
  Zap,
  Image,
  Share2,
  FileCode,
  LayoutDashboard,
  Settings,
  Database,
  Cpu,
  CreditCard,
  Sparkles,
  Plus,
  Trash2,
  Play,
  Pause,
  Upload,
  Activity,
  CheckCircle,
  Server,
  TrendingUp,
  Copy,
  Check,
  ChevronRight,
  HelpCircle,
  Key,
  Code2,
  User,
  Sliders,
  RefreshCw,
  FolderOpen,
  Download,
  Scissors,
  Type,
  Folder,
  VolumeX,
  PlusCircle,
  Eye
} from "lucide-react";

// Types
interface Project {
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

interface MediaFile {
  id: string;
  user_id?: string;
  name: string;
  size: string;
  type: string;
  uploadDate: string;
  thumbnail: string;
  url: string;
  duration?: string;
  resolution?: string;
  status?: string;
}

interface ExportedVideo {
  id: string;
  user_id?: string;
  name: string;
  url: string;
  status: string;
  progress: number;
  date: string;
  resolution?: string;
  size?: string;
  exportDate?: string;
  thumbnail?: string;
}

interface CaptionWord {
  id: number;
  word: string;
  start: number;
  end: number;
}

// Default Captions
const defaultTeluguCaptions: CaptionWord[] = [
  { id: 1, word: "వీడియో ఎడిటింగ్ కోసం", start: 0.2, end: 1.5 },
  { id: 2, word: "ఇంకా గంటల తరబడి కష్టపడుతున్నారా?", start: 1.6, end: 3.2 },
  { id: 3, word: "ఇప్పుడు మీ పని మరింత సులభం!", start: 3.3, end: 4.8 },
  { id: 4, word: "మీ వీడియోను", start: 4.9, end: 5.8 },
  { id: 5, word: "Prompt Techies Studio AI లో అప్లోడ్ చేయండి.", start: 5.9, end: 7.8 },
  { id: 6, word: "క్యాప్షన్స్, థంబ్నెయిల్స్, వైరల్ షార్ట్స్,", start: 7.9, end: 9.6 },
  { id: 7, word: "మరియు ప్రొఫెషనల్ ఎడిటింగ్...", start: 9.7, end: 11.2 },
  { id: 8, word: "అన్నీ కొన్ని సెకన్లలో సిద్ధం.", start: 11.3, end: 12.6 },
  { id: 9, word: "ఎడిట్ చేయండి, ఎక్స్పోర్ట్ చేయండి, ప్రచురించండి.", start: 12.7, end: 14.2 },
  { id: 10, word: "ఈరోజే ఉచితంగా ప్రారంభించండి!", start: 14.3, end: 15.8 }
];

// High-fidelity SVG vectors representing the original SaaS product logos
const CapCutLogo = () => (
  <svg viewBox="0 0 100 100" className="w-8 h-8 select-none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 20 L80 50 L50 80 L20 50 Z" fill="none" stroke="#FFFFFF" strokeWidth="6" />
    <path d="M50 32 L68 50 L50 68 L32 50 Z" fill="none" stroke="#00F0FF" strokeWidth="5" />
    <circle cx="50" cy="50" r="8" fill="#FF007F" />
  </svg>
);

const SubmagicLogo = () => (
  <svg viewBox="0 0 100 100" className="w-8 h-8 select-none" xmlns="http://www.w3.org/2000/svg">
    <path d="M35 25 H25 V75 H35" fill="none" stroke="#FFB800" strokeWidth="8" strokeLinecap="round" />
    <path d="M65 25 H75 V75 H65" fill="none" stroke="#FFB800" strokeWidth="8" strokeLinecap="round" />
    <path d="M50 35 L53 47 L65 50 L53 53 L50 65 L47 53 L35 50 L47 47 Z" fill="#FF7A00" />
  </svg>
);

const OpusClipLogo = () => (
  <svg viewBox="0 0 100 100" className="w-8 h-8 select-none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="40" fill="url(#opusGrad)" />
    <polygon points="42,35 68,50 42,65" fill="#FFFFFF" />
    <defs>
      <linearGradient id="opusGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF4D00" />
        <stop offset="100%" stopColor="#FF8F00" />
      </linearGradient>
    </defs>
  </svg>
);

const VeedLogo = () => (
  <svg viewBox="0 0 100 100" className="w-8 h-8 select-none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="22" fill="#000000" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
    <path d="M25 32 L43 68 H57 L75 32 H62 L50 56 L38 32 Z" fill="#FFFFFF" />
  </svg>
);

const CanvaLogo = () => (
  <svg viewBox="0 0 100 100" className="w-8 h-8 select-none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="40" fill="url(#canvaGrad)" />
    <path d="M62 42 C58 35 48 32 40 38 C32 44 32 56 40 62 C46 66 54 65 60 59" fill="none" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" />
    <defs>
      <linearGradient id="canvaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00C4CC" />
        <stop offset="100%" stopColor="#7D2AE8" />
      </linearGradient>
    </defs>
  </svg>
);

const AdobePodcastLogo = () => (
  <svg viewBox="0 0 100 100" className="w-8 h-8 select-none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="20" fill="#002C2D" />
    <text x="18" y="55" fill="#00E5FF" fontFamily="system-ui" fontSize="30" fontWeight="900">Po</text>
    <rect x="20" y="65" width="6" height="15" rx="3" fill="#00E5FF" />
    <rect x="32" y="60" width="6" height="20" rx="3" fill="#00E5FF" />
    <rect x="44" y="65" width="6" height="15" rx="3" fill="#00E5FF" />
    <rect x="56" y="70" width="6" height="10" rx="3" fill="#00E5FF" />
    <rect x="68" y="60" width="6" height="20" rx="3" fill="#00E5FF" />
    <rect x="80" y="65" width="6" height="15" rx="3" fill="#00E5FF" />
  </svg>
);

const DescriptLogo = () => (
  <svg viewBox="0 0 100 100" className="w-8 h-8 select-none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="40" fill="#00E676" />
    <circle cx="42" cy="55" r="16" fill="#FFFFFF" />
    <rect x="50" y="25" width="16" height="46" rx="8" fill="#FFFFFF" />
  </svg>
);

const BufferLogo = () => (
  <svg viewBox="0 0 100 100" className="w-8 h-8 select-none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 20 L80 32 L50 44 L20 32 Z" fill="#CCCCCC" />
    <path d="M50 35 L80 47 L50 59 L20 47 Z" fill="#999999" opacity="0.8" />
    <path d="M50 50 L80 62 L50 74 L20 62 Z" fill="#666666" opacity="0.6" />
    <path d="M50 65 L80 77 L50 89 L20 77 Z" fill="#3B82F6" />
  </svg>
);

export default function Page() {
  // Navigation Toggles
  const [view, setView] = useState<string>("landing");
  const [dashboardView, setDashboardView] = useState<string>("home");
  const [editorLeftTab, setEditorLeftTab] = useState<string>("media");
  const [selectedClipType, setSelectedClipType] = useState<string>("video");

  // User Authentication
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authUsername, setAuthUsername] = useState("");
  const [authFullName, setAuthFullName] = useState("");
  const [authOTPCode, setAuthOTPCode] = useState("");
  const [authMode, setAuthMode] = useState<"signin" | "signup" | "otp">("signin");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);

  // Project Version History
  const [projectHistory, setProjectHistory] = useState<Array<{ captions: any[]; settings: any; timestamp: string }>>([]);

  // Timeline Zoom and Guides
  const [timelineZoom, setTimelineZoom] = useState<number>(100);
  const [showSafeZone, setShowSafeZone] = useState<boolean>(false);
  
  // Undo/Redo Stacks
  const [undoStack, setUndoStack] = useState<Array<{ captions: any[]; settings: any }>>([]);
  const [redoStack, setRedoStack] = useState<Array<{ captions: any[]; settings: any }>>([]);

  // Video Drag Coordinates
  const [videoX, setVideoX] = useState<number>(0);
  const [videoY, setVideoY] = useState<number>(0);

  // Drawer states
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [dashboardMenuOpen, setDashboardMenuOpen] = useState<boolean>(false);
  const [showDemoModal, setShowDemoModal] = useState<boolean>(false);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  
  // Mobile Editor Sidebar and Properties Collapsibility
  const [showEditorSidebar, setShowEditorSidebar] = useState<boolean>(false);
  const [showEditorProperties, setShowEditorProperties] = useState<boolean>(false);

  // PWA & PWA Simulation
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isAlreadyStandalone, setIsAlreadyStandalone] = useState<boolean>(false);
  const [showInstallModal, setShowInstallModal] = useState<boolean>(false);

  // Real Database Persistence Lists
  const [projects, setProjects] = useState<Project[]>([]);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [exportsList, setExportsList] = useState<ExportedVideo[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  // Editor configuration bindings
  const [videoScale, setVideoScale] = useState<number>(100);
  const [videoOpacity, setVideoOpacity] = useState<number>(100);
  const [videoRotation, setVideoRotation] = useState<number>(0);
  const [videoFlipH, setVideoFlipH] = useState<boolean>(false);
  const [videoFlipV, setVideoFlipV] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [videoVolume, setVideoVolume] = useState<number>(100);

  // Caption values
  const [captionsList, setCaptionsList] = useState<CaptionWord[]>(defaultTeluguCaptions);
  const [captionFontSize, setCaptionFontSize] = useState<number>(26);
  const [captionColor, setCaptionColor] = useState<string>("#FFFF00");
  const [demoStyle, setDemoStyle] = useState<string>("bold");
  const [editWordId, setEditWordId] = useState<number | null>(null);
  const [editWordText, setEditWordText] = useState<string>("");
  const [newCaptionText, setNewCaptionText] = useState<string>("");
  const [newCaptionStart, setNewCaptionStart] = useState<number>(0);
  const [newCaptionEnd, setNewCaptionEnd] = useState<number>(3.0);

  // Exporter bindings
  const [exportRes, setExportRes] = useState<string>("1080p");
  const [aspectRatio, setAspectRatio] = useState<string>("9:16");
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<number>(0);

  // Player synchronization properties
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [videoDuration, setVideoDuration] = useState<number>(15);
  const [playerPlaying, setPlayerPlaying] = useState<boolean>(false);
  const [demoActiveWordIdx, setDemoActiveWordIdx] = useState<number>(0);
  const [demoPlaying, setDemoPlaying] = useState<boolean>(true);

  // Upload States
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadFileName, setUploadFileName] = useState<string>("");
  const [uploadFileSize, setUploadFileSize] = useState<string>("");

  // Sub-tools
  const [shortsUrl, setShortsUrl] = useState<string>("");
  const [analyzingShorts, setAnalyzingShorts] = useState<boolean>(false);
  const [shortsClips, setShortsClips] = useState<any[]>([]);

  const [audioEnhanced, setAudioEnhanced] = useState<boolean>(false);
  const [audioProgress, setAudioProgress] = useState<number>(30);
  const [audioPlaying, setAudioPlaying] = useState<boolean>(false);

  const [thumbnailPrompt, setThumbnailPrompt] = useState<string>("Cyberpunk background with neon elements");
  const [thumbnailText, setThumbnailText] = useState<string>("వైరల్ వీడియోస్!");
  const [generatingThumbnail, setGeneratingThumbnail] = useState<boolean>(false);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop");

  const [socialPlatform, setSocialPlatform] = useState<string>("instagram");
  const [writingCopy, setWritingCopy] = useState<boolean>(false);
  const [generatedCopy, setGeneratedCopy] = useState<string>("");
  const [scheduledSuccessfully, setScheduledSuccessfully] = useState<boolean>(false);

  const [apiKeys, setApiKeys] = useState<string[]>(["ts_live_51Npx9T8vKa..."]);
  const [copiedKey, setCopiedKey] = useState<boolean>(false);
  const [activeCodeLang, setActiveCodeLang] = useState<string>("curl");

  // Refs for video & canvas players
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const renderFrameIdRef = useRef<number | null>(null);
  const audioIntervalRef = useRef<any>(null);
  const demoVideoRef = useRef<HTMLVideoElement | null>(null);

  // Check auth session and load data
  const checkUserSession = async () => {
    const sessionUser = await authService.getSession();
    setUser(sessionUser);
    await refreshData();
  };

  const refreshData = async () => {
    try {
      const projData = await projectService.getProjects();
      setProjects(projData);
      if (projData.length > 0 && !activeProject) {
        setActiveProject(projData[0]);
      }

      const mediaData = await mediaService.getMedia();
      setMediaFiles(mediaData);

      const expData = await exportService.getExports();
      setExportsList(expData);
    } catch (err) {
      console.error("Failed to load data:", err);
    }
  };

  useEffect(() => {
    checkUserSession();

    // Check display mode standalone
    if (typeof window !== 'undefined') {
      setIsAlreadyStandalone(window.matchMedia('(display-mode: standalone)').matches);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  // Sync project captions/settings when loaded
  useEffect(() => {
    if (activeProject) {
      if (activeProject.captions && activeProject.captions.length > 0) {
        setCaptionsList(activeProject.captions);
      } else {
        setCaptionsList(defaultTeluguCaptions);
      }

      if (activeProject.settings) {
        const s = activeProject.settings;
        if (s.videoScale !== undefined) setVideoScale(s.videoScale);
        if (s.videoOpacity !== undefined) setVideoOpacity(s.videoOpacity);
        if (s.videoRotation !== undefined) setVideoRotation(s.videoRotation);
        if (s.videoFlipH !== undefined) setVideoFlipH(s.videoFlipH);
        if (s.videoFlipV !== undefined) setVideoFlipV(s.videoFlipV);
        if (s.captionFontSize !== undefined) setCaptionFontSize(s.captionFontSize);
        if (s.captionColor !== undefined) setCaptionColor(s.captionColor);
        if (s.demoStyle !== undefined) setDemoStyle(s.demoStyle);
        if (s.videoX !== undefined) setVideoX(s.videoX);
        if (s.videoY !== undefined) setVideoY(s.videoY);
      }
      setProjectHistory([]);
    }
  }, [activeProject]);

  // Project history snapshot saver
  const saveProjectVersion = () => {
    if (!activeProject) return;
    const currentSnapshot = {
      captions: [...captionsList],
      settings: {
        videoScale,
        videoOpacity,
        videoRotation,
        videoFlipH,
        videoFlipV,
        captionFontSize,
        captionColor,
        demoStyle,
        videoX,
        videoY
      },
      timestamp: new Date().toLocaleTimeString()
    };
    setProjectHistory(prev => [currentSnapshot, ...prev].slice(0, 10));
  };

  // Auto-Save active project every 5 seconds
  useEffect(() => {
    if (!activeProject) return;
    const interval = setInterval(async () => {
      try {
        await projectService.updateProject(activeProject.id, {
          captions: captionsList,
          settings: {
            videoScale,
            videoOpacity,
            videoRotation,
            videoFlipH,
            videoFlipV,
            captionFontSize,
            captionColor,
            demoStyle,
            videoX,
            videoY
          }
        });
      } catch (err) {
        console.error("Auto-save failed:", err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [activeProject, captionsList, videoScale, videoOpacity, videoRotation, videoFlipH, videoFlipV, captionFontSize, captionColor, demoStyle, videoX, videoY]);

  // Undo/Redo operations
  const pushToUndo = (currentCaptions = captionsList, currentSettings = {
    videoScale, videoOpacity, videoRotation, videoFlipH, videoFlipV, captionFontSize, captionColor, demoStyle, videoX, videoY
  }) => {
    setUndoStack(prev => [...prev, { captions: JSON.parse(JSON.stringify(currentCaptions)), settings: { ...currentSettings } }]);
    setRedoStack([]);
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const previous = undoStack[undoStack.length - 1];
    setUndoStack(prev => prev.slice(0, -1));
    
    setRedoStack(prev => [...prev, {
      captions: JSON.parse(JSON.stringify(captionsList)),
      settings: {
        videoScale, videoOpacity, videoRotation, videoFlipH, videoFlipV, captionFontSize, captionColor, demoStyle, videoX, videoY
      }
    }]);

    setCaptionsList(previous.captions);
    setVideoScale(previous.settings.videoScale);
    setVideoOpacity(previous.settings.videoOpacity);
    setVideoRotation(previous.settings.videoRotation);
    setVideoFlipH(previous.settings.videoFlipH);
    setVideoFlipV(previous.settings.videoFlipV);
    setCaptionFontSize(previous.settings.captionFontSize);
    setCaptionColor(previous.settings.captionColor);
    setDemoStyle(previous.settings.demoStyle);
    if (previous.settings.videoX !== undefined) setVideoX(previous.settings.videoX);
    if (previous.settings.videoY !== undefined) setVideoY(previous.settings.videoY);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const nextState = redoStack[redoStack.length - 1];
    setRedoStack(prev => prev.slice(0, -1));

    setUndoStack(prev => [...prev, {
      captions: JSON.parse(JSON.stringify(captionsList)),
      settings: {
        videoScale, videoOpacity, videoRotation, videoFlipH, videoFlipV, captionFontSize, captionColor, demoStyle, videoX, videoY
      }
    }]);

    setCaptionsList(nextState.captions);
    setVideoScale(nextState.settings.videoScale);
    setVideoOpacity(nextState.settings.videoOpacity);
    setVideoRotation(nextState.settings.videoRotation);
    setVideoFlipH(nextState.settings.videoFlipH);
    setVideoFlipV(nextState.settings.videoFlipV);
    setCaptionFontSize(nextState.settings.captionFontSize);
    setCaptionColor(nextState.settings.captionColor);
    setDemoStyle(nextState.settings.demoStyle);
    if (nextState.settings.videoX !== undefined) setVideoX(nextState.settings.videoX);
    if (nextState.settings.videoY !== undefined) setVideoY(nextState.settings.videoY);
  };

  // Auth form submissions
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    const LOCAL_USER_KEY = 'ts_local_user';
    try {
      if (authMode === "signin") {
        const { user: signedInUser, error } = await authService.signIn(authEmail, authPassword);
        if (error) setAuthError(error);
        else { setUser(signedInUser); await refreshData(); }
      } else if (authMode === "signup") {
        const { user: signedUpUser, error } = await authService.signUp(authEmail, authPassword, authUsername, authFullName);
        if (error) setAuthError(error);
        else { setUser(signedUpUser); await refreshData(); }
      } else {
        const { success, error } = await authService.signInWithOTP(authEmail);
        if (error) setAuthError(error);
        else if (success) setOtpSent(true);
      }
    } catch (err) {
      setAuthError("Auth failed.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleThirdPartyAuth = async (provider: "google" | "github") => {
    setAuthLoading(true);
    setAuthError(null);
    const LOCAL_USER_KEY = 'ts_local_user';
    try {
      if (!isSupabaseConfigured) {
        const mockProfile: UserProfile = {
          id: `usr_${provider}_mock`,
          email: `${provider}_creator@techiesstudio.ai`,
          username: `${provider}_user`,
          fullName: `${provider.toUpperCase()} Creator`,
          avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop',
          role: 'premium'
        };
        setUser(mockProfile);
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(mockProfile));
        await refreshData();
      } else {
        await supabase!.auth.signInWithOAuth({
          provider,
          options: { redirectTo: window.location.origin }
        });
      }
    } catch (err) {
      setAuthError("OAuth failed.");
    } finally {
      setAuthLoading(false);
    }
  };

  // Toggle Play Pause function
  const togglePlayPause = () => {
    const video = videoRef.current;
    if (video) {
      if (playerPlaying) {
        video.pause();
        setPlayerPlaying(false);
      } else {
        video.play().catch(() => {});
        setPlayerPlaying(true);
      }
    }
  };

  // Seek video to specific time
  const handleSeekTime = (time: number) => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = time;
    }
    setCurrentTime(time);
  };

  // Download Generated Thumbnail
  const handleDownloadThumbnail = () => {
    if (!thumbnailUrl) return;
    const link = document.createElement("a");
    link.href = thumbnailUrl;
    link.download = `thumbnail_${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle PWA App Installation
  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setDeferredPrompt(null);
      }
    } else {
      // Show custom install guides modal
      setShowInstallModal(true);
    }
  };

  // Keyboard Shortcuts (Undo/Redo, Spacebar)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") return;
      if (e.ctrlKey && e.key.toLowerCase() === "z") {
        e.preventDefault();
        handleUndo();
      } else if (e.ctrlKey && e.key.toLowerCase() === "y") {
        e.preventDefault();
        handleRedo();
      } else if (e.key === " ") {
        e.preventDefault();
        togglePlayPause();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undoStack, redoStack, playerPlaying, captionsList, videoScale, videoOpacity, videoRotation, videoFlipH, videoFlipV, captionFontSize, captionColor, demoStyle, videoX, videoY]);

  // Video reposition dragging event handlers
  const isDraggingCanvasRef = useRef(false);
  const startDragCoordsRef = useRef({ x: 0, y: 0 });
  const startOffsetRef = useRef({ x: 0, y: 0 });

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    isDraggingCanvasRef.current = true;
    startDragCoordsRef.current = { x: e.clientX, y: e.clientY };
    startOffsetRef.current = { x: videoX, y: videoY };
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingCanvasRef.current) return;
    const dx = e.clientX - startDragCoordsRef.current.x;
    const dy = e.clientY - startDragCoordsRef.current.y;
    setVideoX(startOffsetRef.current.x + dx);
    setVideoY(startOffsetRef.current.y + dy);
  };

  const handleCanvasMouseUp = () => {
    if (isDraggingCanvasRef.current) {
      pushToUndo();
      isDraggingCanvasRef.current = false;
    }
  };

  // Load Data on Mount from local Node-fs API
  const refreshDataOld = async () => {};

  // Update playback speed handler
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  // Update volume handler
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = videoVolume / 100;
    }
  }, [videoVolume]);

  // Audio simulator timer
  useEffect(() => {
    if (audioPlaying) {
      audioIntervalRef.current = setInterval(() => {
        setAudioProgress((prev) => (prev >= 100 ? 0 : prev + 2));
      }, 200);
    } else {
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    }
    return () => {
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    };
  }, [audioPlaying]);

  // Loop for landing page animation captions
  useEffect(() => {
    let interval: any;
    if (demoPlaying && view === "landing") {
      interval = setInterval(() => {
        setDemoActiveWordIdx((prev) => (prev + 1) % defaultTeluguCaptions.length);
      }, 800);
    }
    return () => clearInterval(interval);
  }, [demoPlaying, view]);

  // Sync demo video play/pause on the landing page & handle user interaction for audio
  useEffect(() => {
    if (!demoVideoRef.current) return;

    // Set volume to 80% to be audible but friendly
    demoVideoRef.current.volume = 0.8;

    // Autoplay the video immediately (muted starts as true in JSX to bypass browser autoplay blocks)
    if (demoPlaying && view === "landing") {
      demoVideoRef.current.play().catch((err) => {
        console.warn("Immediate autoplay failed:", err);
      });
    } else {
      demoVideoRef.current.pause();
    }

    // Unmute the video on first user interaction so audio plays directly
    const handleInteraction = () => {
      if (demoVideoRef.current) {
        demoVideoRef.current.muted = false;
        if (demoPlaying && view === "landing") {
          demoVideoRef.current.play().catch(() => {});
        }
      }
      // Remove listeners once user interacts
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };

    window.addEventListener("click", handleInteraction);
    window.addEventListener("keydown", handleInteraction);
    window.addEventListener("touchstart", handleInteraction);

    return () => {
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };
  }, [demoPlaying, view]);

  // Draw Frames to Editor Canvas Loop
  const startCanvasRenderLoop = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      if (video.paused || video.ended || video.seeking) {
        // Still draw one static frame even if paused/seeking
      }
      
      // Clear Canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Save Context
      ctx.save();

      // Translate to center for transforms
      ctx.translate(canvas.width / 2, canvas.height / 2);

      // Apply scale setting
      ctx.scale(videoScale / 100, videoScale / 100);

      // Apply rotation setting
      ctx.rotate((videoRotation * Math.PI) / 180);

      // Apply horizontal and vertical flips
      ctx.scale(videoFlipH ? -1 : 1, videoFlipV ? -1 : 1);

      // Apply opacity setting
      ctx.globalAlpha = videoOpacity / 100;

      // Draw the Video Frame
      ctx.drawImage(
        video,
        -canvas.width / 2 + videoX,
        -canvas.height / 2 + videoY,
        canvas.width,
        canvas.height
      );

      // Restore Context
      ctx.restore();

      // Draw Overlay Subtitles / Captions
      const time = video.currentTime;
      const activeCaption = captionsList.find(
        (w) => time >= w.start && time <= w.end
      );

      if (activeCaption) {
        ctx.save();
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const textY = canvas.height * 0.75;
        const textX = canvas.width / 2;

        if (demoStyle === "neon") {
          ctx.font = `900 ${captionFontSize}px Inter`;
          ctx.shadowBlur = 10;
          ctx.shadowColor = "#39FF14";
          ctx.fillStyle = "#39FF14";
          ctx.fillText(activeCaption.word, textX, textY);
        } else if (demoStyle === "glow") {
          ctx.font = `900 ${captionFontSize}px FSP DEMO - PODIUM Sharp 4.11`;
          ctx.shadowBlur = 15;
          ctx.shadowColor = "rgba(168,85,247,0.8)";
          ctx.fillStyle = "#FFFFFF";
          ctx.fillText(activeCaption.word, textX, textY);
        } else if (demoStyle === "bold") {
          // Draw high contrast subtitle box (Submagic style)
          ctx.font = `900 ${captionFontSize}px Inter`;
          
          // Measure text size
          const metrics = ctx.measureText(activeCaption.word);
          const bgW = metrics.width + 16;
          const bgH = captionFontSize + 12;

          ctx.translate(textX, textY);
          ctx.rotate((-2 * Math.PI) / 180); // tilt

          // Draw black outline shadow
          ctx.fillStyle = "#000000";
          ctx.fillRect(-bgW / 2 + 4, -bgH / 2 + 4, bgW, bgH);

          // Draw yellow outline box
          ctx.strokeStyle = "#000000";
          ctx.lineWidth = 3;
          ctx.fillStyle = captionColor;
          ctx.fillRect(-bgW / 2, -bgH / 2, bgW, bgH);
          ctx.strokeRect(-bgW / 2, -bgH / 2, bgW, bgH);

          // Draw black text inside box
          ctx.fillStyle = "#000000";
          ctx.fillText(activeCaption.word, 0, 0);
        } else {
          // Minimal Clean
          ctx.font = `300 ${captionFontSize}px Inter`;
          ctx.fillStyle = "#FFFFFF";
          ctx.fillText(activeCaption.word, textX, textY);
        }

        ctx.restore();
      }

      // Sync playhead state variables
      setCurrentTime(parseFloat(time.toFixed(1)));
      if (video.duration) {
        setVideoDuration(parseFloat(video.duration.toFixed(1)));
      }

      renderFrameIdRef.current = requestAnimationFrame(render);
    };

    renderFrameIdRef.current = requestAnimationFrame(render);
  };

  useEffect(() => {
    if (activeProject && dashboardView === "editor") {
      // Re-trigger render loop once canvas is ready
      setTimeout(() => {
        startCanvasRenderLoop();
      }, 300);
    }
    return () => {
      if (renderFrameIdRef.current) {
        cancelAnimationFrame(renderFrameIdRef.current);
      }
    };
  }, [activeProject, dashboardView, videoScale, videoOpacity, videoRotation, videoFlipH, videoFlipV, captionsList, captionColor, captionFontSize, demoStyle, videoX, videoY]);

  // Direct File Upload integration via Storage Service
  const handleRealUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setUploadFileName(file.name);
      setUploadFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
      setIsUploading(true);
      setUploadProgress(10);

      try {
        const fileUrl = await storageService.uploadFile(
          "videos",
          file.name,
          file,
          (pct) => setUploadProgress(10 + Math.round(pct * 0.7))
        );

        if (fileUrl) {
          setUploadProgress(90);
          
          const pId = `proj_${Date.now()}`;
          const newProject: Project = {
            id: pId,
            name: file.name.split('.')[0] || "Untitled Project",
            lastEdited: "Just now",
            duration: "15.0",
            resolution: "1920x1080",
            fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
            status: "ready",
            thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop",
            videoUrl: fileUrl,
            captions: defaultTeluguCaptions,
            settings: {
              videoScale: 100,
              videoOpacity: 100,
              videoRotation: 0,
              videoFlipH: false,
              videoFlipV: false,
              captionFontSize: 26,
              captionColor: "#FFFF00",
              demoStyle: "bold",
              videoX: 0,
              videoY: 0
            }
          };

          const newMedia: MediaFile = {
            id: `media_${Date.now()}`,
            name: file.name,
            size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
            type: "video",
            uploadDate: new Date().toISOString().split('T')[0],
            thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop",
            url: fileUrl
          };

          await projectService.createProject(newProject);
          await mediaService.addMedia(newMedia);

          setUploadProgress(100);
          setIsUploading(false);

          await refreshData();
          setActiveProject(newProject);
          setView("dashboard");
          setDashboardView("editor");
        } else {
          alert("File upload failed.");
          setIsUploading(false);
        }
      } catch (err) {
        console.error(err);
        alert("Upload error.");
        setIsUploading(false);
      }
    }
  };

  // Project managers
  const handleOpenProjectDraft = (proj: Project) => {
    setActiveProject(proj);
    setDashboardView("editor");
  };

  const handleDeleteProjectDraft = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const success = await projectService.deleteProject(id);
      if (success) {
        setProjects(projects.filter((p) => p.id !== id));
        if (activeProject?.id === id) {
          setActiveProject(null);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMediaAsset = async (id: string) => {
    try {
      const success = await mediaService.deleteMedia(id);
      if (success) {
        setMediaFiles(mediaFiles.filter((m) => m.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Thumbnail canvas generation & download
  const handleExtractThumbnail = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    setGeneratingThumbnail(true);
    
    const snapCanvas = document.createElement("canvas");
    snapCanvas.width = canvas.width;
    snapCanvas.height = canvas.height;
    const snapCtx = snapCanvas.getContext("2d");
    if (snapCtx) {
      snapCtx.save();
      snapCtx.translate(snapCanvas.width / 2 + videoX, snapCanvas.height / 2 + videoY);
      snapCtx.scale(videoScale / 100, videoScale / 100);
      snapCtx.rotate((videoRotation * Math.PI) / 180);
      snapCtx.scale(videoFlipH ? -1 : 1, videoFlipV ? -1 : 1);
      snapCtx.drawImage(video, -snapCanvas.width / 2, -snapCanvas.height / 2, snapCanvas.width, snapCanvas.height);
      snapCtx.restore();

      snapCtx.font = "900 48px Inter";
      snapCtx.textAlign = "left";
      snapCtx.fillStyle = "#FFFF00";
      snapCtx.strokeStyle = "#000000";
      snapCtx.lineWidth = 4;
      
      const textX = 40;
      const textY = snapCanvas.height - 60;
      snapCtx.strokeText(thumbnailText, textX, textY);
      snapCtx.fillText(thumbnailText, textX, textY);

      setTimeout(() => {
        setThumbnailUrl(snapCanvas.toDataURL("image/png"));
        setGeneratingThumbnail(false);
      }, 600);
    }
  };

  // Real canvas record and export pipeline using MediaRecorder API!
  const triggerRealExport = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    setIsExporting(true);
    setExportProgress(5);

    video.pause();
    setPlayerPlaying(false);
    video.currentTime = 0;
    setCurrentTime(0);

    // Setup MediaRecorder with Audio Context to capture sound from the hidden video
    const canvasStream = canvas.captureStream(30);
    let combinedStream = canvasStream;

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        const audioCtx = new AudioContextClass();
        const source = audioCtx.createMediaElementSource(video);
        const dest = audioCtx.createMediaStreamDestination();
        
        source.connect(dest);
        source.connect(audioCtx.destination);
        
        const audioTracks = dest.stream.getAudioTracks();
        if (audioTracks.length > 0) {
          combinedStream = new MediaStream([
            ...canvasStream.getVideoTracks(),
            audioTracks[0]
          ]);
        }
      }
    } catch (e) {
      console.warn("Could not capture video audio stream track:", e);
    }
    
    let options = { mimeType: "video/webm;codecs=vp9" };
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      options = { mimeType: "video/webm" };
    }

    const recordedChunks: BlobPart[] = [];
    const mediaRecorder = new MediaRecorder(combinedStream, options);

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    };

    mediaRecorder.onstop = async () => {
      const blob = new Blob(recordedChunks, { type: "video/webm" });
      const videoFileUrl = URL.createObjectURL(blob);

      // Save Export to DB via Service
      try {
        const exportName = `${activeProject?.name || "Project"}_export_${Date.now()}.webm`;
        const newExport = {
          id: `exp_${Date.now()}`,
          name: exportName,
          url: videoFileUrl,
          status: "ready",
          progress: 100,
          date: new Date().toLocaleDateString()
        };

        const added = await exportService.addExport(newExport);
        if (added) {
          await refreshData();
          setExportProgress(100);
          setTimeout(() => {
            setIsExporting(false);
            setDashboardView("media");
          }, 600);
        }
      } catch (err) {
        console.error(err);
        setIsExporting(false);
      }
    };

    mediaRecorder.start();
    video.play();
    setPlayerPlaying(true);

    // Setup progress timer simulation during render playback
    const durationSec = video.duration || 15;
    const progressInterval = setInterval(() => {
      const current = video.currentTime;
      const pct = Math.round((current / durationSec) * 90) + 5; // 5% to 95%
      setExportProgress(Math.min(95, pct));
      
      if (video.ended || video.paused) {
        clearInterval(progressInterval);
      }
    }, 250);

    video.onended = () => {
      clearInterval(progressInterval);
      mediaRecorder.stop();
      video.pause();
      setPlayerPlaying(false);
      video.onended = null;
    };
  };

  // Caption CRUD operations
  const handleAddCaption = () => {
    if (!newCaptionText) return;
    const newCap: CaptionWord = {
      id: Date.now(),
      word: newCaptionText,
      start: newCaptionStart,
      end: newCaptionEnd
    };
    setCaptionsList([...captionsList, newCap].sort((a, b) => a.start - b.start));
    setNewCaptionText("");
  };

  const handleDeleteCaption = (id: number) => {
    setCaptionsList(captionsList.filter((c) => c.id !== id));
  };

  const handleSaveWordText = (id: number) => {
    setCaptionsList(
      captionsList.map((c) => (c.id === id ? { ...c, word: editWordText } : c))
    );
    setEditWordId(null);
  };

  // Sub-features tools actions
  const triggerShortsAnalysis = () => {
    if (!shortsUrl) return;
    setAnalyzingShorts(true);
    setShortsClips([]);
    setTimeout(() => {
      setAnalyzingShorts(false);
      setShortsClips([
        { id: 1, title: "AI Revolution in Telugu", score: 98, duration: "0:45", start: "01:20", end: "02:05" },
        { id: 2, title: "SaaS Startups Valuation Secrets", score: 92, duration: "0:58", start: "04:15", end: "05:13" },
        { id: 3, title: "Telugu Creators Earnings Breakdown", score: 87, duration: "0:30", start: "08:10", end: "08:40" }
      ]);
    }, 1500);
  };

  const handleWriteCopy = () => {
    setWritingCopy(true);
    setTimeout(() => {
      setWritingCopy(false);
      if (socialPlatform === "instagram") {
        setGeneratedCopy("🔥 Telugu creators, AI is here to change the game! \n\nTechies Studio AI lets you edit, caption, and publish viral reels in minutes. \n\n👉 Click the link in bio to start editing for free today! \n\n#TeluguCreators #TeluguTech #AIVideoEditing #TechiesStudio #StartupLife #ViralReels");
      } else if (socialPlatform === "youtube") {
        setGeneratedCopy("In this video, we explore how Techies Studio AI is revolutionizing video editing and captioning for Telugu content creators. From auto Telugu subtitling to AI Shorts hooks, this is the final toolkit you'll ever need. \n\n💻 Try it Free: https://techiesstudio.ai\n\n#TechiesStudio #TeluguAI #VideoEditing #AIStartups");
      } else {
        setGeneratedCopy("Viral video edits in 60 seconds. Telugu auto captions, voice enhancement, direct post! 🚀🔥 \n\n#TechiesStudio #AIEditor #TeluguTikTok #CreatorEconomy #SubmagicTelugu");
      }
    }, 1000);
  };

  const handleGenerateApiKey = () => {
    const newKey = `ts_live_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`;
    setApiKeys([...apiKeys, newKey]);
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen relative overflow-hidden bg-[#050505] text-white">
      
      {/* ----------------- MARKETING LANDING VIEW ----------------- */}
      {view === "landing" && (
        <div className="flex-1 flex flex-col">
          {/* Header Navbar */}
          <nav className="sticky top-0 z-40 w-full bg-[#050505]/75 backdrop-blur-md border-b border-white/5 px-6 sm:px-10 lg:px-16 py-4 lg:py-5 flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView("landing")}>
              <img
                src="/logo.png"
                alt="Techies Studio AI Logo"
                className="w-9 h-9 rounded-xl object-cover shadow-lg shadow-violet-500/25 border border-violet-500/30"
              />
              <div>
                <span className="font-podium text-xl sm:text-2xl tracking-wider font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-violet-300">
                  Techies Studio AI
                </span>
                <div className="text-[9px] font-inter tracking-[0.2em] uppercase text-violet-400 font-bold -mt-1">
                  India's AI Creator Platform
                </div>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => setView("landing")} className="font-inter text-xs tracking-widest uppercase text-white font-semibold">
                Studio
              </button>
              <button onClick={() => { setView("dashboard"); setDashboardView("home"); }} className="font-inter text-xs tracking-widest uppercase text-white/60 hover:text-white transition">
                Workspace
              </button>
              <button onClick={() => { setView("dashboard"); setDashboardView("editor"); }} className="font-inter text-xs tracking-widest uppercase text-white/60 hover:text-white transition">
                Video Editor
              </button>
              <button onClick={() => { setView("dashboard"); setDashboardView("media"); }} className="font-inter text-xs tracking-widest uppercase text-white/60 hover:text-white transition">
                Media Library
              </button>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={() => { setView("dashboard"); setDashboardView("home"); }}
                className="flex items-center gap-1.5 border border-white/20 hover:border-violet-500/50 hover:bg-violet-600/10 px-5 py-2.5 text-xs tracking-widest uppercase font-inter rounded-lg transition-all"
              >
                Launch Workspace
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <button className="md:hidden flex flex-col justify-between w-6 h-4" onClick={() => setMenuOpen(true)}>
              <div className="w-6 h-0.5 bg-white rounded-full" />
              <div className="w-6 h-0.5 bg-white rounded-full" />
              <div className="w-4 h-0.5 bg-white rounded-full self-end" />
            </button>
          </nav>

          {/* Mobile Overlay Menu */}
          <div className={`fixed inset-0 z-50 bg-[#050505]/98 backdrop-blur-lg transition-all duration-500 flex flex-col px-8 py-6 ${menuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}>
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-3">
                <img
                  src="/logo.png"
                  alt="Techies Studio AI Logo"
                  className="w-9 h-9 rounded-xl object-cover border border-violet-500/30"
                />
                <div>
                  <span className="font-podium text-xl tracking-wider font-extrabold">Techies Studio AI</span>
                  <div className="text-[9px] tracking-[0.2em] uppercase text-violet-400 font-bold">India's AI Creator Platform</div>
                </div>
              </div>
              <button onClick={() => setMenuOpen(false)} className="p-2 border border-white/10 rounded-full hover:bg-white/5">
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            <div className="flex flex-col justify-center flex-1 gap-6 text-left">
              {[
                { name: "Brand Studio", view: "landing", dashTab: "home" },
                { name: "Creator Dashboard", view: "dashboard", dashTab: "home" },
                { name: "Video Editor", view: "dashboard", dashTab: "editor" },
                { name: "Media Library", view: "dashboard", dashTab: "media" }
              ].map((item, i) => (
                <button
                  key={item.name}
                  onClick={() => {
                    setView(item.view);
                    setDashboardView(item.dashTab);
                    setMenuOpen(false);
                  }}
                  style={{ transitionDelay: `${i * 60 + 100}ms` }}
                  className={`font-podium text-3xl sm:text-4xl text-left uppercase transition transform ${menuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"} ${dashboardView === item.dashTab && view === item.view ? "text-violet-400 font-bold" : "text-white/60 hover:text-white"}`}
                >
                  {item.name}
                </button>
              ))}

              <button
                onClick={() => { setView("dashboard"); setDashboardView("home"); setMenuOpen(false); }}
                style={{ transitionDelay: `350ms` }}
                className={`mt-10 flex items-center justify-between w-full max-w-xs border border-violet-500/40 bg-violet-600/10 px-6 py-4 text-sm tracking-widest uppercase font-inter rounded-xl transition transform ${menuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
              >
                Launch Workspace
                <ArrowUpRight className="w-4 h-4 text-violet-400" />
              </button>
            </div>
          </div>

          {/* Hero Section */}
          <div className="h-[calc(100vh-69px)] w-full relative flex items-center px-6 sm:px-12 lg:px-24 border-b border-white/5">
            <div className="absolute inset-0 -z-10 overflow-hidden">
              <video
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover opacity-35"
                src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260606_154941_df1a96e1-a06f-450c-bd02-d863414cc1a0.mp4"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/70 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-[#050505]/20" />
            </div>

            <div className="grid lg:grid-cols-12 gap-12 items-center w-full max-w-7xl mx-auto z-10 py-8">
              <div className="lg:col-span-7 flex flex-col justify-center text-left">
                <div className="animate-fade-up inline-flex items-center gap-2 mb-6 lg:mb-8 bg-white/5 border border-white/10 rounded-full px-4.5 py-1.5 w-fit">
                  <Crown className="w-4 h-4 text-violet-400" />
                  <span className="text-[10px] sm:text-xs text-white/80 font-inter tracking-[0.2em] uppercase font-semibold">
                    India's AI Creator Platform
                  </span>
                </div>

                <h1 className="animate-fade-up-delay-1 font-podium text-white uppercase leading-[0.9] tracking-tight text-[clamp(2.4rem,6vw,5.5rem)] mb-6">
                  Create Viral<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-200">
                    Telugu Videos
                  </span><br />
                  In Minutes.
                </h1>

                <p className="animate-fade-up-delay-2 text-white/70 text-sm sm:text-base md:text-lg font-inter leading-relaxed max-w-xl mb-8 lg:mb-10">
                  Auto Telugu captions, professional video editing, AI shorts, thumbnails, and direct publishing. Everything regional creators need inside a unified desktop-class workspace.
                </p>

                <div className="animate-fade-up-delay-3 flex flex-wrap items-center gap-4 sm:gap-6">
                  <button
                    onClick={() => { setView("dashboard"); setDashboardView("home"); }}
                    className="group flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-500 hover:from-violet-500 hover:to-indigo-400 text-white px-7 py-4 text-xs tracking-widest uppercase font-bold rounded-xl shadow-lg shadow-violet-500/20 transition-all duration-300"
                  >
                    Start Free
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                  </button>

                  <button
                    onClick={() => setShowDemoModal(true)}
                    className="flex items-center gap-2 border border-white/20 hover:border-white/50 hover:bg-white/5 text-white px-7 py-4 text-xs tracking-widest uppercase font-bold rounded-xl transition"
                  >
                    Watch Demo
                  </button>

                  <div className="hidden sm:flex items-center gap-3 border-l border-white/10 pl-6 ml-2">
                    <Award className="w-8 h-8 text-violet-400" />
                    <div>
                      <div className="text-[10px] text-white/50 tracking-wider uppercase font-inter">Top-Rated</div>
                      <div className="text-xs text-white/80 font-bold uppercase font-inter">Brand Studio</div>
                    </div>
                  </div>
                </div>

                <div className="animate-fade-up-delay-4 mt-12 lg:mt-16 flex flex-wrap gap-8 sm:gap-14 border-t border-white/5 pt-8">
                  <div>
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white">250+</div>
                    <div className="text-[10px] text-white/40 tracking-widest uppercase font-inter mt-1">Brands Transformed</div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white">95%</div>
                    <div className="text-[10px] text-white/40 tracking-widest uppercase font-inter mt-1">Client Retention</div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white">10+</div>
                    <div className="text-[10px] text-white/40 tracking-widest uppercase font-inter mt-1">Years in the Game</div>
                  </div>
                </div>
              </div>

              {/* Interactive Demo Player */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="animate-scale-in w-full max-w-sm rounded-2xl border border-white/10 bg-[#0c0c0c]/80 backdrop-blur-xl p-5 relative shadow-2xl">
                  <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Interactive Sandbox</span>
                  </div>

                  <div className="w-full aspect-[9/16] rounded-xl overflow-hidden relative bg-neutral-900 border border-white/5 flex flex-col items-center justify-center p-6">
                    <video
                      ref={demoVideoRef}
                      src="/intro.mp4"
                      className="absolute inset-0 w-full h-full object-cover opacity-60"
                      loop
                      muted
                      playsInline
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />

                    <div className="z-10 flex flex-col items-center justify-center text-center mt-auto mb-16 select-none">
                      {demoStyle === "neon" && (
                        <div className="text-xl sm:text-2xl font-black text-[#39FF14] tracking-wider drop-shadow-[0_0_8px_#39FF14] uppercase">
                          {defaultTeluguCaptions[demoActiveWordIdx % defaultTeluguCaptions.length].word}
                        </div>
                      )}
                      {demoStyle === "glow" && (
                        <div className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.8)] font-podium uppercase">
                          {defaultTeluguCaptions[demoActiveWordIdx % defaultTeluguCaptions.length].word}
                        </div>
                      )}
                      {demoStyle === "bold" && (
                        <div className="bg-yellow-400 text-black px-4 py-1.5 rounded-md font-extrabold text-lg sm:text-xl border-2 border-black rotate-[-2deg] shadow-[4px_4px_0px_#000]">
                          {defaultTeluguCaptions[demoActiveWordIdx % defaultTeluguCaptions.length].word}
                        </div>
                      )}
                      {demoStyle === "minimal" && (
                        <div className="text-white text-base tracking-widest font-light lowercase">
                          ...{defaultTeluguCaptions[demoActiveWordIdx % defaultTeluguCaptions.length].word}...
                        </div>
                      )}
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-10">
                      <button onClick={() => setDemoPlaying(!demoPlaying)} className="p-1.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full text-white">
                        {demoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      </button>
                      <span className="text-[9px] font-mono text-white/60">00:0{demoActiveWordIdx} / 00:12</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="text-[10px] font-bold tracking-widest text-white/40 uppercase mb-2 block">Caption Style Presets</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { id: "bold", label: "Submagic" },
                        { id: "neon", label: "Neon" },
                        { id: "glow", label: "Glow" },
                        { id: "minimal", label: "Minimal" }
                      ].map((style) => (
                        <button
                          key={style.id}
                          onClick={() => setDemoStyle(style.id)}
                          className={`py-2 px-1 text-[10px] font-semibold rounded-lg border uppercase tracking-wider font-inter transition ${demoStyle === style.id ? "bg-violet-600 border-violet-500 text-white shadow-lg" : "bg-[#141414] border-white/5 text-white/60 hover:border-white/10 hover:text-white"}`}
                        >
                          {style.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Competitor SaaS Logo Features matrix */}
          <div className="py-24 px-6 sm:px-12 lg:px-24 bg-[#080808] border-b border-white/5">
            <div className="max-w-7xl mx-auto text-center">
              <span className="text-xs font-bold tracking-[0.3em] uppercase text-violet-400 font-inter">Complete Ecosystem</span>
              <h2 className="font-podium text-4xl sm:text-5xl uppercase tracking-wide mt-3 mb-6">Packed With AI Power</h2>
              <p className="text-white/60 text-sm max-w-xl mx-auto mb-16 font-inter leading-relaxed">
                Everything you need to turn video ideas into high-quality viral posts. Tailored specifically for Indian and Telugu creators.
              </p>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 text-left">
                {[
                  { icon: <CapCutLogo />, title: "Pro Video Splicing", desc: "Split, crop, zoom, and splice your high-definition timelines directly in browser. (Inspired by CapCut)" },
                  { icon: <SubmagicLogo />, title: "Auto Telugu Captions", desc: "Transcribe spoken Telugu with industry-leading 99% Whisper-based accuracy. (Inspired by Submagic)" },
                  { icon: <OpusClipLogo />, title: "AI Viral Shorts", desc: "Auto-detect high-relevance video hooks and crop landscape videos into vertical 9:16 clips. (Inspired by Opus Clip)" },
                  { icon: <VeedLogo />, title: "Subtitle Translator", desc: "Instantly translate subtitles between Telugu, English, Hindi, and 20+ other languages. (Inspired by VEED.IO)" },
                  { icon: <CanvaLogo />, title: "AI Thumbnail Studio", desc: "Generate click-worthy thumbnails using state-of-the-art Flux models with custom text overlay. (Inspired by Canva)" },
                  { icon: <AdobePodcastLogo />, title: "Noise Removal", desc: "Instantly filter out background ambient sounds, street noises, and humming. (Inspired by Adobe Podcast)" },
                  { icon: <DescriptLogo />, title: "Voice Enhancement", desc: "Give audio files a premium studio-podcast quality polish using AI equalizer algorithms. (Inspired by Descript)" },
                  { icon: <BufferLogo />, title: "Social Publisher", desc: "Generate optimized titles, copy description, and hashtags; schedule posts directly. (Inspired by Buffer)" }
                ].map((feat, index) => (
                  <div key={index} className="p-6 rounded-2xl bg-[#0d0d0d] border border-white/5 hover:border-white/10 hover:bg-[#121212] transition-all group">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-start mb-5 group-hover:scale-110 transition duration-300">
                      {feat.icon}
                    </div>
                    <h3 className="font-bold text-white text-base font-inter mb-2">{feat.title}</h3>
                    <p className="text-white/50 text-xs leading-relaxed font-inter">{feat.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pricing Sections */}
          <div className="py-24 px-6 sm:px-12 lg:px-24 bg-[#050505]">
            <div className="max-w-7xl mx-auto text-center">
              <span className="text-xs font-bold tracking-[0.3em] uppercase text-violet-400 font-inter">Transparent Pricing</span>
              <h2 className="font-podium text-4xl sm:text-5xl uppercase tracking-wide mt-3 mb-6">Simple Creator Plans</h2>

              <div className="flex items-center justify-center gap-4 mb-16">
                <span className={`text-xs font-inter uppercase tracking-widest ${billingCycle === "monthly" ? "text-white font-bold" : "text-white/50"}`}>Monthly</span>
                <button
                  onClick={() => setBillingCycle(billingCycle === "monthly" ? "annual" : "monthly")}
                  className="w-12 h-6 bg-violet-600/30 border border-violet-500/30 rounded-full p-1 relative transition duration-300"
                >
                  <div className={`w-4 h-4 bg-violet-400 rounded-full transition-all duration-300 ${billingCycle === "annual" ? "translate-x-6" : "translate-x-0"}`} />
                </button>
                <span className={`text-xs font-inter uppercase tracking-widest ${billingCycle === "annual" ? "text-white font-bold" : "text-white/50"}`}>
                  Annual <span className="text-violet-400 text-[10px] font-semibold bg-violet-500/10 px-2 py-0.5 rounded-full lowercase">save 20%</span>
                </span>
              </div>

              <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left">
                {/* Free */}
                <div className="p-8 rounded-3xl border border-white/5 bg-[#0b0b0b] flex flex-col justify-between hover:border-white/15 transition-all">
                  <div>
                    <h3 className="text-lg font-bold font-inter text-white mb-2">Free Starter</h3>
                    <p className="text-xs text-white/50 font-inter mb-6">Essential AI tools to get started as a video creator.</p>
                    <div className="text-3xl font-extrabold font-inter text-white mb-6">
                      ₹0<span className="text-xs text-white/40 font-normal"> / month</span>
                    </div>
                    <ul className="space-y-3.5 mb-8">
                      {["5 exports per month", "Standard auto captions", "Max 720p output resolution", "Techies Studio watermark"].map((pt) => (
                        <li key={pt} className="flex items-center gap-2.5 text-xs text-white/70 font-inter">
                          <CheckCircle className="w-4 h-4 text-violet-500 flex-shrink-0" />
                          {pt}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button onClick={() => { setView("dashboard"); setDashboardView("home"); }} className="w-full py-3 text-xs tracking-widest font-bold uppercase font-inter border border-white/15 hover:border-white/40 hover:bg-white/5 rounded-xl transition text-center">
                    Get Started
                  </button>
                </div>

                {/* Creator Pro */}
                <div className="p-8 rounded-3xl border-2 border-violet-500 bg-[#0e0c12] flex flex-col justify-between relative shadow-xl shadow-violet-950/20 transform md:scale-105">
                  <div className="absolute top-0 right-8 -translate-y-1/2 bg-gradient-to-r from-violet-600 to-indigo-500 text-white font-inter text-[9px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full border border-violet-400">
                    MOST POPULAR
                  </div>
                  <div>
                    <h3 className="text-lg font-bold font-inter text-white mb-2">Creator Pro</h3>
                    <p className="text-xs text-white/50 font-inter mb-6">Perfect toolkit for professional YouTubers and creators.</p>
                    <div className="text-3xl font-extrabold font-inter text-white mb-6">
                      {billingCycle === "monthly" ? "₹999" : "₹799"}<span className="text-xs text-white/40 font-normal"> / month</span>
                    </div>
                    <ul className="space-y-3.5 mb-8">
                      {["Unlimited video exports", "Telugu + 20 language transcription", "Premium Submagic caption styles", "No watermarks & 4K quality", "AI Shorts Hook auto clipper", "Pro Audio Enhancer (EQ + Noise)"].map((pt) => (
                        <li key={pt} className="flex items-center gap-2.5 text-xs text-white/80 font-inter">
                          <CheckCircle className="w-4 h-4 text-violet-400 flex-shrink-0" />
                          {pt}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button onClick={() => { setView("dashboard"); setDashboardView("home"); }} className="w-full py-4 text-xs tracking-widest font-bold uppercase font-inter bg-gradient-to-r from-violet-600 to-indigo-500 hover:from-violet-500 hover:to-indigo-400 text-white rounded-xl shadow-lg shadow-violet-500/20 transition text-center">
                    Go Pro Now
                  </button>
                </div>

                {/* Agency */}
                <div className="p-8 rounded-3xl border border-white/5 bg-[#0b0b0b] flex flex-col justify-between hover:border-white/15 transition-all">
                  <div>
                    <h3 className="text-lg font-bold font-inter text-white mb-2">Agency Studio</h3>
                    <p className="text-xs text-white/50 font-inter mb-6">For media agencies and large content houses.</p>
                    <div className="text-3xl font-extrabold font-inter text-white mb-6">
                      {billingCycle === "monthly" ? "₹4,999" : "₹3,999"}<span className="text-xs text-white/40 font-normal"> / month</span>
                    </div>
                    <ul className="space-y-3.5 mb-8">
                      {["Everything in Creator Pro", "Full Developer API access", "5 team member accounts", "Dedicated transcription nodes", "Custom caption font styling", "Priority VIP rendering queue"].map((pt) => (
                        <li key={pt} className="flex items-center gap-2.5 text-xs text-white/70 font-inter">
                          <CheckCircle className="w-4 h-4 text-violet-500 flex-shrink-0" />
                          {pt}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button onClick={() => { setView("dashboard"); setDashboardView("home"); }} className="w-full py-3 text-xs tracking-widest font-bold uppercase font-inter border border-white/15 hover:border-white/40 hover:bg-white/5 rounded-xl transition text-center">
                    Inquire Studio
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-auto border-t border-white/5 bg-[#030303] py-12 px-6 sm:px-12 lg:px-24">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <img
                  src="/logo.png"
                  alt="Techies Studio AI Logo"
                  className="w-7 h-7 rounded-lg object-cover border border-violet-500/30"
                />
                <div>
                  <span className="font-podium text-base tracking-wider font-extrabold">Techies Studio AI</span>
                  <span className="text-[10px] font-mono text-white/40 ml-2">© 2026 Prompt Techies</span>
                </div>
              </div>
              <div className="flex gap-8 text-xs text-white/40 font-inter font-semibold">
                <button className="hover:text-white" onClick={() => { setView("dashboard"); setDashboardView("home"); }}>Workspace</button>
                <button className="hover:text-white" onClick={() => { setView("dashboard"); setDashboardView("editor"); }}>Video Editor</button>
                <button className="hover:text-white" onClick={() => { setView("dashboard"); setDashboardView("media"); }}>Media Library</button>
              </div>
            </div>
          </footer>

          {/* Demo Modal */}
          {showDemoModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
              <div className="w-full max-w-4xl bg-[#0f0f0f] border border-white/10 rounded-2xl overflow-hidden relative animate-scale-in">
                <button
                  onClick={() => setShowDemoModal(false)}
                  className="absolute top-4 right-4 z-10 p-2 bg-black/60 border border-white/10 hover:bg-black/80 rounded-full text-white"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="aspect-video relative bg-black flex items-center justify-center">
                  <video
                    autoPlay
                    controls
                    className="w-full h-full object-contain"
                    src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260606_154941_df1a96e1-a06f-450c-bd02-d863414cc1a0.mp4"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold font-inter text-white">Techies Studio AI - Showcase Reel</h3>
                  <p className="text-xs text-white/50 font-inter mt-1">
                    Watch how our neural engines process video splicing, Telugu translations, and Submagic caption overlays in under 45 seconds.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ----------------- CREATOR DASHBOARD WORKSPACE ----------------- */}
      {view === "dashboard" && !user && (
        <div className="flex-1 flex items-center justify-center bg-[#050505] p-6 relative overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="w-full max-w-md bg-[#0c0c0c]/80 border border-white/10 p-8 rounded-2xl shadow-2xl backdrop-blur-xl z-10">
            <div className="flex flex-col items-center mb-6">
              <img
                src="/logo.png"
                alt="Techies Studio AI Logo"
                className="w-12 h-12 rounded-xl object-cover border border-violet-500/30 mb-3"
              />
              <h2 className="font-podium text-2xl uppercase tracking-wider text-white">Techies Studio AI</h2>
              <p className="text-[10px] text-violet-400 font-bold uppercase tracking-widest -mt-1 mb-2">India's AI Creator Platform</p>
              
              <div className="text-[9px] font-mono border border-amber-500/20 bg-amber-500/5 text-amber-400 px-3 py-1 rounded-full uppercase tracking-wider font-semibold">
                {isSupabaseConfigured ? "🟢 Supabase Production Mode" : "🟡 Local Sandbox Mode"}
              </div>
            </div>

            {authError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg mb-4 text-center">
                {authError}
              </div>
            )}

            {otpSent ? (
              <div className="space-y-4">
                <div className="p-3 bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs rounded-lg text-center">
                  We sent a Magic Link or code to your email. Please check your inbox.
                </div>
                <button
                  onClick={() => setOtpSent(false)}
                  className="w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 text-xs uppercase font-bold tracking-widest rounded-lg border border-white/5 transition"
                >
                  Back to Sign In
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-1 bg-black/40 p-1 border border-white/5 rounded-lg mb-6">
                  {(["signin", "signup", "otp"] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => { setAuthMode(mode); setAuthError(null); }}
                      className={`py-1.5 text-[10px] uppercase tracking-wider font-semibold rounded-md transition ${authMode === mode ? "bg-violet-600 text-white font-bold" : "text-white/60 hover:text-white"}`}
                    >
                      {mode === "signin" ? "Sign In" : mode === "signup" ? "Sign Up" : "OTP Code"}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleAuthSubmit} className="space-y-4">
                  {authMode === "signup" && (
                    <>
                      <div>
                        <label className="text-[9px] font-bold tracking-widest text-white/40 uppercase block mb-1">Full Name</label>
                        <input
                          type="text"
                          required
                          value={authFullName}
                          onChange={(e) => setAuthFullName(e.target.value)}
                          placeholder="E.g., Aqil Kumar"
                          className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/30 focus:border-violet-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-bold tracking-widest text-white/40 uppercase block mb-1">Username</label>
                        <input
                          type="text"
                          required
                          value={authUsername}
                          onChange={(e) => setAuthUsername(e.target.value)}
                          placeholder="telugu_creator"
                          className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/30 focus:border-violet-500 focus:outline-none"
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label className="text-[9px] font-bold tracking-widest text-white/40 uppercase block mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      placeholder="creator@techiesstudio.ai"
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/30 focus:border-violet-500 focus:outline-none"
                    />
                  </div>

                  {authMode !== "otp" && (
                    <div>
                      <label className="text-[9px] font-bold tracking-widest text-white/40 uppercase block mb-1">Password</label>
                      <input
                        type="password"
                        required
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/30 focus:border-violet-500 focus:outline-none"
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full py-3 bg-violet-600 hover:bg-violet-500 text-xs font-bold uppercase tracking-widest rounded-lg transition-all duration-300 shadow-lg shadow-violet-500/10 mt-2 flex items-center justify-center gap-2"
                  >
                    {authLoading ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : authMode === "signin" ? (
                      "Sign In to Studio"
                    ) : authMode === "signup" ? (
                      "Register Account"
                    ) : (
                      "Send Magic Link"
                    )}
                  </button>
                </form>

                <div className="relative my-6 text-center">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5" /></div>
                  <span className="relative z-10 px-3 bg-[#0c0c0c] text-[8px] font-mono text-white/30 uppercase tracking-widest">Or Continue With</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleThirdPartyAuth("google")}
                    className="flex items-center justify-center gap-2 py-2.5 bg-black/40 border border-white/5 hover:border-white/20 rounded-lg text-xs font-semibold text-white/80 transition"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M12.24 10.285V13.4h6.887C18.2 15.614 15.645 18 12.24 18c-3.86 0-7-3.14-7-7s3.14-7 7-7c1.7 0 3.3.6 4.5 1.7l2.42-2.42C17.21 1.72 14.82 1 12.24 1c-6.075 0-11 4.925-11 11s4.925 11 11 11c5.83 0 10.74-4.22 10.74-11 0-.665-.06-1.3-.17-1.715H12.24z"/></svg>
                    Google
                  </button>
                  <button
                    onClick={() => handleThirdPartyAuth("github")}
                    className="flex items-center justify-center gap-2 py-2.5 bg-black/40 border border-white/5 hover:border-white/20 rounded-lg text-xs font-semibold text-white/80 transition"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                    GitHub
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {view === "dashboard" && user && (
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#060606]">
          {/* Dashboard Header Bar */}
          <header className="h-16 border-b border-white/5 bg-[#090909] px-6 flex items-center justify-between z-30 shrink-0">
            <div className="flex items-center gap-3">
              <button
                className="lg:hidden p-1.5 border border-white/10 rounded bg-white/5 text-white"
                onClick={() => setDashboardMenuOpen(!dashboardMenuOpen)}
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setView("landing")}>
                <img
                  src="/logo.png"
                  alt="Techies Studio Logo"
                  className="w-7 h-7 rounded-lg object-cover border border-violet-500/30"
                />
                <div>
                  <span className="font-podium text-lg font-bold tracking-wider text-white">Techies Studio AI</span>
                  <span className="hidden sm:inline-block text-[9px] font-mono text-violet-400 border border-violet-500/20 bg-violet-600/10 px-2.5 py-0.5 rounded-full ml-3 font-semibold uppercase tracking-wider">
                    Creator Workspace
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Upload Indicator */}
            <div className="flex items-center gap-4">
              {isUploading && (
                <div className="hidden md:flex items-center gap-3 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-lg text-xs font-mono text-white/80">
                  <RefreshCw className="w-3.5 h-3.5 text-violet-400 animate-spin" />
                  <span>Uploading: {uploadProgress}%</span>
                </div>
              )}
              <div className="relative">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleRealUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isUploading}
                />
                <button className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-500 hover:from-violet-500 hover:to-indigo-400 px-4 py-2 rounded-lg text-xs uppercase tracking-widest font-bold font-inter transition-all shadow-md shadow-violet-500/10">
                  <Upload className="w-4 h-4" />
                  New Project
                </button>
              </div>
              {user && (
                <div className="flex items-center gap-3 border-l border-white/10 pl-4">
                  <img
                    src={user.avatarUrl}
                    alt={user.fullName || user.username}
                    className="w-7 h-7 rounded-full object-cover border border-violet-500/30"
                  />
                  <div className="hidden lg:flex flex-col text-left">
                    <span className="text-[10px] font-bold text-white truncate max-w-[120px]">{user.fullName || user.username}</span>
                    <span className="text-[8px] font-mono text-violet-400 uppercase tracking-widest font-bold -mt-0.5">{user.role}</span>
                  </div>
                  <button
                    onClick={async () => {
                      await authService.signOut();
                      setUser(null);
                      setView("landing");
                    }}
                    className="text-[10px] text-white/40 hover:text-red-400 uppercase tracking-widest font-bold font-inter transition ml-2"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </header>

          <div className="flex-1 flex relative overflow-hidden pb-16 lg:pb-0">
            {/* Sidebar Navigation (Dashboard Left Sidebar) */}
            <aside className={`w-64 border-r border-white/5 bg-[#090909] p-4 flex flex-col gap-1.5 z-20 transition-all duration-300 absolute lg:static top-0 bottom-0 left-0 ${dashboardMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
              <div className="text-[9px] font-bold tracking-widest text-white/30 uppercase mb-4 pl-3 font-inter">
                Dashboard Navigation
              </div>

              {[
                { id: "home", label: "Dashboard Home", icon: <LayoutDashboard className="w-4.5 h-4.5" /> },
                { id: "projects", label: "Projects", icon: <FolderOpen className="w-4.5 h-4.5" /> },
                { id: "editor", label: "Video Editor", icon: <Video className="w-4.5 h-4.5" /> },
                { id: "captions", label: "Captions", icon: <Sparkles className="w-4.5 h-4.5" /> },
                { id: "shorts", label: "AI Shorts", icon: <Zap className="w-4.5 h-4.5" /> },
                { id: "thumbnails", label: "Thumbnails", icon: <Image className="w-4.5 h-4.5" /> },
                { id: "media", label: "Media Library", icon: <Folder className="w-4.5 h-4.5" /> },
                { id: "analytics", label: "Analytics", icon: <Activity className="w-4.5 h-4.5" /> },
                { id: "team", label: "Team Workspace", icon: <User className="w-4.5 h-4.5" /> },
                { id: "billing", label: "Billing", icon: <CreditCard className="w-4.5 h-4.5" /> },
                { id: "settings", label: "Settings", icon: <Settings className="w-4.5 h-4.5" /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setDashboardView(tab.id);
                    setDashboardMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 w-full text-left py-2.5 px-4 rounded-lg text-xs uppercase tracking-wider font-semibold font-inter transition-all ${dashboardView === tab.id ? "bg-violet-600 text-white font-bold shadow-lg shadow-violet-600/10" : "text-white/60 hover:bg-white/5 hover:text-white"}`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}

              <div className="mt-auto border-t border-white/5 pt-4 pl-3">
                <button onClick={() => setView("landing")} className="flex items-center gap-2 text-[10px] text-white/40 uppercase tracking-widest hover:text-white transition">
                  ← Back to landing
                </button>
              </div>
            </aside>

            {/* Dashboard Main Workspace Content panel */}
            <main className="flex-1 flex flex-col overflow-hidden bg-[#060606] relative">
              
              {/* ----------------- SUB-TAB: HOME ----------------- */}
              {dashboardView === "home" && (
                <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h1 className="text-2xl font-bold font-inter text-white uppercase tracking-wide">Welcome Creator</h1>
                      <p className="text-xs text-white/40 font-inter mt-1">Start a new editing timeline, crop viral shorts, or customize your library.</p>
                    </div>
                  </div>

                  {/* Drag-and-drop simulated upload card */}
                  <div className="border-2 border-dashed border-white/10 hover:border-violet-500/50 bg-[#090909]/40 hover:bg-[#0c0a12]/20 transition-all rounded-3xl p-12 text-center flex flex-col items-center justify-center gap-4 relative">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleRealUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={isUploading}
                    />
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-violet-400">
                      <Upload className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold font-inter text-white uppercase">Upload Video File</h3>
                      <p className="text-xs text-white/40 font-inter mt-1 max-w-sm">
                        Automatically create a project, save file to local server storage, and open it directly inside the Video Editor.
                      </p>
                    </div>
                  </div>

                  {/* Real-time Upload Progress details */}
                  {isUploading && (
                    <div className="p-6 bg-[#090909] border border-white/10 rounded-2xl space-y-3 max-w-xl">
                      <div className="flex justify-between items-center text-xs font-mono">
                        <span className="font-bold text-white uppercase">Uploading file to storage: {uploadFileName}</span>
                        <span className="text-violet-400 font-bold">{uploadProgress}%</span>
                      </div>
                      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-violet-600 to-indigo-500 transition-all" style={{ width: `${uploadProgress}%` }} />
                      </div>
                      <div className="flex justify-between text-[10px] text-white/40 font-mono">
                        <span>Total Size: {uploadFileSize}</span>
                        <span>Destination: Local Server Storage</span>
                      </div>
                    </div>
                  )}

                  {/* Quick Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                      { label: "Total Projects", val: `${projects.length}`, icon: <FolderOpen className="w-4 h-4 text-violet-400" /> },
                      { label: "Media Files", val: `${mediaFiles.length}`, icon: <Folder className="w-4 h-4 text-emerald-400" /> },
                      { label: "Completed Exports", val: `${exportsList.length}`, icon: <CheckCircle className="w-4 h-4 text-cyan-400" /> },
                      { label: "Active Plan", val: "Creator Pro", icon: <Crown className="w-4 h-4 text-amber-400" /> }
                    ].map((stat, idx) => (
                      <div key={idx} className="p-5 rounded-2xl bg-[#090909] border border-white/5 flex items-center justify-between">
                        <div className="space-y-1">
                          <span className="text-[10px] text-white/40 font-inter uppercase tracking-widest block">{stat.label}</span>
                          <span className="text-xl font-extrabold text-white font-inter">{stat.val}</span>
                        </div>
                        <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center">
                          {stat.icon}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Recent Projects Home Grid */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold tracking-widest text-white/40 uppercase font-inter">Recent Projects</h3>
                      <button onClick={() => setDashboardView("projects")} className="text-[10px] text-violet-400 hover:text-violet-300 font-bold uppercase tracking-widest font-inter">
                        View All
                      </button>
                    </div>
                    
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {projects.slice(0, 3).map((proj) => (
                        <div
                          key={proj.id}
                          onClick={() => handleOpenProjectDraft(proj)}
                          className="bg-[#090909] border border-white/5 hover:border-violet-500/30 transition rounded-2xl overflow-hidden cursor-pointer group"
                        >
                          <div className="aspect-video relative bg-neutral-900 border-b border-white/5 overflow-hidden">
                            <img src={proj.thumbnail} alt={proj.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                              <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center text-white">
                                <Play className="w-4 h-4 pl-0.5" />
                              </div>
                            </div>
                          </div>
                          
                          <div className="p-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <h4 className="text-xs font-bold text-white font-inter truncate pr-2">{proj.name}</h4>
                              <span className="text-[9px] font-mono text-white/40">{proj.duration}s</span>
                            </div>
                            <div className="flex items-center justify-between text-[9px] text-white/40 font-mono border-t border-white/5 pt-3">
                              <span>Last edited: {proj.lastEdited}</span>
                              <span className="uppercase text-violet-400 font-bold">{proj.resolution}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ----------------- SUB-TAB: PROJECTS ----------------- */}
              {dashboardView === "projects" && (
                <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
                  <div className="border-b border-white/5 pb-4">
                    <h1 className="text-xl font-bold font-inter text-white uppercase tracking-wider">Project Library</h1>
                    <p className="text-xs text-white/40 font-inter mt-1">Manage all your video project drafts. Click to load into the multi-track timeline.</p>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {projects.map((proj) => (
                      <div
                        key={proj.id}
                        onClick={() => handleOpenProjectDraft(proj)}
                        className="bg-[#090909] border border-white/5 hover:border-violet-500/30 transition rounded-2xl overflow-hidden cursor-pointer group flex flex-col justify-between"
                      >
                        <div className="aspect-video relative bg-neutral-900 border-b border-white/5 overflow-hidden">
                          <img src={proj.thumbnail} alt={proj.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                          <button 
                            onClick={(e) => handleDeleteProjectDraft(proj.id, e)}
                            className="absolute top-2.5 right-2.5 z-10 p-1.5 bg-black/60 hover:bg-red-600 rounded-lg text-white opacity-0 group-hover:opacity-100 transition border border-white/10"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                            <button className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-500 text-white px-3 py-1.5 rounded-lg text-[10px] uppercase font-bold tracking-wider font-inter">
                              <Play className="w-3.5 h-3.5 pl-0.5" />
                              Open Project
                            </button>
                          </div>
                        </div>
                        
                        <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                          <div className="space-y-0.5">
                            <h4 className="text-xs font-bold text-white font-inter truncate">{proj.name}</h4>
                            <span className="text-[9px] font-mono text-white/40 block">Size: {proj.fileSize}</span>
                          </div>
                          
                          <div className="flex items-center justify-between text-[9px] text-white/40 font-mono border-t border-white/5 pt-3 mt-2">
                            <span>Last edited: {proj.lastEdited}</span>
                            <span className="uppercase text-violet-400 font-bold">{proj.duration}s | {proj.resolution}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ----------------- SUB-TAB: VIDEO EDITOR (INTEGRATED & WORKING) ----------------- */}
              {dashboardView === "editor" && (
                <div className="flex-grow flex flex-col h-full overflow-hidden bg-[#060606]">
                  {activeProject ? (
                    <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                      
                      {/* Hidden source video element */}
                      <video
                        ref={videoRef}
                        src={activeProject.videoUrl}
                        className="hidden"
                        crossOrigin="anonymous"
                        playsInline
                        muted
                        loop
                      />

                      {/* Top editor workspace pane */}
                      <div className="flex-grow flex overflow-hidden relative border-b border-white/5">

                        {/* Combined Tools Panel (Sidebar + Sub-menu Drawer) */}
                        <div className={`flex shrink-0 transition-all duration-300 absolute md:static top-0 bottom-0 left-0 h-full z-40 shadow-2xl md:shadow-none ${showEditorSidebar ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
                          {/* 1. EDITOR LEFT SIDEBAR */}
                          <div className="w-16 border-r border-white/5 bg-[#080808] flex flex-col items-center py-4 gap-4 shrink-0">
                            {[
                              { id: "media", label: "Media", icon: <Folder className="w-5 h-5" /> },
                              { id: "upload", label: "Upload", icon: <Upload className="w-5 h-5" /> },
                              { id: "captions", label: "Captions", icon: <Sparkles className="w-5 h-5" /> },
                              { id: "text", label: "Text", icon: <Type className="w-5 h-5" /> },
                              { id: "audio", label: "Audio", icon: <Volume2 className="w-5 h-5" /> },
                              { id: "effects", label: "Effects", icon: <Sliders className="w-5 h-5" /> },
                              { id: "transitions", label: "Transitions", icon: <TrendingUp className="w-5 h-5" /> },
                              { id: "stickers", label: "Stickers", icon: <Award className="w-5 h-5" /> },
                              { id: "templates", label: "Templates", icon: <FolderOpen className="w-5 h-5" /> },
                              { id: "aitools", label: "AI Tools", icon: <Zap className="w-5 h-5" /> }
                            ].map((item) => (
                              <button
                                key={item.id}
                                onClick={() => setEditorLeftTab(item.id)}
                                className={`p-2 rounded-xl transition ${editorLeftTab === item.id ? "bg-violet-600 text-white" : "text-white/40 hover:text-white hover:bg-white/5"}`}
                                title={item.label}
                              >
                                {item.icon}
                              </button>
                            ))}
                          </div>

                          {/* 1b. LEFT TAB SUB-MENU DRAWER */}
                          <div className="w-72 border-r border-white/5 bg-[#090909] flex flex-col p-4 overflow-y-auto shrink-0 text-left relative">
                            {/* Mobile close button inside drawer */}
                            <button 
                              onClick={() => setShowEditorSidebar(false)}
                              className="md:hidden absolute top-3.5 right-3.5 p-1.5 border border-white/10 rounded-lg bg-black/40 text-white hover:bg-white/5 z-50 animate-fade-in"
                              title="Close Menu"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>

                            <h3 className="text-[10px] font-bold tracking-widest text-white/40 uppercase mb-4 font-inter">
                              Editor Menu: {editorLeftTab}
                            </h3>

                            {editorLeftTab === "media" && (
                              <div className="space-y-4">
                                <span className="text-[10px] text-white/40 font-mono block">Click a file to import to player:</span>
                                <div className="space-y-2">
                                  {mediaFiles.map((file) => (
                                    <div 
                                      key={file.id} 
                                      onClick={() => {
                                        const matchingProj = projects.find(p => p.videoUrl === file.url);
                                        if (matchingProj) {
                                          setActiveProject(matchingProj);
                                        } else {
                                          setActiveProject({
                                            id: `proj_${Date.now()}`,
                                            name: file.name.replace(/\.[^/.]+$/, ""),
                                            lastEdited: "Just now",
                                            duration: file.duration || "0:15",
                                            resolution: file.resolution || "1080p",
                                            fileSize: file.size,
                                            status: "ready",
                                            thumbnail: file.thumbnail,
                                            videoUrl: file.url
                                          });
                                        }
                                      }}
                                      className={`p-3 border rounded-xl flex items-center justify-between text-xs cursor-pointer transition ${activeProject.videoUrl === file.url ? "bg-violet-600/10 border-violet-500" : "bg-black/40 border-white/5 hover:border-white/10"}`}
                                    >
                                      <div className="flex items-center gap-2 truncate">
                                        <img src={file.thumbnail} alt="" className="w-9 h-9 rounded object-cover" />
                                        <div className="truncate">
                                          <div className="font-bold text-white truncate">{file.name}</div>
                                          <span className="text-[9px] text-white/40 font-mono">{file.size}</span>
                                        </div>
                                      </div>
                                      <CheckCircle className={`w-4 h-4 text-violet-400 ${activeProject.videoUrl === file.url ? "opacity-100" : "opacity-0"}`} />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {editorLeftTab === "upload" && (
                              <div className="space-y-4">
                                <div className="border-2 border-dashed border-white/10 p-6 rounded-xl text-center relative hover:border-violet-500/40 cursor-pointer">
                                  <input type="file" onChange={handleRealUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                  <Upload className="w-6 h-6 text-violet-400 mx-auto mb-2" />
                                  <span className="text-[10px] text-white/60 font-inter uppercase tracking-wider block font-bold">Import More Media</span>
                                </div>
                              </div>
                            )}

                            {editorLeftTab === "captions" && (
                              <div className="space-y-4">
                                <span className="text-[10px] text-white/40 font-mono block">Add Subtitle Blocks to Timeline:</span>
                                
                                <div className="space-y-3 bg-black/40 border border-white/5 p-3.5 rounded-xl">
                                  <div>
                                    <label className="text-[9px] font-bold text-white/40 uppercase block mb-1">Caption Text</label>
                                    <input
                                      type="text"
                                      placeholder="Type word/phrase..."
                                      value={newCaptionText}
                                      onChange={(e) => setNewCaptionText(e.target.value)}
                                      className="w-full bg-[#141414] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none"
                                    />
                                  </div>
                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <label className="text-[9px] font-bold text-white/40 uppercase block mb-1">Start (s)</label>
                                      <input
                                        type="number"
                                        step="0.1"
                                        value={newCaptionStart}
                                        onChange={(e) => setNewCaptionStart(parseFloat(e.target.value))}
                                        className="w-full bg-[#141414] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none font-mono"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-[9px] font-bold text-white/40 uppercase block mb-1">End (s)</label>
                                      <input
                                        type="number"
                                        step="0.1"
                                        value={newCaptionEnd}
                                        onChange={(e) => setNewCaptionEnd(parseFloat(e.target.value))}
                                        className="w-full bg-[#141414] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none font-mono"
                                      />
                                    </div>
                                  </div>
                                  <button 
                                    onClick={handleAddCaption}
                                    className="w-full bg-violet-600 hover:bg-violet-500 py-2 rounded-lg text-[10px] uppercase font-bold tracking-widest font-inter transition"
                                  >
                                    Add Caption Block
                                  </button>
                                </div>

                                <div className="space-y-2.5 mt-4">
                                  <label className="text-[9px] font-bold text-white/30 uppercase block">Active Subtitle Styling</label>
                                  {["Submagic Bold", "Neon Glow", "Minimal Clean"].map((preset) => (
                                    <button key={preset} onClick={() => setDemoStyle(preset.toLowerCase().includes("bold") ? "bold" : preset.toLowerCase().includes("neon") ? "neon" : "minimal")} className="w-full py-2.5 px-3 bg-black/40 border border-white/5 hover:border-white/20 rounded-xl text-xs text-left text-white/80 uppercase font-semibold font-inter transition">
                                      {preset}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}

                            {editorLeftTab === "text" && (
                              <div className="space-y-2">
                                {["Add Title Header", "Add Body Text", "Subtitle Block"].map((txt) => (
                                  <button key={txt} className="w-full py-3 px-4 bg-black/40 border border-white/5 hover:bg-violet-600/10 rounded-xl text-xs text-left text-white/80 uppercase font-bold font-inter transition flex items-center gap-2">
                                    <PlusCircle className="w-4 h-4 text-violet-400" />
                                    {txt}
                                  </button>
                                ))}
                              </div>
                            )}

                            {editorLeftTab === "audio" && (
                              <div className="space-y-3">
                                {["Ambient_Synth_Glow.wav", "Voiceover_Telugu_Sync.wav"].map((aud) => (
                                  <div key={aud} className="p-3 bg-black/40 border border-white/5 rounded-xl flex items-center justify-between text-xs">
                                    <div className="truncate">
                                      <div className="font-bold text-white truncate">{aud}</div>
                                      <span className="text-[8px] text-white/40 font-mono">00:30</span>
                                    </div>
                                    <button onClick={() => setSelectedClipType("audio")} className="p-1 bg-white/5 hover:bg-violet-600 rounded text-white border border-white/10">
                                      <Plus className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}

                            {editorLeftTab === "effects" && (
                              <div className="grid grid-cols-2 gap-2">
                                {["Vintage VHS", "Neon Glow", "Glitch Distortion"].map((eff) => (
                                  <button key={eff} className="p-3 bg-black/40 border border-white/5 hover:border-violet-500 rounded-xl text-[10px] font-bold text-center text-white/80 uppercase tracking-wider font-inter">
                                    {eff}
                                  </button>
                                ))}
                              </div>
                            )}

                            {editorLeftTab === "transitions" && (
                              <div className="grid grid-cols-2 gap-2">
                                {["Fade Black", "Cross Dissolve", "Zoom Bounce"].map((tran) => (
                                  <button key={tran} className="p-3 bg-black/40 border border-white/5 hover:border-violet-500 rounded-xl text-[10px] font-bold text-center text-white/80 uppercase tracking-wider font-inter">
                                    {tran}
                                  </button>
                                ))}
                              </div>
                            )}

                            {editorLeftTab === "stickers" && (
                              <div className="grid grid-cols-3 gap-2">
                                {["🔥", "👑", "💥", "🚀"].map((stk) => (
                                  <button key={stk} className="p-3 bg-black/40 border border-white/5 hover:bg-white/5 rounded-xl text-xl text-center">
                                    {stk}
                                  </button>
                                ))}
                              </div>
                            )}

                            {editorLeftTab === "templates" && (
                              <div className="space-y-2.5">
                                {["Insta Reel Hook", "YouTube Shorts Ending"].map((tpl) => (
                                  <button key={tpl} className="w-full p-3 bg-black/40 border border-white/5 hover:border-violet-500 rounded-xl text-xs text-left text-white/80 uppercase font-semibold font-inter">
                                    {tpl}
                                  </button>
                                ))}
                              </div>
                            )}

                            {editorLeftTab === "aitools" && (
                              <div className="space-y-3">
                                <button onClick={() => setDashboardView("shorts")} className="w-full p-3 bg-black/40 border border-white/5 hover:bg-violet-600/10 rounded-xl text-xs text-left text-white/80 uppercase font-semibold font-inter flex items-center justify-between">
                                  <span>AI Shorts Generator</span>
                                  <Zap className="w-4 h-4 text-violet-400" />
                                </button>
                                <button onClick={() => setDashboardView("thumbnails")} className="w-full p-3 bg-black/40 border border-white/5 hover:bg-violet-600/10 rounded-xl text-xs text-left text-white/80 uppercase font-semibold font-inter flex items-center justify-between">
                                  <span>AI Thumbnail Studio</span>
                                  <Image className="w-4 h-4 text-emerald-400" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Mobile sidebar backdrops */}
                        {showEditorSidebar && (
                          <div 
                            onClick={() => setShowEditorSidebar(false)}
                            className="md:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-xs animate-fade-in"
                          />
                        )}
                        {showEditorProperties && (
                          <div 
                            onClick={() => setShowEditorProperties(false)}
                            className="lg:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-xs animate-fade-in"
                          />
                        )}

                        {/* 2. CENTER VISIBLE EDITOR CANVAS & CONTROLS */}
                        <div className="flex-1 flex flex-col justify-center items-center p-6 bg-[#070707] relative overflow-hidden">
                          <div className="absolute top-4 left-6 text-[10px] font-mono text-white/40 uppercase tracking-widest flex items-center gap-2">
                            <span>Editing Project: {activeProject.name}</span>
                          </div>

                          {/* Mobile editor toggles */}
                          <div className="absolute top-4 right-6 flex items-center gap-2 z-30">
                            <button
                              onClick={() => {
                                setShowEditorSidebar(!showEditorSidebar);
                                setShowEditorProperties(false);
                              }}
                              className="md:hidden py-1.5 px-3 text-[9px] uppercase tracking-wider font-bold bg-[#0c0c0c] border border-white/10 hover:bg-white/5 text-white rounded-lg flex items-center gap-1.5 transition"
                            >
                              <Sliders className="w-3.5 h-3.5 text-violet-400" />
                              Tools
                            </button>
                            <button
                              onClick={() => {
                                setShowEditorProperties(!showEditorProperties);
                                setShowEditorSidebar(false);
                              }}
                              className="lg:hidden py-1.5 px-3 text-[9px] uppercase tracking-wider font-bold bg-[#0c0c0c] border border-white/10 hover:bg-white/5 text-white rounded-lg flex items-center gap-1.5 transition"
                            >
                              <Settings className="w-3.5 h-3.5 text-violet-400" />
                              Settings
                            </button>
                          </div>

                          {/* Export Processing Loading Bar */}
                          {isExporting && (
                            <div className="absolute inset-0 z-20 bg-black/85 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
                              <RefreshCw className="w-10 h-10 text-violet-400 animate-spin mb-4" />
                              <h3 className="text-sm font-bold font-inter text-white uppercase tracking-wider">Compiling Video Export</h3>
                              <p className="text-xs text-white/50 font-inter mt-1 mb-3">Recording canvas stream and merging audio layers...</p>
                              
                              <div className="w-full max-w-sm bg-white/5 h-2 rounded-full overflow-hidden mb-2">
                                <div className="h-full bg-violet-500 transition-all duration-300" style={{ width: `${exportProgress}%` }} />
                              </div>
                              <span className="text-xs font-mono text-violet-400 font-bold">{exportProgress}%</span>
                            </div>
                          )}

                          {/* Interactive preview Canvas player */}
                          <div 
                            className="relative border border-white/10 rounded-2xl overflow-hidden shadow-2xl bg-black flex items-center justify-center p-4 cursor-grab active:cursor-grabbing"
                            onMouseDown={handleCanvasMouseDown}
                            onMouseMove={handleCanvasMouseMove}
                            onMouseUp={handleCanvasMouseUp}
                            onMouseLeave={handleCanvasMouseUp}
                          >
                            <canvas
                              ref={canvasRef}
                              width={aspectRatio === "9:16" ? 360 : aspectRatio === "16:9" ? 640 : aspectRatio === "1:1" ? 480 : 400}
                              height={aspectRatio === "9:16" ? 640 : aspectRatio === "16:9" ? 360 : aspectRatio === "1:1" ? 480 : 500}
                              className={`rounded-lg object-contain transition-all max-h-[440px] max-w-full`}
                            />
                            {showSafeZone && (
                              <div className="absolute inset-0 pointer-events-none z-20 border border-red-500/20 m-4">
                                <div className="absolute top-2 left-2 text-[8px] font-mono text-red-400 bg-black/80 px-2 py-0.5 rounded border border-red-500/20 uppercase tracking-wider font-semibold">
                                  {aspectRatio} Safe Zone
                                </div>
                                <div className="absolute right-3 bottom-20 flex flex-col gap-3 items-center opacity-50">
                                  <div className="w-6 h-6 rounded-full bg-white/20 border border-white/40 flex items-center justify-center"><User className="w-3 h-3 text-white" /></div>
                                  <div className="w-6 h-6 rounded-full bg-white/20 border border-white/40 flex items-center justify-center text-[9px]">❤️</div>
                                  <div className="w-6 h-6 rounded-full bg-white/20 border border-white/40 flex items-center justify-center text-[9px]">💬</div>
                                  <div className="w-6 h-6 rounded-full bg-white/20 border border-white/40 flex items-center justify-center text-[9px]">🔗</div>
                                </div>
                                <div className="absolute left-3 bottom-3 right-12 text-left opacity-50">
                                  <div className="text-[9px] font-bold text-white mb-0.5">@creator</div>
                                  <div className="text-[7px] text-white/80 line-clamp-2 leading-tight">Interactive safe zones outline where social icons and tags overlap your video frame. Keep subtitles above.</div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Playback seeking controls */}
                          <div className="mt-6 flex items-center gap-6 bg-[#0a0a0a] border border-white/5 px-6 py-3.5 rounded-xl w-full max-w-md shadow-lg">
                            <button
                              onClick={togglePlayPause}
                              className="w-10 h-10 bg-violet-600 hover:bg-violet-500 rounded-full flex items-center justify-center text-white transition shadow-lg shrink-0"
                            >
                              {playerPlaying ? <Pause className="w-4.5 h-4.5" /> : <Play className="w-4.5 h-4.5 pl-0.5" />}
                            </button>

                            <div className="flex-grow flex items-center justify-between text-xs font-mono select-none">
                              <span>00:{currentTime < 10 ? `0${currentTime.toFixed(1)}` : currentTime.toFixed(1)}s</span>
                              <span className="text-white/40">/ 00:{videoDuration < 10 ? `0${videoDuration.toFixed(0)}` : videoDuration.toFixed(0)}.0s</span>
                            </div>

                            <button className="text-white/40 hover:text-white shrink-0">
                              <Volume2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* 3. RIGHT PROPERTIES & EXPORT PANEL */}
                        <div className={`w-72 border-l border-white/5 bg-[#090909] p-5 overflow-y-auto flex flex-col gap-6 shrink-0 text-left transition-all duration-300 absolute lg:static top-0 bottom-0 right-0 z-40 shadow-2xl lg:shadow-none ${showEditorProperties ? "translate-x-0" : "translate-x-full lg:translate-x-0"}`}>
                          {/* Mobile close button inside properties */}
                          <div className="lg:hidden flex justify-between items-center border-b border-white/5 pb-3">
                            <span className="text-xs font-bold text-white uppercase tracking-wider font-inter">Properties</span>
                            <button 
                              onClick={() => setShowEditorProperties(false)}
                              className="p-1 border border-white/10 rounded bg-white/5 text-white/80 hover:text-white"
                              title="Close Properties"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          
                          {/* Video Settings */}
                          <div>
                            <label className="text-[9px] font-bold tracking-widest text-white/40 uppercase mb-2 block">Aspect Ratio</label>
                            <select
                              value={aspectRatio}
                              onChange={(e) => setAspectRatio(e.target.value)}
                              className="w-full bg-[#141414] border border-white/10 rounded-lg px-3 py-2 text-xs text-white/80 outline-none"
                            >
                              <option value="9:16">9:16 (Vertical Shorts)</option>
                              <option value="16:9">16:9 (Landscape Video)</option>
                              <option value="1:1">1:1 (Square Post)</option>
                              <option value="4:5">4:5 (Vertical Post)</option>
                            </select>

                            <div className="mt-3">
                              <button
                                onClick={() => setShowSafeZone(!showSafeZone)}
                                className={`w-full py-2 px-3 text-[10px] font-bold rounded-lg border uppercase tracking-wider font-inter transition ${showSafeZone ? "bg-violet-600 border-violet-500 text-white shadow-lg" : "bg-[#141414] border-white/5 text-white/60 hover:border-white/10 hover:text-white"}`}
                              >
                                {showSafeZone ? "Hide Safe Zones" : "Show Safe Zones"}
                              </button>
                            </div>
                          </div>

                          {/* Sizing & Transforms properties */}
                          <div>
                            <span className="text-[9px] font-bold tracking-widest text-white/40 uppercase mb-3 block border-b border-white/5 pb-2">Transforms</span>
                            <div className="space-y-4">
                              <div>
                                <div className="flex items-center justify-between text-xs text-white/70 mb-1">
                                  <span>Video Scale</span>
                                  <span>{videoScale}%</span>
                                </div>
                                <input
                                  type="range"
                                  min="50"
                                  max="200"
                                  value={videoScale}
                                  onChange={(e) => setVideoScale(parseInt(e.target.value))}
                                  className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-violet-500"
                                />
                              </div>

                              <div>
                                <div className="flex items-center justify-between text-xs text-white/70 mb-1">
                                  <span>Opacity</span>
                                  <span>{videoOpacity}%</span>
                                </div>
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  value={videoOpacity}
                                  onChange={(e) => setVideoOpacity(parseInt(e.target.value))}
                                  className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-violet-500"
                                />
                              </div>

                              <div>
                                <div className="flex items-center justify-between text-xs text-white/70 mb-1">
                                  <span>Rotation</span>
                                  <span>{videoRotation}°</span>
                                </div>
                                <input
                                  type="range"
                                  min="-180"
                                  max="180"
                                  value={videoRotation}
                                  onChange={(e) => setVideoRotation(parseInt(e.target.value))}
                                  className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-violet-500"
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-2 pt-2">
                                <button 
                                  onClick={() => setVideoFlipH(!videoFlipH)}
                                  className={`py-1.5 px-2 rounded-lg border text-[10px] uppercase font-bold tracking-wider font-inter transition ${videoFlipH ? "bg-violet-600 border-violet-500 text-white" : "bg-black/40 border-white/5 text-white/50"}`}
                                >
                                  Flip H
                                </button>
                                <button 
                                  onClick={() => setVideoFlipV(!videoFlipV)}
                                  className={`py-1.5 px-2 rounded-lg border text-[10px] uppercase font-bold tracking-wider font-inter transition ${videoFlipV ? "bg-violet-600 border-violet-500 text-white" : "bg-black/40 border-white/5 text-white/50"}`}
                                >
                                  Flip V
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Speed & Volume settings */}
                          <div>
                            <span className="text-[9px] font-bold tracking-widest text-white/40 uppercase mb-3 block border-b border-white/5 pb-2">Audio & Speed</span>
                            <div className="space-y-4">
                              <div>
                                <div className="flex items-center justify-between text-xs text-white/70 mb-1">
                                  <span>Playback Speed</span>
                                  <span>{playbackSpeed}x</span>
                                </div>
                                <div className="grid grid-cols-4 gap-1.5">
                                  {[0.5, 1, 1.5, 2].map((spd) => (
                                    <button
                                      key={spd}
                                      onClick={() => setPlaybackSpeed(spd)}
                                      className={`py-1 rounded text-[10px] font-mono border transition ${playbackSpeed === spd ? "bg-violet-600 border-violet-500 text-white" : "bg-black/40 border-white/5 text-white/50"}`}
                                    >
                                      {spd}x
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <div className="flex items-center justify-between text-xs text-white/70 mb-1">
                                  <span>Volume</span>
                                  <span>{videoVolume}%</span>
                                </div>
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  value={videoVolume}
                                  onChange={(e) => setVideoVolume(parseInt(e.target.value))}
                                  className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-violet-500"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Subtitle font configs */}
                          <div>
                            <span className="text-[9px] font-bold tracking-widest text-white/40 uppercase mb-3 block border-b border-white/5 pb-2">Subtitle Settings</span>
                            <div className="space-y-4">
                              <div>
                                <div className="flex items-center justify-between text-xs text-white/70 mb-1">
                                  <span>Font Size</span>
                                  <span>{captionFontSize}px</span>
                                </div>
                                <input
                                  type="range"
                                  min="16"
                                  max="48"
                                  value={captionFontSize}
                                  onChange={(e) => setCaptionFontSize(parseInt(e.target.value))}
                                  className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-violet-500"
                                />
                              </div>

                              <div>
                                <label className="text-[9px] font-bold text-white/40 uppercase block mb-1">Highlight Color</label>
                                <div className="flex gap-2">
                                  {["#FFFF00", "#FF00FF", "#00FFFF", "#39FF14"].map((col) => (
                                    <button
                                      key={col}
                                      onClick={() => setCaptionColor(col)}
                                      style={{ backgroundColor: col }}
                                      className={`w-6 h-6 rounded-full border-2 ${captionColor === col ? "border-white" : "border-transparent"}`}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Exports settings */}
                          <div className="mt-auto border-t border-white/5 pt-4">
                            <label className="text-[9px] font-bold tracking-widest text-white/40 uppercase mb-2 block">Resolution target</label>
                            <select
                              value={exportRes}
                              onChange={(e) => setExportRes(e.target.value)}
                              className="w-full bg-[#141414] border border-white/10 rounded-lg px-3 py-2 text-xs text-white/80 outline-none mb-3"
                            >
                              <option value="720p">720p (HD Web)</option>
                              <option value="1080p">1080p (Full HD Pro)</option>
                              <option value="4K">4K (Ultra UHD)</option>
                            </select>
                            <button
                              onClick={triggerRealExport}
                              className="w-full bg-gradient-to-r from-violet-600 to-indigo-500 hover:from-violet-500 hover:to-indigo-400 py-3 rounded-lg text-xs uppercase tracking-widest font-bold font-inter transition shadow-lg shadow-violet-500/25"
                            >
                              Export Video
                            </button>
                          </div>

                        </div>

                      </div>

                      {/* 3. PROFESSIONAL MULTI-TRACK TIMELINE EDITOR */}
                      <div className="h-64 bg-[#080808] border-t border-white/5 flex flex-col overflow-hidden shrink-0 select-none">
                        
                        {/* Timeline Header Controls */}
                        <div className="h-10 border-b border-white/5 px-6 flex items-center justify-between text-xs bg-[#0a0a0a]">
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={() => {
                                alert(`Spliced clip at ${currentTime.toFixed(1)}s!`);
                              }}
                              className="flex items-center gap-1 text-[10px] text-white/60 hover:text-white uppercase font-bold tracking-wider"
                            >
                              <Scissors className="w-3.5 h-3.5" />
                              Split
                            </button>
                            <button 
                              onClick={() => {
                                if (captionsList.length > 0) {
                                  const activeWord = captionsList.find(w => currentTime >= w.start && currentTime <= w.end) || captionsList[0];
                                  pushToUndo();
                                  const newWord = {
                                    id: Date.now(),
                                    word: `${activeWord.word} (Copy)`,
                                    start: activeWord.end + 0.1,
                                    end: activeWord.end + 1.5
                                  };
                                  setCaptionsList([...captionsList, newWord].sort((a,b) => a.start - b.start));
                                }
                              }}
                              className="flex items-center gap-1 text-[10px] text-white/60 hover:text-white uppercase font-bold tracking-wider"
                            >
                              <Copy className="w-3.5 h-3.5" />
                              Duplicate
                            </button>
                            <button 
                              onClick={() => {
                                const activeWord = captionsList.find(w => currentTime >= w.start && currentTime <= w.end);
                                if (activeWord) {
                                  pushToUndo();
                                  setCaptionsList(captionsList.filter(w => w.id !== activeWord.id));
                                }
                              }}
                              className="flex items-center gap-1 text-[10px] text-white/60 hover:text-red-400 uppercase font-bold tracking-wider"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete
                            </button>
                            
                            <div className="h-4 w-px bg-white/10 mx-1" />

                            <button 
                              onClick={handleUndo}
                              disabled={undoStack.length === 0}
                              className={`text-[10px] uppercase font-bold tracking-wider transition ${undoStack.length > 0 ? "text-white/60 hover:text-white" : "text-white/20 cursor-not-allowed"}`}
                            >
                              Undo
                            </button>
                            <button 
                              onClick={handleRedo}
                              disabled={redoStack.length === 0}
                              className={`text-[10px] uppercase font-bold tracking-wider transition ${redoStack.length > 0 ? "text-white/60 hover:text-white" : "text-white/20 cursor-not-allowed"}`}
                            >
                              Redo
                            </button>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-[9px] text-white/40">Zoom:</span>
                            <input 
                              type="range"
                              min="100"
                              max="400"
                              value={timelineZoom}
                              onChange={(e) => setTimelineZoom(parseInt(e.target.value))}
                              className="w-20 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-violet-500 focus:outline-none"
                            />
                            <span className="font-mono text-[9px] text-white/40">{timelineZoom}%</span>
                          </div>
                        </div>

                        {/* Timeline Multi-tracks wrapper */}
                        <div className="flex-1 overflow-auto p-4 relative">
                          <div 
                            className="relative h-full space-y-2" 
                            style={{ width: `${timelineZoom}%`, minWidth: "100%" }}
                            onClick={(e) => {
                              const rect = e.currentTarget.getBoundingClientRect();
                              const x = e.clientX - rect.left;
                              const targetTime = (x / rect.width) * videoDuration;
                              handleSeekTime(Math.max(0, Math.min(videoDuration, targetTime)));
                            }}
                          >
                            {/* Scrub Cursor Line */}
                            <div 
                              style={{ left: `${(currentTime / videoDuration) * 90}%` }}
                              className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10 pointer-events-none"
                            >
                              <div className="w-2.5 h-2.5 rounded-full bg-red-500 -ml-1 -mt-0.5 shadow-md" />
                            </div>

                          {/* Track 1: Text / Captions Track (Green theme) */}
                          <div className="flex items-center gap-4 h-11 bg-black/40 border border-white/5 rounded-xl px-4 relative overflow-hidden">
                            <div className="w-8 flex items-center justify-center font-bold text-[10px] uppercase text-emerald-400 border-r border-white/5 pr-3">T</div>
                            <div className="flex-1 flex gap-1 items-center h-full relative" style={{ left: "6%" }}>
                              {captionsList.map((word) => (
                                <div
                                  key={word.id}
                                  onClick={() => handleSeekTime(word.start)}
                                  className={`px-3 py-1 rounded-md text-[9px] font-bold font-inter truncate transition cursor-pointer flex items-center gap-2 ${currentTime >= word.start && currentTime <= word.end ? "bg-emerald-500 text-black border border-emerald-400 shadow-md" : "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"}`}
                                >
                                  {editWordId === word.id ? (
                                    <input
                                      type="text"
                                      value={editWordText}
                                      onChange={(e) => setEditWordText(e.target.value)}
                                      className="bg-neutral-800 border border-white/20 text-white rounded px-1.5 py-0.5 text-[9px] outline-none"
                                      onKeyDown={(e) => e.key === "Enter" && handleSaveWordText(word.id)}
                                      onClick={(e) => e.stopPropagation()}
                                      autoFocus
                                    />
                                  ) : (
                                    <span onClick={(e) => { e.stopPropagation(); setEditWordId(word.id); setEditWordText(word.word); }}>
                                      {word.word}
                                    </span>
                                  )}
                                  <button onClick={(e) => { e.stopPropagation(); handleDeleteCaption(word.id); }} className="text-red-500 hover:text-red-400 text-[8px] font-bold">✕</button>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Track 2: Video Track (Violet theme) */}
                          <div className="flex items-center gap-4 h-11 bg-black/40 border border-white/5 rounded-xl px-4 relative overflow-hidden">
                            <div className="w-8 flex items-center justify-center font-bold text-[10px] uppercase text-violet-400 border-r border-white/5 pr-3">V</div>
                            <div className="flex-1 flex items-center h-full relative" style={{ left: "6%" }}>
                              <button
                                onClick={() => setSelectedClipType("video")}
                                className={`w-[85%] h-[80%] rounded-lg border flex items-center justify-between px-3 text-[10px] uppercase font-bold tracking-wider transition ${selectedClipType === "video" ? "bg-violet-600 border-violet-400 text-white shadow-lg" : "bg-violet-600/10 border-violet-500/30 text-violet-400 hover:bg-violet-600/20"}`}
                              >
                                <span>{activeProject.name}</span>
                                <span className="font-mono text-[9px] text-white/55">{activeProject.duration}s</span>
                              </button>
                            </div>
                          </div>

                          {/* Track 3: Audio Track (Blue theme) */}
                          <div className="flex items-center gap-4 h-11 bg-black/40 border border-white/5 rounded-xl px-4 relative overflow-hidden">
                            <div className="w-8 flex items-center justify-center font-bold text-[10px] uppercase text-sky-400 border-r border-white/5 pr-3">A</div>
                            <div className="flex-1 flex items-center h-full relative" style={{ left: "6%" }}>
                              <button
                                onClick={() => setSelectedClipType("audio")}
                                className={`w-[70%] h-[80%] rounded-lg border flex items-center justify-between px-3 text-[10px] uppercase font-bold tracking-wider transition ${selectedClipType === "audio" ? "bg-sky-600 border-sky-400 text-white shadow-lg" : "bg-sky-600/10 border-sky-500/30 text-sky-400 hover:bg-sky-600/20"}`}
                              >
                                <span>Ambient_Beat_Track.mp3</span>
                                <span className="font-mono text-[9px] text-white/55">00:12s</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  ) : (
                    <div className="flex-grow flex flex-col justify-center items-center p-8 text-center bg-[#070707]">
                      <Video className="w-12 h-12 text-white/20 mb-4" />
                      <h3 className="font-bold text-white uppercase font-inter">No Project Loaded</h3>
                      <p className="text-xs text-white/40 font-inter mt-1 mb-4">Please upload a file or choose a project to open the Editor.</p>
                      <button onClick={() => setDashboardView("projects")} className="bg-violet-600 hover:bg-violet-500 px-5 py-2.5 rounded-lg text-xs uppercase font-bold tracking-widest font-inter transition">
                        Select Project
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* ----------------- SUB-TAB: CAPTIONS / SOUND ----------------- */}
              {dashboardView === "captions" && (
                <div className="flex-grow overflow-y-auto p-6 md:p-8 space-y-8 max-w-4xl mx-auto w-full">
                  <div className="border-b border-white/5 pb-4">
                    <h1 className="text-xl font-bold font-inter text-white uppercase tracking-wider">AI Speech & Audio Enhancer</h1>
                    <p className="text-xs text-white/40 font-inter mt-1">Denoise audio streams and equalize spoken files for a polished podcast feel.</p>
                  </div>

                  <div className="p-8 rounded-2xl bg-[#090909] border border-white/5 space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-xs text-white/50 font-mono">
                        <span>Wave: {audioPlaying ? "Playing..." : "Paused"}</span>
                        <span>Mode: {audioEnhanced ? "AI STUDIO ENHANCED" : "RAW BYPASS"}</span>
                      </div>

                      <div className="h-32 bg-[#121212] border border-white/5 rounded-xl flex items-end justify-between p-6 relative overflow-hidden">
                        <div className="absolute inset-0 bg-grid-white/[0.01]" />
                        {Array.from({ length: 40 }).map((_, index) => {
                          const waveHeight = audioPlaying 
                            ? Math.sin(index + audioProgress) * 45 + 55 
                            : Math.sin(index) * 20 + 30;
                          const finalHeight = audioEnhanced ? waveHeight * 0.45 + 10 : waveHeight;
                          
                          return (
                            <div 
                              key={index} 
                              style={{ height: `${Math.max(5, Math.min(100, index % 2 === 0 ? finalHeight : finalHeight * 0.75))}%` }}
                              className={`w-[1.5%] rounded-full transition-all duration-300 ${audioEnhanced ? "bg-violet-400" : "bg-neutral-600"}`}
                            />
                          );
                        })}
                        <div className="absolute top-0 bottom-0 bg-violet-500 w-0.5" style={{ left: `${audioProgress}%` }} />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-[#141414] border border-white/5 p-5 rounded-xl">
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => setAudioPlaying(!audioPlaying)}
                          className="w-12 h-12 bg-violet-600 hover:bg-violet-500 rounded-full flex items-center justify-center text-white shadow-lg transition-all"
                        >
                          {audioPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 pl-0.5" />}
                        </button>
                        <div>
                          <h4 className="text-xs font-bold text-white font-inter">Podcast_Interview_Telugu.wav</h4>
                          <span className="text-[10px] text-white/40 font-mono">Length: 00:45 | Rate: 48kHz</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 bg-black/40 border border-white/5 px-4 py-2 rounded-xl select-none">
                        <span className="text-[10px] font-bold tracking-widest text-white/50 uppercase">Raw</span>
                        <button 
                          onClick={() => setAudioEnhanced(!audioEnhanced)}
                          className={`w-14 h-7 rounded-full p-1 relative transition-all ${audioEnhanced ? "bg-violet-600" : "bg-neutral-800"}`}
                        >
                          <div className={`w-5 h-5 bg-white rounded-full transition-all ${audioEnhanced ? "translate-x-7" : "translate-x-0"}`} />
                        </button>
                        <span className="text-[10px] font-bold tracking-widest text-violet-400 uppercase">Enhanced</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ----------------- SUB-TAB: AI SHORTS ----------------- */}
              {dashboardView === "shorts" && (
                <div className="flex-grow overflow-y-auto p-6 md:p-8 space-y-8 max-w-5xl mx-auto w-full">
                  <div className="border-b border-white/5 pb-4">
                    <h1 className="text-xl font-bold font-inter text-white uppercase tracking-wider">AI Shorts Hook Generator</h1>
                    <p className="text-xs text-white/40 font-inter mt-1">Submit links to isolate and crop viral moments into vertical clips.</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8 items-start">
                    <div className="p-6 rounded-2xl bg-[#090909] border border-white/5 space-y-4">
                      <label className="text-[10px] font-bold tracking-widest text-white/40 uppercase block">Video URL Link</label>
                      <div className="flex gap-2">
                        <input 
                          type="url" 
                          placeholder="https://www.youtube.com/watch?v=..."
                          value={shortsUrl}
                          onChange={(e) => setShortsUrl(e.target.value)}
                          className="flex-1 bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-xs outline-none text-white focus:border-violet-500 font-inter"
                        />
                        <button 
                          onClick={triggerShortsAnalysis}
                          disabled={analyzingShorts || !shortsUrl}
                          className="bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white px-5 rounded-xl text-xs uppercase tracking-widest font-bold font-inter transition"
                        >
                          Cut
                        </button>
                      </div>

                      {analyzingShorts && (
                        <div className="flex flex-col items-center justify-center p-8 bg-[#141414] border border-white/5 rounded-xl">
                          <RefreshCw className="w-6 h-6 text-violet-400 animate-spin mb-4" />
                          <span className="text-xs text-white/80 font-bold uppercase tracking-wider font-inter">Running hook calculations...</span>
                        </div>
                      )}

                      {shortsClips.length > 0 && (
                        <div className="space-y-3 mt-4 text-left">
                          {shortsClips.map((clip) => (
                            <div key={clip.id} className="p-4 rounded-xl border border-white/5 bg-black/40 flex items-center justify-between">
                              <div>
                                <h4 className="text-xs font-bold text-white font-inter">{clip.title}</h4>
                                <span className="text-[9px] text-violet-400 font-bold font-mono">Score: {clip.score}% | {clip.duration}</span>
                              </div>
                              <button 
                                onClick={() => {
                                  if (activeProject) {
                                    setDashboardView("editor");
                                  }
                                }}
                                className="flex items-center gap-1 bg-white/5 hover:bg-violet-600 border border-white/10 hover:border-violet-500 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase font-inter transition"
                              >
                                Edit
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="p-6 rounded-2xl bg-[#090909] border border-white/5 space-y-4">
                      <h3 className="text-xs font-bold tracking-widest text-white/40 uppercase font-inter border-b border-white/5 pb-2">Reframing Focus</h3>
                      <div className="aspect-video w-full rounded-xl bg-neutral-900 border border-white/5 flex items-center justify-center relative overflow-hidden">
                        <img 
                          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop"
                          alt=""
                          className="absolute inset-0 w-full h-full object-cover opacity-35"
                        />
                        <div className="absolute top-0 bottom-0 left-[35%] right-[35%] border-2 border-dashed border-violet-500/70 bg-violet-600/5 relative flex justify-center items-center">
                          <span className="text-[8px] bg-violet-500 text-white font-mono px-2 py-0.5 rounded uppercase tracking-wider absolute top-2">9:16 Center</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* ----------------- SUB-TAB: THUMBNAILS (FULLY WORKING FRAME SNAPIER) ----------------- */}
              {dashboardView === "thumbnails" && (
                <div className="flex-grow overflow-y-auto p-6 md:p-8 space-y-8 max-w-5xl mx-auto w-full">
                  <div className="border-b border-white/5 pb-4">
                    <h1 className="text-xl font-bold font-inter text-white uppercase tracking-wider">AI High-Contrast Thumbnail Studio</h1>
                    <p className="text-xs text-white/40 font-inter mt-1">Extract real frames from your video preview, type title text, and download your thumbnail.</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8 items-start">
                    <div className="p-6 rounded-2xl bg-[#090909] border border-white/5 space-y-4 text-left">
                      <div>
                        <label className="text-[10px] font-bold tracking-widest text-white/40 uppercase mb-2 block">Overlay Caption Text</label>
                        <input 
                          type="text" 
                          value={thumbnailText}
                          onChange={(e) => setThumbnailText(e.target.value)}
                          className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-xs outline-none text-white focus:border-violet-500 font-inter font-bold"
                        />
                      </div>

                      <button 
                        onClick={handleExtractThumbnail}
                        disabled={generatingThumbnail}
                        className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 py-3.5 rounded-xl text-xs uppercase tracking-widest font-bold font-inter transition"
                      >
                        {generatingThumbnail ? "Extracting Canvas Frame..." : "Capture Frame & Text"}
                      </button>
                    </div>

                    <div className="p-6 rounded-2xl bg-[#090909] border border-white/5 space-y-4 text-left">
                      <h3 className="text-xs font-bold tracking-widest text-white/40 uppercase font-inter border-b border-white/5 pb-2">Canvas Canvas Preview</h3>
                      <div className="aspect-video w-full rounded-xl bg-neutral-900 border border-white/5 flex flex-col items-center justify-center relative overflow-hidden shadow-inner select-none">
                        <img 
                          src={thumbnailUrl}
                          alt=""
                          className="absolute inset-0 w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex justify-end">
                        <button 
                          onClick={handleDownloadThumbnail}
                          className="flex items-center gap-1.5 border border-white/20 hover:border-white/40 hover:bg-white/5 px-4 py-2 rounded-lg text-[10px] font-bold uppercase font-inter transition"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Download PNG
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* ----------------- SUB-TAB: MEDIA LIBRARY (STORES ALL UPLOADS & PERSISTS) ----------------- */}
              {dashboardView === "media" && (
                <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
                    <div>
                      <h1 className="text-xl font-bold font-inter text-white uppercase tracking-wider">Media Library</h1>
                      <p className="text-xs text-white/40 font-inter mt-1">Upload and store all your videos, raw assets, soundtracks, and thumbnails.</p>
                    </div>

                    <div className="relative">
                      <input type="file" onChange={handleRealUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                      <button className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-500 px-4 py-2 rounded-lg text-xs uppercase tracking-widest font-bold font-inter transition">
                        <Upload className="w-4 h-4" />
                        Upload File
                      </button>
                    </div>
                  </div>

                  {/* Grid table gallery list */}
                  <div className="bg-[#090909] border border-white/5 rounded-2xl p-5 overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs font-inter min-w-[600px]">
                      <thead>
                        <tr className="border-b border-white/5 text-white/40 uppercase tracking-wider text-[10px]">
                          <th className="py-3 px-4">Preview</th>
                          <th className="py-3 px-4">File Name</th>
                          <th className="py-3 px-4">Type</th>
                          <th className="py-3 px-4">File Size</th>
                          <th className="py-3 px-4">Date Uploaded</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {mediaFiles.map((file) => (
                          <tr key={file.id} className="hover:bg-white/2 transition">
                            <td className="py-3 px-4">
                              <img src={file.thumbnail} alt="" className="w-12 h-9 rounded object-cover border border-white/5" />
                            </td>
                            <td className="py-3 px-4 font-semibold text-white truncate max-w-xs">{file.name}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider ${file.type === "video" ? "bg-violet-500/10 text-violet-400" : file.type === "audio" ? "bg-sky-500/10 text-sky-400" : "bg-emerald-500/10 text-emerald-400"}`}>
                                {file.type}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-mono text-white/60">{file.size}</td>
                            <td className="py-3 px-4 font-mono text-white/40">{file.uploadDate}</td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-2.5">
                                <a 
                                  href={file.url} 
                                  download={file.name}
                                  className="p-1.5 border border-white/10 rounded-lg hover:bg-white/5 text-white/60 hover:text-white inline-block" 
                                  title="Download"
                                >
                                  <Download className="w-4 h-4" />
                                </a>
                                <button onClick={() => handleDeleteMediaAsset(file.id)} className="p-1.5 border border-white/10 rounded-lg hover:bg-red-900 hover:border-red-800 text-white/60 hover:text-white" title="Delete">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Exports Section Inside Media */}
                  <div className="space-y-4 mt-10 text-left">
                    <h3 className="text-xs font-bold tracking-widest text-white/40 uppercase font-inter">Exports Section</h3>
                    
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {exportsList.map((exp) => (
                        <div key={exp.id} className="bg-[#090909] border border-white/5 rounded-2xl overflow-hidden p-4 flex flex-col justify-between group">
                          <div className="aspect-video w-full rounded-xl overflow-hidden bg-neutral-900 border border-white/5 relative mb-3">
                            <video src={exp.url} controls className="w-full h-full object-contain" />
                          </div>

                          <div className="space-y-2">
                            <h4 className="text-xs font-bold text-white font-inter truncate">{exp.name}</h4>
                            <div className="flex items-center justify-between text-[9px] text-white/40 font-mono">
                              <span>Resolution: {exp.resolution || "1080p"}</span>
                              <span>{exp.size || "15.0 MB"}</span>
                            </div>
                            <div className="flex items-center justify-between text-[9px] text-white/40 font-mono border-t border-white/5 pt-2 mt-2">
                              <span>Export Date: {exp.exportDate || exp.date}</span>
                              <a 
                                href={exp.url} 
                                download={exp.name}
                                className="flex items-center gap-1 text-[9px] text-violet-400 hover:text-violet-300 font-bold uppercase tracking-wider"
                              >
                                <Download className="w-3 h-3" />
                                Download File
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ----------------- SUB-TABS: ANALYTICS / TEAM / BILLING / SETTINGS ----------------- */}
              {dashboardView === "analytics" && (
                <div className="flex-grow overflow-y-auto p-6 md:p-8 space-y-6">
                  <div className="border-b border-white/5 pb-4">
                    <h1 className="text-xl font-bold font-inter text-white uppercase tracking-wider">Analytics & Performance</h1>
                    <p className="text-xs text-white/40 font-inter mt-1">Review average watch times, subscriber growth, and clip retention indexes.</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-[#090909] border border-white/5 text-center py-16 text-white/40 text-xs">
                    <Activity className="w-12 h-12 text-white/20 mx-auto mb-4" />
                    No active analytics data. Connect your social channels under Settings to load API metrics.
                  </div>
                </div>
              )}

              {dashboardView === "team" && (
                <div className="flex-grow overflow-y-auto p-6 md:p-8 space-y-6">
                  <div className="border-b border-white/5 pb-4">
                    <h1 className="text-xl font-bold font-inter text-white uppercase tracking-wider">Team Workspace</h1>
                    <p className="text-xs text-white/40 font-inter mt-1">Invite collaborative editors, copywriters, and marketers to check active drafts.</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-[#090909] border border-white/5 text-center py-16 text-white/40 text-xs">
                    <User className="w-12 h-12 text-white/20 mx-auto mb-4" />
                    Upgrade to Agency Studio plan to invite collaborative team workspace members.
                  </div>
                </div>
              )}

              {dashboardView === "billing" && (
                <div className="flex-grow overflow-y-auto p-6 md:p-8 space-y-8 max-w-4xl mx-auto w-full text-left">
                  <div className="border-b border-white/5 pb-4">
                    <h1 className="text-xl font-bold font-inter text-white uppercase tracking-wider">Billing & Billing Plans</h1>
                    <p className="text-xs text-white/40 font-inter mt-1">Manage checkout cards, view invoices, or change active subscriptions.</p>
                  </div>

                  <div className="p-6 bg-[#090909] border border-white/5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <span className="text-[10px] text-white/40 uppercase tracking-widest font-mono">Current Active Package</span>
                      <h4 className="text-lg font-bold text-white font-inter mt-1">Creator Pro - Annual Billing</h4>
                      <p className="text-[10px] text-white/40 font-mono mt-0.5">Next renewal date: June 8, 2027 (₹799 / month)</p>
                    </div>
                    
                    <button className="border border-white/25 hover:border-white/50 px-5 py-2.5 rounded-lg text-xs uppercase font-bold tracking-widest font-inter transition">
                      Cancel Plan
                    </button>
                  </div>
                </div>
              )}

              {dashboardView === "settings" && (
                <div className="flex-grow overflow-y-auto p-6 md:p-8 space-y-6 max-w-4xl mx-auto w-full text-left">
                  <div className="border-b border-white/5 pb-4">
                    <h1 className="text-xl font-bold font-inter text-white uppercase tracking-wider">Workspace Settings</h1>
                    <p className="text-xs text-white/40 font-inter mt-1">Configure user accounts, API integrations, and caption presets.</p>
                  </div>

                  <div className="p-6 rounded-2xl bg-[#090909] border border-white/5 space-y-4 text-xs">
                    <div className="flex justify-between items-center py-2.5 border-b border-white/5">
                      <span className="font-bold text-white font-inter uppercase tracking-wider">Default Aspect Ratio</span>
                      <span className="text-white/60">9:16 (Shorts)</span>
                    </div>
                    <div className="flex justify-between items-center py-2.5 border-b border-white/5">
                      <span className="font-bold text-white font-inter uppercase tracking-wider">Whisper Language</span>
                      <span className="text-white/60">Telugu (te)</span>
                    </div>
                    <div className="flex justify-between items-center py-2.5">
                      <span className="font-bold text-white font-inter uppercase tracking-wider">GPU Cluster Region</span>
                      <span className="text-white/60">AP-SOUTH-1 (Mumbai)</span>
                    </div>
                  </div>

                  {activeProject && (
                    <div className="p-6 rounded-2xl bg-[#090909] border border-white/5 space-y-4 text-xs">
                      <div className="border-b border-white/5 pb-2">
                        <h3 className="font-bold text-white font-inter uppercase tracking-wider text-sm">Version History ({activeProject.name})</h3>
                        <p className="text-[10px] text-white/40 mt-1">Manual snapshots and autosave states for the loaded project. Click restore to revert.</p>
                      </div>

                      <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                        {projectHistory.length === 0 ? (
                          <div className="text-[10px] text-white/30 italic">No versions recorded yet. Modify the project to trigger auto-saving or press manual save.</div>
                        ) : (
                          projectHistory.map((ver, idx) => (
                            <div key={idx} className="flex justify-between items-center py-2 px-3 bg-black/40 border border-white/5 rounded-lg">
                              <div className="flex flex-col">
                                <span className="font-bold text-white/80 font-mono">Snapshot #{projectHistory.length - idx}</span>
                                <span className="text-[9px] text-white/40">Timestamp: {ver.timestamp}</span>
                              </div>
                              <button
                                onClick={() => {
                                  pushToUndo();
                                  setCaptionsList(ver.captions);
                                  setVideoScale(ver.settings.videoScale);
                                  setVideoOpacity(ver.settings.videoOpacity);
                                  setVideoRotation(ver.settings.videoRotation);
                                  setVideoFlipH(ver.settings.videoFlipH);
                                  setVideoFlipV(ver.settings.videoFlipV);
                                  setCaptionFontSize(ver.settings.captionFontSize);
                                  setCaptionColor(ver.settings.captionColor);
                                  setDemoStyle(ver.settings.demoStyle);
                                  if (ver.settings.videoX !== undefined) setVideoX(ver.settings.videoX);
                                  if (ver.settings.videoY !== undefined) setVideoY(ver.settings.videoY);
                                  alert("Project restored to selected snapshot!");
                                }}
                                className="px-3 py-1 bg-violet-600/20 hover:bg-violet-600/40 text-violet-400 rounded text-[9px] uppercase font-bold border border-violet-500/20 transition"
                              >
                                Restore
                              </button>
                            </div>
                          ))
                        )}
                      </div>

                      <button
                        onClick={() => {
                          saveProjectVersion();
                          alert("Manual snapshot version saved successfully!");
                        }}
                        className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] uppercase font-bold tracking-wider border border-white/5 transition"
                      >
                        Create Manual Version Snapshot
                      </button>
                    </div>
                  )}
                </div>
              )}

            </main>

            {/* Mobile Bottom Navigation Bar */}
            <div className="fixed bottom-0 left-0 right-0 h-16 bg-[#090909]/95 backdrop-blur-md border-t border-white/5 flex items-center justify-around px-4 lg:hidden z-30">
              {[
                { id: "home", label: "Home", icon: <LayoutDashboard className="w-5 h-5" /> },
                { id: "projects", label: "Projects", icon: <FolderOpen className="w-5 h-5" /> },
                { id: "editor", label: "Editor", icon: <Video className="w-5 h-5" /> },
                { id: "media", label: "Media", icon: <Folder className="w-5 h-5" /> },
                { id: "install", label: "Install", icon: <Download className="w-5 h-5" />, action: handleInstallApp }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (tab.action) {
                      tab.action();
                    } else {
                      setDashboardView(tab.id);
                      setDashboardMenuOpen(false);
                    }
                  }}
                  className={`flex flex-col items-center justify-center gap-1 flex-1 h-full text-[9px] uppercase tracking-wider font-semibold font-inter transition-all ${dashboardView === tab.id && !tab.action ? "text-violet-400 font-bold" : "text-white/40 hover:text-white"}`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

          </div>
        </div>
      )}

      {/* Floating PWA Install App Banner at Bottom of Mobile View */}
      {!isAlreadyStandalone && (
        <div className={`fixed left-4 right-4 md:hidden z-50 bg-[#0c0c0c]/95 backdrop-blur-md border border-violet-500/30 rounded-2xl p-4 flex items-center justify-between shadow-2xl animate-fade-in ${view === "dashboard" && user ? "bottom-20" : "bottom-4"}`}>
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="" className="w-8 h-8 rounded-lg border border-violet-500/20 animate-pulse" />
            <div className="text-left">
              <div className="text-xs font-bold text-white uppercase tracking-wider font-inter">Techies Studio AI</div>
              <div className="text-[9px] text-white/50 font-inter">Add to Home Screen for full studio access.</div>
            </div>
          </div>
          <button
            onClick={handleInstallApp}
            className="bg-violet-600 hover:bg-violet-500 px-3.5 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest text-white transition-all shadow-md shadow-violet-500/10 font-inter"
          >
            Install
          </button>
        </div>
      )}

      {/* PWA Install Helper Modal */}
      {showInstallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-[#0c0c0c] border border-white/10 rounded-3xl p-6 max-w-sm w-full space-y-4 text-center relative">
            <button
              onClick={() => setShowInstallModal(false)}
              className="absolute top-4 right-4 p-1.5 border border-white/10 rounded-full hover:bg-white/5 text-white/60 hover:text-white transition"
              title="Close Modal"
            >
              <X className="w-4 h-4" />
            </button>
            
            <div className="w-12 h-12 bg-violet-600/20 border border-violet-500/30 rounded-2xl flex items-center justify-center mx-auto text-violet-400 animate-bounce">
              <Download className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold font-inter text-white uppercase tracking-wider">Install Techies Studio AI</h3>
            <p className="text-xs text-white/50 font-inter leading-relaxed">
              Install the app on your mobile device to enjoy a full-screen workspace, faster loading times, and instant access.
            </p>

            <div className="bg-white/5 border border-white/5 rounded-2xl p-4 text-left space-y-3">
              <div className="flex gap-3 text-xs">
                <span className="font-bold text-violet-400 font-mono">1.</span>
                <span className="text-white/70">On your mobile browser (Safari/Chrome), tap the <strong>Share</strong> icon or the browser's menu button.</span>
              </div>
              <div className="flex gap-3 text-xs">
                <span className="font-bold text-violet-400 font-mono">2.</span>
                <span className="text-white/70">Scroll down and select <strong>"Add to Home Screen"</strong> or <strong>"Install app"</strong>.</span>
              </div>
              <div className="flex gap-3 text-xs">
                <span className="font-bold text-violet-400 font-mono">3.</span>
                <span className="text-white/70">Tap <strong>"Add"</strong> or <strong>"Install"</strong> in the top right to complete.</span>
              </div>
            </div>

            <button
              onClick={() => setShowInstallModal(false)}
              className="w-full py-3 bg-violet-600 hover:bg-violet-500 rounded-xl text-xs uppercase font-bold tracking-widest font-inter transition-all"
            >
              Got It
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
