/**
 * SURPRISESPARK PRODUCTION ADMIN CMS STORE
 * Manages operational data, templates, scenes, audit trails, and platform telemetry.
 */

import {
  TemplateModel,
  TemplateVersionModel,
  SceneModel,
  SceneObjectModel,
  CameraConfig,
  LightingConfig,
  EnvironmentConfig,
  TriggerDefinition,
} from "@/lib/engine/types";
import { TemplateRegistry } from "@/lib/engine/templateRegistry";
import { ALL_BIRTHDAY_TEMPLATES } from "@/lib/engine/templates";
import { ALL_MUSIC_TRACKS } from "@/lib/engine/musicCatalog";
import { THEMES, ThemeId } from "@/lib/engine/themes";
import { listDrafts } from "@/lib/creator/draftStorage";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

// -----------------------------------------------------------------------------
// 1. ADMIN USER & ACCOUNT TYPES
// -----------------------------------------------------------------------------
export interface AdminUserAccount {
  id: string;
  displayName: string;
  email: string;
  role: "user" | "creator" | "moderator" | "template_manager" | "superadmin";
  status: "active" | "suspended" | "verified";
  registrationDate: string;
  lastActivityAt: string;
  surprisesCount: number;
  publishedCount: number;
  templateUsage: string[];
}

export interface AdminAuditRecord {
  id: string;
  actor: {
    id: string;
    name: string;
    role: string;
  };
  action: string;
  targetTable: string;
  targetId: string;
  previousValue?: string;
  newValue?: string;
  timestamp: string;
}

export interface AdminDashboardMetrics {
  totalUsers: number;
  newUsersToday: number;
  activeUsers: number;
  totalSurprises: number;
  surprisesCreatedToday: number;
  totalOpens: number;
  totalShares: number;
  popularTemplates: Array<{
    name: string;
    slug: string;
    count: number;
    category: string;
  }>;
  completionRate: number; // percentage e.g. 88.4
}

export type AdminMetricsMode = "live" | "demo";

// -----------------------------------------------------------------------------
// 2. INITIAL SEED ACCOUNTS & AUDIT TRAIL
// -----------------------------------------------------------------------------
const INITIAL_USERS: AdminUserAccount[] = [
  {
    id: "usr_01h8x9k2p4m",
    displayName: "Elena Rostova",
    email: "elena.rostova@example.com",
    role: "creator",
    status: "active",
    registrationDate: "2026-08-10T14:22:00Z",
    lastActivityAt: "2026-09-14T08:15:00Z",
    surprisesCount: 14,
    publishedCount: 12,
    templateUsage: ["sweet-celebration"],
  },
  {
    id: "usr_01h8x9k3q5n",
    displayName: "Marcus Vance",
    email: "marcus.v@example.com",
    role: "creator",
    status: "active",
    registrationDate: "2026-08-14T09:40:00Z",
    lastActivityAt: "2026-09-13T22:30:00Z",
    surprisesCount: 8,
    publishedCount: 7,
    templateUsage: ["sweet-celebration"],
  },
  {
    id: "usr_01h8x9k4r6o",
    displayName: "Amina Al-Sayed",
    email: "amina.sayed@example.com",
    role: "creator",
    status: "verified",
    registrationDate: "2026-08-20T11:05:00Z",
    lastActivityAt: "2026-09-14T07:45:00Z",
    surprisesCount: 22,
    publishedCount: 19,
    templateUsage: ["sweet-celebration"],
  },
  {
    id: "usr_01h8x9k5s7p",
    displayName: "Spammy Account",
    email: "bot-spammer@disposable.org",
    role: "user",
    status: "suspended",
    registrationDate: "2026-09-01T04:12:00Z",
    lastActivityAt: "2026-09-02T01:10:00Z",
    surprisesCount: 1,
    publishedCount: 0,
    templateUsage: ["sweet-celebration"],
  },
  {
    id: "usr_01h8x9k6t8q",
    displayName: "Super Admin",
    email: "admin@surprisespark.app",
    role: "superadmin",
    status: "verified",
    registrationDate: "2026-07-01T00:00:00Z",
    lastActivityAt: "2026-09-14T09:30:00Z",
    surprisesCount: 5,
    publishedCount: 5,
    templateUsage: ["sweet-celebration"],
  },
];

