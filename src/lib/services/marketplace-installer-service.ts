import { DBService, supabase } from "./supabase-service";
import { MarketplaceMetadataService } from "./marketplace-metadata-service";

export class MarketplaceInstallerService {
  static async installPackage(workspaceId: string, packageId: string) {
    const pkg = await MarketplaceMetadataService.getPackage(packageId);
    if (!pkg) throw new Error("Package not found in marketplace.");

    const { error } = await supabase
      .from("workspace_pack_installs") // Reusing the same concept
      .upsert([{ 
         workspace_id: workspaceId, 
         pack_id: packageId, 
         status: "installed", 
         installed_at: new Date().toISOString() 
      }]);
      
    if (error) throw error;
    
    await DBService.logAudit({
       workspace_id: workspaceId,
       action: "marketplace_package_installed",
       actor: "tenant_admin",
       details: { packageId }
    });
    
    return true;
  }

  static async uninstallPackage(workspaceId: string, packageId: string) {
    const { error } = await supabase
      .from("workspace_pack_installs")
      .delete()
      .eq("workspace_id", workspaceId)
      .eq("pack_id", packageId);
      
    if (error) throw error;
    
    await DBService.logAudit({
       workspace_id: workspaceId,
       action: "marketplace_package_uninstalled",
       actor: "tenant_admin",
       details: { packageId }
    });
    
    return true;
  }
}
