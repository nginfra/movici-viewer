import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import { Project, UUID } from '@/types';
import { AddProject, DeleteProject, GetProjects, UpdateProject } from '@/api/requests';
import { generalStore } from '@/store/store';
@Module({
  name: 'projects',
  namespaced: true
})
class ProjectStore extends VuexModule {
  allProjects: Project[] = [];
  currentProject: Project | null = null;

  @Mutation
  SET_PROJECTS(projects: Project[]) {
    this.allProjects = projects;
  }

  @Mutation
  SET_ACTIVE_PROJECT(project?: Project) {
    this.currentProject = project ?? null;
    localStorage.activeProjectId = project?.uuid ?? null;
  }

  @Action({ rawError: true })
  async initProjects() {
    await this.getAllProjects();
    const projectId = localStorage.activeProjectId;
    if (projectId) {
      const project = this.getProjectByUUID(projectId);
      this.SET_ACTIVE_PROJECT(project);
      return project;
    }
  }

  @Action({ rawError: true })
  setActiveProjectId(projectId: string) {
    const project = this.getProjectByUUID(projectId);
    this.SET_ACTIVE_PROJECT(project);
    return project;
  }

  @Action({ rawError: true })
  setActiveProjectName(name: string) {
    const project = this.getProjectByName(name);
    this.SET_ACTIVE_PROJECT(project);
    return project;
  }

  @Action({ rawError: true })
  async getAllProjects(): Promise<Project[]> {
    const projects = (await generalStore.api.request(new GetProjects())) ?? [];
    this.SET_PROJECTS(projects);
    return projects;
  }

  @Action({ rawError: true })
  async updateProject(project: Project) {
    return await generalStore.api.request(new UpdateProject(project.uuid, project));
  }

  @Action({ rawError: true })
  async addProject(project: Project) {
    return await generalStore.api.request(new AddProject(project));
  }

  @Action({ rawError: true })
  async deleteProject(project: Project) {
    return await generalStore.api.request(new DeleteProject(project.uuid));
  }

  get projects() {
    return this.allProjects;
  }

  get activeProject() {
    return this.currentProject;
  }

  get activeProjectUUID(): UUID {
    return this.currentProject?.uuid as UUID;
  }

  get getProjectByUUID() {
    return (id: string) => this.allProjects.find(project => project.uuid === id);
  }

  get getProjectByName() {
    return (name: string) => this.allProjects.find(project => project.name === name);
  }
}

export default ProjectStore;
