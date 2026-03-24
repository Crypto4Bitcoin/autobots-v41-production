
import fs from "fs";

export class CodeSanityPreflightAgent {
  static runFullSuite(filePath: string) {
    const content = fs.readFileSync(filePath, "utf8");
    const issues = [];

    // Check 1: Literal Escape Sequence Scan
    if (content.includes("\\n") || content.includes("\\t") || content.includes("\\r")) {
      issues.push({ type: "LITERAL_ESCAPE_INJECTION", severity: "high", repairable: true });
    }

    // Check 2: Import Block Integrity (Multiple imports on one line / Broken quotes)
    if (content.match(/import.*\n.*import/) && content.includes("\\n")) {
       issues.push({ type: "BROKEN_IMPORT_BLOCK", severity: "medium", repairable: true });
    }

    // Check 3: Route Contract Integrity
    if (filePath.includes("route.ts")) {
      if (!content.includes("export async function")) issues.push({ type: "MISSING_HTTP_METHODS", severity: "high", repairable: false });
      if (!content.includes("NextResponse")) issues.push({ type: "MISSING_API_CONTRACT", severity: "medium", repairable: true });
    }

    // Check 4: Alias Integrity (Fragile relative paths)
    if (content.includes("../../../lib")) {
      issues.push({ type: "FRAGILE_RELATIVE_PATH", severity: "low", repairable: true });
    }

    // Check 5: Barrel Export Integrity
    if (filePath.includes("index.ts") && !content.includes("export * from")) {
       issues.push({ type: "WEAK_BARREL_EXPORT", severity: "low", repairable: false });
    }

    // Check 6: Server/Client Boundary Scan
    if (filePath.includes("page.tsx") || filePath.includes("layout.tsx")) {
      const hasUseClient = content.includes("'use client'") || content.includes('"use client"');
      const hasInteractivity = content.includes("useState") || content.includes("useEffect");
      if (hasInteractivity && !hasUseClient) {
        issues.push({ type: "BOUNDARY_VIOLATION_MISSING_CLIENT", severity: "high", repairable: true });
      }
    }

    // Check 7: Patch/JSX Balancing
    const openTags = (content.match(/</g) || []).length;
    const closeTags = (content.match(/>/g) || []).length;
    if (openTags !== closeTags) {
      issues.push({ type: "MALFORMED_JSX_STRUCTURE", severity: "high", repairable: false });
    }

    return {
      preflight_id: Date.now().toString(),
      file: filePath,
      issues,
      risk_score: issues.length * 0.15,
      status: issues.length > 0 ? "warning" : "pass",
      timestamp: new Date().toISOString()
    };
  }
}
