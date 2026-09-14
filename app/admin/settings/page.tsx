"use client";

import React, { useState } from "react";
import { Settings, Save, ShieldAlert, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminSettingsPage() {
  const [maxUploadMb, setMaxUploadMb] = useState("10");
  const [defaultVolume, setDefaultVolume] = useState("0.7");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Settings className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
              System Configuration
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Platform Settings & Limits
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Global operational parameters, security constraints, and media thresholds.
          </p>
        </div>

        <Button
          size="sm"
          onClick={handleSave}
          className="text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white"
          leftIcon={saved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
        >
          {saved ? "Settings Saved" : "Save Changes"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 bg-slate-900/70 border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white mb-2">Upload & Storage Parameters</h3>
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
              Max Photo Upload Size (MB)
            </label>
            <Input
              value={maxUploadMb}
              onChange={(e) => setMaxUploadMb(e.target.value)}
              className="bg-slate-950 border-slate-800 text-xs text-white"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
              Default BGM Audio Volume (0.0 - 1.0)
            </label>
            <Input
              value={defaultVolume}
              onChange={(e) => setDefaultVolume(e.target.value)}
              className="bg-slate-950 border-slate-800 text-xs text-white"
            />
          </div>
        </Card>

        <Card className="p-6 bg-slate-900/70 border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white mb-2">Platform Governance</h3>
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div>
              <p className="text-xs font-bold text-white">Maintenance Mode</p>
              <p className="text-[10px] text-slate-400">Display friendly maintenance banner</p>
            </div>
            <Badge variant="outline" size="sm" className="text-[10px] text-slate-400">
              Disabled
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div>
              <p className="text-xs font-bold text-white">Strict Role Validation</p>
              <p className="text-[10px] text-slate-400">Enforce server-side check on /admin</p>
            </div>
            <Badge variant="success" size="sm">
              Enforced
            </Badge>
          </div>
        </Card>
      </div>
    </div>
  );
}
