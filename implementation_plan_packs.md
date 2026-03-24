# Phase 16: Pack Ecosystem & Lifecycle Management

AutoBots now formalizes **Vertical Packs** as first-class, versioned platform units. This enables clean pack installation, upgrades, and workspace-level lifecycle management without bloating the core platform logic.

## User Review Required

> [!IMPORTANT]
> **Governed Installation**: Pack installation is subject to workspace-level governance (assertPackInstallAllowed), ensuring that only approved domain logic is activated.
> **Lifecycle Decoupling**: Pack logic and manifests are stored in the Pack Registry, keeping the core DAG engine agnostic to domain-specific configurations.

## Proposed Changes

### 1. Pack Registry & Lifecycle Layer
#### [NEW] [pack-registry-service.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/services/pack-registry.service.ts)
- Handles pack registration, versioning, and capability mapping.
#### [NEW] [pack-lifecycle-service.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/services/pack-lifecycle.service.ts)
- Manages workspace-level pack installation, upgrades, and enabling/disabling.
#### [NEW] [pack-compatibility-service.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/services/pack-compatibility-service.ts)
- Validates pack manifests and workspace trust-tier compatibility.

### 2. Core Platform Extensions
#### [MODIFY] [supabase-service.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/services/supabase-service.ts)
- Add pack registry CRUD methods: `createVerticalPack`, `createPackVersion`, `linkPackCapability`, `getVerticalPackBySlug`, `listVerticalPacks`, `installWorkspacePack`, `updateWorkspacePackInstall`, `checkPackVersionExists`.
#### [MODIFY] [governance-service.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/services/governance-service.ts)
- Add `assertPackInstallAllowed` hook to enforce workspace-level pack restrictions.

### 3. Persistence Layer
#### [NEW] `vertical_packs`, `pack_versions`, `pack_capability_links`, `pack_workflow_links`, `workspace_pack_installs` tables
- (Note: MOCKED for local testing).

---

## Verification Plan

### Automated Tests
- `test-pack-ecosystem.ts`:
    - Scenario: Register "research-pack" (v1.0.0). -> Success.
    - Scenario: Install pack to workspace. -> Success.
    - Scenario: Try to install denied pack. -> Rejected by Governance.
    - Scenario: Upgrade pack version. -> Version updated in workspace record.
- `run-regression-suite.ts`: **Mandatory**. Must pass full suite (v1.0 - v16.0).
