"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Layers,
  Plus,
  Copy,
  Archive,
  CheckCircle2,
  XCircle,
  Eye,
  Edit,
  Sparkles,
  Search,
  Check,
  X,
  Sliders,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { adminStore } from "@/lib/admin/adminStore";
import { TemplateModel } from "@/lib/engine/types";

export default function AdminTemplatesPage() {
  const [templates, setTemplates] = useState<TemplateModel[]>(adminStore.listTemplates());
  const [searchQuery, setSearchQuery] = useState("");
  const [duplicateModalOpen, setDuplicateModalOpen] = useState(false);
  const [selectedTemplateForDup, setSelectedTemplateForDup] = useState<TemplateModel | null>(null);
  const [dupName, setDupName] = useState("");
  const [dupSlug, setDupSlug] = useState("");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedTemplateForDelete, setSelectedTemplateForDelete] = useState<TemplateModel | null>(null);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newTplName, setNewTplName] = useState("");
  const [newTplSlug, setNewTplSlug] = useState("");
  const [newTplDesc, setNewTplDesc] = useState("");
  const [newTplCat, setNewTplCat] = useState("birthday");

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filtered = templates.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.categoryId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openDuplicateModal = (tpl: TemplateModel) => {
    setSelectedTemplateForDup(tpl);
    setDupName(`${tpl.name} — Custom Edition`);
    setDupSlug(`${tpl.slug}-custom`);
    setDuplicateModalOpen(true);
  };

  const handleExecuteDuplicate = () => {
    if (!selectedTemplateForDup || !dupName || !dupSlug) return;
    try {
      const cloned = adminStore.duplicateTemplate(
        selectedTemplateForDup.slug,
        dupName,
        dupSlug
      );
      setTemplates([...adminStore.listTemplates()]);
      setDuplicateModalOpen(false);
      setToastMessage(`Duplicated "${selectedTemplateForDup.name}" into "${cloned.name}" with full scene structure!`);
      setTimeout(() => setToastMessage(null), 5000);
    } catch (err: unknown) {
      alert((err as Error).message);
    }
  };

  const handleCreateTemplate = () => {
    if (!newTplName || !newTplSlug) return;
    try {
      const created = adminStore.createTemplate({
        name: newTplName,
        slug: newTplSlug,
        description: newTplDesc,
        categoryId: newTplCat,
        tags: ["Custom", newTplCat],
      });
      setTemplates([...adminStore.listTemplates()]);
      setCreateModalOpen(false);
      setNewTplName("");
      setNewTplSlug("");
      setNewTplDesc("");
      setToastMessage(`Created template "${created.name}" successfully!`);
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err: unknown) {
      alert((err as Error).message);
    }
  };

  const handleTogglePublish = (tpl: TemplateModel) => {
    const nextStatus = tpl.status === "active" ? "draft" : "active";
    adminStore.updateTemplate(tpl.slug, { status: nextStatus });
    setTemplates([...adminStore.listTemplates()]);
    setToastMessage(`Template "${tpl.name}" status updated to ${nextStatus.toUpperCase()}`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleArchive = (tpl: TemplateModel) => {
    adminStore.updateTemplate(tpl.slug, { status: "archived" });
    setTemplates([...adminStore.listTemplates()]);
    setToastMessage(`Template "${tpl.name}" archived.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const openDeleteModal = (tpl: TemplateModel) => {
    setSelectedTemplateForDelete(tpl);
    setDeleteModalOpen(true);
  };

  const handleExecuteDelete = () => {
    if (!selectedTemplateForDelete) return;
    try {
      const target = selectedTemplateForDelete;
      const success = adminStore.deleteTemplate(target.slug);
      if (success) {
        setTemplates([...adminStore.listTemplates()]);
        setDeleteModalOpen(false);
        setSelectedTemplateForDelete(null);
        setToastMessage(
          `Permanently deleted "${target.name}". Removed from public catalogs, creator wizard, database, and local storage.`
        );
        setTimeout(() => setToastMessage(null), 6000);
      } else {
        alert("Failed to delete template.");
      }
    } catch (err: unknown) {
      alert((err as Error).message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Layers className="w-4 h-4 text-pink-400" />
            <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">
              Template Registry
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Template Management & Duplication
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Publish master templates, duplicate experiences into seasonal editions, and manage version snapshots.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            id="btn-open-create-template"
            size="sm"
            onClick={() => setCreateModalOpen(true)}
            className="text-xs font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            New Template
          </Button>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3 rounded-xl bg-purple-950/80 border border-purple-800 text-purple-200 text-xs font-semibold flex items-center justify-between animate-fadeIn">
          <span>{toastMessage}</span>
          <Button variant="ghost" size="sm" onClick={() => setToastMessage(null)} className="h-5 px-2 text-xs">
            Dismiss
          </Button>
        </div>
      )}

      {/* Search Bar */}
      <Card className="p-4 bg-slate-900/70 border-slate-800">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <Input
            id="input-template-search"
            placeholder="Search templates by name, slug, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-slate-950 border-slate-800 text-xs text-white placeholder:text-slate-600"
          />
        </div>
      </Card>

      {/* Templates Table */}
      <Card className="bg-slate-900/70 border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 border-b border-slate-800 text-[11px] uppercase font-bold text-slate-400">
              <tr>
                <th className="p-4 pl-6">Template & Slug</th>
                <th className="p-4">Category</th>
                <th className="p-4">Version</th>
                <th className="p-4">Scenes</th>
                <th className="p-4">Features</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((tpl) => {
                const sceneCount = tpl.versions?.[0]?.scenes?.length || 0;
                return (
                  <tr key={tpl.slug} id={`template-row-${tpl.slug}`} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 pl-6">
                      <div>
                        <p className="font-bold text-white text-xs">{tpl.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{tpl.slug}</p>
                        <p className="text-[10px] text-slate-500 line-clamp-1 max-w-xs mt-0.5">{tpl.description}</p>
                      </div>
                    </td>
                    <td className="p-4 capitalize">
                      <Badge variant="secondary" size="sm" className="bg-purple-950/40 text-purple-300 border-purple-800/40">
                        {tpl.categoryId}
                      </Badge>
                    </td>
                    <td className="p-4 font-mono font-bold text-slate-300">
                      v{tpl.currentVersion}
                    </td>
                    <td className="p-4 font-bold text-white">
                      {sceneCount} scenes
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {tpl.supportsPhotos && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                            Photos ({tpl.maxPhotos})
                          </span>
                        )}
                        {tpl.supportsMusic && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                            Music
                          </span>
                        )}
                        {tpl.supportsTheme && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                            Themes
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      {tpl.status === "active" && (
                        <Badge variant="success" size="sm">Active</Badge>
                      )}
                      {tpl.status === "draft" && (
                        <Badge variant="warning" size="sm">Draft</Badge>
                      )}
                      {tpl.status === "archived" && (
                        <Badge variant="outline" size="sm" className="text-rose-400 border-rose-800">Archived</Badge>
                      )}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <Link href={`/admin/scenes?template=${tpl.slug}`}>
                          <Button variant="outline" size="sm" className="h-7 px-2 text-xs border-slate-700" title="Configure Scenes">
                            <Sliders className="w-3 h-3 mr-1" /> Scenes
                          </Button>
                        </Link>
                        <Button
                          id={`btn-dup-${tpl.slug}`}
                          variant="secondary"
                          size="sm"
                          onClick={() => openDuplicateModal(tpl)}
                          className="h-7 px-2 text-xs bg-purple-900/40 text-purple-200 hover:bg-purple-800/60"
                          title="Duplicate Template"
                        >
                          <Copy className="w-3 h-3 mr-1" /> Duplicate
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleTogglePublish(tpl)}
                          className="h-7 px-2 text-xs text-slate-400 hover:text-white"
                          title={tpl.status === "active" ? "Unpublish to Draft" : "Publish to Active"}
                        >
                          {tpl.status === "active" ? "Unpublish" : "Publish"}
                        </Button>
                        <Button
                          id={`btn-del-${tpl.slug}`}
                          variant="ghost"
                          size="sm"
                          onClick={() => openDeleteModal(tpl)}
                          className="h-7 px-2 text-xs text-rose-400 hover:text-rose-200 hover:bg-rose-950/40"
                          title="Delete Template Permanently"
                        >
                          <Trash2 className="w-3 h-3 mr-1" /> Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* DUPLICATE MODAL (Required by spec: Magic Gift -> Magic Gift — Valentine Edition) */}
      {duplicateModalOpen && selectedTemplateForDup && (
        <div id="modal-duplicate-template" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <Card className="w-full max-w-md bg-slate-900 border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Copy className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold text-white">Duplicate Template</h3>
              </div>
              <button
                onClick={() => setDuplicateModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Clones the entire scene sequence, 3D object transforms, animations, camera settings, and lighting from{" "}
              <strong className="text-white">{selectedTemplateForDup.name}</strong> without rebuilding from scratch.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                  New Template Name
                </label>
                <Input
                  id="input-dup-name"
                  value={dupName}
                  onChange={(e) => setDupName(e.target.value)}
                  placeholder="e.g. Magic Gift — Valentine Edition"
                  className="bg-slate-950 border-slate-800 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                  New Unique Slug
                </label>
                <Input
                  id="input-dup-slug"
                  value={dupSlug}
                  onChange={(e) => setDupSlug(e.target.value)}
                  placeholder="e.g. magic-gift-valentine"
                  className="bg-slate-950 border-slate-800 text-xs text-white"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDuplicateModalOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                id="btn-confirm-duplicate"
                size="sm"
                onClick={handleExecuteDuplicate}
                className="text-xs font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90"
                leftIcon={<Copy className="w-3.5 h-3.5" />}
              >
                Create Duplicated Edition
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* CREATE NEW TEMPLATE MODAL */}
      {createModalOpen && (
        <div id="modal-create-template" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <Card className="w-full max-w-md bg-slate-900 border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-pink-400" />
                <h3 className="text-sm font-bold text-white">New Master Template</h3>
              </div>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                  Template Name
                </label>
                <Input
                  id="input-create-name"
                  value={newTplName}
                  onChange={(e) => {
                    setNewTplName(e.target.value);
                    if (!newTplSlug) {
                      setNewTplSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                    }
                  }}
                  placeholder="e.g. Starry Anniversary Voyage"
                  className="bg-slate-950 border-slate-800 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                  Unique Slug
                </label>
                <Input
                  id="input-create-slug"
                  value={newTplSlug}
                  onChange={(e) => setNewTplSlug(e.target.value)}
                  placeholder="e.g. starry-anniversary-voyage"
                  className="bg-slate-950 border-slate-800 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                  Category
                </label>
                <select
                  value={newTplCat}
                  onChange={(e) => setNewTplCat(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                >
                  <option value="birthday">Birthday & Celebrations</option>
                  <option value="love">Love</option>
                  <option value="anniversary">Anniversary</option>
                  <option value="friendship">Friendship</option>
                  <option value="proposal">Proposal</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                  Description
                </label>
                <Input
                  value={newTplDesc}
                  onChange={(e) => setNewTplDesc(e.target.value)}
                  placeholder="Short description of the experience..."
                  className="bg-slate-950 border-slate-800 text-xs text-white"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCreateModalOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                id="btn-confirm-create-template"
                size="sm"
                onClick={handleCreateTemplate}
                className="text-xs font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90"
              >
                Create Template
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteModalOpen && selectedTemplateForDelete && (
        <div id="modal-delete-template" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <Card className="w-full max-w-md bg-slate-900 border-rose-900/60 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-rose-400">
                <AlertTriangle className="w-5 h-5 text-rose-500" />
                <h3 className="text-sm font-bold text-white">Delete Template Permanently</h3>
              </div>
              <button
                onClick={() => {
                  setDeleteModalOpen(false);
                  setSelectedTemplateForDelete(null);
                }}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-slate-300 leading-relaxed">
                Are you sure you want to permanently delete{" "}
                <strong className="text-white font-mono bg-slate-800 px-1.5 py-0.5 rounded">
                  {selectedTemplateForDelete.name}
                </strong>{" "}
                <span className="text-slate-400">({selectedTemplateForDelete.slug})</span>?
              </p>

              <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-900/50 space-y-2 text-[11px] text-rose-300">
                <p className="font-semibold text-rose-200">This action will immediately:</p>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  <li>Remove from the <strong>Admin Template Registry</strong> & table</li>
                  <li>Remove from all <strong>Public Interfaces</strong> (/templates, /birthday, homepage)</li>
                  <li>Remove from the <strong>Creator Studio Wizard</strong> (/create)</li>
                  <li>Purge from <strong>Local Storage</strong> and register permanent deletion blacklist</li>
                  <li>Delete from the Supabase <strong>Database</strong> (<code className="text-slate-300">templates</code> table)</li>
                </ul>
              </div>

              <p className="text-[11px] text-slate-400 italic">
                Note: Existing published surprises that reference locked version snapshots will remain playable.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setDeleteModalOpen(false);
                  setSelectedTemplateForDelete(null);
                }}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                id="btn-confirm-delete-template"
                variant="destructive"
                size="sm"
                onClick={handleExecuteDelete}
                className="text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-900/30"
                leftIcon={<Trash2 className="w-3.5 h-3.5" />}
              >
                Delete Everywhere
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
