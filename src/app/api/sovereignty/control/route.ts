import { SovereigntyControlService } from "../../../../lib/services/sovereignty-control.service";
import { InterruptAuthorityEngine } from "../../../../lib/services/interrupt-authority-engine.service";
import { ContainmentProtocolManager } from "../../../../lib/services/containment-protocol-manager.service";
import { OverrideChainSystem } from "../../../../lib/services/override-chain.service";
import { AutonomyScopeController } from "../../../../lib/services/autonomy-scope-controller.service";
import { LastResortCustodianMode } from "../../../../lib/services/last-resort-custodian.service";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(SovereigntyControlService.getPosture());
}

export async function POST(request: Request) {
  try {
    const { action, payload, user } = await request.json();
    
    switch (action) {
      case "pause":
        return NextResponse.json(await InterruptAuthorityEngine.triggerEmergencyPause(payload.reason, user));
      case "resume":
        return NextResponse.json(await InterruptAuthorityEngine.resumeAutonomy(user));
      case "contain":
        return NextResponse.json(await ContainmentProtocolManager.applyLevel(payload.level));
      case "set_scope":
        return NextResponse.json(await AutonomyScopeController.setScopePosture(payload.scope, payload.posture));
      case "override":
        return NextResponse.json(await OverrideChainSystem.applyOverride(payload.level, payload.scope, user, payload.duration));
      case "custodian":
        return NextResponse.json(await LastResortCustodianMode.activate());
      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
  } catch (err: unknown) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
