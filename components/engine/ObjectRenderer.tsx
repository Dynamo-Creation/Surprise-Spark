"use client";

import React from "react";
import { SceneObjectModel } from "@/lib/engine/types";
import { Gift, Cake, Sparkles, Flame, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ObjectRendererProps {
  object: SceneObjectModel;
  currentAnimation?: string;
  onObjectClick?: (objectId: string) => void;
  onButtonClick?: (objectId: string) => void;
}

export function ObjectRenderer({
  object,
  currentAnimation,
  onObjectClick,
  onButtonClick,
}: ObjectRendererProps) {
  if (!object.visible) {
    return null;
  }

  const { type, props, transform, interaction } = object;
  const activeAnim = currentAnimation || object.animation?.type || "";

  // CSS animation mapping
  const animationClasses =
    {
      shake: "animate-wiggle",
      float: "animate-float",
      spin: "animate-spin duration-3000",
      bounce: "animate-bounce",
      pulse: "animate-pulse",
      open_lid: "transition-transform duration-700 -translate-y-8 rotate-12 scale-105",
      extinguish: "transition-opacity duration-500 opacity-20 scale-50",
      fade_in: "animate-in fade-in duration-300",
      scale_up: "animate-in zoom-in-90 duration-300",
    }[activeAnim] || "";

  const isClickable = interaction?.clickable;

  const handleClick = () => {
    if (type === "button") {
      onButtonClick?.(object.id);
    } else if (isClickable) {
      onObjectClick?.(object.id);
    }
  };

  // Clean sender signature if sender_name is empty
  const rawText = props.text || "";
  const isSignature = rawText.includes("With love,") || rawText.includes("From");
  const isSignatureEmpty = isSignature && (rawText.replace(/With love,|From|❤️/g, "").trim() === "");

  if (isSignatureEmpty) {
    return null; // Omit empty sender signature gracefully
  }

  return (
    <div
      onClick={handleClick}
      className={`relative select-none transition-all duration-300 ${
        isClickable ? "cursor-pointer group hover:brightness-110 active:scale-95" : ""
      }`}
      style={
        type === "model3d"
          ? {
              transform: `translate3d(${transform.position[0] * 20}px, ${
                -transform.position[1] * 20
              }px, ${transform.position[2] * 20}px) rotate(${transform.rotation[2]}deg) scale(${
                transform.scale[0]
              })`,
            }
          : undefined
      }
      title={interaction?.tooltipText}
    >
      {/* 1. 3D Model Representation (Fallback / 2D mode) */}
      {type === "model3d" && (
        <div className={`relative flex flex-col items-center justify-center ${animationClasses}`}>
          {object.assetRef?.includes("cake") ? (
            <div className="relative p-6 rounded-3xl bg-gradient-to-tr from-pink-500 to-rose-600 text-white shadow-2xl shadow-pink-500/30 flex flex-col items-center">
              <div className="text-6xl sm:text-7xl drop-shadow-md">🎂</div>
              <div className="w-24 h-2 bg-pink-700/50 rounded-full mt-2 blur-xs" />
            </div>
          ) : (
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full blur-xl opacity-60 group-hover:opacity-100 transition-opacity animate-pulse-glow" />
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-3xl bg-gradient-to-tr from-pink-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shadow-2xl shadow-pink-500/30">
                <Gift className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-lg" />
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. Dynamic Text Object */}
      {type === "text" && (
        <div className={`max-w-md mx-auto text-center px-4 ${animationClasses}`}>
          {props.typographyStyle === "headline" ? (
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white drop-shadow-md leading-tight">
              {rawText.includes("Happy Birthday") ? (
                <span className="bg-gradient-to-r from-amber-200 via-pink-400 to-purple-300 bg-clip-text text-transparent">
                  {rawText}
                </span>
              ) : (
                rawText
              )}
            </h2>
          ) : props.typographyStyle === "subtitle" ? (
            <p className="text-xs sm:text-sm font-medium text-pink-300 drop-shadow-xs">
              {rawText}
            </p>
          ) : props.typographyStyle === "letter" ? (
            <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/85 border border-pink-500/20 backdrop-blur-lg text-left shadow-2xl max-h-[220px] sm:max-h-[260px] overflow-y-auto">
              <div className="flex items-center gap-2 mb-2 pb-1 border-b border-white/10">
                <span className="text-xs font-bold uppercase tracking-widest text-pink-400">
                  A Personal Note 💌
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-normal whitespace-pre-line italic">
                &ldquo;{rawText}&rdquo;
              </p>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{rawText}</span>
            </div>
          )}
        </div>
      )}

      {/* 3. Image / Memory Polaroid Object */}
      {type === "image" && (
        <div
          className={`relative p-3 bg-white text-slate-900 rounded-2xl shadow-2xl max-w-[260px] mx-auto transform -rotate-2 hover:rotate-0 transition-transform ${animationClasses}`}
        >
          <div className="w-full h-44 rounded-xl bg-slate-100 overflow-hidden relative">
            {props.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={props.imageUrl}
                alt={props.text || "Memory Photo"}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-tr from-purple-200 to-pink-200 flex flex-col items-center justify-center text-slate-500">
                <Heart className="w-8 h-8 text-pink-500 mb-1" />
                <span className="text-xs font-semibold">Photo Moment</span>
              </div>
            )}
          </div>
          {props.text && (
            <p className="text-center font-handwriting text-xs text-slate-700 pt-2 font-medium">
              {props.text}
            </p>
          )}
        </div>
      )}

      {/* 4. Particle / Flame Object */}
      {type === "particle" && (
        <div className={`flex flex-col items-center justify-center ${animationClasses}`}>
          <div className="relative">
            <div className="absolute -inset-2 bg-amber-400/50 rounded-full blur-md animate-pulse" />
            <div className="relative w-8 h-8 rounded-full bg-gradient-to-t from-orange-500 to-yellow-300 flex items-center justify-center text-white shadow-lg">
              <Flame className="w-5 h-5 text-amber-100" />
            </div>
          </div>
        </div>
      )}

      {/* 5. Interactive Button Object */}
      {type === "button" && (
        <div className="pt-2 flex justify-center w-full">
          <Button
            variant={
              props.buttonVariant === "accent"
                ? "secondary"
                : props.buttonVariant === "secondary"
                ? "outline"
                : "primary"
            }
            size="lg"
            className={`text-xs sm:text-sm font-bold shadow-xl transition-all cursor-pointer min-h-[44px] px-6 ${
              props.buttonVariant === "accent"
                ? "bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-600 hover:to-pink-600 text-white border-none"
                : ""
            }`}
          >
            {props.buttonLabel || "Continue"}
          </Button>
        </div>
      )}
    </div>
  );
}
