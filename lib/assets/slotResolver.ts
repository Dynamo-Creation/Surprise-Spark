import { Asset3DModel, AssetSlot, SlotId, StandardAnimation, TransformDefaults } from "./types";
import { validateAnimationContract } from "./assetValidator";

export interface ResolvedSlotAsset {
  slotId: SlotId;
  slotName: string;
  hasCustomModel: boolean;
  model: Asset3DModel | null;
  fileUrl: string | null;
  versionNumber: number | null;
  transform: TransformDefaults;
  animationMap: Record<StandardAnimation, string | null>;
  warnings: string[];
  fallbackProceduralId?: string;
}

export interface SlotResolutionOptions {
  slot: AssetSlot;
  asset: Asset3DModel | null;
  pinnedVersion?: number;
  requestedAnimations?: StandardAnimation[];
  transformOverrides?: Partial<TransformDefaults>;
}

/**
 * Resolves an abstract slot to a concrete 3D asset and transform defaults.
 * Preserves published surprise immutability if pinnedVersion is provided.
 */
export function resolveSlotAsset(options: SlotResolutionOptions): ResolvedSlotAsset {
  const { slot, asset, pinnedVersion, requestedAnimations = [], transformOverrides } = options;

  // Fallback defaults if no asset exists
  const defaultTransform: TransformDefaults = {
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    anchor: "center",
    cameraFraming: { distance: 6, fov: 45, target: [0, 0, 0] },
  };

  if (!asset || asset.status === "archived") {
    return {
      slotId: slot.id,
      slotName: slot.name,
      hasCustomModel: false,
      model: null,
      fileUrl: null,
      versionNumber: null,
      transform: { ...defaultTransform, ...transformOverrides },
      animationMap: {
        Idle: null,
        Walk: null,
        Wave: null,
        Celebrate: null,
        Gift: null,
        Jump: null,
        Dance: null,
      },
      warnings: [`Slot '${slot.name}' has no active custom 3D model assigned. Using procedural engine fallback.`],
      fallbackProceduralId: slot.fallbackProceduralId,
    };
  }

  // Determine which version to serve (pinned version takes absolute priority for immutable published experiences)
  let targetVersion = asset.versions.find((v) => v.versionNumber === asset.currentVersion);
  if (pinnedVersion !== undefined) {
    const pinnedMatch = asset.versions.find((v) => v.versionNumber === pinnedVersion);
    if (pinnedMatch) {
      targetVersion = pinnedMatch;
    }
  }

  const fileUrl = targetVersion?.fileUrl || asset.activeFileUrl;
  const versionNumber = targetVersion?.versionNumber || asset.currentVersion;

  // Resolve animation contract
  const requirements = [...(slot.requiredAnimations || []), ...requestedAnimations];
  const { warnings, resolvedActionMap } = validateAnimationContract(
    requirements,
    asset.availableAnimations,
    asset.animationMappings
  );

  // Combine transform defaults with optional overrides
  const transform: TransformDefaults = {
    ...defaultTransform,
    ...asset.transformDefaults,
    ...transformOverrides,
    position: transformOverrides?.position || asset.transformDefaults?.position || defaultTransform.position,
    rotation: transformOverrides?.rotation || asset.transformDefaults?.rotation || defaultTransform.rotation,
    scale: transformOverrides?.scale || asset.transformDefaults?.scale || defaultTransform.scale,
    anchor: transformOverrides?.anchor || asset.transformDefaults?.anchor || defaultTransform.anchor,
    cameraFraming: transformOverrides?.cameraFraming || asset.transformDefaults?.cameraFraming || defaultTransform.cameraFraming,
  };

  return {
    slotId: slot.id,
    slotName: slot.name,
    hasCustomModel: true,
    model: asset,
    fileUrl,
    versionNumber,
    transform,
    animationMap: resolvedActionMap,
    warnings,
    fallbackProceduralId: slot.fallbackProceduralId,
  };
}
