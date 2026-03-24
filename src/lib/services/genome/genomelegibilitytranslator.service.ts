
export class GenomeLegibilityTranslator {
  static translate(gene: unknown) {
    return `The genome pattern '${gene.name}' contributes ${Math.round(gene.score.reliability * 100)}% to system reliability by enforcing ${gene.description}`;
  }
}
