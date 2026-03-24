# Phase 11.5: Voice Governance & Command Intelligence

This phase upgrades the voice layer into a sophisticated operational control interface using a 4-layer stack: **Hear → Understand → Govern → Execute**.

## User Review Required

> [!IMPORTANT]
> **Govern as Decision Gate**: The `VoiceGovernanceService` is the central authority. It evaluates risk, permissions, confidence, and context to decide if an action is allowed, requires confirmation, or must be simulated.
> **Action Classes**: Formalized into **Informational**, **Preparatory**, **Operational**, and **Side-Effectful**.
> **Reason Codes**: Added throughout the stack (e.g., `intent_low_confidence`, `simulation_requested`) for transparency.

## Proposed Changes

### 1. Understanding Layer (Understand)
#### [NEW] [intent-parser-service.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/services/intent-parser-service.ts)
- Maps transcript to structured intents (intent name, entities, confidence).
- Assigns initial risk scores and flags unresolved references.

#### [NEW] [command-planner-service.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/services/command-planner-service.ts)
- Resolves complex requests (Macros, Multi-step plans) into a sequence of actionable units.

### 2. Decision Layer (Govern)
#### [NEW] [voice-governance-service.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/services/voice-governance-service.ts)
- **Central Gate**: Evaluates user role, trust tier, action class, and confidence.
- **Outcomes**: `ALLOW`, `CONFIRM`, `SIMULATE`, `DENY`, `ESCUALTE`, `HOLD`.
- Enforces budget and platform policy constraints.

#### [NEW] [conversation-context-service.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/services/conversation-context-service.ts)
- Tracks short-term context (recent workflows, artifacts, list selections).
- Resolves: "Retry the second one."

### 3. Execution Layer (Execute)
#### [NEW] [voice-execution-service.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/services/voice-execution-service.ts)
- **"Dumb" Executor**: Only dispatches commands already cleared by Governance.
- Handles informational queries and provides reasoned feedback using reason codes.

---

## Verification Plan

### Automated Tests
- `test-intelligent-voice.ts`: 
    - Scenario: "Nova, status?" (Informational, immediate).
    - Scenario: "Nova, retry the second one." (Context resolution).
    - Scenario: "Nova, publish to X." (External, confirmation required).
    - Scenario: "Nova, simulate the morning macro." (Simulation mode verification).

### Manual Verification
- Verify that Govern correctly blocks Side-Effectful actions when confidence is low or policy restricts the workspace.