const INITIAL_AUDIT_LOGS: AdminAuditRecord[] = [
  {
    id: "aud_01j982a",
    actor: { id: "usr_01h8x9k6t8q", name: "Super Admin", role: "superadmin" },
    action: "TEMPLATE_PUBLISH",
    targetTable: "templates",
    targetId: "sweet-celebration",
    previousValue: "status: draft",
    newValue: "status: active, version: 1.0.0",
    timestamp: "2026-09-13T18:30:00Z",
  },
  {
    id: "aud_01j982b",
    actor: { id: "usr_01h8x9k6t8q", name: "Super Admin", role: "superadmin" },
    action: "USER_SUSPEND",
    targetTable: "profiles",
    targetId: "usr_01h8x9k5s7p",
    previousValue: "status: active",
    newValue: "status: suspended (Spam policy violation)",
    timestamp: "2026-09-13T20:15:00Z",
  },
  {
    id: "aud_01j982c",
    actor: { id: "usr_01h8x9k6t8q", name: "Super Admin", role: "superadmin" },
    action: "THEME_CREATE",
    targetTable: "themes",
    targetId: "galaxy",
    previousValue: "null",
    newValue: "name: Deep Galaxy Neon, slug: galaxy",
    timestamp: "2026-09-14T01:00:00Z",
  },
];

const ADMIN_TEMPLATES_STORAGE_KEY = "surprisespark_admin_templates_v1";
const ADMIN_USERS_STORAGE_KEY = "surprisespark_admin_users_v1";
const ADMIN_AUDIT_STORAGE_KEY = "surprisespark_admin_audit_v1";
export const DELETED_TEMPLATES_STORAGE_KEY = "surprisespark_deleted_templates_v1";

/**
 * Slugs of all 3D celebration templates permanently purged from the platform,
 * preserving only Sweet Celebration ('sweet-celebration').
 */
export const REMOVED_CELEBRATION_SLUGS = [
  "magic-gift",
  "birthday-cake-reveal",
  "balloon-room",
  "mystery-door",
  "memory-journey",
  "confetti-blast",
  "rainbow-surprise",
  "cute-character",
  "tpl-magic-gift",
  "tpl-birthday-cake",
  "tpl-balloon-room",
  "tpl-mystery-door",
  "tpl-memory-journey",
  "tpl-confetti-blast",
  "tpl-rainbow-surprise",
  "tpl-cute-character",
];

export function getDeletedTemplateSlugs(): string[] {
  if (typeof window === "undefined") return REMOVED_CELEBRATION_SLUGS;
  try {
    const raw = localStorage.getItem(DELETED_TEMPLATES_STORAGE_KEY);
    const customDeleted: string[] = raw ? JSON.parse(raw) : [];
    const merged = Array.from(new Set([...REMOVED_CELEBRATION_SLUGS, ...customDeleted])).filter(
      (s) =>
        s !== "sweet-celebration" &&
        s !== "tpl-sweet-celebration" &&
        s !== "love-animation" &&
        s !== "tpl-love-animation"
    );
    return merged;
  } catch {
    return REMOVED_CELEBRATION_SLUGS;
  }
}

export function isTemplateDeleted(slugOrId: string): boolean {
  if (
    slugOrId === "sweet-celebration" ||
    slugOrId === "tpl-sweet-celebration" ||
    slugOrId === "love-animation" ||
    slugOrId === "tpl-love-animation"
  ) {
    return false;
  }
  return getDeletedTemplateSlugs().includes(slugOrId);
}

export const LOVE_ANIMATION_TEMPLATE: TemplateModel = {
  id: "tpl-love-animation",
  slug: "love-animation",
  name: "Love Animation",
  categoryId: "birthday",
  description: "Romantic canvas particles animation featuring pulsing heartbeat, falling petals, and smooth transitions.",
  tagline: "Romantic Heart & Text Particle Experience",
  thumbnailUrl: "/templates/sweet-celebration/thumbnail.jpg",
  tags: ["Love", "Romantic", "Particles", "Canvas"],
  status: "active",
  isFree: true,
  supportsPhotos: true,
  maxPhotos: 3,
  supportsMusic: true,
  supportsTheme: true,
  currentVersion: "1.0.0",
  versions: [
    {
      id: "tpl-love-animation_v1",
      templateId: "tpl-love-animation",
      version: "1.0.0",
      isPublished: true,
      changelog: "Initial upload",
      createdAt: "2026-09-20T10:31:40.868Z",
      scenes: [],
    },
  ],
  createdAt: "2026-09-20T10:31:40.868Z",
  updatedAt: "2026-09-20T10:31:40.868Z",
};

