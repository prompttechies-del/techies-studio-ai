"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  ArrowUpRight,
  Award,
  Crown,
  X,
  Menu,
  Video,
  Volume2,
  Zap,
  Image as ImageIcon,
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
  VolumeX,
  Scissors,
  Download,
  Info,
  Layers,
  History,
  AlertCircle
} from "lucide-react";

import {
  openDB,
  saveProject,
  getProject,
  getAllProjects,
  deleteProject,
  saveMedia,
  getAllMedia,
  deleteMedia,
  saveExport,
  getAllExports,
  deleteExport,
  DBProject,
  DBMedia,
  DBExport
} from "../lib/db";
import { trimVideo, concatVideos } from "../lib/ffmpeg";
import { CanvasCompositor, CaptionStyle } from "../lib/canvasCompositor";

export default function Page() {
  // Navigation State: 'landing' | 'workspace' | 'docs' | 'admin' | 'architecture'
  const [view, setView] = useState<string>("landing");
  
  // Dashboard metrics
  const [projectsList, setProjectsList] = useState<DBProject[]>([]);
  const [mediaList, setMediaList] = useState<DBMedia[]>([]);
  const [exportsHistory, setExportsHistory] = useState<DBExport[]>([]);
  const [storageUsed, setStorageUsed] = useState<string>("0 MB");

  // Active Project & Editor State
  const [activeProject, setActiveProject] = useState<DBProject | null>(null);
  const [playhead, setPlayhead] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [selectedClipId, setSelectedClipId] = useState<string | null>(null);
  const [selectedTrackType, setSelectedTrackType] = useState<"video" | "audio" | "subtitle" | null>(null);

  // Editor Tabs Left Sidebar: 'media' | 'text' | 'captions' | 'audio' | 'ai'
  const [sidebarTab, setSidebarTab] = useState<string>("media");

  // Captions presets and styling states
  const [captionStyle, setCaptionStyle] = useState<CaptionStyle>({
    fontFamily: "Inter",
    fontSize: 24,
    textColor: "#FFFFFF",
    outlineColor: "#000000",
    outlineWidth: 4,
    shadowColor: "rgba(0,0,0,0.5)",
    shadowBlur: 5,
    shadowOffset: 2,
    yPositionPercent: 80,
    stylePreset: "bold",
    animation: "scale"
  });

  // Media Loader Cache
  const [videoUrlMap, setVideoUrlMap] = useState<Map<string, string>>(new Map());
  const videoElementsRef = useRef<Map<string, HTMLVideoElement>>(new Map());
  
  // Canvas Compositor Ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const compositorRef = useRef<CanvasCompositor | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Upload progress indicators
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  // Render & Export configurations
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<number>(0);
  const [exportRes, setExportRes] = useState<string>("1080p");
  const [exportFps, setExportFps] = useState<number>(30);
  const [exportBlobUrl, setExportBlobUrl] = useState<string | null>(null);

  // AI Tools panel inputs
  const [shortsUrl, setShortsUrl] = useState<string>("");
  const [analyzingShorts, setAnalyzingShorts] = useState<boolean>(false);
  const [shortsClips, setShortsClips] = useState<any[]>([]);

  // Audio Noise removal settings
  const [noiseRemovalActive, setNoiseRemovalActive] = useState<boolean>(false);
  const [audioVolume, setAudioVolume] = useState<number>(1.0);

  // Thumbnail canvas builder states
  const [thumbPrompt, setThumbPrompt] = useState<string>("Cyberpunk background with neon violet grid highlights");
  const [thumbText, setThumbText] = useState<string>("తెలుగు AI క్రియేటర్!");
  const [thumbColor, setThumbColor] = useState<string>("#FFFF00");
  const [thumbImage, setThumbImage] = useState<string>("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop");
  const [generatingThumb, setGeneratingThumb] = useState<boolean>(false);

  // Developer API Docs keys
  const [apiKeys, setApiKeys] = useState<string[]>(["ts_live_92kxNps10k..."]);
  const [copiedKey, setCopiedKey] = useState<boolean>(false);
  const [activeCodeLang, setActiveCodeLang] = useState<string>("curl");

  // Load Database Items on Mount
  useEffect(() => {
    loadDatabaseData();
  }, []);

  // Compositor Loop
  useEffect(() => {
    if (view === "editor" && canvasRef.current) {
      if (!compositorRef.current) {
        compositorRef.current = new CanvasCompositor(canvasRef.current);
      }
      
      const loop = () => {
        if (activeProject) {
          // Render current frame
          compositorRef.current?.renderFrame(
            playhead,
            activeProject,
            videoElementsRef.current,
            captionStyle
          );

          // Update Audio Nodes
          compositorRef.current?.applyAudioFilters(noiseRemovalActive, audioVolume);
        }

        if (isPlaying) {
          setPlayhead((prev) => {
            const maxDuration = activeProject 
              ? Math.max(...activeProject.tracks.video.map(v => v.start + v.duration), 5)
              : 5;
            if (prev >= maxDuration) {
              setIsPlaying(false);
              return 0;
            }
            return prev + 0.033; // ~30fps progress
          });
        }
        animationFrameRef.current = requestAnimationFrame(loop);
      };

      animationFrameRef.current = requestAnimationFrame(loop);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [view, activeProject, playhead, isPlaying, captionStyle, noiseRemovalActive, audioVolume]);

  // Handle Video Elements caching
  useEffect(() => {
    // Generate object URLs for raw media files
    const newMap = new Map<string, string>();
    mediaList.forEach(media => {
      const url = URL.createObjectURL(media.data);
      newMap.set(media.id, url);

      // Cache HTML5 Video Elements
      if (!videoElementsRef.current.has(media.id)) {
        const el = document.createElement("video");
        el.src = url;
        el.crossOrigin = "anonymous";
        el.muted = true;
        el.preload = "auto";
        videoElementsRef.current.set(media.id, el);
      }
    });

    setVideoUrlMap(newMap);

    return () => {
      newMap.forEach(url => URL.revokeObjectURL(url));
    };
  }, [mediaList]);

  const loadDatabaseData = async () => {
    try {
      const projects = await getAllProjects();
      const media = await getAllMedia();
      const exports = await getAllExports();
      
      setProjectsList(projects);
      setMediaList(media);
      setExportsHistory(exports);

      // Estimate local IndexedDB storage
      let bytes = 0;
      media.forEach(m => bytes += m.size);
      exports.forEach(e => bytes += e.size);
      setStorageUsed(`${(bytes / (1024 * 1024)).toFixed(1)} MB`);
    } catch (e) {
      console.warn("Failed loading database items:", e);
    }
  };

  // Create Project
  const handleCreateProject = async () => {
    const id = `proj_${Date.now()}`;
    const newProj: DBProject = {
      id,
      name: `Untitled Project ${projectsList.length + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tracks: {
        video: [],
        audio: [],
        subtitle: [
          { id: "sub_1", text: "నమస్కారం తెలుగు క్రియేటర్స్!", start: 0.5, duration: 2.5 },
          { id: "sub_2", text: "టెక్నికల్ వీడియోస్ చేద్దాం!", start: 3.5, duration: 3.0 }
        ]
      },
      settings: {
        resolution: "1080p",
        fps: 30,
        aspectRatio: "9:16" // Default vertical video aspect ratio
      }
    };

    await saveProject(newProj);
    setActiveProject(newProj);
    setView("editor");
    loadDatabaseData();
  };

  // Open Project
  const handleOpenProject = (proj: DBProject) => {
    setActiveProject(proj);
    setPlayhead(0);
    setIsPlaying(false);
    setView("editor");
  };

  // Delete Project
  const handleDeleteProject = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteProject(id);
    loadDatabaseData();
  };

  // Upload Video File (actual binary extraction)
  const handleUploadMedia = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setIsUploading(true);
      setUploadProgress(10);

      // Setup offline video parser to fetch metadata
      const fileURL = URL.createObjectURL(file);
      const tempVideo = document.createElement("video");
      tempVideo.src = fileURL;
      tempVideo.preload = "metadata";

      tempVideo.onloadedmetadata = async () => {
        setUploadProgress(50);
        const duration = tempVideo.duration || 5.0;
        const resolution = `${tempVideo.videoWidth}x${tempVideo.videoHeight}`;

        const newMedia: DBMedia = {
          id: `media_${Date.now()}`,
          name: file.name,
          type: file.type,
          size: file.size,
          duration,
          resolution,
          data: file,
          createdAt: new Date().toISOString()
        };

        await saveMedia(newMedia);
        setUploadProgress(100);
        setIsUploading(false);
        URL.revokeObjectURL(fileURL);
        loadDatabaseData();
      };

      tempVideo.onerror = () => {
        setIsUploading(false);
        alert("Invalid video file metadata format.");
      };
    }
  };

  // Add Clip to Timeline Video Track
  const handleAddClipToTimeline = (media: DBMedia) => {
    if (!activeProject) return;

    // Calculate start offset based on current max duration
    const currentEnd = activeProject.tracks.video.reduce((max, clip) => Math.max(max, clip.start + clip.duration), 0);

    const newClip = {
      id: `clip_${Date.now()}`,
      mediaId: media.id,
      name: media.name,
      start: currentEnd,
      cutStart: 0,
      duration: media.duration,
      speed: 1.0,
      scale: 1.0,
      x: 0,
      y: 0,
      rotation: 0,
      flipX: false,
      flipY: false
    };

    const updated = {
      ...activeProject,
      tracks: {
        ...activeProject.tracks,
        video: [...activeProject.tracks.video, newClip]
      },
      updatedAt: new Date().toISOString()
    };

    setActiveProject(updated);
    saveProject(updated);
  };

  // Splitting Clips at Playhead position
  const handleSplitClip = () => {
    if (!activeProject || !selectedClipId) return;

    const targetClipIdx = activeProject.tracks.video.findIndex(v => v.id === selectedClipId);
    if (targetClipIdx === -1) return;

    const clip = activeProject.tracks.video[targetClipIdx];
    
    // Check if playhead cuts through clip
    if (playhead > clip.start && playhead < clip.start + clip.duration) {
      const leftDuration = playhead - clip.start;
      const rightDuration = clip.duration - leftDuration;

      // Create two clips
      const leftClip = { ...clip, id: `clip_${Date.now()}_L`, duration: leftDuration };
      const rightClip = {
        ...clip,
        id: `clip_${Date.now()}_R`,
        start: playhead,
        cutStart: clip.cutStart + leftDuration * clip.speed,
        duration: rightDuration
      };

      const videoTracks = [...activeProject.tracks.video];
      videoTracks.splice(targetClipIdx, 1, leftClip, rightClip);

      const updated = {
        ...activeProject,
        tracks: { ...activeProject.tracks, video: videoTracks },
        updatedAt: new Date().toISOString()
      };

      setActiveProject(updated);
      saveProject(updated);
      setSelectedClipId(rightClip.id);
    }
  };

  // Delete Clip from Track
  const handleDeleteClip = () => {
    if (!activeProject || !selectedClipId) return;

    const updated = {
      ...activeProject,
      tracks: {
        ...activeProject.tracks,
        video: activeProject.tracks.video.filter(v => v.id !== selectedClipId)
      },
      updatedAt: new Date().toISOString()
    };

    setActiveProject(updated);
    saveProject(updated);
    setSelectedClipId(null);
  };

  // Update Clip Properties (Right Panel Sliders)
  const handleUpdateClipProperty = (field: string, val: any) => {
    if (!activeProject || !selectedClipId) return;

    const updated = {
      ...activeProject,
      tracks: {
        ...activeProject.tracks,
        video: activeProject.tracks.video.map(clip => 
          clip.id === selectedClipId ? { ...clip, [field]: val } : clip
        )
      },
      updatedAt: new Date().toISOString()
    };

    setActiveProject(updated);
    saveProject(updated);
  };

  // Client-Side Canvas MediaRecorder Exporter
  const handleExportVideo = async () => {
    if (!activeProject) return;

    setIsExporting(true);
    setExportProgress(0);

    try {
      // Setup audio blobs Map if needed
      const audioBlobs = new Map<string, Blob>();
      
      const compositor = new CanvasCompositor(canvasRef.current!);
      const exportedBlob = await compositor.startExport(
        activeProject,
        videoElementsRef.current,
        audioBlobs,
        captionStyle,
        (p) => setExportProgress(p)
      );

      const newExport: DBExport = {
        id: `export_${Date.now()}`,
        name: `${activeProject.name}_export.mp4`,
        date: new Date().toLocaleDateString(),
        size: exportedBlob.size,
        resolution: exportRes === "1080p" ? "1920x1080" : "1280x720",
        fps: exportFps,
        data: exportedBlob
      };

      await saveExport(newExport);
      const url = URL.createObjectURL(exportedBlob);
      setExportBlobUrl(url);
      loadDatabaseData();
    } catch (e) {
      console.error("Local rendering failed:", e);
      alert("Error local compilation failed.");
    } finally {
      setIsExporting(false);
    }
  };

  // AI Thumbnail builder - draw overlays and download PNG
  const handleGenerateThumbnail = () => {
    setGeneratingThumb(true);
    setTimeout(() => {
      setGeneratingThumb(false);
      setThumbImage("https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1000&auto=format&fit=crop");
    }, 1200);
  };

  const downloadThumbnailImage = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 1920;
    canvas.height = 1080;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = thumbImage;
    img.onload = () => {
      ctx.drawImage(img, 0, 0, 1920, 1080);
      
      // Draw subtitle Text
      ctx.fillStyle = thumbColor;
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 14;
      ctx.font = "bold 90px 'FSP DEMO - PODIUM Sharp 4.11', sans-serif";
      ctx.textAlign = "center";
      ctx.strokeText(thumbText, 960, 920);
      ctx.fillText(thumbText, 960, 920);

      // Trigger download
      const link = document.createElement("a");
      link.download = "techies_studio_thumbnail.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
  };

  // AI Shorts Hook Analysis Mock
  const triggerShortsAnalysis = () => {
    if (!shortsUrl) return;
    setAnalyzingShorts(true);
    setShortsClips([]);
    setTimeout(() => {
      setAnalyzingShorts(false);
      setShortsClips([
        { id: 1, title: "AI Future in Telugu Script", score: 98, start: 5.0, duration: 25 },
        { id: 2, title: "Indian Startups Valuation Tricks", score: 91, start: 45.0, duration: 30 }
      ]);
    }, 2000);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen relative overflow-hidden bg-[#030303] text-white">
      
      {/* ----------------- NAVBAR ----------------- */}
      <nav className="sticky top-0 z-40 w-full bg-[#050505]/80 backdrop-blur-md border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView("dashboard")}>
          <img 
            src="/logo.png" 
            alt="Techies Studio AI Logo" 
            className="w-9 h-9 rounded-xl object-cover border border-violet-500/30"
          />
          <div>
            <span className="font-podium text-xl tracking-wider font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-violet-300">
              Techies Studio AI
            </span>
            <div className="text-[8px] font-inter tracking-[0.2em] uppercase text-violet-400 font-bold -mt-0.5">
              India's AI Creator Platform
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs uppercase tracking-widest font-inter text-white/60">
          <button onClick={() => setView("dashboard")} className={`hover:text-white transition ${view === "dashboard" ? "text-violet-400 font-bold" : ""}`}>Dashboard</button>
          {activeProject && <button onClick={() => setView("editor")} className={`hover:text-white transition ${view === "editor" ? "text-violet-400 font-bold" : ""}`}>Editor</button>}
          <button onClick={() => setView("docs")} className={`hover:text-white transition ${view === "docs" ? "text-violet-400 font-bold" : ""}`}>API Docs</button>
          <button onClick={() => setView("architecture")} className={`hover:text-white transition ${view === "architecture" ? "text-violet-400 font-bold" : ""}`}>Architecture</button>
          <button onClick={() => setView("admin")} className={`hover:text-white transition ${view === "admin" ? "text-violet-400 font-bold" : ""}`}>Admin Cluster</button>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-400 border border-violet-500/20 px-3 py-1 rounded-full text-[10px] font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            100 AI CREDITS
          </span>
        </div>
      </nav>

      {/* ----------------- DASHBOARD VIEW ----------------- */}
      {view === "dashboard" && (
        <div className="flex-1 p-6 sm:p-10 max-w-7xl mx-auto w-full space-y-10">
          
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#0a0a0a]/60 border border-white/5 p-6 rounded-3xl">
            <div>
              <h1 className="text-2xl font-bold font-inter">Welcome, prompttechies-del</h1>
              <p className="text-xs text-white/50 font-inter mt-1">Local database usage: {storageUsed} / 500 MB (IndexedDB Storage limit)</p>
            </div>
            
            <button 
              onClick={handleCreateProject}
              className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-500 hover:from-violet-500 hover:to-indigo-400 px-6 py-3.5 rounded-xl text-xs uppercase tracking-widest font-bold font-inter shadow-lg shadow-violet-500/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              Create New Project
            </button>
          </div>

          {/* Projects List Grid */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold tracking-widest text-white/40 uppercase pl-1 font-inter">Recent Projects</h2>
            
            {projectsList.length === 0 ? (
              <div className="p-12 text-center border border-dashed border-white/10 rounded-3xl bg-[#080808]/40">
                <FolderOpen className="w-10 h-10 text-white/20 mx-auto mb-4" />
                <p className="text-sm text-white/50 font-inter">No projects found. Click "Create New Project" to get started.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {projectsList.map((proj) => (
                  <div 
                    key={proj.id}
                    onClick={() => handleOpenProject(proj)}
                    className="p-6 rounded-2xl bg-[#0b0b0b] border border-white/5 hover:border-violet-500/20 hover:bg-[#0e0d12]/50 transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-mono text-white/40">{new Date(proj.createdAt).toLocaleDateString()}</span>
                        <button 
                          onClick={(e) => handleDeleteProject(proj.id, e)}
                          className="p-1.5 hover:bg-red-500/10 border border-white/5 hover:border-red-500/20 rounded-lg text-white/40 hover:text-red-500 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <h3 className="font-bold text-base font-inter text-white group-hover:text-violet-400 transition">{proj.name}</h3>
                      <p className="text-[10px] text-white/40 font-mono mt-1 uppercase tracking-wider">
                        {proj.settings.resolution} • {proj.settings.fps} FPS • {proj.settings.aspectRatio} Aspect
                      </p>
                    </div>

                    <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-4">
                      <span className="text-[10px] text-white/40 font-inter">Open project editor</span>
                      <ChevronRight className="w-4 h-4 text-white/30 group-hover:translate-x-1 group-hover:text-violet-400 transition" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Local Exports History List */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold tracking-widest text-white/40 uppercase pl-1 font-inter">Export History</h2>
            
            {exportsHistory.length === 0 ? (
              <div className="p-6 text-center border border-white/5 rounded-2xl bg-[#080808]/40">
                <p className="text-xs text-white/40 font-inter">No exported videos found. Render files in the project workspace.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {exportsHistory.map((rec) => (
                  <div key={rec.id} className="p-4 rounded-xl border border-white/5 bg-[#0b0b0b] flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-violet-600/15 border border-violet-500/20 flex items-center justify-center">
                        <Video className="w-5 h-5 text-violet-400" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold font-inter text-white">{rec.name}</h4>
                        <p className="text-[9px] text-white/40 font-mono mt-0.5 uppercase">
                          {rec.resolution} • {rec.fps} FPS • {(rec.size / (1024 * 1024)).toFixed(2)} MB • {rec.date}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => {
                          const link = document.createElement("a");
                          link.download = rec.name;
                          link.href = URL.createObjectURL(rec.data);
                          link.click();
                        }}
                        className="flex items-center gap-1 bg-white/5 hover:bg-violet-600 border border-white/10 hover:border-violet-500 px-3.5 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider font-inter transition"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download
                      </button>
                      
                      <button 
                        onClick={async () => {
                          await deleteExport(rec.id);
                          loadDatabaseData();
                        }}
                        className="p-2 border border-white/10 hover:border-red-500/30 hover:bg-red-500/5 rounded-lg text-white/30 hover:text-red-500 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* ----------------- WORKSPACE EDITOR VIEW ----------------- */}
      {view === "editor" && activeProject && (
        <div className="flex-1 flex flex-col h-[calc(100vh-69px)] overflow-hidden">
          
          {/* Main workspace splits */}
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            
            {/* 1. LEFT SIDEBAR TAB CONTROLLERS */}
            <aside className="w-full lg:w-16 bg-[#0a0a0a] border-r border-white/5 flex flex-row lg:flex-col items-center justify-around lg:justify-start lg:py-6 gap-6 overflow-x-auto lg:overflow-x-visible">
              {[
                { id: "media", icon: <Layers className="w-5 h-5" />, label: "Media" },
                { id: "captions", icon: <Sparkles className="w-5 h-5" />, label: "Captions" },
                { id: "audio", icon: <Volume2 className="w-5 h-5" />, label: "Audio" },
                { id: "ai", icon: <Zap className="w-5 h-5" />, label: "AI Tools" },
                { id: "thumbnail", icon: <ImageIcon className="w-5 h-5" />, label: "Thumb" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSidebarTab(tab.id)}
                  className={`p-3 rounded-xl transition-all relative group ${sidebarTab === tab.id ? "bg-violet-600 text-white" : "text-white/40 hover:text-white"}`}
                >
                  {tab.icon}
                  <span className="hidden lg:group-hover:block absolute left-14 top-1/2 -translate-y-1/2 bg-black border border-white/10 px-2 py-1 rounded text-[9px] uppercase tracking-wider z-20 whitespace-nowrap">
                    {tab.label}
                  </span>
                </button>
              ))}
            </aside>

            {/* 2. INNER WORKSPACE LEFT PANEL */}
            <div className="w-full lg:w-80 bg-[#080808] border-r border-white/5 flex flex-col overflow-y-auto">
              
              {/* Media Manager panel */}
              {sidebarTab === "media" && (
                <div className="p-5 space-y-6">
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-white/50">Media Manager</h3>
                    
                    {/* Add local file */}
                    <div className="relative">
                      <input 
                        type="file" 
                        accept="video/*" 
                        onChange={handleUploadMedia}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={isUploading}
                      />
                      <button className="p-1 border border-white/10 hover:border-violet-500 rounded-lg text-white/60 hover:text-violet-400 transition">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {isUploading && (
                    <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-2">
                      <div className="flex justify-between text-[10px] font-mono text-white/60">
                        <span>Uploading...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-violet-500" style={{ width: `${uploadProgress}%` }} />
                      </div>
                    </div>
                  )}

                  {mediaList.length === 0 ? (
                    <div className="text-center p-8 border border-dashed border-white/5 rounded-xl text-white/30 text-xs font-inter">
                      Upload video files using the (+) button above.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      {mediaList.map((media) => (
                        <div 
                          key={media.id}
                          className="bg-[#0b0b0b] border border-white/5 rounded-xl p-3 hover:border-violet-500/35 transition cursor-pointer relative group"
                        >
                          <div 
                            onClick={() => handleAddClipToTimeline(media)}
                            className="aspect-square bg-neutral-900 rounded-lg flex items-center justify-center text-white/20 mb-2 relative overflow-hidden"
                          >
                            <Video className="w-6 h-6" />
                            {/* Hover add action */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                              <span className="text-[9px] bg-violet-600 text-white font-bold px-2 py-1 rounded">ADD CLIP</span>
                            </div>
                          </div>
                          <h4 className="text-[10px] font-bold font-inter text-white truncate">{media.name}</h4>
                          <span className="text-[8px] font-mono text-white/40">{media.resolution} • {media.duration.toFixed(1)}s</span>
                          
                          <button 
                            onClick={async (e) => {
                              e.stopPropagation();
                              await deleteMedia(media.id);
                              loadDatabaseData();
                            }}
                            className="absolute top-1 right-1 p-1 bg-black/60 rounded opacity-0 group-hover:opacity-100 hover:text-red-500 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Subtitles & Captions presets */}
              {sidebarTab === "captions" && (
                <div className="p-5 space-y-6">
                  <div className="border-b border-white/5 pb-3">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-white/50">Caption Presets</h3>
                  </div>

                  <div className="space-y-3">
                    {[
                      { id: "bold", name: "Submagic Yellow", desc: "Yellow text with heavy border shadows" },
                      { id: "neon", name: "Neon Lime", desc: "Vibrant glowing outline style" },
                      { id: "glow", name: "Purple Glow", desc: "Soft ambient backdrop glow styling" },
                      { id: "minimal", name: "Clean Minimal", desc: "Lightweight tracking lowercase style" }
                    ].map((pre) => (
                      <button
                        key={pre.id}
                        onClick={() => setCaptionStyle({ ...captionStyle, stylePreset: pre.id as any })}
                        className={`w-full text-left p-4 rounded-xl border transition-all ${captionStyle.stylePreset === pre.id ? "bg-violet-600/15 border-violet-500 text-white" : "bg-black/20 border-white/5 text-white/60 hover:border-white/10"}`}
                      >
                        <h4 className="text-xs font-bold font-inter">{pre.name}</h4>
                        <p className="text-[10px] text-white/40 mt-1">{pre.desc}</p>
                      </button>
                    ))}
                  </div>

                  {/* Active Captions Editor List */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold tracking-widest text-white/40 uppercase block">Active Timestamps</span>
                    
                    {activeProject.tracks.subtitle.map((sub, idx) => (
                      <div key={sub.id} className="p-3.5 bg-black/40 border border-white/5 rounded-xl flex items-center justify-between">
                        <div className="space-y-1">
                          <input 
                            type="text" 
                            value={sub.text}
                            onChange={(e) => {
                              const updatedSub = activeProject.tracks.subtitle.map(item =>
                                item.id === sub.id ? { ...item, text: e.target.value } : item
                              );
                              const updated = {
                                ...activeProject,
                                tracks: { ...activeProject.tracks, subtitle: updatedSub }
                              };
                              setActiveProject(updated);
                              saveProject(updated);
                            }}
                            className="bg-neutral-900 border border-white/5 text-xs text-white rounded px-2 py-1 outline-none focus:border-violet-500 w-full"
                          />
                          <div className="text-[9px] font-mono text-white/40">Timestamp: {sub.start.toFixed(1)}s - {(sub.start + sub.duration).toFixed(1)}s</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Audio panel */}
              {sidebarTab === "audio" && (
                <div className="p-5 space-y-6">
                  <div className="border-b border-white/5 pb-3">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-white/50">Audio Manager</h3>
                  </div>

                  {/* Noise removal toggle */}
                  <div className="p-5 rounded-xl border border-white/5 bg-black/20 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold font-inter text-white">Remove Background Noise</h4>
                        <p className="text-[9px] text-white/40 font-inter mt-0.5">Filters low-end rumble and high-end hiss.</p>
                      </div>
                      
                      <button 
                        onClick={() => setNoiseRemovalActive(!noiseRemovalActive)}
                        className={`w-11 h-6 rounded-full p-1 transition-all ${noiseRemovalActive ? "bg-violet-600" : "bg-neutral-800"}`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full transition-all ${noiseRemovalActive ? "translate-x-5" : "translate-x-0"}`} />
                      </button>
                    </div>
                  </div>

                  {/* Volume slide */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest text-white/40 uppercase block">Global Audio Volume</label>
                    <input 
                      type="range"
                      min="0.0"
                      max="2.0"
                      step="0.1"
                      value={audioVolume}
                      onChange={(e) => setAudioVolume(parseFloat(e.target.value))}
                      className="w-full accent-violet-500"
                    />
                    <div className="flex justify-between text-[9px] font-mono text-white/40">
                      <span>Muted</span>
                      <span>100%</span>
                      <span>Boost (200%)</span>
                    </div>
                  </div>
                </div>
              )}

              {/* AI tools */}
              {sidebarTab === "ai" && (
                <div className="p-5 space-y-6">
                  <div className="border-b border-white/5 pb-3">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-white/50">AI Short Tool</h3>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-bold tracking-widest text-white/40 uppercase block">Input URL</label>
                    <div className="flex gap-2">
                      <input 
                        type="url"
                        placeholder="YouTube URL..."
                        value={shortsUrl}
                        onChange={(e) => setShortsUrl(e.target.value)}
                        className="bg-[#141414] border border-white/10 rounded-xl px-3 py-2 text-xs outline-none focus:border-violet-500 flex-1"
                      />
                      <button 
                        onClick={triggerShortsAnalysis}
                        disabled={analyzingShorts || !shortsUrl}
                        className="bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white px-3 rounded-lg text-xs uppercase tracking-wider font-bold transition"
                      >
                        Crop
                      </button>
                    </div>
                  </div>

                  {analyzingShorts && (
                    <div className="p-6 text-center border border-white/5 rounded-xl bg-black/40 flex flex-col items-center">
                      <RefreshCw className="w-6 h-6 text-violet-400 animate-spin mb-3" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Analyzing hook matrices...</span>
                    </div>
                  )}

                  {shortsClips.length > 0 && (
                    <div className="space-y-2">
                      {shortsClips.map((clip) => (
                        <div key={clip.id} className="p-4 rounded-xl border border-white/5 bg-black/40 flex justify-between items-center">
                          <div>
                            <h4 className="text-[11px] font-bold text-white truncate max-w-[150px]">{clip.title}</h4>
                            <span className="text-[9px] text-white/40 font-mono mt-0.5 block">{clip.score}% hook rate</span>
                          </div>
                          <button 
                            onClick={() => setPlayhead(clip.start)}
                            className="bg-violet-600/10 border border-violet-500/20 text-violet-400 px-3 py-1.5 rounded-lg text-[9px] uppercase tracking-wider font-bold hover:bg-violet-600 hover:text-white transition"
                          >
                            Jump
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Thumbnail designer */}
              {sidebarTab === "thumbnail" && (
                <div className="p-5 space-y-6">
                  <div className="border-b border-white/5 pb-3">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-white/50">Thumbnail Builder</h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold tracking-widest text-white/40 uppercase block mb-2">Prompt</label>
                      <textarea 
                        value={thumbPrompt}
                        onChange={(e) => setThumbPrompt(e.target.value)}
                        rows={2}
                        className="w-full bg-[#141414] border border-white/10 rounded-xl px-3 py-2 text-xs outline-none text-white focus:border-violet-500 font-inter"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold tracking-widest text-white/40 uppercase block mb-2">Title Text (Telugu)</label>
                      <input 
                        type="text" 
                        value={thumbText}
                        onChange={(e) => setThumbText(e.target.value)}
                        className="w-full bg-[#141414] border border-white/10 rounded-xl px-3 py-2 text-xs outline-none text-white focus:border-violet-500 font-inter"
                      />
                    </div>

                    <button 
                      onClick={handleGenerateThumbnail}
                      disabled={generatingThumb}
                      className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 py-3 rounded-xl text-xs uppercase tracking-widest font-bold transition"
                    >
                      {generatingThumb ? "Generating..." : "Generate AI Frame"}
                    </button>
                    
                    <div className="aspect-video w-full rounded-xl overflow-hidden relative border border-white/5">
                      <img src={thumbImage} alt="Thumbnail canvas preview" className="w-full h-full object-cover" />
                      <div className="absolute bottom-2 left-2 right-2 text-center text-xs font-black font-podium uppercase border-black text-yellow-400 drop-shadow-[2px_2px_0px_#000]">
                        {thumbText}
                      </div>
                    </div>

                    <button 
                      onClick={downloadThumbnailImage}
                      className="w-full bg-white/5 hover:bg-white/10 border border-white/10 py-3 rounded-xl text-xs uppercase tracking-widest font-bold transition flex items-center justify-center gap-1.5"
                    >
                      <Download className="w-4 h-4" />
                      Download Thumbnail
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* 3. CENTER PREVIEW CANVAS & CONTROLS */}
            <div className="flex-1 bg-black flex flex-col justify-between overflow-hidden relative">
              
              {/* Playback Viewport wrapper */}
              <div className="flex-1 flex items-center justify-center p-6">
                <div 
                  className={`aspect-[9/16] h-[75%] max-h-[500px] border border-white/10 rounded-2xl overflow-hidden relative bg-[#050505] shadow-2xl flex items-center justify-center`}
                >
                  <canvas 
                    ref={canvasRef} 
                    width={1080}
                    height={1920}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Floating timestamp badge */}
                  <span className="absolute top-4 left-4 bg-black/60 px-3 py-1 rounded-full text-[10px] font-mono border border-white/5 text-white/80">
                    {playhead.toFixed(2)}s
                  </span>
                </div>
              </div>

              {/* Viewport Playback Controller bar */}
              <div className="bg-[#050505] border-t border-white/5 p-4 flex items-center justify-between px-6">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full flex items-center justify-center transition"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 pl-0.5" />}
                  </button>
                  <span className="text-xs font-mono text-white/50">
                    00:{playhead.toFixed(0).padStart(2, "0")} / 00:30
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs uppercase tracking-wider text-white/40">
                  <span>Aspect: {activeProject.settings.aspectRatio}</span>
                </div>
              </div>

            </div>

            {/* 4. RIGHT SIDEBAR PROPERTIES PANEL */}
            <aside className="w-full lg:w-80 bg-[#080808] border-l border-white/5 p-5 space-y-8 overflow-y-auto">
              
              {/* Transform Property card */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold tracking-widest text-white/50 uppercase border-b border-white/5 pb-2">Properties Panel</h3>
                
                {selectedClipId ? (
                  <div className="space-y-5">
                    {/* Display info about active clip */}
                    <div>
                      <div className="text-[10px] text-white/40 uppercase font-mono">Selected Clip ID</div>
                      <div className="text-xs font-bold font-inter truncate mt-0.5">{selectedClipId}</div>
                    </div>

                    {/* Scale (zoom) slider */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-bold text-white/40 uppercase">
                        <span>Scale (Zoom)</span>
                        <span>
                          {Math.floor((activeProject.tracks.video.find(c => c.id === selectedClipId)?.scale || 1.0) * 100)}%
                        </span>
                      </div>
                      <input 
                        type="range"
                        min="0.2"
                        max="4.0"
                        step="0.05"
                        value={activeProject.tracks.video.find(c => c.id === selectedClipId)?.scale || 1.0}
                        onChange={(e) => handleUpdateClipProperty("scale", parseFloat(e.target.value))}
                        className="w-full accent-violet-500"
                      />
                    </div>

                    {/* Rotation slider */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-bold text-white/40 uppercase">
                        <span>Rotation</span>
                        <span>
                          {activeProject.tracks.video.find(c => c.id === selectedClipId)?.rotation || 0}°
                        </span>
                      </div>
                      <input 
                        type="range"
                        min="0"
                        max="360"
                        step="1"
                        value={activeProject.tracks.video.find(c => c.id === selectedClipId)?.rotation || 0}
                        onChange={(e) => handleUpdateClipProperty("rotation", parseInt(e.target.value))}
                        className="w-full accent-violet-500"
                      />
                    </div>

                    {/* Horizontal Pos X slider */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-bold text-white/40 uppercase">
                        <span>Offset X</span>
                        <span>
                          {activeProject.tracks.video.find(c => c.id === selectedClipId)?.x || 0}px
                        </span>
                      </div>
                      <input 
                        type="range"
                        min="-200"
                        max="200"
                        step="1"
                        value={activeProject.tracks.video.find(c => c.id === selectedClipId)?.x || 0}
                        onChange={(e) => handleUpdateClipProperty("x", parseInt(e.target.value))}
                        className="w-full accent-violet-500"
                      />
                    </div>

                    {/* Vertical Pos Y slider */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-bold text-white/40 uppercase">
                        <span>Offset Y</span>
                        <span>
                          {activeProject.tracks.video.find(c => c.id === selectedClipId)?.y || 0}px
                        </span>
                      </div>
                      <input 
                        type="range"
                        min="-200"
                        max="200"
                        step="1"
                        value={activeProject.tracks.video.find(c => c.id === selectedClipId)?.y || 0}
                        onChange={(e) => handleUpdateClipProperty("y", parseInt(e.target.value))}
                        className="w-full accent-violet-500"
                      />
                    </div>

                    {/* Speed Controls */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-bold text-white/40 uppercase">
                        <span>Speed</span>
                        <span>
                          {activeProject.tracks.video.find(c => c.id === selectedClipId)?.speed || 1.0}x
                        </span>
                      </div>
                      <input 
                        type="range"
                        min="0.25"
                        max="3.0"
                        step="0.25"
                        value={activeProject.tracks.video.find(c => c.id === selectedClipId)?.speed || 1.0}
                        onChange={(e) => handleUpdateClipProperty("speed", parseFloat(e.target.value))}
                        className="w-full accent-violet-500"
                      />
                    </div>

                    {/* Flips Row */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <button 
                        onClick={() => {
                          const current = activeProject.tracks.video.find(c => c.id === selectedClipId)?.flipX || false;
                          handleUpdateClipProperty("flipX", !current);
                        }}
                        className={`py-2 px-3 border rounded-xl text-[10px] uppercase font-bold tracking-wider font-inter transition-all ${activeProject.tracks.video.find(c => c.id === selectedClipId)?.flipX ? "bg-violet-600/10 border-violet-500 text-violet-400" : "bg-black/20 border-white/5 text-white/50"}`}
                      >
                        Flip X
                      </button>
                      
                      <button 
                        onClick={() => {
                          const current = activeProject.tracks.video.find(c => c.id === selectedClipId)?.flipY || false;
                          handleUpdateClipProperty("flipY", !current);
                        }}
                        className={`py-2 px-3 border rounded-xl text-[10px] uppercase font-bold tracking-wider font-inter transition-all ${activeProject.tracks.video.find(c => c.id === selectedClipId)?.flipY ? "bg-violet-600/10 border-violet-500 text-violet-400" : "bg-black/20 border-white/5 text-white/50"}`}
                      >
                        Flip Y
                      </button>
                    </div>

                  </div>
                ) : (
                  <div className="p-6 text-center border border-dashed border-white/5 rounded-xl text-white/30 text-xs">
                    Select a video clip block in the timeline to adjust properties.
                  </div>
                )}
              </div>

              {/* Subtitle Properties settings */}
              <div className="space-y-4 pt-4 border-t border-white/5">
                <h3 className="text-xs font-bold tracking-widest text-white/50 uppercase">Subtitles Style</h3>
                
                <div className="space-y-4">
                  {/* Font picker */}
                  <div>
                    <label className="text-[9px] font-bold tracking-wider text-white/40 uppercase block mb-1">Font family</label>
                    <select 
                      value={captionStyle.fontFamily}
                      onChange={(e) => setCaptionStyle({ ...captionStyle, fontFamily: e.target.value })}
                      className="w-full bg-[#141414] border border-white/10 rounded-xl px-3 py-2 text-xs outline-none text-white focus:border-violet-500"
                    >
                      <option value="Inter">Inter Font (Standard)</option>
                      <option value="Arial">Arial (Sleek)</option>
                      <option value="system-ui">System Default</option>
                    </select>
                  </div>

                  {/* Font Size slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[9px] font-bold text-white/40 uppercase">
                      <span>Font Size</span>
                      <span>{captionStyle.fontSize}px</span>
                    </div>
                    <input 
                      type="range"
                      min="12"
                      max="60"
                      step="2"
                      value={captionStyle.fontSize}
                      onChange={(e) => setCaptionStyle({ ...captionStyle, fontSize: parseInt(e.target.value) })}
                      className="w-full accent-violet-500"
                    />
                  </div>

                  {/* Text Highlights Color picker */}
                  <div>
                    <label className="text-[9px] font-bold tracking-wider text-white/40 uppercase block mb-1">Text Color</label>
                    <div className="flex gap-2">
                      {["#FFFFFF", "#FFFF00", "#FF00FF", "#39FF14"].map((col) => (
                        <button
                          key={col}
                          onClick={() => setCaptionStyle({ ...captionStyle, textColor: col })}
                          style={{ backgroundColor: col }}
                          className={`w-6 h-6 rounded-full border-2 ${captionStyle.textColor === col ? "border-white" : "border-transparent"}`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Positioning slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[9px] font-bold text-white/40 uppercase">
                      <span>Y Alignment Position</span>
                      <span>{captionStyle.yPositionPercent}%</span>
                    </div>
                    <input 
                      type="range"
                      min="10"
                      max="90"
                      step="5"
                      value={captionStyle.yPositionPercent}
                      onChange={(e) => setCaptionStyle({ ...captionStyle, yPositionPercent: parseInt(e.target.value) })}
                      className="w-full accent-violet-500"
                    />
                  </div>

                  {/* Animation toggles */}
                  <div>
                    <label className="text-[9px] font-bold tracking-wider text-white/40 uppercase block mb-1">Active Animation</label>
                    <select
                      value={captionStyle.animation}
                      onChange={(e) => setCaptionStyle({ ...captionStyle, animation: e.target.value as any })}
                      className="w-full bg-[#141414] border border-white/10 rounded-xl px-3 py-2 text-xs outline-none text-white focus:border-violet-500"
                    >
                      <option value="scale">Scale Active Word (Karaoke)</option>
                      <option value="none">No Animation</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Local Exporter Config Card */}
              <div className="space-y-4 pt-6 border-t border-white/5">
                <h3 className="text-xs font-bold tracking-widest text-white/50 uppercase">Local rendering</h3>
                
                <div className="p-4 rounded-xl border border-white/5 bg-black/20 space-y-4">
                  <div className="flex justify-between text-[10px] text-white/50 font-mono">
                    <span>Target Res</span>
                    <select 
                      value={exportRes} 
                      onChange={(e) => setExportRes(e.target.value)}
                      className="bg-neutral-900 border border-white/5 text-[9px] px-1 py-0.5 rounded text-white"
                    >
                      <option value="720p">720P HD</option>
                      <option value="1080p">1080P Full HD</option>
                      <option value="2k">2K Quad HD</option>
                      <option value="4k">4K Ultra HD</option>
                    </select>
                  </div>

                  {isExporting ? (
                    <div className="space-y-2">
                      <div className="flex justify-between text-[9px] font-mono text-white/60">
                        <span>Rendering: {exportProgress}%</span>
                      </div>
                      <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-violet-500" style={{ width: `${exportProgress}%` }} />
                      </div>
                    </div>
                  ) : (
                    <button 
                      onClick={handleExportVideo}
                      className="w-full bg-gradient-to-r from-violet-600 to-indigo-500 hover:from-violet-500 hover:to-indigo-400 py-3 rounded-xl text-xs uppercase tracking-widest font-bold font-inter transition-all"
                    >
                      Export Video Clip
                    </button>
                  )}

                  {exportBlobUrl && (
                    <a 
                      href={exportBlobUrl}
                      download={`${activeProject.name}_export.mp4`}
                      className="w-full bg-white/5 hover:bg-white/10 border border-white/10 py-3 rounded-xl text-xs uppercase tracking-widest font-bold font-inter transition-all flex items-center justify-center gap-1.5"
                    >
                      <Download className="w-4 h-4" />
                      Save Export file
                    </a>
                  )}
                </div>
              </div>

            </aside>

          </div>

          {/* 5. BOTTOM TIMELINE MULTI-TRACK INTERACTION GRID */}
          <div className="h-72 bg-[#050505] border-t border-white/5 flex flex-col justify-between overflow-hidden">
            
            {/* Timeline Action Tools */}
            <div className="px-6 py-3 border-b border-white/5 flex items-center justify-between bg-[#080808]">
              <div className="flex items-center gap-3">
                
                <button 
                  onClick={handleSplitClip}
                  disabled={!selectedClipId}
                  className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 disabled:opacity-30 border border-white/10 px-4 py-2 rounded-lg text-[10px] uppercase font-bold tracking-wider font-inter transition"
                >
                  <Scissors className="w-3.5 h-3.5" />
                  Split Clip
                </button>
                
                <button 
                  onClick={handleDeleteClip}
                  disabled={!selectedClipId}
                  className="flex items-center gap-1.5 hover:bg-red-500/10 border border-white/5 hover:border-red-500/20 disabled:opacity-30 rounded-lg text-white/40 hover:text-red-500 px-4 py-2 text-[10px] uppercase font-bold tracking-wider font-inter transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Clip
                </button>

              </div>
              
              <div className="text-[10px] font-mono text-white/40">
                Playhead Seek position: {playhead.toFixed(2)} seconds
              </div>
            </div>

            {/* Timeline tracks overflow area */}
            <div className="flex-1 overflow-y-auto overflow-x-auto relative p-6 space-y-4">
              
              {/* Ruler background ticks */}
              <div className="h-4 w-[1500px] border-b border-white/5 relative mb-2">
                {Array.from({ length: 30 }).map((_, index) => (
                  <div 
                    key={index} 
                    style={{ left: `${index * 50}px` }} 
                    className="absolute bottom-0 text-[8px] font-mono text-white/30 pl-1 border-l border-white/10 h-2.5"
                  >
                    {index}s
                  </div>
                ))}
              </div>

              {/* TRACK 1: Video Track */}
              <div className="h-10 w-[1500px] bg-neutral-900/40 border border-white/5 rounded-xl relative flex items-center p-1">
                <span className="absolute left-3 text-[8px] font-bold uppercase tracking-widest text-white/30 select-none z-10">VIDEO TRACK</span>
                
                {activeProject.tracks.video.map((clip) => (
                  <div
                    key={clip.id}
                    onClick={() => { setSelectedClipId(clip.id); setSelectedTrackType("video"); }}
                    style={{
                      left: `${clip.start * 50}px`,
                      width: `${clip.duration * 50}px`
                    }}
                    className={`h-8 rounded-lg absolute flex items-center justify-between px-3 cursor-pointer select-none overflow-hidden transition-all ${selectedClipId === clip.id ? "bg-violet-600 text-white shadow-lg border border-violet-400" : "bg-[#141414] border border-white/5 text-white/70 hover:bg-[#1c1c1c]"}`}
                  >
                    <span className="text-[9px] font-bold font-inter truncate max-w-[120px]">{clip.name}</span>
                    <span className="text-[8px] font-mono text-white/40">{(clip.duration).toFixed(1)}s</span>
                  </div>
                ))}
              </div>

              {/* TRACK 2: Subtitle Track */}
              <div className="h-10 w-[1500px] bg-neutral-900/40 border border-white/5 rounded-xl relative flex items-center p-1">
                <span className="absolute left-3 text-[8px] font-bold uppercase tracking-widest text-white/30 select-none z-10">SUBTITLE TRACK</span>
                
                {activeProject.tracks.subtitle.map((sub) => (
                  <div
                    key={sub.id}
                    style={{
                      left: `${sub.start * 50}px`,
                      width: `${sub.duration * 50}px`
                    }}
                    className="h-8 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-lg absolute flex items-center justify-center px-3"
                  >
                    <span className="text-[9px] font-bold font-inter truncate">{sub.text}</span>
                  </div>
                ))}
              </div>

              {/* Dynamic playback cursor head overlay */}
              <div 
                style={{ left: `${playhead * 50}px` }} 
                className="absolute top-0 bottom-0 w-0.5 bg-violet-500 pointer-events-none z-30 transition-all duration-75"
              >
                <div className="w-3 h-3 bg-violet-500 rounded-full absolute top-0 -left-[5px] shadow-lg shadow-violet-500/50" />
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ----------------- DEVELOPER API DOCS VIEW ----------------- */}
      {view === "docs" && (
        <div className="flex-1 max-w-5xl mx-auto w-full p-6 md:p-12 space-y-12">
          
          <div className="border-b border-white/5 pb-6">
            <h2 className="text-2xl font-bold font-inter text-white">Developer API Keys & Docs</h2>
            <p className="text-xs text-white/40 font-inter mt-1">Integrate our advanced Whisper-based auto captioning and video reframing pipelines directly into your own products.</p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0b0b0b] border border-white/5 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-white font-inter">Live API Secret Keys</h3>
                <p className="text-[10px] text-white/40 font-inter mt-0.5">Keep these credentials secure. Never disclose them in client-side code.</p>
              </div>
              <button 
                onClick={() => {
                  const newKey = `ts_live_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`;
                  setApiKeys([...apiKeys, newKey]);
                }}
                className="flex items-center gap-1.5 border border-white/10 hover:border-white/30 hover:bg-white/5 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider font-inter transition"
              >
                <Plus className="w-3.5 h-3.5" />
                Generate Key
              </button>
            </div>

            <div className="space-y-2.5">
              {apiKeys.map((key, index) => (
                <div key={index} className="flex items-center justify-between p-3.5 bg-black/40 border border-white/5 rounded-xl font-mono text-xs text-white/80">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-violet-400" />
                    <span>{key}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(key);
                        setCopiedKey(true);
                        setTimeout(() => setCopiedKey(false), 2000);
                      }}
                      className="text-white/40 hover:text-white transition flex items-center gap-1 text-[10px]"
                    >
                      {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedKey ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            <div className="lg:col-span-5 bg-[#0b0b0b] border border-white/5 rounded-2xl p-6 space-y-4">
              <h4 className="text-xs font-bold tracking-widest text-white/50 uppercase font-inter">SDK Code Blocks</h4>
              <div className="flex flex-col gap-2">
                {[
                  { id: "curl", label: "cURL CLI" },
                  { id: "node", label: "NodeJS SDK" },
                  { id: "python", label: "Python Helper" }
                ].map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => setActiveCodeLang(lang.id)}
                    className={`text-left py-3 px-4 rounded-xl text-xs uppercase tracking-wider font-semibold font-inter transition-all ${activeCodeLang === lang.id ? "bg-violet-600 text-white font-bold" : "text-white/50 hover:bg-white/5 hover:text-white"}`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7 bg-[#0b0b0b] border border-white/5 rounded-2xl p-6 font-mono text-xs overflow-x-auto text-violet-300">
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4 text-[10px] text-white/40 uppercase tracking-widest font-mono">
                <span>POST /v1/transcribe/telugu</span>
                <span>Language: {activeCodeLang}</span>
              </div>

              {activeCodeLang === "curl" && (
                <pre className="leading-relaxed bg-black/30 p-4 rounded-lg overflow-x-auto text-white/80">
{`curl -X POST https://api.techiesstudio.ai/v1/transcribe \\
  -H "Authorization: Bearer ts_live_51Npx..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "video_url": "https://cloudfront.net/myvideo.mp4",
    "target_language": "te",
    "word_timestamps": true
  }'`}
                </pre>
              )}

              {activeCodeLang === "node" && (
                <pre className="leading-relaxed bg-black/30 p-4 rounded-lg overflow-x-auto text-white/80">
{`const client = require('@techiesstudio/sdk')('ts_live_51Npx...');

async function transcribeVideo() {
  const result = await client.transcribe({
    videoUrl: 'https://cloudfront.net/myvideo.mp4',
    language: 'te',
    timestamps: true
  });
  console.log('Transcription:', result.words);
}`}
                </pre>
              )}

              {activeCodeLang === "python" && (
                <pre className="leading-relaxed bg-black/30 p-4 rounded-lg overflow-x-auto text-white/80">
{`import techiesstudio as ts

client = ts.Client(api_key="ts_live_51Npx...")

transcription = client.transcribe(
    video_url="https://cloudfront.net/myvideo.mp4",
    language="te",
    timestamps=True
)

print(transcription.get("words"))`}
                </pre>
              )}

              <div className="mt-6 text-[10px] text-white/30 font-mono">
                Response: Returns a JSON array containing transcribed words, confidence index, start timestamps, and end timestamps.
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ----------------- ADMIN DASHBOARD CLUSTER ----------------- */}
      {view === "admin" && (
        <div className="flex-1 max-w-5xl mx-auto w-full p-6 md:p-12 space-y-12">
          
          <div className="border-b border-white/5 pb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold font-inter text-white">GPU Node Cluster Console</h2>
              <p className="text-xs text-white/40 font-inter mt-1">Monitor GPU instances, celery execution pipelines, billing metrics, and translation jobs.</p>
            </div>
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3.5 py-1.5 rounded-full text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              SYSTEM HEALTH: 99.9%
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Active Whisper Pipelines", val: "14 nodes", desc: "GPU Cluster Load", icon: <Cpu className="w-5 h-5 text-violet-400" /> },
              { label: "Transcription Queue", val: "4 jobs", desc: "Wait Time: 4.2s", icon: <Activity className="w-5 h-5 text-emerald-400" /> },
              { label: "Monthly Recurring Revenue", val: "₹15,45,000", desc: "+12.5% this week", icon: <CreditCard className="w-5 h-5 text-pink-400" /> },
              { label: "Total Active Users", val: "14,845", desc: "Active Sessions: 1,420", icon: <User className="w-5 h-5 text-cyan-400" /> }
            ].map((stat, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-[#0b0b0b] border border-white/5 flex items-center justify-between">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider font-inter">{stat.label}</span>
                  <div className="text-2xl font-extrabold text-white font-inter">{stat.val}</div>
                  <p className="text-[10px] text-white/30 font-mono">{stat.desc}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                  {stat.icon}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#0b0b0b] border border-white/5 rounded-2xl p-6">
            <h3 className="text-xs font-bold tracking-widest text-white/50 uppercase border-b border-white/5 pb-4 mb-6 font-inter">Active NVIDIA A10G Instances</h3>
            
            <div className="space-y-4">
              {[
                { name: "Node-West-US-1", model: "NVIDIA A10G Tensor Core (24GB VRAM)", load: 88, status: "Transcribing" },
                { name: "Node-East-US-2", model: "NVIDIA A10G Tensor Core (24GB VRAM)", load: 42, status: "Idle Queue" },
                { name: "Node-EU-West-1", model: "NVIDIA A10G Tensor Core (24GB VRAM)", load: 12, status: "Idle Queue" },
                { name: "Node-AP-South-1", model: "NVIDIA A10G Tensor Core (24GB VRAM)", load: 95, status: "FFmpeg Overlay Render" }
              ].map((node, index) => (
                <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-black/40 border border-white/5">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-bold font-inter text-white">{node.name}</span>
                      <span className={`text-[8px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider font-bold ${node.status === "Idle Queue" ? "bg-emerald-500/10 text-emerald-400" : "bg-violet-500/10 text-violet-400"}`}>
                        {node.status}
                      </span>
                    </div>
                    <span className="text-[10px] text-white/40 font-mono mt-0.5 block">{node.model}</span>
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-48">
                    <span className="text-[10px] font-mono text-white/60 min-w-[45px] text-right">GPU: {node.load}%</span>
                    <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className={`h-full transition-all duration-500 ${node.load > 85 ? "bg-red-500" : node.load > 50 ? "bg-violet-500" : "bg-emerald-500"}`} style={{ width: `${node.load}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ----------------- ARCHITECTURE VIEW ----------------- */}
      {view === "architecture" && (
        <div className="flex-1 max-w-5xl mx-auto w-full p-6 md:p-12 space-y-12">
          
          <div className="border-b border-white/5 pb-6">
            <h2 className="text-2xl font-bold font-inter text-white">System Architecture & Database Schema</h2>
            <p className="text-xs text-white/40 font-inter mt-1">Explore our scalable system infrastructure diagram and relational database design representing 1M+ active user capability.</p>
          </div>

          <div className="space-y-6">
            <h3 className="text-xs font-bold tracking-widest text-white/50 uppercase border-b border-white/5 pb-3 font-inter">Server Pipeline Infrastructure</h3>
            
            <div className="grid md:grid-cols-5 gap-4 items-center">
              {[
                { step: "Step 1", title: "Client Web App", desc: "Next.js static assets served via AWS CloudFront." },
                { step: "Step 2", title: "API Gateway", desc: "FastAPI routes validations & distributes webhooks." },
                { step: "Step 3", title: "Task Broker", desc: "Redis Pub/Sub balances Celery workers." },
                { step: "Step 4", title: "Whisper GPU Nodes", desc: "NVIDIA A10G clusters generate word timestamps." },
                { step: "Step 5", title: "S3 Storage", desc: "FFmpeg renders output video directly to bucket." }
              ].map((item, idx) => (
                <div 
                  key={idx}
                  className={`p-5 rounded-2xl text-center space-y-2 relative border ${idx === 3 ? "border-violet-500 bg-[#0e0c12] shadow-lg shadow-violet-950/20" : "border-white/5 bg-[#0b0b0b]"}`}
                >
                  <div className="text-[10px] font-mono text-violet-400 font-bold uppercase tracking-wider">{item.step}</div>
                  <h4 className="text-xs font-bold font-inter text-white uppercase">{item.title}</h4>
                  <p className="text-[9px] text-white/40 font-inter leading-relaxed">{item.desc}</p>
                  {idx < 4 && <div className="hidden md:block absolute top-1/2 right-[-10px] -translate-y-1/2 text-violet-500 text-lg font-bold">→</div>}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xs font-bold tracking-widest text-white/50 uppercase border-b border-white/5 pb-3 font-inter">Relational Database Schemas (Prisma Models)</h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-5 rounded-xl border border-white/5 bg-[#0b0b0b] font-mono text-[10px]">
                <div className="text-violet-400 font-bold border-b border-white/5 pb-2 mb-3">model User {"{"}</div>
                <ul className="space-y-1.5 text-white/70 pl-2">
                  <li>id String @id @default(cuid)</li>
                  <li>email String @unique</li>
                  <li>name String?</li>
                  <li>createdAt DateTime @default(now)</li>
                  <li>projects Project[]</li>
                  <li>billingPlan String @default("FREE")</li>
                  <li>apiKeys ApiKey[]</li>
                </ul>
                <div className="text-violet-400 font-bold border-t border-white/5 pt-2 mt-3">{"}"}</div>
              </div>

              <div className="p-5 rounded-xl border border-white/5 bg-[#0b0b0b] font-mono text-[10px]">
                <div className="text-violet-400 font-bold border-b border-white/5 pb-2 mb-3">model Project {"{"}</div>
                <ul className="space-y-1.5 text-white/70 pl-2">
                  <li>id String @id @default(cuid)</li>
                  <li>userId String</li>
                  <li>user User @relation(fields: [userId])</li>
                  <li>videoUrl String</li>
                  <li>status String @default("UPLOADED")</li>
                  <li>captions Subtitle[]</li>
                  <li>createdAt DateTime @default(now)</li>
                  <li>updatedAt DateTime @updatedAt</li>
                </ul>
                <div className="text-violet-400 font-bold border-t border-white/5 pt-2 mt-3">{"}"}</div>
              </div>

              <div className="p-5 rounded-xl border border-white/5 bg-[#0b0b0b] font-mono text-[10px]">
                <div className="text-violet-400 font-bold border-b border-white/5 pb-2 mb-3">model Subtitle {"{"}</div>
                <ul className="space-y-1.5 text-white/70 pl-2">
                  <li>id String @id @default(cuid)</li>
                  <li>projectId String</li>
                  <li>project Project @relation(fields: [projectId])</li>
                  <li>word String</li>
                  <li>startTime Float</li>
                  <li>endTime Float</li>
                  <li>highlighted Boolean @default(false)</li>
                </ul>
                <div className="text-violet-400 font-bold border-t border-white/5 pt-2 mt-3">{"}"}</div>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
