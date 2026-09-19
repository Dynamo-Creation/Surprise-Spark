"use client";

import React from "react";
import { Heart, Star } from "lucide-react";
import { Marquee } from "@/components/magicui/marquee";

interface Testimonial {
  name: string;
  role: string;
  avatarUrl: string;
  gender: "male" | "female";
  content: string;
  tag: string;
}

const TESTIMONIALS_ROW_1: Testimonial[] = [
  {
    name: "Lucas M.",
    role: "Surprised his partner Sarah",
    avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=160&auto=format&fit=crop&q=80",
    gender: "male",
    content: "The interactive letterbox and typewriter notes brought tears of joy on FaceTime! Truly unforgettable.",
    tag: "Sweet Celebration 💌",
  },
  {
    name: "Elena R.",
    role: "Sent to best friend in Tokyo",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&auto=format&fit=crop&q=80",
    gender: "female",
    content: "Zero app download needed. Sent the link on WhatsApp and it played seamlessly on Safari instantly!",
    tag: "Sweet Celebration 💖",
  },
  {
    name: "Devon K.",
    role: "Created for Mom's 60th",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80",
    gender: "male",
    content: "Dynamic celebratory bunting, background melody, and polaroid frame brought our whole family together.",
    tag: "Sweet Memories 📸",
  },
  {
    name: "Priya N.",
    role: "Surprised her boyfriend",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80",
    gender: "female",
    content: "He spent 20 minutes tapping the letterbox and reading all the sweet personal notes. Pure magic!",
    tag: "Sweet Birthday 🎈",
  },
];

const TESTIMONIALS_ROW_2: Testimonial[] = [
  {
    name: "Marcus T.",
    role: "Anniversary surprise",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&auto=format&fit=crop&q=80",
    gender: "male",
    content: "Way more meaningful than a paper card or text. Felt like handing her a personalized interactive celebration world.",
    tag: "Letterbox Magic 💌",
  },
  {
    name: "Chloe D.",
    role: "Sister's graduation",
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=160&auto=format&fit=crop&q=80",
    gender: "female",
    content: "The 3D unboxing animation gave everyone in the room genuine goosebumps. Everyone asked for the link!",
    tag: "Sweet Celebration 🎊",
  },
  {
    name: "Aiden W.",
    role: "Long-distance relationship",
    avatarUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=160&auto=format&fit=crop&q=80",
    gender: "male",
    content: "Being 5,000 miles away is hard, but opening this together made us feel like we were in the same room.",
    tag: "Origami Sanctuary 🕊️",
  },
  {
    name: "Sophia L.",
    role: "Best friend's 25th",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&auto=format&fit=crop&q=80",
    gender: "female",
    content: "The heart cursor trail and typewriter message sequence is so heartwarming. 10/10 recommendation!",
    tag: "Sweet Celebration 🎂",
  },
];

function TestimonialCard({ item }: { item: Testimonial }) {
  return (
    <div className="relative w-80 sm:w-92 shrink-0 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-4 shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-3">
          {/* Realistic High-Res Portrait Avatar with Gender Match */}
          <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-pink-500/40 shadow-sm shrink-0">
            <img
              src={item.avatarUrl}
              alt={item.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{item.name}</h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">{item.role}</p>
          </div>
        </div>
        <span className="text-[10px] font-semibold text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-950/60 px-2.5 py-0.5 rounded-full border border-pink-200/50 dark:border-pink-900/50 whitespace-nowrap shrink-0">
          {item.tag}
        </span>
      </div>
      
      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-normal italic">
        &ldquo;{item.content}&rdquo;
      </p>

      <div className="flex items-center gap-1 mt-3 text-amber-400">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-3 h-3 fill-amber-400" />
        ))}
      </div>
    </div>
  );
}

export function CelebrationMarqueeSection() {
  return (
    <section className="py-16 bg-white dark:bg-slate-950 relative overflow-hidden border-b border-slate-100 dark:border-slate-800/80">
      {/* Subtle edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-white dark:from-slate-950 to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-28 bg-gradient-to-l from-white dark:from-slate-950 to-transparent z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-950/50 px-3 py-1 rounded-full border border-pink-200 dark:border-pink-900/50 mb-2.5 whitespace-nowrap">
          <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500 shrink-0" />
          <span>Real Emotional Reactions</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Celebrations That Left People Speechless
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-lg mx-auto">
          Real stories from creators who surprised friends, partners, and family around the globe.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {/* Row 1: Leftward Marquee */}
        <Marquee pauseOnHover className="[--duration:35s]">
          {TESTIMONIALS_ROW_1.map((item, idx) => (
            <TestimonialCard key={`r1-${idx}`} item={item} />
          ))}
        </Marquee>

        {/* Row 2: Rightward Marquee */}
        <Marquee reverse pauseOnHover className="[--duration:40s]">
          {TESTIMONIALS_ROW_2.map((item, idx) => (
            <TestimonialCard key={`r2-${idx}`} item={item} />
          ))}
        </Marquee>
      </div>
    </section>
  );
}
