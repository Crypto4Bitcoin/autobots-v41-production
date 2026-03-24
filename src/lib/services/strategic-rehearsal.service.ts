import { TwinStressLab } from "./twin-stress-lab.service";
import { FederationRiskSimulator } from "./federation-risk.service";

export class ContinuousStrategicRehearsal {
  private static rehearsalLog: unknown[] = [];

  static async triggerUnsolicitedRehearsal() {
    const scenarios = ["regional_outage", "trust_collapse", "memory_sync_drift"];
    const selected = scenarios[Math.floor(Math.random() * scenarios.length)];
    
    console.log(`[Self-Rehearsal] TRIGGERING BACKGROUND STRATEGIC DRILL: ${selected}`);
    
    let report;
    if (selected === "trust_collapse") {
      report = await FederationRiskSimulator.simulateTrustCollapse("ORG_EXTERNAL");
    } else {
      report = await TwinStressLab.runScenario(selected, { automated: true });
    }
    
    const logEntry = { type: selected, timestamp: new Date(), result: report };
    this.rehearsalLog.push(logEntry);
    return logEntry;
  }

  static getLatestRehearsals() { return this.rehearsalLog.slice(-5); }
}