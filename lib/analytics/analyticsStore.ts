import {
  AnalyticsEvent,
  FunnelStep,
  PlatformGrowthMetrics,
  TemplateAnalytics,
} from "./types";

export type { PlatformGrowthMetrics };

const STORAGE_KEY_ANALYTICS = "surprisespark_analytics_metrics_v1";

export const INITIAL_TEMPLATE_ANALYTICS: TemplateAnalytics[] = [
  {
    templateId: "magic-gift",
    name: "Magic Gift 🎁",
    category: "Mystery Box",
    views: 4200,
    selections: 1850,
    creations: 1420,
    completionRate: 92.4,
    shares: 2840,
    popularityScore: 98,
  },
  {
    templateId: "cake-reveal",
    name: "Birthday Cake Reveal 🎂",
    category: "Cake & Candles",
    views: 3600,
    selections: 1400,
    creations: 980,
    completionRate: 89.1,
    shares: 1950,
    popularityScore: 92,
  },
  {
    templateId: "balloon-room",
    name: "Balloon Room 🎈",
    category: "Helium Celebration",
    views: 3100,
    selections: 1150,
    creations: 840,
    completionRate: 87.5,
    shares: 1680,
    popularityScore: 86,
  },
  {
    templateId: "mystery-door",
    name: "Mystery Door 🚪",
    category: "Portal Journey",
    views: 2800,
    selections: 980,
    creations: 690,
    completionRate: 85.3,
    shares: 1320,
    popularityScore: 81,
  },
  {
    templateId: "memory-journey",
    name: "Memory Journey 📸",
    category: "Photo Scrapbook",
    views: 2600,
    selections: 890,
    creations: 610,
    completionRate: 91.2,
    shares: 1450,
    popularityScore: 79,
  },
  {
    templateId: "confetti-blast",
    name: "Confetti Blast 🎉",
    category: "Festival Party",
    views: 2400,
    selections: 790,
    creations: 530,
    completionRate: 84.0,
    shares: 1080,
    popularityScore: 74,
  },
  {
    templateId: "rainbow-surprise",
    name: "Rainbow Surprise 🌈",
    category: "Pastel Fantasy",
    views: 2100,
    selections: 680,
    creations: 450,
    completionRate: 86.8,
    shares: 920,
    popularityScore: 69,
  },
  {
    templateId: "cute-character",
    name: "Cute Character Mascot 🧸",
    category: "Animated Avatar",
    views: 1900,
    selections: 620,
    creations: 410,
    completionRate: 88.4,
    shares: 890,
    popularityScore: 66,
  },
];

export const INITIAL_GROWTH_METRICS: PlatformGrowthMetrics = {
  dau: 684,
  wau: 2120,
  mau: 5490,
  signups: 1425,
  creations: 3840,
  publications: 3420,
  opens: 18920,
  shares: 7240,
  replays: 9150,
  completionRate: 88.6,
  editorAbandonmentRate: 16.4,
  averageLoadTimeMs: 480,
  deviceBreakdown: {
    mobile: 78.4,
    desktop: 18.2,
    tablet: 3.4,
  },
  funnelCounts: {
    signup: 1425,
    template_viewed: 1380,
    template_selected: 1290,
    editor_started: 1220,
    draft_saved: 1150,
    surprise_published: 1020,
    surprise_opened: 980,
    surprise_completed: 890,
    surprise_shared: 560,
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

  public getMetrics(): PlatformGrowthMetrics {
    return { ...this.metrics };
  }

  public getPlatformMetrics(): PlatformGrowthMetrics {
    return this.getMetrics();
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