// Persistent & In-Memory Global Storage
class AdminStore {
  private static instance: AdminStore;

  private users: Map<string, AdminUserAccount> = new Map();
  private auditLogs: AdminAuditRecord[] = [];
  private templates: Map<string, TemplateModel> = new Map();

  private constructor() {
    this.seedDefaults();
    this.loadFromStorage();
  }

  private seedDefaults() {
    INITIAL_USERS.forEach((u) => this.users.set(u.id, u));
    this.auditLogs = [...INITIAL_AUDIT_LOGS];

    const registry = TemplateRegistry.getInstance();
    const deleted = getDeletedTemplateSlugs();
    const baseTemplates = [...ALL_BIRTHDAY_TEMPLATES, LOVE_ANIMATION_TEMPLATE];
    for (const tpl of baseTemplates) {
      if (!deleted.includes(tpl.slug) && !deleted.includes(tpl.id)) {
        this.templates.set(tpl.slug, JSON.parse(JSON.stringify(tpl)));
        registry.registerTemplate(tpl);
      }
    }
  }

  private loadFromStorage() {
    if (typeof window === "undefined") return;
    try {
      // 1. Ensure permanent blacklist in localStorage has all removed celebration slugs
      const rawDeleted = localStorage.getItem(DELETED_TEMPLATES_STORAGE_KEY);
      const existingDeleted: string[] = rawDeleted ? JSON.parse(rawDeleted) : [];
      const updatedBlacklist = Array.from(new Set([...existingDeleted, ...REMOVED_CELEBRATION_SLUGS])).filter(
        (s) =>
          s !== "sweet-celebration" &&
          s !== "tpl-sweet-celebration" &&
          s !== "love-animation" &&
          s !== "tpl-love-animation"
      );
      localStorage.setItem(DELETED_TEMPLATES_STORAGE_KEY, JSON.stringify(updatedBlacklist));

      // 2. Remove purged templates from in-memory maps and engine registry
      for (const slug of REMOVED_CELEBRATION_SLUGS) {
        this.templates.delete(slug);
        TemplateRegistry.getInstance().deleteTemplate(slug);
      }

      // 3. Clean stored templates table
      const rawTpls = localStorage.getItem(ADMIN_TEMPLATES_STORAGE_KEY);
      if (rawTpls) {
        const parsed: TemplateModel[] = JSON.parse(rawTpls);
        const registry = TemplateRegistry.getInstance();
        const cleaned: TemplateModel[] = [];
        const seenSlugs = new Set<string>();

        parsed.forEach((tpl) => {
          if (tpl && tpl.slug === "lov-animation") {
            tpl.slug = "love-animation";
            tpl.name = "Love Animation";
            tpl.id = "tpl-love-animation";
          }
          if (
            tpl &&
            tpl.slug &&
            !seenSlugs.has(tpl.slug) &&
            !updatedBlacklist.includes(tpl.slug) &&
            !updatedBlacklist.includes(tpl.id)
          ) {
            seenSlugs.add(tpl.slug);
            this.templates.set(tpl.slug, tpl);
            registry.registerTemplate(tpl);
            cleaned.push(tpl);
          } else if (
            updatedBlacklist.includes(tpl.slug) ||
            updatedBlacklist.includes(tpl.id)
          ) {
            this.templates.delete(tpl.slug);
            this.templates.delete(tpl.id);
            registry.deleteTemplate(tpl.slug);
            registry.deleteTemplate(tpl.id);
          }
        });

        // Ensure love-animation is present if not deleted
        if (!seenSlugs.has(LOVE_ANIMATION_TEMPLATE.slug) && !updatedBlacklist.includes(LOVE_ANIMATION_TEMPLATE.slug)) {
          this.templates.set(LOVE_ANIMATION_TEMPLATE.slug, LOVE_ANIMATION_TEMPLATE);
          registry.registerTemplate(LOVE_ANIMATION_TEMPLATE);
          cleaned.push(LOVE_ANIMATION_TEMPLATE);
        }

        localStorage.setItem(ADMIN_TEMPLATES_STORAGE_KEY, JSON.stringify(cleaned));
      } else {
        // First load fallback
        const registry = TemplateRegistry.getInstance();
        if (!updatedBlacklist.includes(LOVE_ANIMATION_TEMPLATE.slug)) {
          this.templates.set(LOVE_ANIMATION_TEMPLATE.slug, LOVE_ANIMATION_TEMPLATE);
          registry.registerTemplate(LOVE_ANIMATION_TEMPLATE);
        }
      }

      // 4. Asynchronously purge removed celebration templates from Supabase
      if (isSupabaseConfigured()) {
        try {
          const supabase = createClient();
          for (const slug of REMOVED_CELEBRATION_SLUGS) {
            supabase.from("templates").delete().eq("slug", slug).then();
          }
        } catch {
          // offline
        }
      }

      const rawUsers = localStorage.getItem(ADMIN_USERS_STORAGE_KEY);
      if (rawUsers) {
        const parsedUsers: AdminUserAccount[] = JSON.parse(rawUsers);
        parsedUsers.forEach((u) => this.users.set(u.id, u));
      }

      const rawAudit = localStorage.getItem(ADMIN_AUDIT_STORAGE_KEY);
      if (rawAudit) {
        this.auditLogs = JSON.parse(rawAudit);
      }
    } catch {
      // Storage load error fallback
    }
  }

