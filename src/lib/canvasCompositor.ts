// HTML5 Canvas Video Compositor & Web Audio API Engine
// Provides real-time rendering, filters, translations, active-word highlights, and client-side MP4 recording.

import { DBProject } from "./db";

export interface CaptionStyle {
  fontFamily: string;
  fontSize: number;
  textColor: string;
  outlineColor: string;
  outlineWidth: number;
  shadowColor: string;
  shadowBlur: number;
  shadowOffset: number;
  yPositionPercent: number; // 0 (top) to 100 (bottom)
  stylePreset: "bold" | "neon" | "glow" | "minimal";
  animation: "fade" | "scale" | "none";
}

export class CanvasCompositor {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private audioCtx: AudioContext | null = null;
  private audioDestination: MediaStreamAudioDestinationNode | null = null;
  private filterNodes: BiquadFilterNode[] = [];
  private volumeNode: GainNode | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Could not acquire 2D canvas context");
    this.ctx = context;
  }

  /**
   * Initializes Web Audio Context for processing audio effects and noise removal.
   */
  public initAudio() {
    if (this.audioCtx) return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    this.audioCtx = new AudioContextClass();
    this.audioDestination = this.audioCtx.createMediaStreamDestination();
    this.volumeNode = this.audioCtx.createGain();
    this.volumeNode.connect(this.audioDestination);
  }

  /**
   * Applies audio filters: highpass for rumble, lowpass for hiss (Noise Removal).
   */
  public applyAudioFilters(noiseRemovalActive: boolean, volumeLevel: number) {
    if (!this.audioCtx || !this.volumeNode || !this.audioDestination) return;

    // Disconnect existing filters
    this.filterNodes.forEach(node => node.disconnect());
    this.filterNodes = [];

    let lastNode: AudioNode = this.audioCtx.createGain(); // pass-through
    this.volumeNode.gain.value = volumeLevel;

    if (noiseRemovalActive) {
      // 1. High-pass filter to remove low-frequency room rumble (< 80Hz)
      const hp = this.audioCtx.createBiquadFilter();
      hp.type = "highpass";
      hp.frequency.value = 80;

      // 2. Low-pass filter to remove high-frequency hiss (> 8000Hz)
      const lp = this.audioCtx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 8000;

      hp.connect(lp);
      this.filterNodes.push(hp, lp);
      
      // Connect volume node to highpass
      this.volumeNode.disconnect();
      this.volumeNode.connect(hp);
      
      lastNode = lp;
    } else {
      // Connect volume directly to destination
      this.volumeNode.disconnect();
      this.volumeNode.connect(this.audioDestination);
    }

    if (this.filterNodes.length > 0) {
      lastNode.connect(this.audioDestination);
    }
  }

  /**
   * Renders a single frame of the video editor onto the canvas.
   */
  public renderFrame(
    currentTime: number,
    project: DBProject,
    videoElements: Map<string, HTMLVideoElement>,
    captionStyle: CaptionStyle
  ) {
    const { ctx, canvas } = this;
    
    // Clear canvas
    ctx.fillStyle = "#030303";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 1. Render Video Track
    const activeVideoClip = project.tracks.video.find(
      (clip) => currentTime >= clip.start && currentTime <= clip.start + clip.duration
    );

    if (activeVideoClip) {
      const video = videoElements.get(activeVideoClip.mediaId);
      if (video && video.readyState >= 2) {
        // Calculate playing position inside video file based on speed
        const elapsed = currentTime - activeVideoClip.start;
        const videoTime = activeVideoClip.cutStart + elapsed * activeVideoClip.speed;
        
        // Sync HTML5 video playback cursor if drifted significantly
        if (Math.abs(video.currentTime - videoTime) > 0.3) {
          video.currentTime = videoTime;
        }

        ctx.save();

        // Position canvas matrix to center of video clip
        const centerX = canvas.width / 2 + activeVideoClip.x;
        const centerY = canvas.height / 2 + activeVideoClip.y;
        ctx.translate(centerX, centerY);

        // Apply transformations: scale, rotation, flips
        ctx.scale(
          activeVideoClip.scale * (activeVideoClip.flipX ? -1 : 1),
          activeVideoClip.scale * (activeVideoClip.flipY ? -1 : 1)
        );
        ctx.rotate((activeVideoClip.rotation * Math.PI) / 180);

        // Draw video centered
        const dWidth = canvas.width;
        const dHeight = (video.videoHeight / video.videoWidth) * canvas.width;
        ctx.drawImage(video, -dWidth / 2, -dHeight / 2, dWidth, dHeight);

        ctx.restore();
      }
    }

    // 2. Render Subtitle Track (Dynamically overlayed with styles)
    const activeSubtitle = project.tracks.subtitle.find(
      (sub) => currentTime >= sub.start && currentTime <= sub.start + sub.duration
    );

    if (activeSubtitle) {
      this.drawSubtitleText(activeSubtitle.text, currentTime, activeSubtitle, captionStyle);
    }
  }

  /**
   * Draws styled subtitle text with support for active-word highlighting (Karaoke) and custom layouts.
   */
  private drawSubtitleText(
    text: string,
    currentTime: number,
    subtitle: DBProject["tracks"]["subtitle"][0],
    style: CaptionStyle
  ) {
    const { ctx, canvas } = this;
    ctx.save();

    // Set font styles
    ctx.font = `${style.fontSize}px ${style.fontFamily || "Inter"}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const x = canvas.width / 2;
    const y = (canvas.height * style.yPositionPercent) / 100;

    // Apply Presets Shadow/Stroke adjustments
    if (style.stylePreset === "bold") {
      ctx.shadowColor = "rgba(0, 0, 0, 0.85)";
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 3;
      ctx.shadowOffsetY = 3;
    } else if (style.stylePreset === "neon") {
      ctx.shadowColor = style.textColor || "#39FF14";
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    } else if (style.stylePreset === "glow") {
      ctx.shadowColor = style.shadowColor || "rgba(139, 92, 246, 0.8)";
      ctx.shadowBlur = 15;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    } else {
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
    }

    // Split text into words to simulate active word karaoke highlights
    const words = text.split(" ");
    const totalWords = words.length;

    // Estimate active word index based on relative progress through subtitle block
    const progress = (currentTime - subtitle.start) / subtitle.duration;
    const activeWordIdx = Math.max(0, Math.min(totalWords - 1, Math.floor(progress * totalWords)));

    // Calculate word widths to render them aligned horizontally
    const wordSpacings = 10; // spacing between words in pixels
    const wordWidths = words.map(w => ctx.measureText(w).width);
    const totalWidth = wordWidths.reduce((sum, w) => sum + w, 0) + (totalWords - 1) * wordSpacings;
    
    let startX = x - totalWidth / 2;

    words.forEach((word, idx) => {
      ctx.save();
      const wordWidth = wordWidths[idx];
      const wordX = startX + wordWidth / 2;

      const isActive = idx === activeWordIdx;

      // Color selection
      let textColor = style.textColor || "#FFFFFF";
      let strokeColor = style.outlineColor || "#000000";
      let strokeWidth = style.outlineWidth || 4;

      if (isActive) {
        if (style.stylePreset === "bold") {
          textColor = "#FFFF00"; // yellow highlight like Submagic
        } else if (style.stylePreset === "glow") {
          textColor = "#F43F5E"; // pink highlight
        } else {
          textColor = "#A78BFA"; // violet highlight
        }
        
        // Add zoom scaling animation to the active word
        if (style.animation === "scale") {
          ctx.translate(wordX, y);
          ctx.scale(1.15, 1.15);
          ctx.translate(-wordX, -y);
        }
      }

      // Draw stroke/outline
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = strokeWidth;
      ctx.strokeText(word, wordX, y);

      // Draw text fill
      ctx.fillStyle = textColor;
      ctx.fillText(word, wordX, y);

      ctx.restore();
      startX += wordWidth + wordSpacings;
    });

    ctx.restore();
  }

  /**
   * Compiles the video timeline locally, recording canvas frames and audio outputs to a downloadable Blob.
   */
  public startExport(
    project: DBProject,
    videoElements: Map<string, HTMLVideoElement>,
    audioBlobs: Map<string, Blob>,
    captionStyle: CaptionStyle,
    onProgress: (progress: number) => void
  ): Promise<Blob> {
    this.initAudio();

    return new Promise((resolve, reject) => {
      const { canvas } = this;
      const fps = project.settings.fps || 30;
      const duration = Math.max(...project.tracks.video.map(v => v.start + v.duration), 5); // Fallback to 5s min

      // Capture canvas stream
      const canvasStream = canvas.captureStream(fps);
      
      // Combine with Web Audio destination stream if available
      const combinedStream = new MediaStream();
      canvasStream.getVideoTracks().forEach(track => combinedStream.addTrack(track));
      
      if (this.audioDestination) {
        this.audioDestination.stream.getAudioTracks().forEach(track => combinedStream.addTrack(track));
      }

      const options = { mimeType: "video/webm;codecs=vp9,opus" };
      let recorder: MediaRecorder;
      try {
        recorder = new MediaRecorder(combinedStream, options);
      } catch (e) {
        // Fallback mimeType
        recorder = new MediaRecorder(combinedStream);
      }

      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const videoBlob = new Blob(chunks, { type: "video/webm" });
        resolve(videoBlob);
      };

      // Start play-through rendering timeline loop
      let currentSec = 0;
      const timeStep = 1 / fps;
      
      // Pre-play videos silently
      videoElements.forEach(video => {
        video.muted = true;
        video.play().catch(() => {});
      });

      recorder.start();

      const renderNextFrame = () => {
        if (currentSec >= duration) {
          recorder.stop();
          videoElements.forEach(video => video.pause());
          onProgress(100);
          return;
        }

        // Draw frame onto the export canvas
        this.renderFrame(currentSec, project, videoElements, captionStyle);
        
        currentSec += timeStep;
        onProgress(Math.floor((currentSec / duration) * 100));
        
        // Use requestAnimationFrame for smooth frame locks
        requestAnimationFrame(renderNextFrame);
      };

      renderNextFrame();
    });
  }
}
