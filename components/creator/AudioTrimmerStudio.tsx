"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Mic,
  Square,
  Play,
  Pause,
  Upload,
  Music,
  Trash2,
  Scissors,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface AudioTrimmerStudioProps {
  maxDurationSec?: number; // Bounded by template design duration (e.g., 60s for The Golden Proposal)
  templateName?: string;
  onAudioChange?: (audioData: {
    url: string;
    blob?: Blob;
    startTime: number;
    duration: number;
    name: string;
    type: "voice_note" | "custom_music";
  } | null) => void;
  initialAudioUrl?: string;
}

export function AudioTrimmerStudio({
  maxDurationSec = 60,
  templateName = "The Golden Proposal",
  onAudioChange,
  initialAudioUrl,
}: AudioTrimmerStudioProps) {
  const [activeTab, setActiveTab] = useState<"upload" | "record">("upload");

  // Audio file & buffer state
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(initialAudioUrl || null);
  const [audioDuration, setAudioDuration] = useState<number>(0);
  const [waveformPeaks, setWaveformPeaks] = useState<number[]>([]);

  // Trimming state (in seconds)
  const [startTime, setStartTime] = useState<number>(0);
  const [clipDuration, setClipDuration] = useState<number>(maxDurationSec);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackProgress, setPlaybackProgress] = useState<number>(0); // 0 to 1

  // Recording state
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Audio element for playback preview
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Keep clip duration bounded to template duration
  useEffect(() => {
    if (audioDuration > 0) {
      const allowed = Math.min(audioDuration, maxDurationSec);
      setClipDuration(allowed);
      if (startTime + allowed > audioDuration) {
        setStartTime(Math.max(0, audioDuration - allowed));
      }
    }
  }, [audioDuration, maxDurationSec, startTime]);

  // Decode audio file into Web Audio API AudioBuffer for waveform generation
  const decodeAudio = useCallback(async (blobOrFile: Blob) => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const arrayBuffer = await blobOrFile.arrayBuffer();
      const decoded = await ctx.decodeAudioData(arrayBuffer);
      setAudioDuration(decoded.duration);

      // Extract 60 peak samples for the visual waveform
      const rawData = decoded.getChannelData(0);
      const samples = 64;
      const blockSize = Math.floor(rawData.length / samples);
      const peaks: number[] = [];

      for (let i = 0; i < samples; i++) {
        const blockStart = blockSize * i;
        let sum = 0;
        for (let j = 0; j < blockSize; j++) {
          sum += Math.abs(rawData[blockStart + j] || 0);
        }
        peaks.push(sum / blockSize);
      }

      // Normalize peaks between 0.15 and 1.0
      const maxPeak = Math.max(...peaks, 0.001);
      const normalized = peaks.map((p) => Math.max(0.18, p / maxPeak));
      setWaveformPeaks(normalized);
      ctx.close();
    } catch (e) {
      console.warn("Could not decode waveform directly:", e);
      // Fallback pseudo waveform if browser decoding fails
      const fallback = Array.from({ length: 64 }, () => Math.random() * 0.7 + 0.3);
      setWaveformPeaks(fallback);
    }
  }, []);

  // Handle file upload from device
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (audioUrl && audioUrl.startsWith("blob:")) {
      URL.revokeObjectURL(audioUrl);
    }

    const url = URL.createObjectURL(file);
    setAudioFile(file);
    setAudioUrl(url);
    setStartTime(0);
    setIsPlaying(false);

    await decodeAudio(file);

    if (onAudioChange) {
      onAudioChange({
        url,
        blob: file,
        startTime: 0,
        duration: Math.min(file.size / 16000, maxDurationSec),
        name: file.name,
        type: "custom_music",
      });
    }
  };

  // Start Voice Note Recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm;codecs=opus" });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        setAudioFile(new File([audioBlob], "Voice_Note.webm", { type: "audio/webm" }));
        setIsPlaying(false);
        setStartTime(0);

        await decodeAudio(audioBlob);

        if (onAudioChange) {
          onAudioChange({
            url,
            blob: audioBlob,
            startTime: 0,
            duration: recordingSeconds,
            name: "Personal Voice Note",
            type: "voice_note",
          });
        }

        // Stop all mic tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start(100);
      setIsRecording(true);
      setRecordingSeconds(0);

      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev + 1 >= maxDurationSec) {
            stopRecording();
            return maxDurationSec;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      console.error("Microphone access error:", err);
      alert("Please allow microphone permissions to record your heartfelt voice note.");
    }
  };

  // Stop Voice Note Recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    }
  };

  // Toggle trimmed playback
  const togglePlay = () => {
    const audio = audioElementRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    } else {
      audio.currentTime = startTime;
      audio.play().then(() => {
        setIsPlaying(true);
        const updateLoop = () => {
          if (!audio.paused) {
            const current = audio.currentTime;
            const end = startTime + clipDuration;
            if (current >= end) {
              audio.pause();
              audio.currentTime = startTime;
              setIsPlaying(false);
              setPlaybackProgress(0);
            } else {
              const prog = (current - startTime) / clipDuration;
              setPlaybackProgress(Math.max(0, Math.min(1, prog)));
              animationFrameRef.current = requestAnimationFrame(updateLoop);
            }
          }
        };
        animationFrameRef.current = requestAnimationFrame(updateLoop);
      }).catch((e) => console.warn("Audio play prevented:", e));
    }
  };

  // Clear loaded audio
  const handleRemoveAudio = () => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
    }
    if (audioUrl && audioUrl.startsWith("blob:")) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioFile(null);
    setAudioUrl(null);
    setAudioDuration(0);
    setWaveformPeaks([]);
    setIsPlaying(false);
    setStartTime(0);
    if (onAudioChange) {
      onAudioChange(null);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="rounded-3xl border border-slate-200/80 dark:border-rose-950/60 bg-gradient-to-b from-white/90 to-rose-50/20 dark:from-slate-900/90 dark:to-slate-950/90 p-5 backdrop-blur-md shadow-lg space-y-4">
      {/* Hidden audio element */}
      {audioUrl && (
        <audio
          ref={audioElementRef}
          src={audioUrl}
          onLoadedMetadata={(e) => {
            const d = e.currentTarget.duration;
            if (d && !isNaN(d) && d > 0) {
              setAudioDuration(d);
            }
          }}
        />
      )}

      {/* Header with Template Duration Bounding Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white shadow-xs">
              <Music className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>Personal Voice Note or Device Music</span>
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Add a personal message or song from your device, trimmed to match {templateName}.
          </p>
        </div>

        {/* Max Duration Badge according to template design duration */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-[11px] font-semibold text-amber-700 dark:text-amber-300">
          <Scissors className="w-3 h-3 text-amber-500" />
          <span>Max Duration: {maxDurationSec}s</span>
        </div>
      </div>

      {/* Tabs: Upload Music vs Record Voice Note */}
      {!audioUrl && !isRecording && (
        <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
          <button
            type="button"
            onClick={() => setActiveTab("upload")}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "upload"
                ? "bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload From Device</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("record")}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "record"
                ? "bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Record Voice Note</span>
          </button>
        </div>
      )}

      {/* Recording in Progress View */}
      {isRecording && (
        <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex flex-col items-center justify-center space-y-4 text-center animate-in fade-in">
          <div className="relative">
            <span className="w-16 h-16 rounded-full bg-rose-500 flex items-center justify-center text-white shadow-xl shadow-rose-500/40 animate-pulse">
              <Mic className="w-7 h-7" />
            </span>
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
            </span>
          </div>

          <div>
            <p className="text-sm font-black text-rose-600 dark:text-rose-400">
              Recording Voice Note...
            </p>
            <p className="text-2xl font-mono font-bold text-slate-900 dark:text-white mt-1">
              {formatTime(recordingSeconds)} / {formatTime(maxDurationSec)}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              Speak your confession, heartfelt wish, or favorite memory
            </p>
          </div>

          <Button
            type="button"
            variant="destructive"
            size="md"
            onClick={stopRecording}
            leftIcon={<Square className="w-4 h-4 fill-white" />}
            className="rounded-full px-6 shadow-md"
          >
            Done Recording
          </Button>
        </div>
      )}

      {/* Mode 1: Device Audio File Upload Dropzone */}
      {!audioUrl && !isRecording && activeTab === "upload" && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-rose-400 dark:hover:border-rose-500/80 rounded-2xl p-6 text-center cursor-pointer transition-all bg-white/40 dark:bg-slate-950/40 hover:bg-rose-50/30 dark:hover:bg-rose-950/20 group"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/mp3,audio/wav,audio/m4a,audio/aac,audio/*"
            className="hidden"
            onChange={handleFileUpload}
          />
          <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
            <Upload className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
            Click to upload your favorite song or audio clip
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Supports MP3, WAV, M4A, AAC from your phone or PC.
          </p>
          <span className="inline-block mt-3 text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2.5 py-0.5 rounded-full border border-rose-200/60 dark:border-rose-900/60">
            Instagram & WhatsApp style Trimmer available after upload
          </span>
        </div>
      )}

      {/* Mode 2: Voice Note Recording Launcher */}
      {!audioUrl && !isRecording && activeTab === "record" && (
        <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center bg-white/40 dark:bg-slate-950/40 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
            <Mic className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              Record a Personal Voice Note (Up to {maxDurationSec}s)
            </h4>
            <p className="text-[11px] text-slate-500 mt-1 max-w-sm mx-auto">
              Your voice makes the proposal or celebration 100x more emotional. Just tap record to start.
            </p>
          </div>
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={startRecording}
            leftIcon={<Mic className="w-4 h-4" />}
            className="rounded-full px-6 shadow-md"
          >
            Start Recording
          </Button>
        </div>
      )}

      {/* Audio Loaded: Instagram/WhatsApp Style Audio Trimmer Workspace */}
      {audioUrl && (
        <div className="space-y-4 animate-in fade-in">
          {/* Audio Item Meta Bar */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={togglePlay}
                className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
                title={isPlaying ? "Pause Preview" : "Play Trimmed Preview"}
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
              </button>

              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {audioFile?.name || "Personal Audio Track"}
                </p>
                <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                  <span>Total: {formatTime(audioDuration || 60)}</span>
                  <span>•</span>
                  <span className="font-semibold text-rose-600 dark:text-rose-400">
                    Selected: {formatTime(clipDuration)} (Max {maxDurationSec}s)
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRemoveAudio}
              className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
              title="Remove audio and use default template synth"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Instagram / WhatsApp Waveform Scrubber with Trimming Bounding Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 dark:text-slate-300">
              <span className="flex items-center gap-1">
                <Scissors className="w-3 h-3 text-rose-500" />
                <span>Drag slider to trim best section ({formatTime(startTime)} – {formatTime(startTime + clipDuration)})</span>
              </span>
              <span className="text-[10px] text-slate-400">
                {formatTime(startTime)} / {formatTime(audioDuration || maxDurationSec)}
              </span>
            </div>

            {/* Waveform Visualization Canvas */}
            <div className="relative h-16 w-full rounded-2xl bg-slate-950 border border-slate-800 p-2 overflow-hidden flex items-end justify-between gap-1 select-none">
              {/* Waveform Bars */}
              {waveformPeaks.length > 0 ? (
                waveformPeaks.map((peak, idx) => {
                  const barTime = ((idx / waveformPeaks.length) * (audioDuration || 60));
                  const isInsideTrim = barTime >= startTime && barTime <= (startTime + clipDuration);

                  return (
                    <div
                      key={idx}
                      className="flex-1 rounded-full transition-all duration-150"
                      style={{
                        height: `${Math.round(peak * 100)}%`,
                        backgroundColor: isInsideTrim
                          ? "rgba(244, 63, 94, 0.9)"
                          : "rgba(100, 116, 139, 0.3)",
                        boxShadow: isInsideTrim ? "0 0 6px rgba(244, 63, 94, 0.5)" : "none",
                      }}
                    />
                  );
                })
              ) : (
                /* Fallback pulsing wave bars */
                Array.from({ length: 48 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-rose-500/80 rounded-full"
                    style={{
                      height: `${Math.sin(i * 0.3) * 35 + 45}%`,
                    }}
                  />
                ))
              )}

              {/* Scrubber Playhead Line */}
              {isPlaying && (
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_8px_#ffffff] z-20 pointer-events-none transition-all duration-75"
                  style={{
                    left: `${((startTime + playbackProgress * clipDuration) / (audioDuration || 60)) * 100}%`,
                  }}
                />
              )}
            </div>

            {/* Trim Slider Handle (Instagram-style scrubber) */}
            {audioDuration > maxDurationSec && (
              <div className="pt-1">
                <input
                  type="range"
                  min={0}
                  max={Math.max(0, audioDuration - maxDurationSec)}
                  step={0.5}
                  value={startTime}
                  onChange={(e) => {
                    const newStart = parseFloat(e.target.value);
                    setStartTime(newStart);
                    if (audioElementRef.current) {
                      audioElementRef.current.currentTime = newStart;
                    }
                    if (onAudioChange && audioUrl) {
                      onAudioChange({
                        url: audioUrl,
                        blob: audioFile || undefined,
                        startTime: newStart,
                        duration: clipDuration,
                        name: audioFile?.name || "Personal Audio",
                        type: activeTab === "record" ? "voice_note" : "custom_music",
                      });
                    }
                  }}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                  <span>Start: {formatTime(startTime)}</span>
                  <span>End: {formatTime(startTime + clipDuration)}</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-[11px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-200/60 dark:border-emerald-800/60">
            <span className="flex items-center gap-1.5 font-bold">
              <Check className="w-3.5 h-3.5" /> Audio Ready for {templateName}
            </span>
            <span className="text-[10px] font-mono">
              Synchronized to {formatTime(clipDuration)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
