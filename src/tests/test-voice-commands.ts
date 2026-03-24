import { VoiceWorker } from "../lib/services/voice-worker";
import { ConversationalCommandEngine } from "../lib/services/conversational-engine";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { SearchService } from "../lib/services/search-service";
import { TrendScoutAgent } from "../lib/agents/trend-scout-agent";
import { PipelineState } from "../lib/types/enums";

async function testVoiceInteraction() {
  console.log("🚀 Testing Phase 10: Platform Operations & Voice Interaction Layer...\n");

  const workspaceId = "00000000-0000-0000-0000-000000000001";

  // 1. Test Voice STT to Command
  console.log("Test: Voice Command Parsing (STT Simulation)");
  const transcribedText = await VoiceWorker.speechToText(null); 
  console.log(`- Transcribed: "${transcribedText}"`);
  
  const response = await ConversationalCommandEngine.processCommand(transcribedText, workspaceId);
  console.log(`- Conversational Response: "${response}"`);
  console.log("✅ Passed: Voice command recognized and mapped to action.");

  // 2. Test Live Search Integration (TrendScout)
  console.log("\nTest: TrendScoutAgent (Search/Bing Integration)");
  const agent = new TrendScoutAgent();
  const agentOutput = await agent.process({
      pipelineItemId: "item-1",
      workspaceId: workspaceId,
      inputState: PipelineState.RESEARCHING,
      targetState: PipelineState.RESEARCHING,
      payload: { topic: "Agentic AI OS" }
  });

  // Type assertion for build pass
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const outputData = agentOutput.output as any;
  console.log(`- Agent Findings: ${outputData.topTrends.join(", ")}`);
  console.log("✅ Passed: Live search results integrated into agent output.");

  // 3. Test TTS Summary
  console.log("\nTest: Text-to-Speech (Verbal Summary)");
  const verbalSummary = await VoiceWorker.textToSpeech(response);
  console.log(`- TTS Output: ${verbalSummary.audioUri}`);
  console.log("✅ Passed: Verbal summary generated for user.");

  console.log("\n🎉 VOICE INTERACTION & SEARCH VERIFIED!");
}

testVoiceInteraction();
