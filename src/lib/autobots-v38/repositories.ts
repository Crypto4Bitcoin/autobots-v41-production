export class Repositories {
  async execute(p?: unknown) { (void p); return { ok: true }; }
  async run(p?: unknown) { (void p); return { ok: true }; }
}
export const repositories = new Repositories();

export const territoryRepository = (props: any) => null;
export class territoryRepositoryStub { static async execute() { return {}; } }

export const territoryInfluenceRepository = (props: any) => null;
export class territoryInfluenceRepositoryStub { static async execute() { return {}; } }

export const territoryConflictRepository = (props: any) => null;
export class territoryConflictRepositoryStub { static async execute() { return {}; } }
