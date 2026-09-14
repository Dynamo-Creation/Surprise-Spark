"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Film,
  Plus,
  Copy,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  Camera,
  Sun,
  Globe,
  Box,
  Type,
  Music,
  Zap,
  Check,
  Sparkles,
  Sliders,
  Play,
  RotateCcw,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { adminStore } from "@/lib/admin/adminStore";
import { SceneModel, SceneObjectModel, TemplateModel } from "@/lib/engine/types";
import { ExperiencePlayer } from "@/components/engine/ExperiencePlayer";

function SceneBuilderContent() {
  const searchParams = useSearchParams();
  const initialTplSlug = searchParams.get("template") || "magic-gift";

  const [templates, setTemplates] = useState<TemplateModel[]>(adminStore.listTemplates());
  const [selectedTplSlug, setSelectedTplSlug] = useState<string>(initialTplSlug);
  const [scenes, setScenes] = useState<SceneModel[]>(adminStore.getScenes(initialTplSlug));
  const [selectedSceneIndex, setSelectedSceneIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<
    "environment" | "camera" | "lighting" | "objects" | "text" | "audio" | "triggers"
  >("environment");

  const [toast, setToast] = useState<string | null>(null);

  // Sync scenes when selected template changes
  useEffect(() => {
    const loaded = adminStore.getScenes(selectedTplSlug);
    setScenes(loaded);
    setSelectedSceneIndex(0);
  }, [selectedTplSlug]);

  const activeScene: SceneModel | undefined = scenes[selectedSceneIndex];

  const handleUpdateActiveScene = (updates: Partial<SceneModel>) => {
    if (!activeScene) return;
    const updated = adminStore.updateScene(selectedTplSlug, activeScene.id, updates);
    if (updated) {
      setScenes([...adminStore.getScenes(selectedTplSlug)]);
    }
  };

  const handleAddScene = () => {
    const created = adminStore.addScene(selectedTplSlug, {
      name: `Scene ${scenes.length + 1}`,
      transition: "fade",
      durationMs: 4000,
    });
    setScenes([...adminStore.getScenes(selectedTplSlug)]);
    setSelectedSceneIndex(scenes.length);
    setToast(`Added new scene: "${created.name}"`);
    setTimeout(() => setToast(null), 3000);
  };

  const handleDuplicateScene = () => {
    if (!activeScene) return;
    const dup = adminStore.duplicateScene(selectedTplSlug, activeScene.id);
    setScenes([...adminStore.getScenes(selectedTplSlug)]);
    setSelectedSceneIndex(scenes.length);
    setToast(`Duplicated scene "${activeScene.name}"`);
    setTimeout(() => setToast(null), 3000);
  };

  const handleDeleteScene = () => {
    if (!activeScene || scenes.length <= 1) {
      alert("A template must contain at least one scene.");
      return;
    }
    const name = activeScene.name;
    adminStore.deleteScene(selectedTplSlug, activeScene.id);
    setScenes([...adminStore.getScenes(selectedTplSlug)]);
    setSelectedSceneIndex(Math.max(0, selectedSceneIndex - 1));
    setToast(`Deleted scene "${name}"`);
    setTimeout(() => setToast(null), 3000);
  };

  const handleMoveScene = (direction: "up" | "down") => {
    if (direction === "up" && selectedSceneIndex === 0) return;
    if (direction === "down" && selectedSceneIndex === scenes.length - 1) return;

    const targetIdx = direction === "up" ? selectedSceneIndex - 1 : selectedSceneIndex + 1;
    const reordered = [...scenes];
    const temp = reordered[selectedSceneIndex];
    reordered[selectedSceneIndex] = reordered[targetIdx];
    reordered[targetIdx] = temp;

    adminStore.reorderScenes(selectedTplSlug, reordered.map((s) => s.id));
    setScenes([...adminStore.getScenes(selectedTplSlug)]);
    setSelectedSceneIndex(targetIdx);
  };

  const currentTemplate = adminStore.getTemplate(selectedTplSlug);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Film className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
              Visual Scene Builder
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Scene Architecture & 3D Inspector
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Configure cameras, dynamic lighting, procedural 3D objects, dynamic variable text, and interaction triggers.
          </p>
        </div>

        {/* Template Selector Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-400">Template:</label>
          <select
            id="select-admin-template"
            value={selectedTplSlug}
            onChange={(e) => setSelectedTplSlug(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-white focus:outline-none focus:border-purple-500"
          >
            {templates.map((tpl) => (
              <option key={tpl.slug} value={tpl.slug}>
                {tpl.name} ({tpl.slug})
              </option>
            ))}
          </select>
        </div>
      </div>

      {toast && (
        <div className="p-3 rounded-xl bg-purple-950/80 border border-purple-800 text-purple-200 text-xs font-semibold flex items-center justify-between animate-fadeIn">
          <span>{toast}</span>
          <Button variant="ghost" size="sm" onClick={() => setToast(null)} className="h-5 px-2 text-xs">
            Dismiss
          </Button>
        </div>
      )}

      {/* Scene Timeline Strip */}
      <Card className="p-4 bg-slate-900/70 border-slate-800">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Sequence Timeline ({scenes.length} Scenes)
            </span>
            <Badge variant="secondary" size="sm" className="text-[10px]">
              {currentTemplate?.name}
            </Badge>
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              id="btn-add-scene"
              size="sm"
              onClick={handleAddScene}
              className="h-7 text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white"
              leftIcon={<Plus className="w-3 h-3" />}
            >
              Add Scene
            </Button>
            <Button
              id="btn-duplicate-scene"
              variant="outline"
              size="sm"
              onClick={handleDuplicateScene}
              className="h-7 text-xs border-slate-700 text-slate-300"
              leftIcon={<Copy className="w-3 h-3" />}
            >
              Duplicate
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleMoveScene("up")}
              disabled={selectedSceneIndex === 0}
              className="h-7 px-2 border-slate-700 text-slate-300 disabled:opacity-30"
              title="Move Scene Earlier"
            >
              <ArrowUp className="w-3 h-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleMoveScene("down")}
              disabled={selectedSceneIndex === scenes.length - 1}
              className="h-7 px-2 border-slate-700 text-slate-300 disabled:opacity-30"
              title="Move Scene Later"
            >
              <ArrowDown className="w-3 h-3" />
            </Button>
            <Button
              id="btn-delete-scene"
              variant="ghost"
              size="sm"
              onClick={handleDeleteScene}
              className="h-7 px-2 text-rose-400 hover:text-rose-300 hover:bg-rose-950/30"
              title="Delete Scene"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* Scene Cards Strip */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 custom-scrollbar">
          {scenes.map((scene, idx) => {
            const isSelected = idx === selectedSceneIndex;
            return (
              <button
                key={scene.id}
                id={`scene-chip-${idx}`}
                onClick={() => setSelectedSceneIndex(idx)}
                className={`flex-shrink-0 w-44 p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? "bg-gradient-to-br from-purple-900/60 to-pink-900/40 border-purple-500 shadow-lg shadow-purple-500/20"
                    : "bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400"
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-1">
                  <span>SCENE #{idx + 1}</span>
                  <span className="font-mono">{scene.durationMs ? `${scene.durationMs / 1000}s` : "Manual"}</span>
                </div>
                <p className="font-bold text-xs text-white truncate">{scene.name}</p>
                <p className="text-[10px] text-slate-400 capitalize mt-0.5">
                  {scene.transition} transition
                </p>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Main Builder Grid: Inspector (Left) & Preview (Right) */}
      {activeScene && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Inspector Panel (7 cols) */}
          <Card className="lg:col-span-7 bg-slate-900/80 border-slate-800 overflow-hidden flex flex-col">
            {/* Inspector Navigation Tabs */}
            <div className="flex items-center border-b border-slate-800 bg-slate-950/60 overflow-x-auto custom-scrollbar">
              {[
                { id: "environment", label: "Environment", icon: Globe },
                { id: "camera", label: "Camera", icon: Camera },
                { id: "lighting", label: "Lighting", icon: Sun },
                { id: "objects", label: "3D Objects", icon: Box },
                { id: "text", label: "Text & Vars", icon: Type },
                { id: "audio", label: "Audio & SFX", icon: Music },
                { id: "triggers", label: "Triggers", icon: Zap },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    id={`tab-inspector-${tab.id}`}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`flex items-center gap-1.5 px-3.5 py-3 text-xs font-bold transition-colors whitespace-nowrap border-b-2 ${
                      isActive
                        ? "border-purple-500 text-white bg-slate-900/60"
                        : "border-transparent text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Contents */}
            <div className="p-5 flex-1 space-y-4">
              {/* Scene Basic Info */}
              <div className="grid grid-cols-2 gap-3 pb-4 border-b border-slate-800/80">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                    Scene Title
                  </label>
                  <Input
                    id="input-scene-name"
                    value={activeScene.name}
                    onChange={(e) => handleUpdateActiveScene({ name: e.target.value })}
                    className="bg-slate-950 border-slate-800 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                    Transition Style
                  </label>
                  <select
                    value={activeScene.transition}
                    onChange={(e) =>
                      handleUpdateActiveScene({
                        transition: e.target.value as SceneModel["transition"],
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  >
                    <option value="fade">Fade</option>
                    <option value="zoom">Zoom</option>
                    <option value="slide">Slide</option>
                    <option value="dissolve">Dissolve</option>
                    <option value="curtain">Curtain</option>
                  </select>
                </div>
              </div>

              {/* TAB 1: ENVIRONMENT */}
              {activeTab === "environment" && (
                <div className="space-y-4 animate-fadeIn">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                      Background CSS Gradient
                    </label>
                    <Input
                      value={activeScene.environment.backgroundGradient}
                      onChange={(e) =>
                        handleUpdateActiveScene({
                          environment: {
                            ...activeScene.environment,
                            backgroundGradient: e.target.value,
                          },
                        })
                      }
                      className="bg-slate-950 border-slate-800 text-xs text-white font-mono"
                      placeholder="e.g. from-slate-950 via-purple-950 to-slate-900"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                        Particles Preset
                      </label>
                      <select
                        value={activeScene.environment.particlesPreset || "none"}
                        onChange={(e) =>
                          handleUpdateActiveScene({
                            environment: {
                              ...activeScene.environment,
                              particlesPreset: e.target.value as any,
                            },
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white capitalize"
                      >
                        {["none", "stars", "confetti", "balloons", "snow", "fireflies", "hearts"].map(
                          (p) => (
                            <option key={p} value={p}>
                              {p}
                            </option>
                          )
                        )}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                        Fog Density (0 - 0.1)
                      </label>
                      <Input
                        type="number"
                        step="0.01"
                        value={activeScene.environment.fogDensity || 0.02}
                        onChange={(e) =>
                          handleUpdateActiveScene({
                            environment: {
                              ...activeScene.environment,
                              fogDensity: parseFloat(e.target.value),
                            },
                          })
                        }
                        className="bg-slate-950 border-slate-800 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: CAMERA CONTROLS */}
              {activeTab === "camera" && (
                <div className="space-y-4 animate-fadeIn">
                  <p className="text-xs text-slate-400">
                    Controls 3D perspective viewport, position coordinates, FOV, and shake parameters.
                  </p>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                      Camera Position [X, Y, Z]
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[0, 1, 2].map((axisIdx) => (
                        <Input
                          key={axisIdx}
                          type="number"
                          step="0.5"
                          value={activeScene.camera.position[axisIdx]}
                          onChange={(e) => {
                            const newPos = [...activeScene.camera.position] as [number, number, number];
                            newPos[axisIdx] = parseFloat(e.target.value);
                            handleUpdateActiveScene({
                              camera: { ...activeScene.camera, position: newPos },
                            });
                          }}
                          className="bg-slate-950 border-slate-800 text-xs text-white text-center font-mono"
                        />
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                        Field of View (FOV)
                      </label>
                      <Input
                        type="number"
                        value={activeScene.camera.fov}
                        onChange={(e) =>
                          handleUpdateActiveScene({
                            camera: {
                              ...activeScene.camera,
                              fov: parseInt(e.target.value) || 50,
                            },
                          })
                        }
                        className="bg-slate-950 border-slate-800 text-xs text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                        Orbit Controls Enabled
                      </label>
                      <button
                        onClick={() =>
                          handleUpdateActiveScene({
                            camera: {
                              ...activeScene.camera,
                              allowOrbit: !activeScene.camera.allowOrbit,
                            },
                          })
                        }
                        className={`w-full py-2 px-3 rounded-xl border text-xs font-bold transition-colors ${
                          activeScene.camera.allowOrbit
                            ? "bg-purple-600 border-purple-500 text-white"
                            : "bg-slate-950 border-slate-800 text-slate-400"
                        }`}
                      >
                        {activeScene.camera.allowOrbit ? "Orbit Allowed" : "Fixed Angle"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: LIGHTING CONTROLS */}
              {activeTab === "lighting" && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                        Ambient Light Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={activeScene.lighting.ambientColor}
                          onChange={(e) =>
                            handleUpdateActiveScene({
                              lighting: {
                                ...activeScene.lighting,
                                ambientColor: e.target.value,
                              },
                            })
                          }
                          className="w-8 h-8 rounded-lg border border-slate-800 bg-transparent cursor-pointer"
                        />
                        <Input
                          value={activeScene.lighting.ambientColor}
                          onChange={(e) =>
                            handleUpdateActiveScene({
                              lighting: {
                                ...activeScene.lighting,
                                ambientColor: e.target.value,
                              },
                            })
                          }
                          className="bg-slate-950 border-slate-800 text-xs text-white font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                        Ambient Intensity ({activeScene.lighting.ambientIntensity})
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="2"
                        step="0.1"
                        value={activeScene.lighting.ambientIntensity}
                        onChange={(e) =>
                          handleUpdateActiveScene({
                            lighting: {
                              ...activeScene.lighting,
                              ambientIntensity: parseFloat(e.target.value),
                            },
                          })
                        }
                        className="w-full accent-purple-500 mt-2"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                      Directional Light Position [X, Y, Z]
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[0, 1, 2].map((idx) => (
                        <Input
                          key={idx}
                          type="number"
                          value={activeScene.lighting.directionalPosition?.[idx] ?? 5}
                          onChange={(e) => {
                            const cur = activeScene.lighting.directionalPosition || [5, 10, 5];
                            const next = [...cur] as [number, number, number];
                            next[idx] = parseFloat(e.target.value);
                            handleUpdateActiveScene({
                              lighting: {
                                ...activeScene.lighting,
                                directionalPosition: next,
                              },
                            });
                          }}
                          className="bg-slate-950 border-slate-800 text-xs text-white text-center font-mono"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: 3D OBJECTS & GEOMETRIES */}
              {activeTab === "objects" && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase">
                      Scene Objects ({activeScene.objects.length})
                    </span>
                    <Button
                      size="sm"
                      onClick={() => {
                        const newObj: SceneObjectModel = {
                          id: `obj_${Date.now()}`,
                          name: `Object ${activeScene.objects.length + 1}`,
                          type: "model3d",
                          transform: {
                            position: [0, 0, 0],
                            rotation: [0, 0, 0],
                            scale: [1, 1, 1],
                          },
                          visible: true,
                          props: { color: "#ec4899" },
                        };
                        handleUpdateActiveScene({
                          objects: [...activeScene.objects, newObj],
                        });
                      }}
                      className="h-7 text-xs bg-purple-600 text-white"
                      leftIcon={<Plus className="w-3 h-3" />}
                    >
                      Add 3D Object
                    </Button>
                  </div>

                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {activeScene.objects.map((obj, oIdx) => (
                      <div
                        key={obj.id}
                        className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between"
                      >
                        <div>
                          <p className="text-xs font-bold text-white">{obj.name}</p>
                          <span className="text-[10px] text-slate-400 uppercase font-mono">
                            {obj.type} • Pos: [{obj.transform.position.join(", ")}]
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              const updated = [...activeScene.objects];
                              updated[oIdx].visible = !updated[oIdx].visible;
                              handleUpdateActiveScene({ objects: updated });
                            }}
                            className={`text-[10px] px-2 py-0.5 rounded ${
                              obj.visible
                                ? "bg-emerald-950/40 text-emerald-400 border border-emerald-800"
                                : "bg-slate-800 text-slate-500"
                            }`}
                          >
                            {obj.visible ? "Visible" : "Hidden"}
                          </button>
                          <button
                            onClick={() => {
                              const updated = activeScene.objects.filter((_, i) => i !== oIdx);
                              handleUpdateActiveScene({ objects: updated });
                            }}
                            className="text-rose-400 hover:text-rose-300 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: TEXT & DYNAMIC VARIABLES */}
              {activeTab === "text" && (
                <div className="space-y-4 animate-fadeIn">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                      Dynamic Template Variables Supported
                    </label>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {["{{recipient_name}}", "{{sender_name}}", "{{message}}"].map((variable) => (
                        <button
                          key={variable}
                          onClick={() => {
                            // Find primary text object or append
                            const textObj = activeScene.objects.find((o) => o.type === "text");
                            if (textObj) {
                              textObj.props.text = `${textObj.props.text || ""} ${variable}`;
                              handleUpdateActiveScene({ objects: [...activeScene.objects] });
                            }
                          }}
                          className="px-2 py-1 rounded-lg bg-purple-950/40 border border-purple-800 text-[11px] font-mono font-bold text-purple-300 hover:bg-purple-900/60 transition-colors"
                        >
                          + {variable}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                      Headline Text Content
                    </label>
                    <Input
                      id="input-scene-text"
                      value={activeScene.objects.find((o) => o.type === "text")?.props?.text || "Hey... I have something for you."}
                      onChange={(e) => {
                        const objs = [...activeScene.objects];
                        let txtObj = objs.find((o) => o.type === "text");
                        if (!txtObj) {
                          txtObj = {
                            id: `txt_${Date.now()}`,
                            name: "Headline Text",
                            type: "text",
                            transform: { position: [0, 2, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
                            visible: true,
                            props: { text: e.target.value },
                          };
                          objs.push(txtObj);
                        } else {
                          txtObj.props.text = e.target.value;
                        }
                        handleUpdateActiveScene({ objects: objs });
                      }}
                      className="bg-slate-950 border-slate-800 text-xs text-white"
                      placeholder="Enter static or {{dynamic_variable}} text..."
                    />
                  </div>
                </div>
              )}

              {/* TAB 6: AUDIO & SFX */}
              {activeTab === "audio" && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                        Soundtrack Preset
                      </label>
                      <select className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white">
                        <option value="happy">Happy Birthday Melodic</option>
                        <option value="magical">Magical Starlight Glissando</option>
                        <option value="party">Celebration Party Synth</option>
                        <option value="sweet">Sweet Acoustic Guitar</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                        Scene SFX Trigger
                      </label>
                      <select className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white">
                        <option value="none">None</option>
                        <option value="pop">Balloon Pop</option>
                        <option value="sparkle">Magical Sparkle</option>
                        <option value="cheer">Party Cheer</option>
                        <option value="whoosh">Whoosh</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 7: TRIGGERS */}
              {activeTab === "triggers" && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase">
                      Interactive Scene Triggers
                    </span>
                    <Button
                      size="sm"
                      onClick={() => {
                        const newTrigger = {
                          id: `trig_${Date.now()}`,
                          type: "tap" as const,
                          actions: [{ id: `act_${Date.now()}`, type: "play_animation" as const }],
                        };
                        handleUpdateActiveScene({
                          triggers: [...(activeScene.triggers || []), newTrigger],
                        });
                      }}
                      className="h-7 text-xs bg-purple-600 text-white"
                      leftIcon={<Plus className="w-3 h-3" />}
                    >
                      Add Trigger
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {(activeScene.triggers || []).map((trig, tIdx) => (
                      <div
                        key={trig.id}
                        className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between"
                      >
                        <div>
                          <p className="text-xs font-bold text-white capitalize">
                            Trigger: {trig.type.replace(/_/g, " ")}
                          </p>
                          <span className="text-[10px] text-purple-400 font-mono">
                            {trig.actions.length} action(s) linked
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            const updated = (activeScene.triggers || []).filter((_, i) => i !== tIdx);
                            handleUpdateActiveScene({ triggers: updated });
                          }}
                          className="text-rose-400 hover:text-rose-300 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Live Preview Panel (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <Card className="bg-slate-900/80 border-slate-800 overflow-hidden">
              <CardHeader className="p-4 border-b border-slate-800 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-purple-400" />
                  <CardTitle className="text-xs font-bold text-white uppercase tracking-wider">
                    Live Scene Viewport
                  </CardTitle>
                </div>
                <Badge variant="outline" size="sm" className="text-[10px] text-purple-300 border-purple-700">
                  Scene #{selectedSceneIndex + 1}
                </Badge>
              </CardHeader>

              {/* Viewport Box */}
              <div className="relative aspect-[4/3] bg-black overflow-hidden">
                {currentTemplate && currentTemplate.versions?.[0] ? (
                  <ExperiencePlayer
                    template={currentTemplate}
                    version={currentTemplate.versions[0]}
                    scenes={[activeScene]}
                    personalization={{
                      recipient_name: "Maya",
                      sender_name: "Alex",
                      message: "Happy Birthday! May your year be magical!",
                    }}
                    showCreatorControls={false}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
                    Scene preview unavailable
                  </div>
                )}
              </div>

              <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>Viewport: Interactive Three.js Preview</span>
                <span className="font-mono text-slate-500">FOV: {activeScene.camera.fov}°</span>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminSceneBuilderPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-slate-400">Loading Visual Scene Builder...</div>}>
      <SceneBuilderContent />
    </React.Suspense>
  );
}
