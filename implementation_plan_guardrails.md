# Phase 34: Platform Guardrails & Runtime Enforcement

This phase formalizes the 'Five Rules' into the AutoBots runtime. We implement automated enforcement to ensure the system remains observable, deterministic, and governable as it scales.

## User Review Required

> [!IMPORTANT]
> **Strict Idempotency**: All side-effectful capabilities will now be required to provide an idempotency key at registration and execution time.
> **Dumb Worker Enforcement**: The worker registry will now monitor and block any worker attempt to perform 'intelligent' operations reserved for specialized services.

## Proposed Changes

### 1. Runtime Policy Enforcement
#### [NEW] [guardrail-enforcement-service.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/services/guardrail-enforcement-service.ts)
- Runtime validator for Rule 4 (Idempotency) and Rule 5 (Governance/Trust).
#### [MODIFY] [job-lease-service.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/services/job-lease-service.ts)
- Inject mandatory idempotency key validation into the lease claiming process.

### 2. Architectural Integrity
#### [MODIFY] [worker-registry-service.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/services/worker-registry-service.ts)
- Enforce the 'Dumb Worker' principle by restricting worker classes to specific capability sets.
#### [MODIFY] [projection.service.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/services/projection.service.ts)
- Add a 'Verification Mode' to audit projections against the event stream for drift detection (Rule 1).

---

## Verification Plan

### Automated Tests
- `test-platform-guardrails.ts`:
    - Scenario: Attempt side-effect without idempotency key. -> REJECTED.
    - Scenario: Worker attempts intelligent delegation. -> REJECTED.
    - Scenario: Simulate event bypass mutation. -> Projection Audit FAILURE detected.
- `run-regression-suite.ts`: **Final platform validation at v34.0**.
