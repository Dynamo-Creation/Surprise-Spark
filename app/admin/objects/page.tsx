"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Box, Plus, Search, Sparkles, Layers, Check } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const INITIAL_3D_OBJECTS = [
  { id: "obj-gift-box", name: "Procedural Gift Box & Ribbon", type: "Composite Box", category: "Props", polyCount: "1.2k", color: "#ec4899" },
  { id: "obj-cake-tiered", name: "Tiered Birthday Cake with Candles", type: "Cylinder Group", category: "Props", polyCount: "2.4k", color: "#fbbf24" },
  { id: "obj-balloon-single", name: "Buoyant Helium Balloon", type: "Sphere + String", category: "Decor", polyCount: "640", color: "#a855f7" },
  { id: "obj-door-portal", name: "Mysterious Door & Frame", type: "Extruded Box", category: "Portals", polyCount: "1.8k", color: "#6366f1" },
  { id: "obj-polaroid-frame", name: "Floating Polaroid Frame", type: "Plane + Mesh", category: "Photos", polyCount: "320", color: "#f8fafc" },
  { id: "obj-star-sparkle", name: "Golden Shimmer Star", type: "Extruded Star", category: "FX", polyCount: "480", color: "#f59e0b" },
  { id: "obj-confetti-particle", name: "Confetti Flutter Quad", type: "Instanced Mesh", category: "Particles", polyCount: "128", color: "#38bdf8" },
];

export default function AdminObjectsPage() {
  const [objects, setObjects] = useState(INITIAL_3D_OBJECTS);
  const [search, setSearch] = useState("");

  const filtered = objects.filter(
    (o) =>
      o.name.toLowerCase().includes(search.toLowerCase()) ||
      o.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Box className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
              Asset Catalog
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Procedural 3D Objects
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Geometry assets rendered procedurally with Three.js without requiring external heavyweight Blender meshes.
          </p>
        </div>

        <Link href="/admin/assets">
          <Button variant="outline" size="sm" className="text-xs border-slate-700 bg-slate-900" leftIcon={<Box className="w-3.5 h-3.5 text-purple-400" />}>
            Manage 3D Asset Library
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((obj) => (
          <Card key={obj.id} className="p-5 bg-slate-900/70 border-slate-800 hover:border-slate-700 transition-all group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 bg-purple-950/40 border border-purple-800 px-2 py-0.5 rounded-full">
                {obj.category}
              </span>
              <div
                className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                style={{ backgroundColor: obj.color }}
              />
            </div>
            <h3 className="font-bold text-sm text-white mb-1">{obj.name}</h3>
            <p className="text-xs text-slate-400 font-mono mb-3">{obj.type} • {obj.polyCount} polys</p>
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono text-[10px] text-slate-500">{obj.id}</span>
              <Badge variant="success" size="sm">Active in Engine</Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