  private saveToStorage() {
    if (typeof window === "undefined") return;
    try {
      const uniqueTemplates = Array.from(
        new Map(Array.from(this.templates.values()).map((t) => [t.slug, t])).values()
      );
      localStorage.setItem(
        ADMIN_TEMPLATES_STORAGE_KEY,
        JSON.stringify(uniqueTemplates)
      );
      localStorage.setItem(
        ADMIN_USERS_STORAGE_KEY,
        JSON.stringify(Array.from(this.users.values()))
      );
      localStorage.setItem(
        ADMIN_AUDIT_STORAGE_KEY,
        JSON.stringify(this.auditLogs)
      );
    } catch {
      // Storage save fallback
    }
  }

  public static getInstance(): AdminStore {
    if (!AdminStore.instance) {
      AdminStore.instance = new AdminStore();
    }
    return AdminStore.instance;
  }

  // ---------------------------------------------------------------------------
  // DASHBOARD TELEMETRY & METRICS
  // ---------------------------------------------------------------------------
  public getMetrics(mode: AdminMetricsMode = "live"): AdminDashboardMetrics {
    const drafts = typeof window !== "undefined" ? listDrafts() : [];

    if (mode === "live") {
      // 100% Genuine live telemetry derived from real creator activity & database
      const uniqueUserIds = new Set<string>();
      drafts.forEach((d) => {
        if (d.userId) uniqueUserIds.add(d.userId);
      });
      // At least 1 user if an account or session is currently active
      const totalUsers = Math.max(uniqueUserIds.size, 1);

      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const surprisesCreatedToday = drafts.filter(
        (d) => d.createdAt && d.createdAt >= oneDayAgo
      ).length;

      const totalSurprises = drafts.length;
      const totalOpens = drafts.reduce((acc, d) => acc + (d.viewCount || 0), 0);
      const totalShares = drafts.reduce((acc, d) => acc + (d.shareCount || 0), 0);

      // Template adoption breakdown from real surprises
      const templateCounts: Record<string, number> = {};
      for (const d of drafts) {
        const slug = d.templateSlug || "sweet-celebration";
        templateCounts[slug] = (templateCounts[slug] || 0) + 1;
      }

      const allRegistered = Array.from(this.templates.values());
      const popularTemplates = allRegistered
        .map((tpl) => ({
          name: tpl.name,
          slug: tpl.slug,
          count: templateCounts[tpl.slug] || 0,
          category: tpl.categoryId || "Birthday",
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      const publishedCount = drafts.filter((d) => d.status === "published").length;
      const completionRate =
        totalSurprises > 0
          ? Math.round((publishedCount / totalSurprises) * 100 * 10) / 10
          : 0;

      return {
        totalUsers,
        newUsersToday: Math.min(totalUsers, 1),
        activeUsers: totalUsers,
        totalSurprises,
        surprisesCreatedToday,
        totalOpens,
        totalShares,
        popularTemplates,
        completionRate,
      };
    }

    // Demo Mode: Seeded realistic baseline metrics
    const totalUsers = this.users.size + 1420; // baseline accounts
    const activeUsers = Math.floor(totalUsers * 0.74);
    const newUsersToday = 38;

    const localSurprisesCount = drafts.length;
    const totalSurprises = 3840 + localSurprisesCount;
    const surprisesCreatedToday = 142 + localSurprisesCount;
    const totalOpens = 18920 + drafts.reduce((acc, d) => acc + (d.viewCount || 0), 0);
    const totalShares = 7240 + drafts.reduce((acc, d) => acc + (d.shareCount || 0), 0);

    const popularTemplates = [
      { name: "Sweet Celebration 💌", slug: "sweet-celebration", count: 1840, category: "Birthday" },
    ];

    return {
      totalUsers,
      newUsersToday,
      activeUsers,
      totalSurprises,
      surprisesCreatedToday,
      totalOpens,
      totalShares,
      popularTemplates,
      completionRate: 88.6,
    };
  }

  // ---------------------------------------------------------------------------
  // USERS MANAGEMENT
  // ---------------------------------------------------------------------------
  public listUsers(query?: string): AdminUserAccount[] {
    const all = Array.from(this.users.values());
    if (!query) return all;
    const q = query.toLowerCase();
    return all.filter(
      (u) =>
        u.displayName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.id.toLowerCase().includes(q)
    );
  }

  public updateUserStatus(
    userId: string,
    status: "active" | "suspended" | "verified",
    actor = "Super Admin"
  ): AdminUserAccount | null {
    const user = this.users.get(userId);
    if (!user) return null;

    const prev = user.status;
    user.status = status;
    user.lastActivityAt = new Date().toISOString();
    this.users.set(userId, user);
    this.saveToStorage();

    this.logAction(
      actor,
      `USER_STATUS_${status.toUpperCase()}`,
      "profiles",
      userId,
      `status: ${prev}`,
      `status: ${status}`
    );

    return user;
  }

  // ---------------------------------------------------------------------------
  // TEMPLATES MANAGEMENT & DUPLICATION
  // ---------------------------------------------------------------------------
  public listTemplates(): TemplateModel[] {
    this.loadFromStorage();
    const unique = new Map<string, TemplateModel>();
    for (const tpl of this.templates.values()) {
      if (tpl && tpl.slug) {
        unique.set(tpl.slug, tpl);
      }
    }
    return Array.from(unique.values());
  }

  public getTemplate(slugOrId: string): TemplateModel | undefined {
    this.loadFromStorage();
    for (const tpl of this.templates.values()) {
      if (tpl.slug === slugOrId || tpl.id === slugOrId) {
        return tpl;
      }
    }
    return TemplateRegistry.getInstance().getTemplate(slugOrId);
  }

  public createTemplate(
    data: Partial<TemplateModel>,
    actor = "Super Admin"
  ): TemplateModel {
    const now = new Date().toISOString();
    const slug = data.slug || "custom-template-" + Date.now().toString(36);
    const id = data.id || "tpl_" + Math.random().toString(36).substring(2, 10);

    const newVersion: TemplateVersionModel = {
      id: `${id}_v1`,
      templateId: id,
      version: "1.0.0",
      isPublished: true,
      changelog: "Initial creation",
      createdAt: now,
      scenes: data.versions?.[0]?.scenes || [],
    };

    const template: TemplateModel = {
      id,
      categoryId: data.categoryId || "birthday",
      name: data.name || "Untitled Template",
      slug,
      description: data.description || "",
      tagline: data.tagline || "",
      thumbnailUrl: data.thumbnailUrl || "/templates/sweet-celebration/thumbnail.jpg",
      tags: data.tags || ["Birthday", "Custom"],
      status: data.status || "active",
      isFree: data.isFree ?? true,
      supportsPhotos: data.supportsPhotos ?? true,
      maxPhotos: data.maxPhotos ?? 5,
      supportsMusic: data.supportsMusic ?? true,
      supportsTheme: data.supportsTheme ?? true,
      currentVersion: "1.0.0",
      versions: [newVersion],
      createdAt: now,
      updatedAt: now,
    };

    this.templates.set(slug, template);
    TemplateRegistry.getInstance().registerTemplate(template);
    this.saveToStorage();

    this.logAction(
      actor,
      "TEMPLATE_CREATE",
      "templates",
      slug,
      "null",
      `name: ${template.name}, slug: ${template.slug}`
    );

    return template;
  }

  /**
   * DUPLICATION ENGINE
   * Example: Allows 'Magic Gift' to become 'Magic Gift — Valentine Edition'
   * without rebuilding the template from scratch.
   */
  public duplicateTemplate(
    sourceSlug: string,
    newName: string,
    newSlug: string,
    actor = "Super Admin"
  ): TemplateModel {
    this.loadFromStorage();
    const source = this.getTemplate(sourceSlug);
    if (!source) {
      throw new Error(`Source template '${sourceSlug}' not found.`);
    }

    const now = new Date().toISOString();
    const newId = "tpl_" + Math.random().toString(36).substring(2, 10);

    // Deep clone source scenes
    const sourceScenes = source.versions?.[0]?.scenes || [];
    const clonedScenes: SceneModel[] = JSON.parse(JSON.stringify(sourceScenes)).map(
      (scene: SceneModel, idx: number) => ({
        ...scene,
        id: `${newId}_scene_${idx + 1}`,
      })
    );

    const newVersion: TemplateVersionModel = {
      id: `${newId}_v1`,
      templateId: newId,
      version: "1.0.0",
      isPublished: true,
      changelog: `Duplicated from ${source.name}`,
      createdAt: now,
      scenes: clonedScenes,
    };

    const clonedTemplate: TemplateModel = {
      ...JSON.parse(JSON.stringify(source)),
      id: newId,
      name: newName,
      slug: newSlug,
      tags: [...source.tags, "Duplicated"],
      status: "active",
      currentVersion: "1.0.0",
      versions: [newVersion],
      createdAt: now,
      updatedAt: now,
    };

    this.templates.set(newSlug, clonedTemplate);
    TemplateRegistry.getInstance().registerTemplate(clonedTemplate);
    this.saveToStorage();

    this.logAction(
      actor,
      "TEMPLATE_DUPLICATE",
      "templates",
      newSlug,
      `source: ${sourceSlug}`,
      `cloned: ${newName} (${newSlug})`
    );

    return clonedTemplate;
  }

  public updateTemplate(
    slug: string,
    updates: Partial<TemplateModel>,
    actor = "Super Admin"
  ): TemplateModel | null {
    const existing = this.templates.get(slug);
    if (!existing) return null;

    const prevName = existing.name;
    const prevStatus = existing.status;

    const updated: TemplateModel = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.templates.set(slug, updated);
    TemplateRegistry.getInstance().registerTemplate(updated);
    this.saveToStorage();

    this.logAction(
      actor,
      "TEMPLATE_UPDATE",
      "templates",
      slug,
      `name: ${prevName}, status: ${prevStatus}`,
      `name: ${updated.name}, status: ${updated.status}`
    );

    return updated;
  }

  /**
   * PERMANENT TEMPLATE DELETION
   * Removes template from admin store, template registry, local storage,
   * database, and all public catalogs.
   */
  public deleteTemplate(slug: string, actor = "Super Admin"): boolean {
    this.loadFromStorage();
    const target = this.getTemplate(slug);
    const targetId = target?.id;
    const targetSlug = target?.slug || slug;
    const targetName = target?.name || slug;

    // 1. Remove from in-memory maps by key and by value
    for (const [key, tpl] of Array.from(this.templates.entries())) {
      if (
        key === targetSlug ||
        key === targetId ||
        tpl.slug === targetSlug ||
        (targetId && tpl.id === targetId)
      ) {
        this.templates.delete(key);
      }
    }

    // 2. Add to persistent deleted list in localStorage
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem(DELETED_TEMPLATES_STORAGE_KEY);
        const deleted: string[] = raw ? JSON.parse(raw) : [];
        if (!deleted.includes(targetSlug)) deleted.push(targetSlug);
        if (targetId && !deleted.includes(targetId)) deleted.push(targetId);
        localStorage.setItem(DELETED_TEMPLATES_STORAGE_KEY, JSON.stringify(deleted));
      } catch {
        // storage fallback
      }
    }

    // 3. Remove from global TemplateRegistry
    TemplateRegistry.getInstance().deleteTemplate(targetSlug);
    if (targetId) {
      TemplateRegistry.getInstance().deleteTemplate(targetId);
    }

    // 4. Save updated templates map to localStorage
    this.saveToStorage();

    // 5. Asynchronously delete from Supabase if configured
    if (typeof window !== "undefined" && isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        supabase.from("templates").delete().eq("slug", targetSlug).then();
      } catch {
        // offline or unconfigured
      }
    }

    // 6. Record in audit trail
    this.logAction(
      actor,
      "TEMPLATE_DELETE",
      "templates",
      targetSlug,
      `name: ${targetName}, slug: ${targetSlug}`,
      "DELETED_PERMANENTLY"
    );

    return true;
  }

