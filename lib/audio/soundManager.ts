"use client";

/**
 * Procedural Web Audio Engine for SurpriseSpark
 * Synthesizes celebratory sound effects and ambient background music
 * with zero external MP3 dependencies, zero copyright issues, and 100% offline reliability.
 */

class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted = false;
  private masterGain: GainNode | null = null;
  private bgmGain: GainNode | null = null;
  private isBgmPlaying = false;
  private bgmInterval: NodeJS.Timeout | null = null;

  // Custom background audio (user-uploaded tracks / voice notes)
  private customAudioElement: HTMLAudioElement | null = null;
  private isCustomAudioActive = false;
  private customAudioUrl: string | null = null;

  private initContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.7, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);

        this.bgmGain = this.ctx.createGain();
        this.bgmGain.gain.setValueAtTime(0.25, this.ctx.currentTime);
        this.bgmGain.connect(this.masterGain);
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(muted ? 0 : 0.7, this.ctx.currentTime, 0.05);
    }
    // Sync mute state with custom audio element
    if (this.customAudioElement) {
      this.customAudioElement.muted = muted;
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  /**
   * Synthesize Sound Effects
   */
  public playSoundEffect(name: string) {
    const ctx = this.initContext();
    if (!ctx || !this.masterGain || this.isMuted) return;

    const now = ctx.currentTime;

    switch (name) {
      case "gift_shake":
      case "shake": {
        // Playful wooden box rattle/shake sound
        for (let i = 0; i < 4; i++) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(140 + i * 35 + Math.random() * 20, now + i * 0.04);
          gain.gain.setValueAtTime(0.3, now + i * 0.04);
          gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.04 + 0.05);
          osc.connect(gain);
          gain.connect(this.masterGain);
          osc.start(now + i * 0.04);
          osc.stop(now + i * 0.04 + 0.06);
        }
        break;
      }

      case "lid_pop":
      case "open": {
        // Resonant ascending pop & sparkle
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.26);
        break;
      }

      case "celebration_fanfare":
      case "fanfare":
      case "cheer": {
        // Joyful chord fanfare (C major triad + high sparkle: C5, E5, G5, C6)
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          const delay = idx * 0.08;
          osc.frequency.setValueAtTime(freq, now + delay);
          gain.gain.setValueAtTime(0.35, now + delay);
          gain.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.8);
          osc.connect(gain);
          gain.connect(this.masterGain!);
          osc.start(now + delay);
          osc.stop(now + delay + 0.85);
        });
        break;
      }

      case "sparkle":
      case "sparkles": {
        // High crystalline twinkling notes
        const sparkles = [1318.51, 1567.98, 1760.0, 2093.0];
        sparkles.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          const delay = idx * 0.06;
          osc.frequency.setValueAtTime(freq, now + delay);
          gain.gain.setValueAtTime(0.2, now + delay);
          gain.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.35);
          osc.connect(gain);
          gain.connect(this.masterGain!);
          osc.start(now + delay);
          osc.stop(now + delay + 0.4);
        });
        break;
      }

      case "whoosh":
      case "transition": {
        // Soft atmospheric whoosh
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(320, now + 0.15);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.35);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.36);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.38);
        break;
      }

      case "candle_blow":
      case "extinguish": {
        // Soft breath / twinkle extinguish
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.2);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.26);
        break;
      }

      default:
        // Generic soft chime
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(587.33, now);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.32);
    }
  }

  private currentMood: string = "happy";

  /**
   * Procedural Ambient Background Music with Mood-Specific Scales & Synthesis
   */
  public startBgm(mood: string = "happy") {
    // If custom background audio is actively playing, suppress procedural BGM
    if (this.isCustomAudioActive && this.customAudioElement && !this.customAudioElement.paused) {
      return;
    }

    // If already playing the requested mood, no-op
    if (this.isBgmPlaying && this.currentMood === mood) return;

    // If playing a different mood, stop first
    if (this.isBgmPlaying) {
      this.stopBgm();
    }

    const ctx = this.initContext();
    if (!ctx) return;

    this.isBgmPlaying = true;
    this.currentMood = mood;

    // Mood-specific musical scales & tempos
    let scale = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33];
    let intervalMs = 500;
    let waveType: OscillatorType = "sine";
    let gainLevel = 0.08;

    switch (mood) {
      case "party":
        scale = [261.63, 329.63, 392.0, 440.0, 523.25, 659.25];
        intervalMs = 320;
        waveType = "triangle";
        gainLevel = 0.1;
        break;
      case "sweet":
        scale = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5];
        intervalMs = 680;
        waveType = "sine";
        gainLevel = 0.06;
        break;
      case "magical":
        scale = [329.63, 392.0, 493.88, 587.33, 659.25, 783.99, 987.77];
        intervalMs = 450;
        waveType = "sine";
        gainLevel = 0.07;
        break;
      case "emotional":
        scale = [196.0, 220.0, 261.63, 293.66, 329.63, 392.0, 440.0];
        intervalMs = 750;
        waveType = "sine";
        gainLevel = 0.09;
        break;
      case "happy":
      default:
        scale = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25];
        intervalMs = 440;
        waveType = "sine";
        gainLevel = 0.08;
        break;
    }

    let noteIdx = 0;

    const playNote = () => {
      if (!this.isBgmPlaying || !this.ctx || !this.bgmGain || this.isMuted) return;
      const now = this.ctx.currentTime;
      const freq = scale[noteIdx % scale.length];
      noteIdx = (noteIdx + Math.floor(Math.random() * 3) + 1) % scale.length;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = waveType;
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(gainLevel, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + (intervalMs / 1000) * 1.5);

      osc.connect(gain);
      gain.connect(this.bgmGain);

      osc.start(now);
      osc.stop(now + (intervalMs / 1000) * 1.6);
    };

    playNote();
    this.bgmInterval = setInterval(playNote, intervalMs);
  }

  public stopBgm() {
    this.isBgmPlaying = false;
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }

  public isBgmOn(): boolean {
    return this.isBgmPlaying;
  }

  public getBgmCategory(): string {
    return this.currentMood;
  }

  /**
   * Play a custom background audio track from a permanent URL.
   * Used when the creator uploaded a personal song, voice note, or chose a soundtrack.
   * Automatically suppresses procedural BGM while this track is playing.
   * Supports trimmed playback: if startTime and duration are provided, playback
   * starts at the trim start and loops back at trim end.
   */
  public playBackgroundAudio(
    url: string,
    options?: { loop?: boolean; volume?: number; startTime?: number; duration?: number }
  ) {
    if (typeof window === "undefined" || !url) return;

    // If we're already playing this exact URL, no-op
    if (
      this.isCustomAudioActive &&
      this.customAudioUrl === url &&
      this.customAudioElement &&
      !this.customAudioElement.paused
    ) {
      return;
    }

    // Stop any existing custom audio
    this.stopBackgroundAudio();

    // Also stop procedural BGM so it doesn't overlap
    this.stopBgm();

    // Unlock Web Audio context using the current user gesture
    this.initContext();

    try {
      const audio = new Audio(url);
      audio.crossOrigin = "anonymous";
      audio.volume = options?.volume ?? 0.75;
      audio.muted = this.isMuted;
      audio.preload = "auto";
      audio.setAttribute("playsinline", "true");
      audio.setAttribute("webkit-playsinline", "true");

      const trimStart = options?.startTime ?? 0;
      const trimDuration = options?.duration;
      const hasTrim = trimStart > 0 || (trimDuration !== undefined && trimDuration > 0);

      // If we have trim data, use manual timeupdate loop instead of native loop
      if (hasTrim && trimDuration && trimDuration > 0) {
        audio.loop = false; // We handle looping manually for trimmed audio
        audio.currentTime = trimStart;

        // Timeupdate-based trim enforcement
        audio.addEventListener("timeupdate", () => {
          const trimEnd = trimStart + trimDuration;
          if (audio.currentTime >= trimEnd) {
            if (options?.loop !== false) {
              // Loop back to trim start
              audio.currentTime = trimStart;
            } else {
              audio.pause();
              this.isCustomAudioActive = false;
            }
          }
        });

        // If audio reaches natural end before trimEnd, loop back
        audio.addEventListener("ended", () => {
          if (options?.loop !== false) {
            audio.currentTime = trimStart;
            audio.play().catch(() => {});
          } else {
            this.isCustomAudioActive = false;
          }
        });
      } else {
        // No trim: use native loop
        audio.loop = options?.loop !== false;

        audio.addEventListener("ended", () => {
          if (!audio.loop) {
            this.isCustomAudioActive = false;
          }
        });
      }

      // Handle errors gracefully
      audio.addEventListener("error", (e) => {
        console.warn("[SoundManager] Custom audio playback error:", e);
        this.isCustomAudioActive = false;
      });

      this.customAudioElement = audio;
      this.customAudioUrl = url;
      this.isCustomAudioActive = true;

      // Attempt immediate playback (relies on prior user gesture from curtain tap)
      const playPromise = audio.play();
      if (playPromise) {
        playPromise.catch(() => {
          // Browser blocked autoplay — set up a one-time gesture listener to retry
          const unlockHandler = () => {
            if (hasTrim && trimDuration) {
              audio.currentTime = trimStart;
            }
            audio.play().catch(() => {});
            document.removeEventListener("click", unlockHandler);
            document.removeEventListener("touchstart", unlockHandler);
          };
          document.addEventListener("click", unlockHandler, { once: true });
          document.addEventListener("touchstart", unlockHandler, { once: true });
        });
      }
    } catch (err) {
      console.warn("[SoundManager] Failed to create custom audio:", err);
      this.isCustomAudioActive = false;
    }
  }

  /**
   * Stop custom background audio playback and clean up.
   */
  public stopBackgroundAudio() {
    if (this.customAudioElement) {
      try {
        this.customAudioElement.pause();
        this.customAudioElement.src = "";
        this.customAudioElement.load();
      } catch {
        // Ignore cleanup errors
      }
      this.customAudioElement = null;
    }
    this.isCustomAudioActive = false;
    this.customAudioUrl = null;
  }

  /**
   * Check if custom background audio is actively playing.
   */
  public isCustomAudioPlaying(): boolean {
    return (
      this.isCustomAudioActive &&
      this.customAudioElement !== null &&
      !this.customAudioElement.paused
    );
  }

  /**
   * Check if any audio (custom or procedural BGM) is currently playing.
   */
  public isAnyAudioPlaying(): boolean {
    return this.isCustomAudioPlaying() || this.isBgmPlaying;
  }
}

export const soundManager = new SoundManager();
