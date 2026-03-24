import { DBService } from "./supabase-service";

export class PackRegistryService {
  /**
   * Registers a new vertical pack or updates an existing one with a new version.
   */
  async registerPack(input: {
    slug: string;
    name: string;
    description?: string;
    version: string;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    manifest: Record<string, any>;
    capabilities?: string[];
  }) {
    console.log(`[PackRegistry] Registering pack: ${input.slug} (v${input.version})`);

    // 1. Create/Update Vertical Pack
    const pack = await DBService.createVerticalPack({
      slug: input.slug,
      name: input.name,
      description: input.description || "",
      current_version: input.version,
      manifest: input.manifest
    });

    // 2. Add Version Record
    await DBService.createPackVersion({
      pack_id: pack.id,
      version: input.version,
      manifest: input.manifest
    });

    // 3. Link Capabilities
    if (input.capabilities?.length) {
      for (const capability of input.capabilities) {
        await DBService.linkPackCapability(pack.id, capability);
      }
    }

    return pack;
  }

  async getPackBySlug(slug: string) {
    return DBService.getVerticalPackBySlug(slug);
  }

  async listPacks() {
    return DBService.listVerticalPacks();
  }
}