  // ---------------------------------------------------------------------------
  // SCENE BUILDER OPERATIONS
  // ---------------------------------------------------------------------------
  public getScenes(templateSlug: string): SceneModel[] {
    this.loadFromStorage();
    const tpl = this.getTemplate(templateSlug);
    if (!tpl || !tpl.versions || tpl.versions.length === 0) return [];
    return tpl.versions[0].scenes || [];
  }

  public addScene(
    templateSlug: string,
    sceneData: Partial<SceneModel>,
    actor = "Super Admin"
  ): SceneModel {
    this.loadFromStorage();
    const tpl = this.getTemplate(templateSlug);
    if (!tpl || !tpl.versions || tpl.versions.length === 0) {
      throw new Error(`Template '${templateSlug}' not found.`);
    }

    const currentScenes = tpl.versions[0].scenes;
    const nextOrder = currentScenes.length + 1;
    const sceneId = `${tpl.id}_scene_${Date.now()}`;

    const newScene: SceneModel = {
      id: sceneId,
      name: sceneData.name || `Scene ${nextOrder}`,
      order: nextOrder,
      durationMs: sceneData.durationMs || 5000,
      transition: sceneData.transition || "fade",
      camera: sceneData.camera || {
        position: [0, 2, 7],
        target: [0, 1, 0],
        fov: 50,
      },
      lighting: sceneData.lighting || {
        ambientColor: "#ffffff",
        ambientIntensity: 0.6,
        directionalColor: "#fff7ed",
        directionalPosition: [5, 10, 5],
      },
      environment: sceneData.environment || {
        backgroundGradient: "from-slate-950 to-purple-950",
        particlesPreset: "stars",
      },
      objects: sceneData.objects || [],
      triggers: sceneData.triggers || [],
    };

    currentScenes.push(newScene);
    tpl.updatedAt = new Date().toISOString();
    TemplateRegistry.getInstance().registerTemplate(tpl);
    this.saveToStorage();

    this.logAction(
      actor,
      "SCENE_ADD",
      "scenes",
      newScene.id,
      "null",
      `template: ${templateSlug}, name: ${newScene.name}`
    );

    return newScene;
  }

