
import { randomUUID } from "crypto"
import { SchoolIdentityRecord } from "./types"

export class SchoolIdentityDidService {
  private static identities: SchoolIdentityRecord[] = []

  async issue(input: { schoolId: string }) {
    const record: SchoolIdentityRecord = {
      id: randomUUID(),
      schoolId: input.schoolId,
      did: `did:omega-academy:${input.schoolId}`,
      credentialStatus: "active",
      publicKeyRef: `pk-${input.schoolId}`,
      createdAt: new Date().toISOString(),
    }

    SchoolIdentityDidService.identities.unshift(record)
    return record
  }

  async list() {
    return [...SchoolIdentityDidService.identities]
  }
}
