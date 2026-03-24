export interface DeveloperProject {
  id: string;
  name: string;
  developerId: string;
  status: 'Staging' | 'Published' | 'Restricted';
}

export class DeveloperPortalService {
  private static projects: DeveloperProject[] = [];

  /**
   * Registers a new developer project for marketplace inclusion.
   */
  static async registerProject(name: string, developerId: string): Promise<DeveloperProject> {
    const project: DeveloperProject = {
      id: `proj_${Math.random().toString(36).substr(2, 9)}`,
      name,
      developerId,
      status: 'Staging'
    };
    this.projects.push(project);
    console.log(`[DeveloperPortal] Registered new developer project: ${name} [ID: ${project.id}]`);
    return project;
  }

  static getProject(projectId: string): DeveloperProject | undefined {
    return this.projects.find(p => p.id === projectId);
  }
}
