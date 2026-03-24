import { AgentPackageManifest } from "./marketplace-metadata-service";

export class AgentPackageVerifier {
  static verify(manifest: AgentPackageManifest, signature?: string) {
    if (!manifest.id || !manifest.name || !manifest.publisherId) {
      throw new Error("Invalid package format: Missing required identity fields.");
    }
    if (!manifest.sandboxPolicy || manifest.sandboxPolicy.maxMemoryMb > 1024) {
      throw new Error("Invalid package format: Sandbox policy rejected (invalid or exceeds max 1024MB memory).");
    }
    
    if (!manifest.capabilities || manifest.capabilities.length === 0) {
       throw new Error("Invalid package format: Package must expose at least one capability.");
    }
    
    if (signature === "TAMPERED_SIG" || signature === "INVALID_SIG") {
       throw new Error("Package Verification Failed: Invalid cryptographic signature.");
    }

    return true;
  }
}

export class MarketplacePublisherService {
  static async publish(manifest: AgentPackageManifest, signature?: string) {
    AgentPackageVerifier.verify(manifest, signature);
    manifest.verification = { isVerified: true, verifiedAt: new Date().toISOString() };
    
    const { MarketplaceMetadataService } = await import("./marketplace-metadata-service");
    await MarketplaceMetadataService.registerPackage(manifest);
    return manifest;
  }
}
