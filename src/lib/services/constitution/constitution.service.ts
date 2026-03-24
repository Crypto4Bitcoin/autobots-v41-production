
import fs from "fs";
import path from "path";

export interface ConstitutionalPrinciple {
  id: string;
  name: string;
  statement: string;
  rationale: string;
  ratified_at: string;
  source_gene_id?: string;
  severity: "low" | "medium" | "high" | "critical";
}

export class ConstitutionalRegistryService {
  private static CONSTITUTION_FILE = path.join(process.cwd(), "src/lib/constants/constitution-db.json");

  static getConstitution(): ConstitutionalPrinciple[] {
    if (!fs.existsSync(this.CONSTITUTION_FILE)) {
      const initial: ConstitutionalPrinciple[] = [
        {
          id: "law-001",
          name: "The First Law of Legibility",
          statement: "No mutation shall obfuscate the system's decision-making state for the purpose of local performance gains.",
          rationale: "Transparency is the foundation of operator sovereignty and long-term survival.",
          ratified_at: new Date().toISOString(),
          severity: "critical"
        }
      ];
      this.saveConstitution(initial);
      return initial;
    }
    return JSON.parse(fs.readFileSync(this.CONSTITUTION_FILE, "utf8"));
  }

  static saveConstitution(constitution: ConstitutionalPrinciple[]) {
    const dir = path.dirname(this.CONSTITUTION_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(this.CONSTITUTION_FILE, JSON.stringify(constitution, null, 2));
  }

  static ratifyGene(gene: unknown): ConstitutionalPrinciple {
    const constitution = this.getConstitution();
    const newPrinciple: ConstitutionalPrinciple = {
      id: `law-${Date.now()}`,
      name: gene.name,
      statement: gene.description,
      rationale: `Graduated from trusted gene ${gene.gene_id} after successful operational proof.`,
      ratified_at: new Date().toISOString(),
      source_gene_id: gene.gene_id,
      severity: "high"
    };
    constitution.push(newPrinciple);
    this.saveConstitution(constitution);
    return newPrinciple;
  }
}
