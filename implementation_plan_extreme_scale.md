# Phase 35: Deterministic Execution, Policy Compilation & Snapshot Recovery

This phase establishes the final deterministic substrate of AutoBots. We ensure every run is version-anchored, every policy decision is persisted, and recovery is accelerated through tiered, range-aware snapshots.

## User Review Required

> [!IMPORTANT]
> **Fail-Closed Production**: Production runs will now strictly reject execution if any core dependency (workflow, pack, policy) is unpinned or floating.
> **Persisted Policies**: Policy bundles are now immutable artifacts. A single compiled bundle governs an entire execution context.
> **Truth Hierarchy**: Snapshots are strictly for acceleration. The Event Ledger remains the only authoritative record.

## Proposed Changes

### 1. Deterministic Execution Contracts (Foundation)
#### [MODIFY] [contract-stamp-service.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/services/contract-stamp.service.ts)
- Add mandatory version auditing.
- Implement fail-closed logic for floating references (unpinned packs, mutable schemas).
- Stamp `execution_contract_version` on every run.

### 2. Formal Policy Compilation (Persisted Artifacts)
#### [MODIFY] [policy-compiler-service.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/services/policy-compiler.service.ts)
- Transform compiler output into a persisted `policy_bundle` artifact.
- Add `compiler_version` and `compiled_at` metadata.
- Ensure all platform consumers reference the same bundle ID for a given context.

### 3. Tiered Incremental Snapshotting
#### [MODIFY] [snapshot-service.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/services/snapshot-service.ts)
- Implement tiered snapshot classes: `workflow`, `projection`, `task_graph`.
- Make snapshots range-aware using `source_stream_range` (start/end event IDs).
- Add `snapshot_builder_version` stamping.

### 4. Hybrid Replay & Equivalence
#### [MODIFY] [checkpoint-replay-service.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/services/checkpoint-replay-service.ts)
- Implement range-checked incremental reconstruction.
- Support "Ignore Snapshot" path for full ledger fallback.

---

## Verification Plan

### Automated Tests
- `test-deterministic-replay-equivalence.ts`:
    - **Equivalence Check**: Verify that `Full Ledger Replay` state is identical to `Snapshot + Tail Replay` state.
    - **Contract Enforcement**: Verify that runs with unpinned packs are rejected.
    - **Policy Persistence**: Verify that multiple services resolve to the exact same persisted policy bundle ID.
- `run-regression-suite.ts`: **Confirm 30/30 PASSED record.**