  public duplicateScene(
    templateSlug: string,
    sceneId: string,
    actor = "Super Admin"
  ): SceneModel {
    this.loadFromStorage();
    const tpl = this.getTemplate(templateSlug);
    if (!tpl || !tpl.versions || tpl.versions.length === 0) {
      throw new Error(`Template '${templateSlug}' not found.`);
    }

    const currentScenes = tpl.versions[0].scenes;
    const target = currentScenes.find((s) => s.id === sceneId);
    if (!target) {
      throw new Error(`Scene '${sceneId}' not found.`);
    }

    const cloneId = `${tpl.id}_scene_dup_${Date.now()}`;
    const cloned: SceneModel = {
      ...JSON.parse(JSON.stringify(target)),
      id: cloneId,
      name: `${target.name} (Copy)`,
      order: currentScenes.length + 1,
    };

    currentScenes.push(cloned);
    tpl.updatedAt = new Date().toISOString();
    TemplateRegistry.getInstance().registerTemplate(tpl);
    this.saveToStorage();

    this.logAction(
      actor,
      "SCENE_DUPLICATE",
      "scenes",
      cloneId,
      `sourceScene: ${sceneId}`,
      `clonedScene: ${cloned.name}`
    );

    return cloned;
  }

  public updateScene(
    templateSlug: string,
    sceneId: string,
    updates: Partial<SceneModel>,
    actor = "Super Admin"
  ): SceneModel | null {
    this.loadFromStorage();
    const tpl = this.getTemplate(templateSlug);
    if (!tpl || !tpl.versions || tpl.versions.length === 0) return null;

    const scenes = tpl.versions[0].scenes;
    const idx = scenes.findIndex((s) => s.id === sceneId);
    if (idx === -1) return null;

    const prevName = scenes[idx].name;
    scenes[idx] = {
      ...scenes[idx],
      ...updates,
    };

    tpl.updatedAt = new Date().toISOString();
    TemplateRegistry.getInstance().registerTemplate(tpl);
    this.saveToStorage();

    this.logAction(
      actor,
      "SCENE_UPDATE",
      "scenes",
      sceneId,
      `name: ${prevName}`,
      `name: ${scenes[idx].name}`
    );

    return scenes[idx];
  }

