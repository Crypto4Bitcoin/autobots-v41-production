
import fs from "fs";
import path from "path";

export interface CulturalPersona {
  id: string;
  name: string;
  professional_background: string;
  narrative_preference: "technical" | "conceptual" | "minimalist" | "storytelling";
  tonality: "direct" | "empathetic" | "objective";
}

export class CulturalContextService {
  private static PERSONA_FILE = path.join(process.cwd(), "src/lib/constants/cultural-personas.json");

  static getPersonas(): CulturalPersona[] {
    if (!fs.existsSync(this.PERSONA_FILE)) {
      const initial: CulturalPersona[] = [
        { id: "p-eng-01", name: "SRE Leader", professional_background: "Site Reliability Engineering", narrative_preference: "technical", tonality: "direct" },
        { id: "p-exec-01", name: "Strategic Director", professional_background: "Business Operations", narrative_preference: "conceptual", tonality: "objective" },
        { id: "p-creative-01", name: "User Advocate", professional_background: "Product Design", narrative_preference: "storytelling", tonality: "empathetic" }
      ];
      this.savePersonas(initial);
      return initial;
    }
    return JSON.parse(fs.readFileSync(this.PERSONA_FILE, "utf8"));
  }

  static savePersonas(personas: CulturalPersona[]) {
    fs.writeFileSync(this.PERSONA_FILE, JSON.stringify(personas, null, 2));
  }
}

export class InterfaceEmpathyEngine {
  static adaptNarrative(report: string, personaId: string): string {
    const personas = CulturalContextService.getPersonas();
    const persona = personas.find(p => p.id === personaId);
    if (!persona) return report;

    console.log(`[EmpathyEngine] Adapting narrative for ${persona.name} (${persona.narrative_preference})...`);
    
    // Mock adaptation logic
    switch (persona.narrative_preference) {
      case "technical":
        return `TECHNICAL ANALYSIS: ${report}. System state: CONVERGED. Latency: 12ms.`;
      case "conceptual":
        return `STRATEGIC OVERVIEW: ${report.replace(/fault/g, 'structural challenge')}. Alignment: 100%.`;
      case "storytelling":
        return `The journey of this system event began when... ${report}.`;
      case "minimalist":
        return `STATUS: OK. ${report.substring(0, 50)}...`;
      default:
        return report;
    }
  }
}
