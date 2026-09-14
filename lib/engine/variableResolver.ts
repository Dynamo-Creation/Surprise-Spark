import { PersonalizationData, SceneObjectModel, SceneModel } from "./types";

/**
 * Safely resolves dynamic variables within template text strings.
 * Uses regular expression token replacement without arbitrary code execution (no eval/Function).
 *
 * Supported variables:
 * - {{recipient_name}}
 * - {{sender_name}}
 * - {{message}}
 * - {{special_date}}
 * - {{photo_1}} ... {{photo_5}}
 */
export function resolveVariables(
  templateString: string,
  context: PersonalizationData
): string {
  if (!templateString || typeof templateString !== "string") {
    return templateString || "";
  }

  return templateString.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (match, variableKey) => {
    const key = variableKey.toLowerCase();

    // Map known variable keys
    switch (key) {
      case "recipient_name":
        return context.recipient_name || "Someone Special";
      case "sender_name":
        return context.sender_name || "A Good Friend";
      case "message":
        return context.message || "";
      case "special_date":
        return context.special_date || "";
      case "photo_1":
        return context.photo_1 || "";
      case "photo_2":
        return context.photo_2 || "";
      case "photo_3":
        return context.photo_3 || "";
      case "photo_4":
        return context.photo_4 || "";
      case "photo_5":
        return context.photo_5 || "";
      default:
        // Fallback to direct context lookup or keep original match if undefined
        return context[key] !== undefined ? String(context[key]) : match;
    }
  });
}

/**
 * Recursively resolves variables within a scene object's properties.
 */
export function resolveObjectVariables(
  object: SceneObjectModel,
  context: PersonalizationData
): SceneObjectModel {
  const updatedProps = { ...object.props };

  // Resolve string properties
  if (typeof updatedProps.text === "string") {
    updatedProps.text = resolveVariables(updatedProps.text, context);
  }

  if (typeof updatedProps.imageUrl === "string") {
    updatedProps.imageUrl = resolveVariables(updatedProps.imageUrl, context);
  }

  if (typeof updatedProps.buttonLabel === "string") {
    updatedProps.buttonLabel = resolveVariables(updatedProps.buttonLabel, context);
  }

  return {
    ...object,
    props: updatedProps,
  };
}

/**
 * Resolves all dynamic variables across an entire scene.
 */
export function resolveSceneVariables(
  scene: SceneModel,
  context: PersonalizationData
): SceneModel {
  return {
    ...scene,
    name: resolveVariables(scene.name, context),
    objects: scene.objects.map((obj) => resolveObjectVariables(obj, context)),
  };
}
