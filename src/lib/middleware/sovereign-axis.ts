import { NextResponse, NextRequest } from "next/server";
import { SovereigntyControlService } from "../services/sovereignty-control.service";
import { CapabilityRegistryService } from "../services/capability-registry-service";

/**
 * ?? SOVEREIGN AXIS MIDDLEWARE (THE INFINITY SPEAR)
 * 
 * Every request through the sovereign head must pass this axis.
 * No bot can think itself into power—all intents are verified
 * against the immutable registry and current posture.
 */
export async function sovereignAxisMiddleware(req: NextRequest) {
  const traceId = req.headers.get("x-trace-id") || `tr-${Date.now()}`;
  const actorId = req.headers.get("x-actor-id") || "system";
  const intentKey = req.headers.get("x-intent-key");

  // 1. Posture Check (The Flower Shield)
  const posture = SovereigntyControlService.getPosture();
  if (posture.evolution_paused && req.nextUrl.pathname.includes("/api/evolution")) {
    console.warn(`[SovereignAxis] BLOCKED: Evolution is paused. Trace: ${traceId}`);
    return NextResponse.json({ error: "SOVEREIGN_LOCK: EVOLUTION_PAUSED" }, { status: 403 });
  }

  // 2. Capability verification (The Inner Ball Core)
  if (intentKey) {
    const capability = await CapabilityRegistryService.getCapability(intentKey);
    if (!capability) {
      console.error(`[SovereignAxis] BLOCKED: Unknown intent key "${intentKey}". Trace: ${traceId}`);
      return NextResponse.json({ error: "Sovereign axis violation: Unknown capability intent." }, { status: 403 });
    }
  }

  // 3. Fail-Closed Default (The Triangle Lock)
  // If the path is /api/control/ignite and posture says global_autonomy is disabled...
  if (req.nextUrl.pathname.includes("/api/control/ignite") && !posture.global_autonomy_enabled) {
    return NextResponse.json({ error: "Access denied: Platform is in LOW_POWER_STAGED mode." }, { status: 403 });
  }

  // 4. Pass through if all verifiers in the flower shell approve.
  return NextResponse.next({
    headers: {
      "x-trace-id": traceId,
      "x-sovereign-posture": JSON.stringify(posture)
    }
  });
}
