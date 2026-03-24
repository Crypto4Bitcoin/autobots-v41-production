import { VoiceActionClass, VoiceIntent } from "../types/voice-intelligence-types";

export class IntentParserService {
  /**
   * Parses raw speech transcription into a structured VoiceIntent.
   */
  static async parse(utterance: string): Promise<VoiceIntent> {
    const text = utterance.toLowerCase();
    
    // Default intent
    const intent: VoiceIntent = {
      intentName: "unknown",
      actionClass: VoiceActionClass.INFORMATIONAL,
      entities: {},
      confidence: 0.5,
      initialRiskScore: 0,
      isSimulationRequested: text.includes("simulate") || text.includes("plan only") || text.includes("what would you do"),
      rawUtterance: utterance
    };

    // Mapping heuristics for Phase 11.5 Demonstration
    if (text.includes("status") || text.includes("running") || text.includes("backlog")) {
      intent.intentName = "system_status_query";
      intent.actionClass = VoiceActionClass.INFORMATIONAL;
      intent.confidence = 0.95;
    } 
    else if (text.includes("retry") || text.includes("restart")) {
      intent.intentName = "workflow_retry_request";
      intent.actionClass = VoiceActionClass.OPERATIONAL;
      intent.initialRiskScore = 0.4;
      intent.confidence = 0.9;
      
      // Look for ordinals like "second one"
      if (text.includes("second") || text.includes("2nd")) intent.unresolvedReferences = ["index_2"];
      else if (text.includes("first") || text.includes("1st")) intent.unresolvedReferences = ["index_1"];
      else if (text.includes("last")) intent.unresolvedReferences = ["index_last"];
    }
    else if (text.includes("publish") || text.includes("post") || text.includes("send")) {
      intent.intentName = "external_publish_request";
      intent.actionClass = VoiceActionClass.SIDE_EFFECTFUL;
      intent.initialRiskScore = 0.8;
      intent.confidence = 0.85;
      
      if (text.includes("all channels") || text.includes("everywhere")) intent.entities.scope = "global";
      if (text.includes("youtube")) intent.entities.platform = "youtube";
      if (text.includes("today")) intent.entities.time_hint = "today";
    }
    else if (text.includes("prepare") || text.includes("draft") || text.includes("brief")) {
      intent.intentName = "workflow_assembly_request";
      intent.actionClass = VoiceActionClass.PREPARATORY;
      intent.initialRiskScore = 0.2;
      intent.confidence = 0.8;
      
      if (text.includes("morning")) intent.entities.routine = "morning_brief";
    }

    return intent;
  }
}
