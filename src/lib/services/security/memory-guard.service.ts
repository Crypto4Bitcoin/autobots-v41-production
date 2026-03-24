export class MemoryGuard {
  async validateWrite(data: unknown): Promise<boolean> {
    if (data.type === 'playbook' && data.unsafe) return false
    if (typeof data.content === 'string' && data.content.includes('<script>')) return false
    return true
  }
}