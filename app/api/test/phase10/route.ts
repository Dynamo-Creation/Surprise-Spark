import { NextResponse } from "next/server";
import { validate3DFile, validateAnimationContract, MAX_ASSET_SIZE_BYTES } from "@/lib/assets/assetValidator";
import { assetStore } from "@/lib/assets/assetStore";

export async function GET() {
  const results: Record<string, unknown> = {};

  try {
    // -------------------------------------------------------------------------
    // 1. FILE VALIDATION & INTEGRITY
    // -------------------------------------------------------------------------
    // Valid GLB binary buffer
    const validGlbHeader = new Uint8Array([
      0x67, 0x6c, 0x54, 0x46, // magic: 'glTF'
      0x02, 0x00, 0x00, 0x00, // version: 2
      0x20, 0x00, 0x00, 0x00, // length: 32
      0x08, 0x00, 0x00, 0x00, // chunk 0 length: 8
      0x4a, 0x53, 0x4f, 0x4e, // chunk 0 type: "JSON"
      0x7b, 0x7d, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, // "{}" padded
    ]);
    const valGlb = validate3DFile("test_robot.glb", validGlbHeader);

    // Corrupted header
    const corruptHeader = new Uint8Array([0x42, 0x41, 0x44, 0x21, 0x01, 0x00, 0x00, 0x00]);
    const valCorrupt = validate3DFile("corrupt.glb", corruptHeader);

    // Valid GLTF JSON
    const validGltfJson = new TextEncoder().encode(
      JSON.stringify({ asset: { version: "2.0" }, animations: [{ name: "Dance" }] })
    );
    const valGltf = validate3DFile("scene.gltf", validGltfJson);

    // Oversized buffer
    const hugeBuffer = new Uint8Array(MAX_ASSET_SIZE_BYTES + 1024);
    const valHuge = validate3DFile("huge.glb", hugeBuffer);

    results.fileValidation = {
      validGlb: valGlb.valid && valGlb.format === "glb",
      corruptRejected: !valCorrupt.valid && valCorrupt.errors.length > 0,
      validGltf: valGltf.valid && valGltf.format === "gltf",
      hugeRejected: !valHuge.valid && valHuge.errors.length > 0,
    };

    // -------------------------------------------------------------------------
    // 2. ANIMATION CONTRACT & WARNING FALLBACK
    // -------------------------------------------------------------------------
    const contractResult = validateAnimationContract(
      ["Idle", "Celebrate", "Wave"],
      ["Idle", "Walk", "Happy_Dance"],
      { Happy_Dance: "Celebrate" }
    );

    results.animationContract = {
      celebrateMapped: contractResult.resolvedActionMap.Celebrate === "Happy_Dance",
      waveWarningEmitted: contractResult.warnings.length > 0,
      waveFallbackActive: !!contractResult.resolvedActionMap.Wave,
      warnings: contractResult.warnings,
    };

    // -------------------------------------------------------------------------
    // 3. ABSTRACT SLOTS & ZERO-CODE SWAPPING
    // -------------------------------------------------------------------------
    const initialSlot = assetStore.resolveSlot("birthday_character");
    assetStore.assignSlotAsset("birthday_character", "char-astro-bot");
    const updatedSlot = assetStore.resolveSlot("birthday_character");

    results.abstractSlots = {
      initialAssetId: initialSlot.model?.id,
      reassignedAssetId: updatedSlot.model?.id,
      success: updatedSlot.model?.id === "char-astro-bot",
    };

    // -------------------------------------------------------------------------
    // 4. ASSET VERSIONING & PUBLISHED IMMUTABILITY
    // -------------------------------------------------------------------------
    const v2Asset = assetStore.replaceAssetFile("char-astro-bot", {
      fileName: "astro_bot_v2.glb",
      changelog: "V2 test upgrade",
      polyCount: 2200,
    });
    const pinnedResolution = assetStore.resolveSlot("birthday_character", 1);

    results.versioning = {
      v2VersionNumber: v2Asset.currentVersion,
      pinnedVersionResolved: pinnedResolution.versionNumber === 1,
      pinnedFileUrl: pinnedResolution.fileUrl,
    };

    // -------------------------------------------------------------------------
    // 5. SAFE NON-DESTRUCTIVE DELETION GATING
    // -------------------------------------------------------------------------
    const deleteActive = assetStore.deleteAsset("char-astro-bot");
    const dummy = assetStore.uploadAsset({
      name: "Temporary Crystal",
      category: "props",
      format: "glb",
      fileName: "temp_crystal.glb",
    });
    const deleteDummy = assetStore.deleteAsset(dummy.id);

    results.safeDeletion = {
      referencedBlocked: !deleteActive.success && !!deleteActive.error,
      unreferencedAllowed: deleteDummy.success,
      deletionBlockedMessage: deleteActive.error,
    };

    // Reset store to clean defaults
    assetStore.resetToDefaults();

    return NextResponse.json({ success: true, results });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Test failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
