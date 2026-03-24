# Phase 10: Platform Operations & Voice Interaction Layer

This phase transforms AutoBots into an interactive AI operating system, enabling voice-driven commands, conversational monitoring, and real-time internet awareness via Bing integration.

## User Review Required

> [!NOTE]
> **Voice Processing**: The initial implementation uses "Shell" workers for STT/TTS that can be connected to OpenAI Whisper/TTS or local alternatives (Ollama/Piper).
> **Governance**: Voice commands are passed through the standard **Policy Engine** to ensure permissions and budgets are respected before execution.

## Proposed Changes

### 1. Voice & Conversation Workers
#### [NEW] [voice-worker.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/services/voice-worker.ts)
- Handles Speech-to-Text (STT) and Text-to-Speech (TTS) transformations.
- Provides a stream-ready interface for conversational UI.

### 2. Conversational Command Engine
#### [NEW] [conversational-engine.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/services/conversational-engine.ts)
- Translates natural language strings (e.g., "Nova, research AI chips") into structured DAG triggers.
- Provides "Status Report" generation for verbal monitoring (e.g., "Your youtube-publish run is waiting for approval").

### 3. Real-Time Search Integration
#### [NEW] [search-service.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/services/search-service.ts)
- Integration with Bing/Google Search APIs.
- Registers as a platform-wide `Capability` for any agent to consume.

### 4. Orchestrator Extensions
#### [MODIFY] [orchestrator.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/orchestrator/orchestrator.ts)
- Support for `conversation_trigger` as a workflow entry point.

---

## Verification Plan

### Automated Tests
- `test-voice-commands.ts`: Verify that a text command (simulating STT) triggers the correct DAG run and returns a verbal status confirmation.
- `test-search-capability.ts`: Verify that the search service returns trending data that can be consumed by the "TrendScout" agent.

### Manual Verification
- Interaction test: "Nova, status?" -> Confirm verbal summary of active/waiting runs.
