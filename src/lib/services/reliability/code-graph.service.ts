export interface DependencyNode {
  path: string
  imports: string[]
  unresolved: string[]
  isComponent: boolean
}

export class CodeGraphService {
  private nodes = new Map<string, DependencyNode>()

  async scanFile(filePath: string, content: string): Promise<DependencyNode> {
    // Regex to find static imports
    const importRegex = /import\s+.*?\s+from\s+['"](.*?)['"]/g
    const imports: string[] = []
    let match
    while ((match = importRegex.exec(content)) !== null) {
      imports.push(match[1])
    }

    const node: DependencyNode = {
      path: filePath,
      imports,
      unresolved: [],
      isComponent: filePath.endsWith('.tsx')
    }
    this.nodes.set(filePath, node)
    return node
  }

  async markUnresolved(filePath: string, target: string): Promise<void> {
    const node = this.nodes.get(filePath)
    if (node && !node.unresolved.includes(target)) {
      node.unresolved.push(target)
    }
  }

  getGraph(): Map<string, DependencyNode> {
    return this.nodes
  }
}