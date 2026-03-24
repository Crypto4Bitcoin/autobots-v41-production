export class DeploymentTemplateService {
  async buildTemplate(input: { category: string }) {
    return "template:" + input.category + ":runtime+memory+analytics+autopost"
  }
}
