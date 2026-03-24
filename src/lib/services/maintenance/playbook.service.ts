
import fs from "fs";
import path from "path";

export class PlaybookService {
  static async executeLiteralEscapeRepair(filePath: string) {
    const content = fs.readFileSync(filePath, "utf8");
    const fixedContent = content
      .replace(/\\n/g, "\n")
      .replace(/\\t/g, "\t")
      .replace(/\\r/g, "\r");
    
    if (content !== fixedContent) {
      fs.writeFileSync(filePath, fixedContent);
      return { status: "success", action: "Replaced literal escape sequences" };
    }
    return { status: "no_change" };
  }

  static async executeMissingModuleStub(targetPath: string, moduleName: string) {
    const stubContent = `export class ${moduleName} {
  static async run(payload: any) {
    return { status: "stub", message: "Auto-generated stub for ${moduleName}" };
  }
}`;
    const dir = path.dirname(targetPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(targetPath, stubContent);
    return { status: "success", action: `Created stub for ${moduleName}` };
  }

  static async executePathAliasRepair(filePath: string) {
    const content = fs.readFileSync(filePath, "utf8");
    const fixedContent = content.replace(/\.\.\/\.\.\/\.\.\/lib/g, "@/lib");
    if (content !== fixedContent) {
      fs.writeFileSync(filePath, fixedContent);
      return { status: "success", action: "Normalized path aliases" };
    }
    return { status: "no_change" };
  }

  static async executeRouteContractRepair(filePath: string) {
    let content = fs.readFileSync(filePath, "utf8");
    if (!content.includes("NextResponse")) {
      content = 'import { NextResponse } from "next/server";\n' + content;
      fs.writeFileSync(filePath, content);
      return { status: "success", action: "Injected NextResponse import" };
    }
    return { status: "no_change" };
  }

  static async executeBoundaryRepair(filePath: string) {
    let content = fs.readFileSync(filePath, "utf8");
    if (!content.includes("'use client'") && !content.includes('"use client"')) {
      content = '"use client";\n' + content;
      fs.writeFileSync(filePath, content);
      return { status: "success", action: "Injected 'use client' directive" };
    }
    return { status: "no_change" };
  }

  // Playbook 7: Generated Patch Corruption Repair
  static async executePatchCorruptionRepair(filePath: string) {
    const content = fs.readFileSync(filePath, "utf8");
    // Normalize corrupt semicolons or multiple imports on one line
    const fixedContent = content
      .replace(/;\s*import/g, ";\nimport")
      .replace(/}\s*export/g, "}\n\nexport");
    
    if (content !== fixedContent) {
      fs.writeFileSync(filePath, fixedContent);
      return { status: "success", action: "Healed generated patch formatting" };
    }
    return { status: "no_change" };
  }
}
