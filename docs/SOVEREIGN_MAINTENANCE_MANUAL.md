# ?? SOVEREIGN MAINTENANCE MANUAL (V4.1)
**AutoBots Platform // Regulation Brain // Level 5.5 Readiness**

---

## ?? 1. STARTUP ORDER (IGNITION)
Follow this precise sequence to transition from **OFFLINE** to **SOVEREIGN_IDLE**.

| Phase | Action | Verification |
| :--- | :--- | :--- |
| **0. ENV** | Confirm Vercel env vars match the V4 Pack. | Edge variables locked. |
| **1. SYNC** | Trigger fresh Vercel deployment. | Build Status: **READY**. |
| **2. HEALTH** | Reach `https://[domain]/api/health`. | Return `200 OK` (SOVEREIGN_IDLE). |
| **3. CONTROL** | Reach `https://[domain]/control`. | Monitor Loads (4-Gate Verification). |
| **4. SPINE** | Apply `schema.sql`, `telegram.sql`, and `generated_divisions.sql`. | **DB Spine** bar reaches 19/19. |
| **5. PROOF** | Run `npx tsx src/scripts/test-webhook-roundtrip.ts`. | **Audit Trail** appears in `/control`. |

---

## ??? 2. LOW-STATE OPERATING POSTURE
Current system baseline for **SOVEREIGN_IDLE** mode.

| Category | Posture | Logic |
| :--- | :--- | :--- |
| **Edge API** | **ON** | Core health, webhook, and regulation routes are reachable. |
| **DB Spine** | **LOW (READ-ONLY)** | 19-division registry is immutable. No writes outside of logs. |
| **Automation** | **OFF** | `job_runs` are queued but not executed (Low Power Stage). |
| **Telegram** | **ON (LISTEN)** | Webhook accepts inbound, logs event, and sends static reply. |
| **Storage** | **LOW** | No large asset ingestion or blob updates allowed. |

---

## ?? 3. FAILURE CONDITIONS & RESPONSES
Identifying and mitigating system drift.

| Error | Condition | Protocol |
| :--- | :--- | :--- |
| **404 / 500** | `/api/health` unreachable. | **ISOLATE:** Check edge provisioning and env vars. |
| **DB MISMATCH** | DB Spine count < 19. | **RE-SEED:** Run `seed-divisions.mjs` against the live edge. |
| **WEBHOOK FAIL** | Inbound message not logged. | **AUDIT:** Verify `TELEGRAM_WEBHOOK_SECRET` in Vercel vs script. |
| **DASHBOARD STALE** | Monitor data > 30s old. | **RE-SYNC:** Click "Force Sync" or check `/api/control/status`. |
| **RLS BYPASS** | Non-authenticated /api access. | **LOCKDOWN:** Switch from `anon` to `service_role` proxy. |

---

## ??? 4. RECOVERY STEPS (INCIDENT MANAGEMENT)
If the system becomes unstable, follow the isolation sequence:

1.  **Shutdown First**: Disable the Telegram Hook (Clear `TELEGRAM_WEBHOOK_SECRET`).
2.  **Isolate State**: Switch `/control` to **LOCKDOWN** mode.
3.  **Validate Spine**: Run `SELECT COUNT(*) FROM divisions;` in Supabase.
4.  **Re-Test Logic**: Test `api/health` locally before re-enabling edge.
5.  **Ignition Proof**: Re-run the Round-Trip proof script once stable.

---

## ?? 5. SECRET ROTATION PROCEDURE (WEBHOOK)
Required if the `TELEGRAM_WEBHOOK_SECRET` is exposed.

1.  **Generate**: Random 48-byte key (Base64).
2.  **Vercel Update**: Paste the new secret into Project Settings.
3.  **Local Sync**: Update `src/db/.telegram_secret` and `.env.local`. 
4.  **Redeploy**: Trigger a fresh build to synchronize the edge secrets.
5.  **Proof**: Run `test-webhook-roundtrip.ts` to verify the new handshake.

---

## ??? 6. V4 TO V5 TRANSITION RULES
Guidelines for future architectural evolution.

1.  **Stable Spine**: The 19-division registry (divisions table) must never be dropped.
2.  **Hardened Webhook**: All inbound Telegram traffic must be verified via secret-token.
3.  **Proxy Monitoring**: Live UI data (SovereignMonitor) must always flow through server-secured API proxies.
4.  **Certification**: Every change to the `/control` route requires a fresh `npm run build` and `test-webhook-roundtrip` proof.

---
**DESIGNATED GALACTIC INFRASTRUCTURE // INFINITY LOOP LOCKED**