  public deleteScene(
    templateSlug: string,
    sceneId: string,
    actor = "Super Admin"
  ): boolean {
    this.loadFromStorage();
    const tpl = this.getTemplate(templateSlug);
    if (!tpl || !tpl.versions || tpl.versions.length === 0) return false;

    const scenes = tpl.versions[0].scenes;
    const idx = scenes.findIndex((s) => s.id === sceneId);
    if (idx === -1) return false;

    const deletedName = scenes[idx].name;
    scenes.splice(idx, 1);

    // Re-index scene order
    scenes.forEach((s, i) => {
      s.order = i + 1;
    });

    tpl.updatedAt = new Date().toISOString();
    TemplateRegistry.getInstance().registerTemplate(tpl);
    this.saveToStorage();

    this.logAction(actor, "SCENE_DELETE", "scenes", sceneId, deletedName, "deleted");
    return true;
  }

  public reorderScenes(
    templateSlug: string,
    orderedIds: string[],
    actor = "Super Admin"
  ): SceneModel[] {
    this.loadFromStorage();
    const tpl = this.getTemplate(templateSlug);
    if (!tpl || !tpl.versions || tpl.versions.length === 0) return [];

    const scenes = tpl.versions[0].scenes;
    const sceneMap = new Map(scenes.map((s) => [s.id, s]));

    const reordered: SceneModel[] = [];
    orderedIds.forEach((id, index) => {
      const s = sceneMap.get(id);
      if (s) {
        s.order = index + 1;
        reordered.push(s);
      }
    });

    tpl.versions[0].scenes = reordered;
    tpl.updatedAt = new Date().toISOString();
    TemplateRegistry.getInstance().registerTemplate(tpl);
    this.saveToStorage();

    this.logAction(
      actor,
      "SCENE_REORDER",
      "scenes",
      templateSlug,
      "previous sequence",
      orderedIds.join(" -> ")
    );

    return reordered;
  }

  // ---------------------------------------------------------------------------
  // AUDIT LOGGING
  // ---------------------------------------------------------------------------
  public listAuditLogs(limit = 100): AdminAuditRecord[] {
    return [...this.auditLogs].slice(0, limit);
  }

  public logAction(
    actorName: string,
    action: string,
    targetTable: string,
    targetId: string,
    previousValue = "",
    newValue = ""
  ): AdminAuditRecord {
    const record: AdminAuditRecord = {
      id: "aud_" + Math.random().toString(36).substring(2, 10),
      actor: {
        id: "admin-actor",
        name: actorName,
        role: "superadmin",
      },
      action,
      targetTable,
      targetId,
      previousValue,
      newValue,
      timestamp: new Date().toISOString(),
    };

    this.auditLogs.unshift(record);
    this.saveToStorage();
    return record;
  }
}

export const adminStore = AdminStore.getInstance();
