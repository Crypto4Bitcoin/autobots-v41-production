# Phase 12: Autonomous Workflow Recommendation & Assembly

This phase transitions AutoBots from a reactive execution platform to an assistive intelligent system. It adds a layer of intelligence that helps operators decide which workflows to run or build.

## User Review Required

> [!IMPORTANT]
> **Runtime Stability**: Phase 12 components sit *above* the core runtime. They generate workflow definitions but do not modify the Orchestrator or DAG execution logic.
> **Validation Rule**: Generated workflows must pass the same validation pipeline (cycles, deps, capabilities, trust-tiers, governance) as hand-built ones.
> **Draft-First Building**: Voice-guided assembly defaults to a "Draft" state. Worfklows require explicit operator approval/activation before they can be executed.

## Proposed Changes

### 1. Intelligence Layer (Planning)
#### [NEW] [workflow-recommendation-service.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/services/workflow-recommendation-service.ts)
- **Primary Goal**: Maps user goals to existing templates or specialized Vertical Packs.
- Suggests "Safe" templates based on history and enabled packs.

#### [NEW] [workflow-assembler-service.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/services/workflow-assembler-service.ts)
- **Primary Goal**: Assembles new draft DAGs from capability patterns.
- Enforces structural integrity (cycle detection, dependency checking) during assembly.

### 2. Interface Layer (Guidance)
#### [MODIFY] [voice-execution-service.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/services/voice-execution-service.ts)
- **Proposal Mode**: Instead of immediate dispatch, voice commands for building a workflow create a **Pending Draft**.

#### [NEW] [pack-recommendation-service.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/services/pack-recommendation-service.ts)
- Identifies the most suitable Vertical Pack for novel user requests.

---

## Verification Plan

### Automated Tests
- `run-regression-suite.ts`: **Mandatory**. Phase 12 must not break Regression Suite v1.0.
- `test-autonomous-assembly.ts`:
    - Scenario: "Build me a competitor report." -> Verifies Suggestion -> Draft Assembly -> Validation loop.
    - Scenario: "Nova, help me automate my morning brief." -> Verifies recommendation of the "Morning Brief" template.
