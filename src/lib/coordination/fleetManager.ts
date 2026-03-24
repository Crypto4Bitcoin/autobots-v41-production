export interface Fleet { id: string; leaderId: string; memberIds: string[]; requiredRoles: string[]; district: string; missionStatus: 'forming' | 'active' | 'complete' | 'failed' }
export function formFleet(id: string, leaderId: string, members: string[], roles: string[], district: string): Fleet {
    return { id, leaderId, memberIds: members, requiredRoles: roles, district, missionStatus: 'forming' };
}
export function selectLeader(candidateIds: string[], confidenceAndTrust: Record<string, number>): string {
    return [...candidateIds].sort((a,b) => (confidenceAndTrust[b] || 0) - (confidenceAndTrust[a] || 0))[0];
}
