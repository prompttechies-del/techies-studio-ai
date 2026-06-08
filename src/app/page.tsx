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
  FolderOpen
} from "lucide-react";

// Types & Data Mockups
interface CaptionWord {
  id: number;
  word: string;
  start: number;
  end: number;
}

const teluguMockCaptions: CaptionWord[] = [
  { id: 1, word: "నమస్కారం", start: 0.2, end: 0.8 },
  { id: 2, word: "తెలుగు", start: 0.9, end: 1.4 },
  { id: 3, word: "క్రియేటర్స్!", start: 1.5, end: 2.2 },
  { id: 4, word: "టెక్నికల్", start: 2.3, end: 3.0 },
  { id: 5, word: "వీడియోలకు", start: 3.1, end: 3.8 },
  { id: 6, word: "స్వాగతం.", start: 3.9, end: 4.6 },
  { id: 7, word: "ఈరోజు", start: 4.7, end: 5.2 },
  { id: 8, word: "మనం", start: 5.3, end: 5.8 },
  { id: 9, word: "వైరల్", start: 5.9, end: 6.4 },
  { id: 10, word: "కంటెంట్", start: 6.5, end: 7.2 },
  { id: 11, word: "తయారు", start: 7.3, end: 7.8 },
  { id: 12, word: "చేద్దాం!", start: 7.9, end: 8.5 }
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
  // Navigation State: 'landing' | 'workspace' | 'docs' | 'admin' | 'architecture'
  const [view, setView] = useState<string>("landing");
  
  // Dashboard Workspace sub-tabs: 'captioner' | 'shorts' | 'audio' | 'thumbnail' | 'publisher'
  const [workspaceTab, setWorkspaceTab] = useState<string>("captioner");
  
  // Responsive mobile menu state
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  
  // Landing Page Demo Playback
  const [demoStyle, setDemoStyle] = useState<string>("bold");
  const [demoActiveWordIdx, setDemoActiveWordIdx] = useState<number>(0);
  const [demoPlaying, setDemoPlaying] = useState<boolean>(true);
  
  // Modals state
  const [showDemoModal, setShowDemoModal] = useState<boolean>(false);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  
  // Workspace specific states
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [videoFile, setVideoFile] = useState<string | null>(null);
  const [captionsList, setCaptionsList] = useState<CaptionWord[]>(teluguMockCaptions);
  const [editWordId, setEditWordId] = useState<number | null>(null);
  const [editWordText, setEditWordText] = useState<string>("");
  
  // Shorts Cropper hook analyzer mock
  const [shortsUrl, setShortsUrl] = useState<string>("");
  const [analyzingShorts, setAnalyzingShorts] = useState<boolean>(false);
  const [shortsClips, setShortsClips] = useState<any[]>([]);
  
  // Audio Enhancer comparison toggle
  const [audioEnhanced, setAudioEnhanced] = useState<boolean>(false);
  const [audioPlaying, setAudioPlaying] = useState<boolean>(false);
  const audioIntervalRef = useRef<any>(null);
  const [audioProgress, setAudioProgress] = useState<number>(30);
  
  // Thumbnail editor states
  const [thumbnailPrompt, setThumbnailPrompt] = useState<string>("Viral tech review background with glowing neon lights");
  const [thumbnailText, setThumbnailText] = useState<string>("వైరల్ వీడియోస్!");
  const [thumbnailColor, setThumbnailColor] = useState<string>("#FFFF00");
  const [generatingThumbnail, setGeneratingThumbnail] = useState<boolean>(false);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop");
  
  // Social publisher copywriter states
  const [socialPlatform, setSocialPlatform] = useState<string>("instagram");
  const [writingCopy, setWritingCopy] = useState<boolean>(false);
  const [generatedCopy, setGeneratedCopy] = useState<string>("");
  const [scheduledTime, setScheduledTime] = useState<string>("2026-06-08T18:00");
  const [scheduledSuccessfully, setScheduledSuccessfully] = useState<boolean>(false);

  // Developer API keys
  const [apiKeys, setApiKeys] = useState<string[]>(["ts_live_51Npx9T8vKa..."]);
  const [copiedKey, setCopiedKey] = useState<boolean>(false);
  const [activeCodeLang, setActiveCodeLang] = useState<string>("curl");

  // Timer loop for Landing Page captions simulator
  useEffect(() => {
    let interval: any;
    if (demoPlaying) {
      interval = setInterval(() => {
        setDemoActiveWordIdx((prev) => (prev + 1) % teluguMockCaptions.length);
      }, 700);
    }
    return () => clearInterval(interval);
  }, [demoPlaying]);

  // Audio Playback simulation
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

  // Actions
  const handleStartFree = () => {
    setView("workspace");
    setMenuOpen(false);
  };

  const handleUploadVideo = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setVideoFile(file.name);
      setIsUploading(true);
      setUploadProgress(0);
      
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    }
  };

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
    }, 2000);
  };

  const handleGenerateThumbnail = () => {
    setGeneratingThumbnail(true);
    setTimeout(() => {
      setGeneratingThumbnail(false);
      setThumbnailUrl("https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1000&auto=format&fit=crop");
    }, 1500);
  };

  const handleWriteCopy = () => {
    setWritingCopy(true);
    setTimeout(() => {
      setWritingCopy(false);
      if (socialPlatform === "instagram") {
        setGeneratedCopy("🔥 Telugu creators, AI is here to change the game! \n\nTechies Studio AI lets you edit, caption, and publish viral reels in minutes. \n\n👉 Click the link in bio to start editing for free today! \n\n#TeluguCreators #TeluguTech #AIVideoEditing #TechiesStudio #StartupLife #ViralReels");
      } else if (socialPlatform === "youtube") {
        setGeneratedCopy("In this video, we explore how Techies Studio AI is revolutionizing video editing and captioning for Telugu content creators. From auto Telugu subtitling to AI Shorts hooks, this is the final toolkit you'll ever need. \n\n💻 Try it Free: https://techiesstudio.ai\n\n📌 Timestamps:\n0:00 - Intro\n1:20 - AI Telugu Captions\n4:15 - Auto Shorts Clip\n\n#TechiesStudio #TeluguAI #VideoEditing #AIStartups");
      } else {
        setGeneratedCopy("Viral video edits in 60 seconds. Telugu auto captions, voice enhancement, direct post! 🚀🔥 \n\n#TechiesStudio #AIEditor #TeluguTikTok #CreatorEconomy #SubmagicTelugu");
      }
    }, 1200);
  };

  const handleSchedulePost = () => {
    setScheduledSuccessfully(true);
    setTimeout(() => {
      setScheduledSuccessfully(false);
    }, 3000);
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

  const handleSaveWord = (id: number) => {
    setCaptionsList(
      captionsList.map((item) =>
        item.id === id ? { ...item, word: editWordText } : item
      )
    );
    setEditWordId(null);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen relative overflow-hidden bg-[#050505] text-white">
      
      {/* Dynamic Ambient Blur Backdrops */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none -z-20 animate-pulse duration-10000" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] rounded-full bg-indigo-700/10 blur-[150px] pointer-events-none -z-20" />
      
      {/* ----------------- NAVBAR ----------------- */}
      <nav className="sticky top-0 z-40 w-full bg-[#050505]/75 backdrop-blur-md border-b border-white/5 px-6 sm:px-10 lg:px-16 py-4 lg:py-5 flex items-center justify-between">
        
        {/* Brand Logo */}
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

        {/* Center Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <button 
            onClick={() => setView("landing")} 
            className={`font-inter text-xs tracking-widest uppercase hover:text-white transition ${view === "landing" ? "text-white font-semibold" : "text-white/60"}`}
          >
            Studio
          </button>
          <button 
            onClick={() => { setView("workspace"); setWorkspaceTab("captioner"); }} 
            className={`font-inter text-xs tracking-widest uppercase hover:text-white transition ${view === "workspace" ? "text-white font-semibold" : "text-white/60"}`}
          >
            Workspace
          </button>
          <button 
            onClick={() => setView("docs")} 
            className={`font-inter text-xs tracking-widest uppercase hover:text-white transition ${view === "docs" ? "text-white font-semibold" : "text-white/60"}`}
          >
            API Docs
          </button>
          <button 
            onClick={() => setView("architecture")} 
            className={`font-inter text-xs tracking-widest uppercase hover:text-white transition ${view === "architecture" ? "text-white font-semibold" : "text-white/60"}`}
          >
            System Info
          </button>
          <button 
            onClick={() => setView("admin")} 
            className={`font-inter text-xs tracking-widest uppercase hover:text-white transition ${view === "admin" ? "text-white font-semibold" : "text-white/60"}`}
          >
            Admin Cluster
          </button>
        </div>

        {/* Right CTA Button */}
        <div className="hidden md:flex items-center gap-4">
          <button 
            onClick={handleStartFree} 
            className="flex items-center gap-1.5 border border-white/20 hover:border-violet-500/50 hover:bg-violet-600/10 px-5 py-2.5 text-xs tracking-widest uppercase font-inter rounded-lg transition-all"
          >
            Launch Free
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Hamburguer */}
        <button className="md:hidden flex flex-col justify-between w-6 h-4" onClick={() => setMenuOpen(true)}>
          <div className="w-6 h-0.5 bg-white rounded-full" />
          <div className="w-6 h-0.5 bg-white rounded-full" />
          <div className="w-4 h-0.5 bg-white rounded-full align-self-end" />
        </button>
      </nav>

      {/* ----------------- MOBILE OVERLAY MENU ----------------- */}
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
            { name: "Brand Studio", view: "landing" },
            { name: "Creator Workspace", view: "workspace" },
            { name: "Developer API", view: "docs" },
            { name: "System Architecture", view: "architecture" },
            { name: "Admin Dashboard", view: "admin" }
          ].map((item, i) => (
            <button
              key={item.view}
              onClick={() => {
                setView(item.view);
                setMenuOpen(false);
              }}
              style={{ transitionDelay: `${i * 60 + 100}ms` }}
              className={`font-podium text-3xl sm:text-4xl text-left uppercase transition-all duration-300 transform ${menuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"} ${view === item.view ? "text-violet-400 font-bold" : "text-white/60 hover:text-white"}`}
            >
              {item.name}
            </button>
          ))}
          
          <button
            onClick={handleStartFree}
            style={{ transitionDelay: `400ms` }}
            className={`mt-10 flex items-center justify-between w-full max-w-xs border border-violet-500/40 bg-violet-600/10 px-6 py-4 text-sm tracking-widest uppercase font-inter rounded-xl transition transform ${menuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
          >
            Launch Free Now
            <ArrowUpRight className="w-4 h-4 text-violet-400" />
          </button>
        </div>
      </div>

      {/* ----------------- LANDING VIEW ----------------- */}
      {view === "landing" && (
        <div className="flex-1 flex flex-col">
          
          {/* HERO MARKETING VIEWPORT */}
          <div className="h-[calc(100vh-69px)] w-full relative flex items-center px-6 sm:px-12 lg:px-24 border-b border-white/5">
            
            {/* Absolute Fullscreen Video Background */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
              <video
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover opacity-35"
                src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260606_154941_df1a96e1-a06f-450c-bd02-d863414cc1a0.mp4"
              />
              {/* Premium dark mesh gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/70 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-[#050505]/20" />
            </div>

            <div className="grid lg:grid-cols-12 gap-12 items-center w-full max-w-7xl mx-auto z-10 py-8">
              
              {/* Left Column: Headline copy */}
              <div className="lg:col-span-7 flex flex-col justify-center text-left">
                
                {/* Crown Tagline */}
                <div className="animate-fade-up inline-flex items-center gap-2 mb-6 lg:mb-8 bg-white/5 border border-white/10 rounded-full px-4.5 py-1.5 w-fit">
                  <Crown className="w-4 h-4 text-violet-400" />
                  <span className="text-[10px] sm:text-xs text-white/80 font-inter tracking-[0.2em] uppercase font-semibold">
                    India's AI Creator Platform
                  </span>
                </div>

                {/* Title (Podium Font, Clamp-sized) */}
                <h1 className="animate-fade-up-delay-1 font-podium text-white uppercase leading-[0.9] tracking-tight text-[clamp(2.4rem,6vw,5.5rem)] mb-6">
                  Create Viral<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-200">
                    Telugu Videos
                  </span><br />
                  In Minutes.
                </h1>

                {/* Subheading (Inter Font) */}
                <p className="animate-fade-up-delay-2 text-white/70 text-sm sm:text-base md:text-lg font-inter leading-relaxed max-w-xl mb-8 lg:mb-10">
                  Auto Telugu captions, viral AI Shorts hooks, thumbnail generation, noise removal, and instant publishing. Everything creators need in one high-performance studio platform.
                </p>

                {/* Action Row */}
                <div className="animate-fade-up-delay-3 flex flex-wrap items-center gap-4 sm:gap-6">
                  
                  <button 
                    onClick={handleStartFree} 
                    className="group flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-500 hover:from-violet-500 hover:to-indigo-400 text-white px-7 py-4 text-xs tracking-widest uppercase font-bold rounded-xl shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 transition-all duration-300"
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

                  {/* Award Badge (hidden on mobile) */}
                  <div className="hidden sm:flex items-center gap-3 border-l border-white/10 pl-6 ml-2">
                    <Award className="w-8 h-8 text-violet-400" />
                    <div>
                      <div className="text-[10px] text-white/50 tracking-wider uppercase font-inter">Top-Rated</div>
                      <div className="text-xs text-white/80 font-bold uppercase font-inter">Brand Studio</div>
                    </div>
                  </div>

                </div>

                {/* Stats Row */}
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

              {/* Right Column: Interactive Editor Sandbox / Simulation */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="animate-scale-in w-full max-w-sm rounded-2xl border border-white/10 bg-[#0c0c0c]/80 backdrop-blur-xl p-5 relative shadow-2xl shadow-violet-950/20">
                  
                  {/* Decorative card header */}
                  <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Interactive Sandbox</span>
                  </div>

                  {/* Vertically Mock Mobile Video Preview Frame */}
                  <div className="w-full aspect-[9/16] rounded-xl overflow-hidden relative bg-neutral-900 border border-white/5 flex flex-col items-center justify-center p-6 shadow-inner">
                    <img 
                      src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop"
                      alt="Sample background video frame"
                      className="absolute inset-0 w-full h-full object-cover opacity-60"
                    />
                    {/* Shadow overlay to read text */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />

                    {/* Top simulation metrics */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-[10px] text-white/80 font-mono">
                      <span>FPS: 60.00</span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                        RENDER
                      </span>
                    </div>

                    {/* Center Animated Telugu Captions based on Selected Style */}
                    <div className="z-10 flex flex-col items-center justify-center text-center mt-auto mb-16 select-none">
                      {demoStyle === "neon" && (
                        <div className="text-xl sm:text-2xl font-black text-[#39FF14] tracking-wider drop-shadow-[0_0_8px_#39FF14] uppercase">
                          {teluguMockCaptions[demoActiveWordIdx].word}
                        </div>
                      )}
                      {demoStyle === "glow" && (
                        <div className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.8)] font-podium">
                          {teluguMockCaptions[demoActiveWordIdx].word}
                        </div>
                      )}
                      {demoStyle === "bold" && (
                        <div className="bg-yellow-400 text-black px-4 py-1.5 rounded-md font-extrabold text-lg sm:text-xl border-2 border-black rotate-[-2deg] shadow-[4px_4px_0px_#000]">
                          {teluguMockCaptions[demoActiveWordIdx].word}
                        </div>
                      )}
                      {demoStyle === "minimal" && (
                        <div className="text-white text-base tracking-widest font-light lowercase">
                          ...{teluguMockCaptions[demoActiveWordIdx].word}...
                        </div>
                      )}
                      
                      <div className="text-[10px] text-white/50 tracking-wider font-mono mt-4">
                        (Active subtitle sync: {teluguMockCaptions[demoActiveWordIdx].start}s)
                      </div>
                    </div>

                    {/* Bottom simulated play bar */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-10">
                      <button onClick={() => setDemoPlaying(!demoPlaying)} className="p-1.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full text-white">
                        {demoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      </button>
                      <span className="text-[9px] font-mono text-white/60">00:0{demoActiveWordIdx} / 00:12</span>
                    </div>
                  </div>

                  {/* Interactive Caption Style Presets Selector */}
                  <div className="mt-4">
                    <label className="text-[10px] font-bold tracking-widest text-white/40 uppercase mb-2 block font-inter">Caption Style Presets</label>
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
                          className={`py-2 px-1 text-[10px] font-semibold rounded-lg border uppercase tracking-wider font-inter transition-all ${demoStyle === style.id ? "bg-violet-600 border-violet-500 text-white shadow-lg" : "bg-[#141414] border-white/5 text-white/60 hover:border-white/10 hover:text-white"}`}
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

          {/* 10 CORE FEATURES MATRIX */}
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

          {/* PRICING SECTION */}
          <div className="py-24 px-6 sm:px-12 lg:px-24 bg-[#050505]">
            <div className="max-w-7xl mx-auto text-center">
              
              <span className="text-xs font-bold tracking-[0.3em] uppercase text-violet-400 font-inter">Transparent Pricing</span>
              <h2 className="font-podium text-4xl sm:text-5xl uppercase tracking-wide mt-3 mb-6">Simple Creator Plans</h2>
              
              {/* Billing Cycle Toggle */}
              <div className="flex items-center justify-center gap-4 mb-16">
                <span className={`text-xs font-inter uppercase tracking-widest ${billingCycle === "monthly" ? "text-white font-bold" : "text-white/50"}`}>Monthly</span>
                <button 
                  onClick={() => setBillingCycle(billingCycle === "monthly" ? "annual" : "monthly")}
                  className="w-12 h-6 bg-violet-600/30 border border-violet-500/30 rounded-full p-1 relative transition-all duration-300"
                >
                  <div className={`w-4 h-4 bg-violet-400 rounded-full transition-all duration-300 ${billingCycle === "annual" ? "translate-x-6" : "translate-x-0"}`} />
                </button>
                <span className={`text-xs font-inter uppercase tracking-widest ${billingCycle === "annual" ? "text-white font-bold" : "text-white/50"}`}>
                  Annual <span className="text-violet-400 text-[10px] font-semibold bg-violet-500/10 px-2 py-0.5 rounded-full lowercase">save 20%</span>
                </span>
              </div>

              {/* Pricing Cards Grid */}
              <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left">
                
                {/* Plan 1: Free */}
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
                  <button onClick={handleStartFree} className="w-full py-3 text-xs tracking-widest font-bold uppercase font-inter border border-white/15 hover:border-white/40 hover:bg-white/5 rounded-xl transition text-center">
                    Get Started
                  </button>
                </div>

                {/* Plan 2: Creator Pro (Popular) */}
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
                  <button onClick={handleStartFree} className="w-full py-4 text-xs tracking-widest font-bold uppercase font-inter bg-gradient-to-r from-violet-600 to-indigo-500 hover:from-violet-500 hover:to-indigo-400 text-white rounded-xl shadow-lg shadow-violet-500/20 transition text-center">
                    Go Pro Now
                  </button>
                </div>

                {/* Plan 3: Agency */}
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
                  <button onClick={handleStartFree} className="w-full py-3 text-xs tracking-widest font-bold uppercase font-inter border border-white/15 hover:border-white/40 hover:bg-white/5 rounded-xl transition text-center">
                    Inquire Studio
                  </button>
                </div>

              </div>

            </div>
          </div>

          {/* FOOTER */}
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
              <div className="flex gap-8 text-xs text-white/40 font-inter">
                <button className="hover:text-white" onClick={() => setView("docs")}>Developer API</button>
                <button className="hover:text-white" onClick={() => setView("architecture")}>Architecture</button>
                <button className="hover:text-white" onClick={() => setView("admin")}>GPU Cluster Status</button>
              </div>
            </div>
          </footer>

          {/* SIMULATED WATCH DEMO VIDEO MODAL */}
          {showDemoModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
              <div className="w-full max-w-4xl bg-[#0f0f0f] border border-white/10 rounded-2xl overflow-hidden relative">
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

      {/* ----------------- WORKSPACE CREATOR DASHBOARD ----------------- */}
      {view === "workspace" && (
        <div className="flex-1 flex flex-col md:flex-row bg-[#080808]">
          
          {/* Workspace Left Menu Sidebar */}
          <aside className="w-full md:w-64 bg-[#0a0a0a] border-r border-white/5 flex flex-row md:flex-col p-4 md:p-6 gap-2 overflow-x-auto md:overflow-x-visible md:overflow-y-auto">
            
            <div className="hidden md:block text-[9px] font-bold tracking-widest text-white/30 uppercase mb-4 pl-3">
              Creator Studio Tools
            </div>

            {[
              { id: "captioner", label: "AI Captioner", icon: <Sparkles className="w-4 h-4" /> },
              { id: "shorts", label: "AI Shorts Hooks", icon: <Zap className="w-4 h-4" /> },
              { id: "audio", label: "Audio Enhancer", icon: <Volume2 className="w-4 h-4" /> },
              { id: "thumbnail", label: "Thumbnail Studio", icon: <Image className="w-4 h-4" /> },
              { id: "publisher", label: "Social Publisher", icon: <Share2 className="w-4 h-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setWorkspaceTab(tab.id)}
                className={`flex items-center gap-3 w-full text-left py-3 px-4 rounded-xl text-xs uppercase tracking-wider font-semibold font-inter transition-all ${workspaceTab === tab.id ? "bg-violet-600 text-white shadow-lg shadow-violet-600/10 font-bold" : "text-white/60 hover:bg-white/5 hover:text-white"}`}
              >
                {tab.icon}
                <span className="whitespace-nowrap">{tab.label}</span>
              </button>
            ))}

            <div className="hidden md:block mt-auto pt-6 border-t border-white/5">
              <button 
                onClick={() => setView("landing")} 
                className="flex items-center gap-2 text-[10px] text-white/40 uppercase tracking-widest hover:text-white transition w-full pl-3"
              >
                ← Back to Studio Home
              </button>
            </div>
          </aside>

          {/* Workspace Workspace Content Panel */}
          <main className="flex-1 p-6 md:p-10 flex flex-col justify-start">
            
            {/* TAB 1: AI CAPTIONER */}
            {workspaceTab === "captioner" && (
              <div className="flex-1 flex flex-col">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6 mb-8">
                  <div>
                    <h2 className="text-xl font-bold font-inter text-white">AI Subtitle & Caption Generator</h2>
                    <p className="text-xs text-white/40 font-inter mt-1">Upload files and automatically generate styled Telugu captions with Whisper transcription.</p>
                  </div>
                  
                  {/* File Upload Button */}
                  <div className="relative">
                    <input 
                      type="file" 
                      accept="video/*" 
                      onChange={handleUploadVideo} 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={isUploading}
                    />
                    <button className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 px-5 py-3 rounded-lg text-xs uppercase tracking-widest font-bold font-inter transition duration-300">
                      <Upload className="w-4 h-4" />
                      Upload Video
                    </button>
                  </div>
                </div>

                {/* Upload Status Card */}
                {isUploading && (
                  <div className="mb-6 p-5 rounded-xl border border-white/10 bg-white/5 max-w-xl">
                    <div className="flex items-center justify-between text-xs text-white/80 font-mono mb-2">
                      <span>Uploading: {videoFile}</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-violet-500 transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                    </div>
                  </div>
                )}

                {/* Main Captioner Screen */}
                <div className="grid lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Video Player Preview Column */}
                  <div className="lg:col-span-5 bg-neutral-900 border border-white/5 rounded-2xl overflow-hidden aspect-[9/16] max-w-xs mx-auto w-full relative flex flex-col items-center justify-center p-6 shadow-inner">
                    <img 
                      src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop"
                      alt="Captioner background frame"
                      className="absolute inset-0 w-full h-full object-cover opacity-50"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

                    {/* Styled active caption rendering */}
                    <div className="z-10 flex flex-col items-center justify-center text-center mt-auto mb-20 select-none">
                      <div className="bg-yellow-400 text-black px-4 py-1.5 rounded-md font-extrabold text-lg sm:text-xl border-2 border-black rotate-[-2deg] shadow-[4px_4px_0px_#000]">
                        {captionsList[demoActiveWordIdx]?.word || "నమస్కారం"}
                      </div>
                      <div className="text-[10px] text-white/40 tracking-wider font-mono mt-3">
                        Word sync: {captionsList[demoActiveWordIdx]?.start}s - {captionsList[demoActiveWordIdx]?.end}s
                      </div>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-10">
                      <button onClick={() => setDemoPlaying(!demoPlaying)} className="p-1.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full text-white">
                        {demoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      </button>
                      <span className="text-[9px] font-mono text-white/60">00:0{demoActiveWordIdx} / 00:12</span>
                    </div>
                  </div>

                  {/* Transcription Editor & Timestamps Column */}
                  <div className="lg:col-span-7 bg-[#0b0b0b] border border-white/5 rounded-2xl p-6">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                      <span className="text-xs font-bold tracking-widest text-white/50 uppercase font-inter">Transcribed Captions (Telugu)</span>
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full font-mono">Whisper v3 Active</span>
                    </div>

                    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                      {captionsList.map((item, idx) => (
                        <div 
                          key={item.id} 
                          className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${idx === demoActiveWordIdx ? "bg-violet-600/15 border-violet-500/35" : "bg-white/2 border-white/5 hover:border-white/10"}`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-mono text-white/40 font-bold bg-white/5 px-2 py-1 rounded">
                              {item.start.toFixed(1)}s
                            </span>
                            {editWordId === item.id ? (
                              <input 
                                type="text" 
                                value={editWordText}
                                onChange={(e) => setEditWordText(e.target.value)}
                                className="bg-neutral-800 border border-white/20 text-white rounded px-2.5 py-1 text-xs outline-none focus:border-violet-500"
                                onKeyDown={(e) => e.key === "Enter" && handleSaveWord(item.id)}
                                autoFocus
                              />
                            ) : (
                              <span 
                                onClick={() => { setEditWordId(item.id); setEditWordText(item.word); }}
                                className="text-xs text-white cursor-pointer hover:underline hover:text-violet-400 font-semibold font-inter"
                              >
                                {item.word}
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {editWordId === item.id ? (
                              <button onClick={() => handleSaveWord(item.id)} className="text-[10px] bg-violet-600 text-white px-2.5 py-1 rounded hover:bg-violet-500 font-bold">
                                Save
                              </button>
                            ) : (
                              <button 
                                onClick={() => { setEditWordId(item.id); setEditWordText(item.word); }}
                                className="text-[10px] text-white/40 hover:text-white font-mono"
                              >
                                edit
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 border-t border-white/5 pt-4 flex justify-between items-center">
                      <span className="text-[10px] text-white/30 font-mono">Tip: Click on any word to edit spelling manually.</span>
                      <button className="bg-gradient-to-r from-violet-600 to-indigo-500 hover:from-violet-500 hover:to-indigo-400 px-6 py-3 rounded-lg text-xs uppercase tracking-widest font-bold font-inter transition-all duration-300">
                        Export Subtitled Video
                      </button>
                    </div>

                  </div>

                </div>
              </div>
            )}

            {/* TAB 2: AI SHORTS HOOKS */}
            {workspaceTab === "shorts" && (
              <div className="flex-1 flex flex-col">
                <div className="border-b border-white/5 pb-6 mb-8">
                  <h2 className="text-xl font-bold font-inter text-white">AI Shorts Clip Generator (Opus style)</h2>
                  <p className="text-xs text-white/40 font-inter mt-1">Insert a long video URL to automatically clip the most engaging, hook-worthy moments into vertical shorts.</p>
                </div>

                <div className="grid lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Column URL input */}
                  <div className="lg:col-span-6 space-y-6">
                    <div className="p-6 rounded-2xl bg-[#0b0b0b] border border-white/5">
                      <label className="text-[10px] font-bold tracking-widest text-white/40 uppercase mb-3 block font-inter">Long Video URL (YouTube, Vimeo, etc.)</label>
                      <div className="flex gap-2">
                        <input 
                          type="url" 
                          placeholder="https://www.youtube.com/watch?v=..."
                          value={shortsUrl}
                          onChange={(e) => setShortsUrl(e.target.value)}
                          className="flex-1 bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-xs outline-none text-white focus:border-violet-500"
                        />
                        <button 
                          onClick={triggerShortsAnalysis}
                          disabled={analyzingShorts || !shortsUrl}
                          className="bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white px-5 rounded-xl text-xs uppercase tracking-widest font-bold font-inter transition"
                        >
                          Analyze Hooks
                        </button>
                      </div>

                      {analyzingShorts && (
                        <div className="mt-6 flex flex-col items-center justify-center p-8 bg-[#141414] border border-white/5 rounded-xl">
                          <RefreshCw className="w-8 h-8 text-violet-400 animate-spin mb-4" />
                          <span className="text-xs text-white/80 font-bold uppercase tracking-wider font-inter">Running Neural Hook Analysis</span>
                          <span className="text-[10px] text-white/40 font-mono mt-1">Calculating high retention time frames...</span>
                        </div>
                      )}
                    </div>

                    {/* Hook Results Cards */}
                    {shortsClips.length > 0 && (
                      <div className="space-y-4">
                        <span className="text-[10px] font-bold tracking-widest text-white/40 uppercase block font-inter">Auto-Clipped Viral Hooks</span>
                        
                        {shortsClips.map((clip) => (
                          <div key={clip.id} className="p-5 rounded-xl border border-white/5 bg-[#0b0b0b] hover:border-violet-500/30 transition-all flex items-center justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h4 className="text-xs font-bold font-inter text-white">{clip.title}</h4>
                                <span className="text-[9px] bg-violet-500/10 text-violet-400 px-2 py-0.5 rounded-full font-bold">
                                  {clip.score}% viral score
                                </span>
                              </div>
                              <p className="text-[10px] text-white/40 font-mono">Time range: {clip.start} - {clip.end} ({clip.duration})</p>
                            </div>
                            
                            <button className="flex items-center gap-1 bg-white/5 hover:bg-violet-600 border border-white/10 hover:border-violet-500 px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider font-inter transition">
                              Select
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right Column Layout Preview */}
                  <div className="lg:col-span-6 bg-[#0b0b0b] border border-white/5 rounded-2xl p-6">
                    <h3 className="text-xs font-bold tracking-widest text-white/50 uppercase border-b border-white/5 pb-4 mb-4 font-inter">Auto-Reframed 9:16 Video</h3>
                    
                    <div className="aspect-video w-full rounded-xl bg-neutral-900 border border-white/5 flex items-center justify-center relative overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop"
                        alt="Landscape base clip"
                        className="absolute inset-0 w-full h-full object-cover opacity-35"
                      />
                      
                      {/* Crop indicators */}
                      <div className="absolute top-0 bottom-0 left-[35%] right-[35%] border-2 border-dashed border-violet-500/70 bg-violet-600/5 relative flex flex-col justify-center items-center">
                        <span className="text-[8px] bg-violet-500 text-white font-mono px-1.5 py-0.5 rounded uppercase tracking-wider absolute top-2">9:16 Clip Focus</span>
                        <div className="w-6 h-6 rounded-full bg-violet-500 flex items-center justify-center text-white">
                          <CheckCircle className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 space-y-2">
                      <h4 className="text-xs font-bold text-white font-inter">AI Face-tracking Active</h4>
                      <p className="text-[10px] text-white/50 leading-relaxed font-inter">
                        Our dynamic cropper detects faces, products, or points of interest and centers them automatically as they move throughout the timeline.
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* TAB 3: AUDIO ENHANCER */}
            {workspaceTab === "audio" && (
              <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
                <div className="border-b border-white/5 pb-6 mb-8">
                  <h2 className="text-xl font-bold font-inter text-white">AI Studio Audio Enhancer</h2>
                  <p className="text-xs text-white/40 font-inter mt-1">Isolate speech, delete background noise, and balance voice quality to match top studio podcasts.</p>
                </div>

                <div className="p-8 rounded-2xl bg-[#0b0b0b] border border-white/5 space-y-8">
                  
                  {/* Waveform Visualization area */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs text-white/50 font-mono">
                      <span>Status: {audioPlaying ? "Playing Wave..." : "Paused"}</span>
                      <span>Enhancer: {audioEnhanced ? "STUDIO (ACTIVE)" : "RAW (BYPASS)"}</span>
                    </div>

                    <div className="h-32 bg-[#121212] border border-white/5 rounded-xl flex items-end justify-between p-6 relative overflow-hidden">
                      {/* Background grid */}
                      <div className="absolute inset-0 bg-grid-white/[0.02]" />

                      {/* Mock Dynamic wave bars */}
                      {Array.from({ length: 40 }).map((_, index) => {
                        const randomHeight = audioPlaying 
                          ? Math.sin(index + audioProgress) * 40 + 50 
                          : Math.sin(index) * 20 + 30;
                        const enhancedHeight = audioEnhanced ? randomHeight * 0.4 + 10 : randomHeight;
                        
                        return (
                          <div 
                            key={index} 
                            style={{ height: `${Math.max(5, Math.min(100, index % 2 === 0 ? enhancedHeight : enhancedHeight * 0.7))}%` }}
                            className={`w-[1.5%] rounded-full transition-all duration-300 ${audioEnhanced ? "bg-violet-400" : "bg-neutral-600"}`}
                          />
                        );
                      })}

                      {/* Timeline head marker */}
                      <div className="absolute top-0 bottom-0 bg-violet-500 w-0.5" style={{ left: `${audioProgress}%` }} />
                    </div>
                  </div>

                  {/* Player Controls & Enhancer Toggle */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-[#141414] border border-white/5 p-5 rounded-xl">
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => setAudioPlaying(!audioPlaying)}
                        className="w-12 h-12 bg-violet-600 hover:bg-violet-500 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300"
                      >
                        {audioPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 pl-0.5" />}
                      </button>
                      <div>
                        <h4 className="text-xs font-bold text-white font-inter">Podcast_Interview_Telugu.wav</h4>
                        <span className="text-[10px] text-white/40 font-mono">Sample audio length: 00:45</span>
                      </div>
                    </div>

                    {/* Toggle Slider */}
                    <div className="flex items-center gap-3 bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl select-none">
                      <span className="text-[10px] font-bold tracking-widest text-white/50 uppercase font-inter">Original</span>
                      <button 
                        onClick={() => setAudioEnhanced(!audioEnhanced)}
                        className={`w-14 h-7 rounded-full p-1 relative transition-all ${audioEnhanced ? "bg-violet-600" : "bg-neutral-800"}`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-all ${audioEnhanced ? "translate-x-7" : "translate-x-0"}`} />
                      </button>
                      <span className="text-[10px] font-bold tracking-widest text-violet-400 uppercase font-inter">AI Enhanced</span>
                    </div>
                  </div>

                  {/* Audio Features Checkboxes */}
                  <div className="grid sm:grid-cols-3 gap-4 border-t border-white/5 pt-6">
                    {[
                      { id: "noise", label: "Delete Ambient Noise", active: true },
                      { id: "voice", label: "Enhance Voice Quality", active: true },
                      { id: "volume", label: "Auto Normalize Output", active: false }
                    ].map((feature) => (
                      <div key={feature.id} className="p-4 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                        <span className="text-[11px] font-bold text-white/80 font-inter uppercase tracking-wider">{feature.label}</span>
                        <div className={`w-4.5 h-4.5 rounded flex items-center justify-center border ${feature.active ? "bg-violet-500/20 border-violet-500 text-violet-400" : "border-white/10"}`}>
                          {feature.active && <CheckCircle className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            )}

            {/* TAB 4: THUMBNAIL STUDIO */}
            {workspaceTab === "thumbnail" && (
              <div className="flex-1 flex flex-col">
                <div className="border-b border-white/5 pb-6 mb-8">
                  <h2 className="text-xl font-bold font-inter text-white">AI Click-Worthy Thumbnail Studio</h2>
                  <p className="text-xs text-white/40 font-inter mt-1">Generate stunning backgrounds using Flux models and overlay high-contrast Telugu text.</p>
                </div>

                <div className="grid lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Column Controls */}
                  <div className="lg:col-span-5 space-y-6">
                    <div className="p-6 rounded-2xl bg-[#0b0b0b] border border-white/5 space-y-4">
                      
                      {/* Image Prompt */}
                      <div>
                        <label className="text-[10px] font-bold tracking-widest text-white/40 uppercase mb-2 block font-inter">AI Image Generation Prompt</label>
                        <textarea 
                          value={thumbnailPrompt}
                          onChange={(e) => setThumbnailPrompt(e.target.value)}
                          rows={3}
                          className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-xs outline-none text-white focus:border-violet-500 font-inter leading-relaxed"
                        />
                      </div>

                      {/* Custom Overlay Text */}
                      <div>
                        <label className="text-[10px] font-bold tracking-widest text-white/40 uppercase mb-2 block font-inter">Thumbnail Text (Telugu)</label>
                        <input 
                          type="text" 
                          value={thumbnailText}
                          onChange={(e) => setThumbnailText(e.target.value)}
                          className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-xs outline-none text-white focus:border-violet-500 font-inter"
                        />
                      </div>

                      {/* Text Color Picker */}
                      <div>
                        <label className="text-[10px] font-bold tracking-widest text-white/40 uppercase mb-2 block font-inter">Text Highlights Color</label>
                        <div className="flex gap-2">
                          {[
                            { name: "Yellow", hex: "#FFFF00" },
                            { name: "Magenta", hex: "#FF00FF" },
                            { name: "Cyan", hex: "#00FFFF" },
                            { name: "Green", hex: "#39FF14" }
                          ].map((col) => (
                            <button
                              key={col.hex}
                              onClick={() => setThumbnailColor(col.hex)}
                              style={{ backgroundColor: col.hex }}
                              className={`w-8 h-8 rounded-full border-2 ${thumbnailColor === col.hex ? "border-white" : "border-transparent"}`}
                            />
                          ))}
                        </div>
                      </div>

                      <button 
                        onClick={handleGenerateThumbnail}
                        disabled={generatingThumbnail}
                        className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 py-3.5 rounded-xl text-xs uppercase tracking-widest font-bold font-inter transition-all"
                      >
                        {generatingThumbnail ? "Synthesizing Image..." : "Generate AI Thumbnail"}
                      </button>

                    </div>
                  </div>

                  {/* Right Column Preview Canvas */}
                  <div className="lg:col-span-7 bg-[#0b0b0b] border border-white/5 rounded-2xl p-6">
                    <h3 className="text-xs font-bold tracking-widest text-white/50 uppercase border-b border-white/5 pb-4 mb-4 font-inter">Live Canvas Preview</h3>
                    
                    <div className="aspect-video w-full rounded-xl bg-neutral-900 border border-white/5 flex flex-col items-center justify-center relative overflow-hidden shadow-inner select-none">
                      <img 
                        src={thumbnailUrl}
                        alt="Thumbnail generated canvas background"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/15" />

                      {/* High Contrast Text Overlay (Simulates YouTube Thumbnail meta) */}
                      <div className="z-10 mt-auto mb-6 ml-6 mr-auto text-left">
                        <div 
                          style={{ color: thumbnailColor, textShadow: "4px 4px 0px #000, -2px -2px 0px #000, 2px -2px 0px #000, -2px 2px 0px #000" }}
                          className="text-3xl sm:text-4xl md:text-5xl font-black font-podium uppercase tracking-wide leading-tight drop-shadow-lg"
                        >
                          {thumbnailText}
                        </div>
                      </div>

                      {/* Mock YouTube play icon to preview in-app feel */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                        <Play className="w-16 h-16 text-white" />
                      </div>
                    </div>

                    <div className="mt-6 flex justify-between items-center">
                      <span className="text-[10px] text-white/30 font-mono">Output aspect ratio: 16:9 (1920x1080px)</span>
                      <button className="flex items-center gap-1.5 border border-white/20 hover:border-white/40 hover:bg-white/5 px-5 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider font-inter transition">
                        Download Image
                      </button>
                    </div>

                  </div>

                </div>
              </div>
            )}

            {/* TAB 5: SOCIAL PUBLISHER */}
            {workspaceTab === "publisher" && (
              <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
                <div className="border-b border-white/5 pb-6 mb-8">
                  <h2 className="text-xl font-bold font-inter text-white">AI Social publisher & Scheduler</h2>
                  <p className="text-xs text-white/40 font-inter mt-1">Generate optimized descriptions, tags, and hashtags, and schedule posts directly to your channels.</p>
                </div>

                <div className="p-8 rounded-2xl bg-[#0b0b0b] border border-white/5 space-y-6">
                  
                  {/* Select Platform Row */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: "instagram", label: "Instagram Reels" },
                      { id: "youtube", label: "YouTube Shorts" },
                      { id: "tiktok", label: "TikTok Video" }
                    ].map((plat) => (
                      <button
                        key={plat.id}
                        onClick={() => setSocialPlatform(plat.id)}
                        className={`py-3.5 px-2 text-xs uppercase tracking-wider font-bold rounded-xl border font-inter transition-all ${socialPlatform === plat.id ? "bg-violet-600 border-violet-500 text-white shadow-lg" : "bg-black/40 border-white/5 text-white/50 hover:border-white/10 hover:text-white"}`}
                      >
                        {plat.label}
                      </button>
                    ))}
                  </div>

                  {/* Text Generator Area */}
                  <div className="bg-[#141414] border border-white/5 rounded-xl p-5 space-y-4">
                    <div className="flex items-center justify-between text-xs text-white/50 font-mono">
                      <span>Copywriter Engine</span>
                      <button 
                        onClick={handleWriteCopy}
                        disabled={writingCopy}
                        className="text-violet-400 hover:text-violet-300 font-bold uppercase tracking-wider text-[10px]"
                      >
                        {writingCopy ? "Generating..." : "Generate Optimized Copy"}
                      </button>
                    </div>

                    <textarea
                      value={generatedCopy}
                      onChange={(e) => setGeneratedCopy(e.target.value)}
                      placeholder="Your generated social description and viral hashtags will appear here..."
                      rows={6}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs outline-none text-white focus:border-violet-500 font-inter leading-relaxed"
                    />
                  </div>

                  {/* Scheduler Form Row */}
                  <div className="grid sm:grid-cols-2 gap-6 items-end border-t border-white/5 pt-6">
                    <div>
                      <label className="text-[10px] font-bold tracking-widest text-white/40 uppercase mb-2 block font-inter">Post Schedule Date & Time</label>
                      <input 
                        type="datetime-local" 
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                        className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3.5 text-xs outline-none text-white focus:border-violet-500 font-mono"
                      />
                    </div>

                    <button 
                      onClick={handleSchedulePost}
                      className="w-full bg-gradient-to-r from-violet-600 to-indigo-500 hover:from-violet-500 hover:to-indigo-400 py-3.5 rounded-xl text-xs uppercase tracking-widest font-bold font-inter transition shadow-lg shadow-violet-500/25"
                    >
                      Schedule Publication
                    </button>
                  </div>

                  {/* Notification popup */}
                  {scheduledSuccessfully && (
                    <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 flex items-center gap-3 text-xs font-inter font-semibold">
                      <CheckCircle className="w-5 h-5 flex-shrink-0" />
                      Post successfully scheduled for {new Date(scheduledTime).toLocaleString()}!
                    </div>
                  )}

                </div>
              </div>
            )}

          </main>
        </div>
      )}

      {/* ----------------- DEVELOPER API DOCS VIEW ----------------- */}
      {view === "docs" && (
        <div className="flex-1 max-w-5xl mx-auto w-full p-6 md:p-12 space-y-12">
          
          <div className="border-b border-white/5 pb-6">
            <h2 className="text-2xl font-bold font-inter text-white">Developer API Keys & Docs</h2>
            <p className="text-xs text-white/40 font-inter mt-1">Integrate our advanced Whisper-based auto captioning and video reframing pipelines directly into your own products.</p>
          </div>

          {/* Keys Section */}
          <div className="p-6 rounded-2xl bg-[#0b0b0b] border border-white/5 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-white font-inter">Live API Secret Keys</h3>
                <p className="text-[10px] text-white/40 font-inter mt-0.5">Keep these credentials secure. Never disclose them in client-side code.</p>
              </div>
              <button 
                onClick={handleGenerateApiKey}
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
                      onClick={() => handleCopyKey(key)} 
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

          {/* Code Endpoint Showcase */}
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Left selector */}
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

            {/* Right code board */}
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

          {/* Metrics grids */}
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

          {/* GPU Cluster Cluster Nodes Detail */}
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

          {/* Infrastructure Diagram using Interactive Cards */}
          <div className="space-y-6">
            <h3 className="text-xs font-bold tracking-widest text-white/50 uppercase border-b border-white/5 pb-3 font-inter">Server Pipeline Infrastructure</h3>
            
            <div className="grid md:grid-cols-5 gap-4 items-center">
              
              <div className="p-5 bg-[#0b0b0b] border border-white/5 rounded-2xl text-center space-y-2 relative">
                <div className="text-[10px] font-mono text-violet-400 font-bold uppercase tracking-wider">Step 1</div>
                <h4 className="text-xs font-bold font-inter text-white uppercase">Client Web App</h4>
                <p className="text-[9px] text-white/40 font-inter">Next.js static assets served via AWS CloudFront.</p>
                <div className="hidden md:block absolute top-1/2 right-[-10px] -translate-y-1/2 text-violet-500 text-lg font-bold">→</div>
              </div>

              <div className="p-5 bg-[#0b0b0b] border border-white/5 rounded-2xl text-center space-y-2 relative">
                <div className="text-[10px] font-mono text-violet-400 font-bold uppercase tracking-wider">Step 2</div>
                <h4 className="text-xs font-bold font-inter text-white uppercase">API Gateway</h4>
                <p className="text-[9px] text-white/40 font-inter">FastAPI routes validations & distributes webhooks.</p>
                <div className="hidden md:block absolute top-1/2 right-[-10px] -translate-y-1/2 text-violet-500 text-lg font-bold">→</div>
              </div>

              <div className="p-5 bg-[#0b0b0b] border border-white/5 rounded-2xl text-center space-y-2 relative">
                <div className="text-[10px] font-mono text-violet-400 font-bold uppercase tracking-wider">Step 3</div>
                <h4 className="text-xs font-bold font-inter text-white uppercase">Task Broker</h4>
                <p className="text-[9px] text-white/40 font-inter">Redis Pub/Sub balances Celery workers.</p>
                <div className="hidden md:block absolute top-1/2 right-[-10px] -translate-y-1/2 text-violet-500 text-lg font-bold">→</div>
              </div>

              <div className="p-5 bg-[#0b0b0b] border-2 border-violet-500 bg-[#0e0c12] rounded-2xl text-center space-y-2 relative shadow-lg shadow-violet-950/20">
                <div className="text-[10px] font-mono text-violet-400 font-bold uppercase tracking-wider">Step 4</div>
                <h4 className="text-xs font-bold font-inter text-white uppercase">Whisper GPU Nodes</h4>
                <p className="text-[9px] text-white/50 font-inter">NVIDIA A10G clusters generate word timestamps.</p>
                <div className="hidden md:block absolute top-1/2 right-[-10px] -translate-y-1/2 text-violet-500 text-lg font-bold">→</div>
              </div>

              <div className="p-5 bg-[#0b0b0b] border border-white/5 rounded-2xl text-center space-y-2 relative">
                <div className="text-[10px] font-mono text-violet-400 font-bold uppercase tracking-wider">Step 5</div>
                <h4 className="text-xs font-bold font-inter text-white uppercase">S3 Storage</h4>
                <p className="text-[9px] text-white/40 font-inter">FFmpeg renders output video directly to bucket.</p>
              </div>

            </div>
          </div>

          {/* Database Entity Relationship visualization */}
          <div className="space-y-6">
            <h3 className="text-xs font-bold tracking-widest text-white/50 uppercase border-b border-white/5 pb-3 font-inter">Relational Database Schemas (Prisma Models)</h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              
              {/* Model 1: User */}
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

              {/* Model 2: Project */}
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

              {/* Model 3: Subtitle */}
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
