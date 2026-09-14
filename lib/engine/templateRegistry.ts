import {
  TemplateModel,
  TemplateVersionModel,
  SceneModel,
  SurpriseModel,
  PersonalizationData,
} from "./types";
import { DEMO_TEMPLATE_MODEL, DEMO_VERSION_1_0_0 } from "./demoTemplate";
import { ALL_BIRTHDAY_TEMPLATES } from "./templates";

export class TemplateRegistry {
  private static instance: TemplateRegistry;

  private templates: Map<string, TemplateModel> = new Map();
  private versions: Map<string, TemplateVersionModel> = new Map();

  private constructor() {
    // Seed all production birthday templates
    for (const tpl of ALL_BIRTHDAY_TEMPLATES) {
      this.registerTemplate(tpl);
    }

    // Also register legacy demo template for backwards-compatibility
    this.registerTemplate(DEMO_TEMPLATE_MODEL);
    this.registerTemplateVersion(DEMO_VERSION_1_0_0);
  }


  public static getInstance(): TemplateRegistry {
    if (!TemplateRegistry.instance) {
      TemplateRegistry.instance = new TemplateRegistry();
    }
    return TemplateRegistry.instance;
  }

  /**
   * Registers a template definition.
   */
  public registerTemplate(template: TemplateModel): void {
    this.templates.set(template.id, template);
    this.templates.set(template.slug, template);

    // Register all embedded versions
    if (template.versions && Array.isArray(template.versions)) {
      for (const ver of template.versions) {
        this.registerTemplateVersion(ver);
      }
    }
  }

  /**
   * Registers a specific template version.
   */
  public registerTemplateVersion(version: TemplateVersionModel): void {
    this.versions.set(version.id, version);

    // Also index by composite key "templateId@version"
    this.versions.set(`${version.templateId}@${version.version}`, version);
  }

  /**
   * Retrieves a template by ID or slug.
   */
  public getTemplate(idOrSlug: string): TemplateModel | undefined {
    return this.templates.get(idOrSlug);
  }

  /**
   * Retrieves a template version by version ID.
   * Guarantees version immutability: returns the exact version manifest linked to a surprise.
   */
  public getTemplateVersion(versionId: string): TemplateVersionModel | undefined {
    return this.versions.get(versionId);
  }

  /**
   * Lists all registered templates, optionally filtered by category.
   */
  public listTemplates(category?: string): TemplateModel[] {
    const list: TemplateModel[] = [];
    const seenIds = new Set<string>();

    for (const tpl of this.templates.values()) {
      if (!seenIds.has(tpl.id)) {
        seenIds.add(tpl.id);
        if (!category || tpl.categoryId === category) {
          list.push(tpl);
        }
      }
    }

    return list;
  }

  /**
   * Resolves the exact template, locked version, and scenes for a surprise.
   * Ensures that updates to original templates never affect published surprises.
   */
  public resolveSurpriseExperience(surprise: SurpriseModel): {
    template: TemplateModel;
    version: TemplateVersionModel;
    scenes: SceneModel[];
  } {
    // 1. Resolve locked template version
    let version = this.getTemplateVersion(surprise.templateVersionId);

    // If not found directly, try finding the template's current version
    let template = this.getTemplate(surprise.templateId);
    if (!template) {
      template = DEMO_TEMPLATE_MODEL;
    }

    if (!version) {
      version = template.versions.find((v) => v.id === surprise.templateVersionId) || DEMO_VERSION_1_0_0;
    }

    const rawScenes = version.scenes || [];
    const photos = surprise.photos || [];

    // Filter scenes: if scene has requiresPhotoIndex (1-indexed), check if photo exists
    const scenes = rawScenes.filter((scene) => {
      if (!scene.requiresPhotoIndex) return true;
      const idx = scene.requiresPhotoIndex - 1;
      return idx >= 0 && idx < photos.length && Boolean(photos[idx]);
    });

    return {
      template,
      version,
      scenes,
    };
  }
}

export const templateRegistry = TemplateRegistry.getInstance();
