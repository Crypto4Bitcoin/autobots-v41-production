# AutoBots Platform Guardrails: The Five Rules

To survive million-workflow production scale and prevent architectural collapse, the AutoBots platform adheres to these five non-negotiable guardrails.

## 1. Events Stay Authoritative
**Rule**: The event stream is the ONLY source of truth.
- **Verification**: No direct status updates or side-table flags allowed without a corresponding event.
- **Enforcement**: Projections must be rebuildable from history at any time. Shortcut mutations that bypass events are considered a critical architectural failure.

## 2. Domain Logic Stays Out of the Core
**Rule**: The platform core is domain-agnostic; packs define domain behavior.
- **Verification**: The Orchestrator and Control Plane must not contain special cases for specific packs (e.g., "if media render then skip check").
- **Enforcement**: Domain-specific logic lives exclusively in Capabilities and Vertical Packs.

## 3. Workers Stay Dumb
**Rule**: Workers execute tasks and emit events; they do not make global or intelligent decisions.
- **Verification**: Intelligence (recommendations, evolution, policy arbitration) must live in specialized services, not in the execution fleet.
- **Enforcement**: Workers follow a strict "Claim-Execute-Emit-Finish" cycle.

## 4. Side Effects are Idempotent
**Rule**: Every action with an external side effect MUST carry an idempotency key.
- **Verification**: Actions like publishing, messaging, or artifact creation must be safe to retry after a lease timeout or worker crash.
- **Enforcement**: `node_run_id` or `workflow_run_id + node_id` serves as the mandatory key.

## 5. Autonomy Grows Through Trust, Not Surprise
**Rule**: The platform follows an "Observe → Recommend → Simulate → Approve → Activate" cycle.
- **Verification**: No autonomous changes (workflow evolution, pack installation, strategic delegation) may bypass governance or human review gates.
- **Enforcement**: Trust-tier policy checks and approval gates are mandatory for all autonomous proposals.

---

> [!IMPORTANT]
> Any code change that violates these rules will be rejected by the governance validator. These guardrails ensure that as the workforce grows, the platform remains deterministic, observable, and trustworthy.
