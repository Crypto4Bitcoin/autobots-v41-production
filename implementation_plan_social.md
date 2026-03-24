# Phase 9: Social Execution Pack v1

This phase extends AutoBots with the "Social Execution Pack", enabling agents to browse the web, download/edit media, and publish to social platforms.

## User Review Required

> [!IMPORTANT]
> **Browser Automation Constraints**: Browser-based social publishing is susceptible to auth-flow changes and rate limits. The architecture prioritizes **API-first, Browser-second** execution. human review gates are mandatory for sensitive publishing steps during the pilot.

## Proposed Changes

### 1. Database Schema Extensions
#### [NEW] [20240322_social_execution.sql](file:///c:/Users/owner/.gemini/antigravity/scratch/supabase/migrations/20240322_social_execution.sql)
- `external_accounts`: Manages credentials and platform statuses.
- `publish_jobs`: Tracks the lifecycle of social media posts.

### 2. Social Workers & Infrastructure
#### [NEW] [browser-worker.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/services/browser-worker.ts)
- Playwright-based worker for navigation, screenshots, and form submission.
#### [NEW] [media-worker.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/services/media-worker.ts)
- FFmpeg and downloader integration for media processing.
#### [NEW] [publish-worker.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/services/publish-worker.ts)
- Bridge to platform APIs and browser-based publishing fallback.

### 3. Agent & Capability Registry
#### [MODIFY] [capability-registry-service.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/services/capability-registry-service.ts)
- Register `BrowserControlAgent`, `MediaAcquisitionAgent`, `VideoEditAgent`, and `PublisherAgent`.

### 4. Workflow Template
- Seed the `source-to-multi-platform-publish` DAG template.

---

## Verification Plan

### Automated Tests
- `test-social-workflow.ts`: Full lifecycle test from "Discover" to "Mock Publish" across multiple platforms (YouTube, TikTok, X).
- `test-media-processing.ts`: Verify FFmpeg clipping and metadata extraction.

### Manual Verification
- Execute a browser task (e.g., search and screenshot) and verify artifact storage.
- Resolve a human review gate for a generated social post.
