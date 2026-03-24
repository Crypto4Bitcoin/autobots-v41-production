
import fs from "fs";
import path from "path";

export interface DecisionRecord {
  decision_id: string;
  timestamp: string;
  source_layer: string;
  intent_alignment: number;
  explanation: string;
  status: "approved" | "blocked" | "executed";
}

export class UnifiedDecisionLedger {
  private static LEDGER_FILE = path.join(process.cwd(), "src/lib/constants/decision-ledger.json");

  static log(record: Omit<DecisionRecord, "decision_id" | "timestamp">) {
    const records = this.getRecords();
    const newRecord: DecisionRecord = {
      decision_id: "dec-" + Date.now(),
      timestamp: new Date().toISOString(),
      ...record
    };
    records.push(newRecord);
    fs.writeFileSync(this.LEDGER_FILE, JSON.stringify(records, null, 2));
    console.log("[Ledger] Decision recorded:", newRecord.decision_id);
    return newRecord;
  }

  static getRecords(): DecisionRecord[] {
    if (!fs.existsSync(this.LEDGER_FILE)) {
      const dir = path.dirname(this.LEDGER_FILE);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(this.LEDGER_FILE, "[]");
      return [];
    }
    return JSON.parse(fs.readFileSync(this.LEDGER_FILE, "utf8"));
  }
}
