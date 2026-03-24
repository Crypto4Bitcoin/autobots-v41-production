import { NextResponse } from "next/server"
import { RepairDoctorAgent } from "@/lib/services/reliability/repair-doctor.service"
import { RepairNurseAgent } from "@/lib/services/reliability/repair-nurse.service"

export async function POST(req: Request) {
  try {
    const { incident } = await req.json()
    const doctor = new RepairDoctorAgent()
    const nurse = new RepairNurseAgent()

    const action = await doctor.diagnose(incident)
    const success = await nurse.executeRepair(action, incident)

    return NextResponse.json({ status: "success", action, success })
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ status: "error", message: "Repair failed" }, { status: 500 })
  }
}