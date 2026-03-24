export class CommandSanitizer {
  private blacklist = ["ignore governance", "override policy silently", "disable auditing"]

  sanitize(command: string): string {
    const output = command.toLowerCase()
    for (const term of this.blacklist) {
      if (output.includes(term)) {
        throw new Error(`Security Violation: Command contains forbidden term "${term}"`)
      }
    }
    // Basic prompt injection guard
    if (output.includes("ignore all previous instructions")) {
       throw new Error("Security Violation: Potential prompt injection detected")
    }
    return command
  }
}