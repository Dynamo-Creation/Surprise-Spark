import {
  AnalyticsEvent,
  DeviceCategory,
  FunnelStep,
  PerformanceMetrics,
  SurpriseMetricEvent,
} from "./types";
import { getOrCreateSessionId, isTelemetryPermitted } from "./privacy";
import { analyticsStore } from "./analyticsStore";

/**
 * In-memory and session-level event deduplication cache.
 * Prevents rapid double clicks, reload counting, and repeated scene traversals from inflating data.
 */
class EventDeduplicator {
  private inMemoryKeys = new Set<string>();

  public isDuplicate(key: string, ttlMs: number = 3000): boolean {
    if (this.inMemoryKeys.has(key)) {
      return true;
    }

    this.inMemoryKeys.add(key);

    // Expire from memory after ttl
    if (ttlMs > 0) {
      setTimeout(() => {
        this.inMemoryKeys.delete(key);
      }, ttlMs);
    }

    return false;
  }

  public clear() {
    this.inMemoryKeys.clear();
  }
}

export const eventDeduplicator = new EventDeduplicator();

/**
 * Detects device category purely from viewport and navigator platform.
 * Zero fingerprinting, completely anonymous.
 */
export function detectDeviceCategory(): DeviceCategory {
  if (typeof window === "undefined") return "desktop";

  const width = window.innerWidth;
  const ua = navigator.userAgent.toLowerCase();

  if (/tablet|ipad|playbook|silk/i.test(ua) || (width >= 768 && width <= 1024)) {
    return "tablet";
  }

  if (/mobile|iphone|ipod|android|blackberry|iemobile|kindle/i.test(ua) || width < 768) {
    return "mobile";
  }

  return "desktop";
}

/**
 * Dispatches an analytics event with strict deduplication and privacy checking.
 */
export function trackEvent(params: {
  eventType: string;
  step?: FunnelStep;
  surpriseId?: string;
  templateId?: string;
  sceneIndex?: number;
  performance?: PerformanceMetrics;
  metadata?: Record<string, unknown>;
  dedupTtlMs?: number; // 0 = forever per session, >0 = debounce
}): { tracked: boolean; reason?: string } {
  if (!isTelemetryPermitted()) {
    return { tracked: false, reason: "telemetry_opted_out" };
  }

  const sessionId = getOrCreateSessionId();
  const deviceCategory = detectDeviceCategory();

  // Construct deduplication fingerprint
  const dedupKey = [
    sessionId,
    params.eventType,
    params.step || "",
    params.surpriseId || "",
    params.sceneIndex !== undefined ? `scene_${params.sceneIndex}` : "",
  ]
    .filter(Boolean)
    .join("::");

  // Funnel steps and unique surprise opens should only track once per session
  const isUniquePerSession =
    params.step !== undefined ||
    params.eventType === "surprise_opened" ||
    params.eventType === "surprise_completed";

  const ttl = isUniquePerSession ? 0 : (params.dedupTtlMs ?? 4000);

  if (eventDeduplicator.isDuplicate(dedupKey, ttl)) {
    return { tracked: false, reason: "duplicate_intercepted" };
  }

  const event: AnalyticsEvent = {
    id: "evt_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 6),
    sessionId,
    eventType: params.eventType,
    step: params.step,
    surpriseId: params.surpriseId,
    templateId: params.templateId,
    sceneIndex: params.sceneIndex,
    deviceCategory,
    performance: params.performance,
    timestamp: new Date().toISOString(),
    metadata: params.metadata,
  };

  analyticsStore.recordEvent(event);
  return { tracked: true };
}

// -----------------------------------------------------------------------------
// CONVENIENCE TRACKERS
// -----------------------------------------------------------------------------

/**
 * Tracks progression along the 9-stage product funnel.
 */
export function trackFunnel(
  step: FunnelStep,
  payload?: { templateId?: string; surpriseId?: string; metadata?: Record<string, unknown> }
) {
  return trackEvent({
    eventType: `funnel_${step}`,
    step,
    templateId: payload?.templateId,
    surpriseId: payload?.surpriseId,
    metadata: payload?.metadata,
  });
}

/**
 * Tracks recipient surprise lifecycle events (open, scene progress, complete, replay, share).
 */
export function trackSurpriseEvent(
  event: SurpriseMetricEvent,
  payload: {
    surpriseId: string;
    templateId?: string;
    sceneIndex?: number;
    metadata?: Record<string, unknown>;
  }
) {
  return trackEvent({
    eventType: `surprise_${event}`,
    surpriseId: payload.surpriseId,
    templateId: payload.templateId,
    sceneIndex: payload.sceneIndex,
    metadata: payload.metadata,
  });
}

/**
 * Tracks non-invasive technical performance telemetry.
 */
export function trackPerformance(
  metrics: { loadTimeMs: number; renderFps?: number; webGlAvailable: boolean; errorCount?: number },
  surpriseId?: string
) {
  const deviceCategory = detectDeviceCategory();
  return trackEvent({
    eventType: "performance_sample",
    surpriseId,
    performance: {
      ...metrics,
      deviceCategory,
    },
    dedupTtlMs: 10000,
  });
}
