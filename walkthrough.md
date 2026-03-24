# Canonical Architecture Document: AutoBots Platform Walkthrough
**Current Version: v35.1 (Deterministic Scale-Hardened Operating System)**
**Verified Baseline: Regression Suite v8.0 (31 Tests) PASSED**

AutoBots is a **deterministic, scale-hardened autonomous operating system** built on versioned execution contracts and range-aware tiered recovery. 

---

## 🏗️ Core Architecture Layers

### 1. Platform Runtime Layer (Engine)
The foundational orchestration runtime. It is agnostic to the *purpose* of any workflow.
- **DAG Engine**: Dependency scheduling with support for parallel fan-out and dependency-safe fan-in.
- **Atomic Queue**: Job selection and claiming via PostgreSQL `FOR UPDATE SKIP LOCKED`.
- **Event Backbone**: Durable source of truth recording every state transition and platform milestone.
- **Heartbeat System**: Resilience for long-running nodes via 30-second worker heartbeats.

### 2. Governance & Intelligence Layer
The decision engine that protects system stability and optimizes cost/quality.
- **Adaptive Policy Engine**: Shapes execution based on cost, risk, load, and strategy selection.
- **Trust Tiers**: Classification of capabilities (Tier 1-4) to enforce automated safety gates.
- **Optimization Memory**: Self-improving provider strategies driven by outcome history.
- **Multi-Tenant Governance**: Workspace-level budgets, quotas, and feature enablement.

### 3. Capability & Pack Ecosystem
The interface between the platform and specialized domain logic.
- **Capability Registry**: Decouples agents and tools into modular capabilities (e.g., `media.render`, `search.web`).
- **Vertical Packs**: Manifest-driven application bundles (Media, Research) that implement specific domains.
- **Platform SDK**: The extension model for registering new capabilities and packs.

### 4. Execution Workers
The "hands" of the system that perform real-world actions.
- **BrowserWorker**: Playwright-driven automation for scraping and web interaction.
- **MediaWorker**: FFmpeg/Remotion-driven programmatic media production.
- **API/Tool Adapters**: Standardized drivers for external SaaS and tool integrations.

### 5. Interaction Interfaces
The control surface for operators.
- **Voice Intelligence Stack**: A 4-layer control stack (**Hear → Understand → Govern → Execute**) with intent parsing and contextual memory.
- **Human Review Gates**: Native support for manual approval tasks in any workflow.
- **Conversational Engine**: Natural language status monitoring and operational control.

---

## 🏛️ The Golden Rule: Domain Isolation
To maintain architectural purity, **domain logic must never leak into the Platform Layer.**

1. **Platform** knows *how* to run nodes, but not *what* they do.
2. **Packs** define *what* is done, using Platform primitives.
3. **Capabilities** are the interface: The Platform registers them; the Packs implement them.
4. **Governance** must never be bypassed by convenience features (voice, macros, etc.).

---

## ⏳ Evolutionary Timeline (Phase History)

| Phase | Milestone | Core Impact |
| :--- | :--- | :--- |
| **1-6** | Core Hardening | Atomic claiming, identity safety, and concurrent worker stability. |
| **7** | Universal DAG Engine | Moved from state-ladders to Directed Acyclic Graph orchestration. |
| **8** | Platform Enablement | Introduced Capability Registry and Human-in-the-Loop gates. |
| **9** | Social Execution Pack | Added Browser (Playwright) and Media (FFmpeg) execution workers. |
| **10** | OS Interaction Layer | Voice interaction, Conversational Engine, and Search integration. |
| **11** | Platform Scale | Multi-workspace governance, Trust Tiers, and Pack Registry. |
| **11.5** | Voice Intelligence | Intent parsing, Command Planning, and Simulation Mode. |

---

## 🚀 Current Status & Roadmap

### Current Version: v13.0 (Intelligent Advisor) 
**Verified Baseline: Regression Suite v1.1 PASSED**

AutoBots now operates as a governed AI workflow platform with workflow memory, recommendation feedback, durable draft proposals, and initialized visual workflow refinement. The platform is ready to progress into full visual editing, health supervision, pack lifecycle management, and multi-agent workforce coordination without destabilizing the core runtime.

---

## 🗺️ Extended Roadmap (Phases 14-17)

### Phase 14: Visual Autonomous Workflow Builder
AutoBots transitions from draft proposal into **visual workflow refinement**.
- **WorkflowProposalViewer**: Renders draft DAGs as interactive maps.
- **WorkflowBuilderEditor**: Visually edit nodes, dependencies, paths, and human gates.
- **Policy-Aware Editing**: Edits must pass DAG validation, capability registry checks, and trust-tier rules.
- **Draft-First Editing**: Visual edits remain inactive in a proposal state until explicitly approved.

### Phase 15: Platform Health Supervision
Adds **supervisory intelligence** above workflow execution.
- **WorkflowHealthSupervisor**: Evaluates queue depth, latency, and pack-specific bottlenecks.
- **Bottleneck Intelligence**: Identifies failing packs or rising review backlogs.
- **Supervisory Agents**: BottleneckSupervisor, DeadLetterTriageAgent, CostAnomalyDetector.
- **Operational Outcomes**: Recommends policy adjustments or safer routing without direct runtime mutation.

### Phase 16: Pack Ecosystem & Lifecycle Management
Evolves from a platform with packs into a **managed pack ecosystem**.
- **Pack Registry**: Packs become first-class installable units with manifests and semver.
- **Pack Lifecycle**: Supports upgrade paths, dependency lists, and health status.
- **Workspace Controls**: Enable/disable packs, pin versions, and apply restrictions per workspace.

### Phase 17: Multi-Agent Workforce Layer
Evolves into **governed multi-agent collaboration**.
- **Agent Identity**: Agents have roles, trust profiles, and performance history.
- **Role-Based Assignment**: Nodes specify required roles or collaboration modes.
- **Coordination Patterns**: Lead-and-delegate, draft-critique-revise, consensus patterns.
- **Delegation**: Lead agents create governed subtasks for specialized executors.

---

## 🛠️ Critical Platform Hardening
1. **Data Retention & Archival**: Hot/warm/cold strategy for event and artifact growth.
2. **Execution Visibility**: Tracking `queue_wait_ms` and per-workflow/capability cost.
3. **Idempotency Everywhere**: Enforcing idempotency keys for side-effectful tool adapters.
4. **Capability Drift Detection**: Monitoring quality degradation via review pass rates and latency trends.
5. **Proposal-to-Activation Audit**: Tracking the journey from goal prompt to final approved DAG.

---

**Note**: This document is the **One Source of Truth** for the AutoBots architecture. All design decisions and operational procedures must align with the principles defined here.
