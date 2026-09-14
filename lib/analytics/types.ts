/**
 * PRODUCT ANALYTICS & TELEMETRY DOMAIN TYPES
 * Zero-PII, Privacy-Conscious, Deduplicated Event Pipeline
 */

export type FunnelStep =
  | "signup"
  | "template_viewed"
  | "template_selected"
  | "editor_started"
  | "draft_saved"
  | "surprise_published"
  | "surprise_opened"
  | "surprise_completed"
  | "surprise_shared";

export const FUNNEL_STAGES: { step: FunnelStep; label: string; order: number; description: string }[] = [
  { step: "signup", label: "1. Creator Signup", order: 1, description: "New creator account registered on the platform" },
  { step: "template_viewed", label: "2. Template Viewed", order: 2, description: "Browsing celebration templates in catalog" },
  { step: "template_selected", label: "3. Template Selected", order: 3, description: "Template chosen for personalization" },
  { step: "editor_started", label: "4. Editor Started", order: 4, description: "Began entering recipient details and message" },
  { step: "draft_saved", label: "5. Draft Saved", order: 5, description: "Experience draft persisted locally or to cloud" },
  { step: "surprise_published", label: "6. Surprise Published", order: 6, description: "Unique link generated (/s/[id])" },
  { step: "surprise_opened", label: "7. Surprise Opened", order: 7, description: "Recipient unboxes opening envelope curtain" },
  { step: "surprise_completed", label: "8. Surprise Completed", order: 8, description: "Recipient finishes all 3D scenes (smile screen)" },
  { step: "surprise_shared", label: "9. Surprise Shared", order: 9, description: "Recipient shares surprise or creates their own" },
];

export const FUNNEL_STEPS_ORDER: FunnelStep[] = FUNNEL_STAGES.map((s) => s.step);

export type SurpriseMetricEvent =
  | "open"
  | "scene_complete"
  | "complete"
  | "replay"
  | "share";

export type DeviceCategory = "mobile" | "desktop" | "tablet";

export interface PerformanceMetrics {
  loadTimeMs: number;
  renderFps?: number;
  webGlAvailable: boolean;
  deviceCategory: DeviceCategory;
  errorCount?: number;
}

export interface AnalyticsEvent {
  id: string;
  sessionId: string;
  eventType: string;
  step?: FunnelStep;
  surpriseId?: string;
  templateId?: string;
  sceneIndex?: number;
  deviceCategory: DeviceCategory;
  performance?: PerformanceMetrics;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface TemplateAnalytics {
  templateId: string;
  name: string;
  category: string;
  views: number;
  selections: number;
  creations: number;
  completionRate: number; // percentage (0 - 100)
  shares: number;
  popularityScore: number;
}

export interface PlatformGrowthMetrics {
  dau: number; // Daily Active Users
  wau: number; // Weekly Active Users
  mau: number; // Monthly Active Users
  signups: number;
  creations: number;
  publications: number;
  opens: number;
  shares: number;
  replays: number;
  completionRate: number;
  editorAbandonmentRate: number; // percentage
  averageLoadTimeMs: number;
  deviceBreakdown: {
    mobile: number; // percentage
    desktop: number; // percentage
    tablet: number; // percentage
  };
  funnelCounts: Record<FunnelStep, number>;
  templateAnalytics: TemplateAnalytics[];
}

export type ConsentState = "opt_in" | "opt_out" | "essential_only";

export interface UserPrivacyProfile {
  consentState: ConsentState;
  telemetryEnabled: boolean;
  sessionId: string;
  lastUpdated: string;
}
