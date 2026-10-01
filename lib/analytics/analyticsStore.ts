import {
  AnalyticsEvent,
  FunnelStep,
  PlatformGrowthMetrics,
  TemplateAnalytics,
} from "./types";
import { listDrafts } from "@/lib/creator/draftStorage";

export type { PlatformGrowthMetrics };

const STORAGE_KEY_ANALYTICS = "surprisespark_analytics_metrics_v1";

export const INITIAL_TEMPLATE_ANALYTICS: TemplateAnalytics[] = [
  {
    templateId: "the-golden-proposal",
    name: "The Golden Proposal 💍",
    category: "Romantic & Interactive",
    views: 48,
    selections: 16,
    creations: 12,
    completionRate: 100,
    shares: 24,
    popularityScore: 98,
  },
  {
    templateId: "birthday-gift",
    name: "Birthday 3D Gift Box 🎁",
    category: "Birthday & Celebration",
    views: 38,
    selections: 14,
    creations: 10,
    completionRate: 100,
    shares: 20,
    popularityScore: 92,
  },
  {
    templateId: "love-animation",
    name: "Love Animation ❤️",
    category: "Romance & Kinetic",
    views: 32,
    selections: 11,
    creations: 9,
    completionRate: 100,
    shares: 18,
    popularityScore: 88,
  },
  {
    templateId: "whispers-of-love",
    name: "Whispers of Love 💌",
    category: "Storybook Celebration",
    views: 22,
    selections: 8,
    creations: 5,
    completionRate: 100,
    shares: 12,
    popularityScore: 82,
  },
  {
    templateId: "sweet-celebration",
    name: "Sweet Celebration 🎂",
    category: "Interactive Birthday",
    views: 18,
    selections: 6,
    creations: 3,
    completionRate: 100,
    shares: 8,
    popularityScore: 78,
  },
];

export const INITIAL_GROWTH_METRICS: PlatformGrowthMetrics = {
  dau: 6,
  wau: 6,
  mau: 6,
  signups: 6,
  creations: 39,
  publications: 39,
  opens: 128,
  shares: 64,
  replays: 32,
  completionRate: 100,
  editorAbandonmentRate: 0,
  averageLoadTimeMs: 420,
  deviceBreakdown: {
    mobile: 75,
    desktop: 22,
    tablet: 3,
  },
  funnelCounts: {
    signup: 6,
    template_viewed: 78,
    template_selected: 45,
    editor_started: 39,
    draft_saved: 39,
    surprise_published: 39,
    surprise_opened: 128,
    surprise_completed: 120,
    surprise_shared: 64,
  },
  templateAnalytics: [...INITIAL_TEMPLATE_ANALYTICS],
};

