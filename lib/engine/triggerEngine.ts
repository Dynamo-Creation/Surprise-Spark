import {
  TriggerDefinition,
  TriggerType,
  ActionDefinition,
  ActionType,
  CameraConfig,
  SceneModel,
} from "./types";

export interface TriggerEngineCallbacks {
  onPlayAnimation?: (objectId: string, animationName: string) => void;
  onStopAnimation?: (objectId: string) => void;
  onSetObjectVisibility?: (objectId: string, visible: boolean) => void;
  onChangeCamera?: (cameraPosition?: [number, number, number], fov?: number) => void;
  onPlaySound?: (soundUrl: string) => void;
  onShowText?: (message: string) => void;
  onSpawnEffect?: (effectType: string) => void;
  onTransitionScene?: (target: number | "next" | "previous" | "first") => void;
  onCustomEvent?: (eventName: string, payload?: unknown) => void;
}

export class TriggerEngine {
  private triggers: TriggerDefinition[] = [];
  private callbacks: TriggerEngineCallbacks;
  private activeTimeouts: NodeJS.Timeout[] = [];

  constructor(callbacks: TriggerEngineCallbacks = {}) {
    this.callbacks = callbacks;
  }

  /**
   * Loads active triggers for the current scene.
   * Cancels any pending timeouts from previous scenes.
   */
  public loadTriggers(triggers: TriggerDefinition[]): void {
    this.clearTimeouts();
    this.triggers = triggers || [];

    // Automatically fire scene_loaded triggers
    this.dispatchEvent("scene_loaded");
  }

  /**
   * Dispatches an event into the trigger system.
   * Evaluates all triggers matching the event type and optional target object.
   */
  public dispatchEvent(
    type: TriggerType,
    context?: { targetObjectId?: string; eventName?: string }
  ): void {
    const matchingTriggers = this.triggers.filter((trigger) => {
      if (trigger.type !== type) return false;

      // Check target object match if specified
      if (trigger.targetObjectId && context?.targetObjectId) {
        if (trigger.targetObjectId !== context.targetObjectId) return false;
      }

      // Check custom event name match if specified
      if (trigger.eventName && context?.eventName) {
        if (trigger.eventName !== context.eventName) return false;
      }

      return true;
    });

    for (const trigger of matchingTriggers) {
      if (trigger.delayMs && trigger.delayMs > 0) {
        const timeout = setTimeout(() => {
          this.executeActions(trigger.actions);
        }, trigger.delayMs);
        this.activeTimeouts.push(timeout);
      } else {
        this.executeActions(trigger.actions);
      }
    }
  }

  /**
   * Executes a sequence of actions, respecting individual action delay timers.
   */
  public executeActions(actions: ActionDefinition[]): void {
    if (!actions || !Array.isArray(actions)) return;

    let cumulativeDelay = 0;

    for (const action of actions) {
      const actionDelay = action.payload?.delayMs || 0;
      cumulativeDelay += actionDelay;

      if (cumulativeDelay > 0) {
        const timeout = setTimeout(() => {
          this.executeAction(action);
        }, cumulativeDelay);
        this.activeTimeouts.push(timeout);
      } else {
        this.executeAction(action);
      }
    }
  }

  /**
   * Dispatches a single action to its respective handler.
   */
  private executeAction(action: ActionDefinition): void {
    const { type, targetObjectId, payload } = action;

    switch (type) {
      case "play_animation":
        if (targetObjectId && payload?.animationName) {
          this.callbacks.onPlayAnimation?.(targetObjectId, payload.animationName);
        }
        break;

      case "stop_animation":
        if (targetObjectId) {
          this.callbacks.onStopAnimation?.(targetObjectId);
        }
        break;

      case "show_object":
        if (targetObjectId) {
          this.callbacks.onSetObjectVisibility?.(targetObjectId, true);
        }
        break;

      case "hide_object":
        if (targetObjectId) {
          this.callbacks.onSetObjectVisibility?.(targetObjectId, false);
        }
        break;

      case "change_camera":
        this.callbacks.onChangeCamera?.(payload?.cameraPosition, payload?.cameraFov);
        break;

      case "play_sound":
        if (payload?.soundUrl) {
          this.callbacks.onPlaySound?.(payload.soundUrl);
        }
        break;

      case "show_text":
        if (payload?.textMessage) {
          this.callbacks.onShowText?.(payload.textMessage);
        }
        break;

      case "spawn_effect":
        if (payload?.effectType) {
          this.callbacks.onSpawnEffect?.(payload.effectType);
        }
        break;

      case "transition_scene":
        if (payload?.targetSceneIndex !== undefined) {
          this.callbacks.onTransitionScene?.(payload.targetSceneIndex);
        } else {
          this.callbacks.onTransitionScene?.("next");
        }
        break;

      case "trigger_custom_event":
        if (payload?.customEventName) {
          this.callbacks.onCustomEvent?.(payload.customEventName, payload);
          // Re-dispatch into the trigger engine for custom event chaining
          this.dispatchEvent("custom_event", { eventName: payload.customEventName });
        }
        break;

      default:
        console.warn(`Unknown action type: ${type}`);
    }
  }

  /**
   * Cleans up all pending action timer timeouts.
   */
  public clearTimeouts(): void {
    for (const timeout of this.activeTimeouts) {
      clearTimeout(timeout);
    }
    this.activeTimeouts = [];
  }

  public destroy(): void {
    this.clearTimeouts();
  }
}
