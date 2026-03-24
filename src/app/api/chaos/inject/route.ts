import { ChaosInjectorAgent } from "../../../../lib/agents/chaos-injector-agent";
import { ChaosScenarioService } from "../../../../lib/services/chaos-scenario.service";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const scenario = ChaosScenarioService.getScenario(body.scenario_id);

    if (!scenario) {
      return NextResponse.json({ error: "Scenario not found" }, { status: 404 });
    }

    const injection = await ChaosInjectorAgent.injectFailure({
      ...scenario,
      duration: body.duration
    });

    return NextResponse.json({
      status: "injected",
      injection_id: injection.injection_id,
      scenario: scenario.scenario_id,
      expected_recovery: scenario.expected_response
    });
  } catch (err: unknown) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
