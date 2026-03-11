import { Identifier } from "@digitalaidseattle/core";
import { ProjectTransactionService } from "../contentGenerationServices";
import { Project, ProjectContent } from "../types";
import { cloneProject } from "./CloneProject";
import { createProject } from "./CreateProject";
import { deleteProject } from "./DeleteProject";
import { generateProjectContent } from "./GenerateProjectContent";
import { saveProject } from "./SaveProject";
import { exportProjectContent } from "./ExportProjectContent";

export class TransactionService implements ProjectTransactionService {

  private static instance: TransactionService;

  static getInstance() {
    if (!TransactionService.instance) {
      TransactionService.instance = new TransactionService();
    }
    return TransactionService.instance;
  }
  
  async create(): Promise<Project> {
    return createProject();
  }
  async clone(project: Project): Promise<Project> {
    return cloneProject(project);
  }
  async delete(id: Identifier): Promise<void> {
    return deleteProject(id);
  }

  async generateContent(project: Project): Promise<ProjectContent> {
    return generateProjectContent(project);
  }

  async save(project: Project): Promise<Project> {
    return saveProject(project);
  }

  async exporContent(content: ProjectContent): Promise<void> {
    return exportProjectContent(content);
  }

}