class AnalyticsStore {
  private metrics: PlatformGrowthMetrics = { ...INITIAL_GROWTH_METRICS };
  private events: AnalyticsEvent[] = [];

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_ANALYTICS);
        if (saved) {
          this.metrics = JSON.parse(saved);
          return;
        }
      } catch {
        // Fallback
      }
    }
    this.metrics = JSON.parse(JSON.stringify(INITIAL_GROWTH_METRICS));
  }

  private persist() {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY_ANALYTICS, JSON.stringify(this.metrics));
      } catch {
        // Storage fail
      }
    }
  }

  public getMetrics(mode: "live" | "demo" = "live"): PlatformGrowthMetrics {
    if (mode === "demo") {
      return { ...this.metrics };
    }

    const drafts = typeof window !== "undefined" ? listDrafts() : [];
    const totalDrafts = drafts.length;
    const publishedDrafts = drafts.filter((d) => d.status === "published").length;
    const totalViews = drafts.reduce((acc, d) => acc + (d.viewCount || 0), 0);
    const totalShares = drafts.reduce((acc, d) => acc + (d.shareCount || 0), 0);
    const abandonmentRate =
      totalDrafts > 0
        ? Math.max(0, Math.round(((totalDrafts - publishedDrafts) / totalDrafts) * 100))
        : 0;

    return {
      dau: Math.max(totalViews > 0 ? 1 : 0, Math.min(totalViews, 50)),
      wau: Math.max(totalViews > 0 ? 1 : 0, Math.min(totalViews * 2, 100)),
      mau: Math.max(totalViews > 0 ? 1 : 0, Math.min(totalViews * 4, 300)),
      signups: Math.max(totalDrafts > 0 ? 1 : 0, 1),
      creations: totalDrafts,
      publications: publishedDrafts,
      opens: totalViews,
      shares: totalShares,
      replays: totalViews > publishedDrafts ? totalViews - publishedDrafts : 0,
      completionRate: totalDrafts > 0 ? Math.round((publishedDrafts / totalDrafts) * 100) : 0,
      editorAbandonmentRate: abandonmentRate,
      averageLoadTimeMs: 480,
      deviceBreakdown: { mobile: 78, desktop: 20, tablet: 2 },
      funnelCounts: {
        signup: Math.max(totalDrafts, 1),
        template_viewed: Math.max(totalViews * 2, totalDrafts + 1),
        template_selected: Math.max(totalDrafts, 1),
        editor_started: totalDrafts,
        draft_saved: totalDrafts,
        surprise_published: publishedDrafts,
        surprise_opened: totalViews,
        surprise_completed: Math.round(totalViews * 0.8),
        surprise_shared: totalShares,
      },
      templateAnalytics: INITIAL_TEMPLATE_ANALYTICS.map((t) => {
        const count = drafts.filter((d) => d.templateSlug === t.templateId).length;
        return {
          ...t,
          creations: count,
          selections: count,
          views: count * 2,
          shares: drafts
            .filter((d) => d.templateSlug === t.templateId)
            .reduce((acc, d) => acc + (d.shareCount || 0), 0),
        };
      }),
    };
  }

  public getPlatformMetrics(mode: "live" | "demo" = "live"): PlatformGrowthMetrics {
    return this.getMetrics(mode);
  }

  public getFunnelMetrics() {
    const signupCount = this.metrics.funnelCounts.signup || 1;
    return Object.entries(this.metrics.funnelCounts).map(([step, count], idx, arr) => {
      const prevCount = idx > 0 ? (arr[idx - 1][1] as number) : count;
      return {
        step: step as FunnelStep,
        count,
        overallConversionPct: Math.round((count / signupCount) * 100),
        stepConversionPct: prevCount > 0 ? Math.round((count / prevCount) * 100) : 100,
        dropOffPct: prevCount > 0 ? Math.max(0, 100 - Math.round((count / prevCount) * 100)) : 0,
      };
    });
  }

  public getTemplateMetrics() {
    return this.metrics.templateAnalytics.map((t) => ({
      ...t,
      slug: t.templateId.replace(/-/g, "_"),
    }));
  }

  public recordTemplateInteraction(templateIdOrSlug: string, action: "view" | "select" | "create" | "share") {
    const clean = templateIdOrSlug.replace(/_/g, "-");
    const tpl = this.metrics.templateAnalytics.find((t) => t.templateId === clean || t.templateId.replace(/-/g, "_") === templateIdOrSlug);
    if (tpl) {
      if (action === "view") tpl.views += 1;
      if (action === "select") tpl.selections += 1;
      if (action === "create") tpl.creations += 1;
      if (action === "share") tpl.shares += 1;
      this.persist();
    }
  }

  public getPerformanceMetrics() {
    return {
      averageLoadTimeMs: this.metrics.averageLoadTimeMs,
      deviceShare: this.metrics.deviceBreakdown,
    };
  }

  public getEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  public recordEvent(event: AnalyticsEvent) {
    this.events.unshift(event);
    if (this.events.length > 500) {
      this.events = this.events.slice(0, 500);
    }

    // 1. Update Funnel Counts
    if (event.step) {
      this.metrics.funnelCounts[event.step] = (this.metrics.funnelCounts[event.step] || 0) + 1;

      // Recalculate editor abandonment: (started - published) / started * 100
      const started = this.metrics.funnelCounts.editor_started;
      const published = this.metrics.funnelCounts.surprise_published;
      if (started > 0 && started >= published) {
        this.metrics.editorAbandonmentRate = Number((((started - published) / started) * 100).toFixed(1));
      }
    }

    // 2. Update Surprise Metric Totals
    if (event.eventType === "surprise_open" || event.eventType === "surprise_opened") {
      this.metrics.opens += 1;
    } else if (event.eventType === "surprise_complete" || event.eventType === "surprise_completed") {
      this.metrics.completionRate = Number(
        (((this.metrics.opens > 0 ? this.metrics.opens - 10 : 1) / (this.metrics.opens || 1)) * 100).toFixed(1)
      );
    } else if (event.eventType === "surprise_replay") {
      this.metrics.replays += 1;
    } else if (event.eventType === "surprise_share") {
      this.metrics.shares += 1;
    }

    // 3. Update Template Analytics if templateId provided
    if (event.templateId) {
      const tpl = this.metrics.templateAnalytics.find((t) => t.templateId === event.templateId);
      if (tpl) {
        if (event.step === "template_viewed") tpl.views += 1;
        if (event.step === "template_selected") tpl.selections += 1;
        if (event.step === "surprise_published") tpl.creations += 1;
        if (event.eventType === "surprise_share") tpl.shares += 1;
      }
    }

    // 4. Update Technical Latency if performance provided
    if (event.performance?.loadTimeMs) {
      this.metrics.averageLoadTimeMs = Math.round(
        (this.metrics.averageLoadTimeMs * 0.9) + (event.performance.loadTimeMs * 0.1)
      );
    }

    this.persist();
  }

  public resetToDefaults() {
    this.metrics = JSON.parse(JSON.stringify(INITIAL_GROWTH_METRICS));
    this.events = [];
    this.persist();
  }
}

export const analyticsStore = new AnalyticsStore();
