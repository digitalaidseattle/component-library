/**
 *  ContentGenerationServices.ts
 *
 *  IoC container for service access
 * 
 *  @copyright 2024 Digital Aid Seattle
 *
 */


import { EntityService, Identifier, StorageFile } from "@digitalaidseattle/core";
import { Part } from "@google/genai";
import { Project, ProjectContent, ProjectContext } from "./types";

export interface AiService {
  getModels(): string[];
  query(prompt: string, modelType?: string, contexts?: ProjectContext[]): Promise<any>;
  createParts(contexts: ProjectContext[]): Part[];
  createSchema(schemaParams: string[]): any;
  parameterizedQuery(prompt: string, schemaParams: string[], modelType?: string, contexts?: ProjectContext[]): Promise<any>;
  calcTokenCount(model: string, content: string): Promise<number>;
  calcFileTokenCount(model: string, file: File): Promise<number>;
  calcStorageFileTokenCount(model: string, file: StorageFile): Promise<number>;
  generatePrompt(project: Project): string;
}

export interface ProjectTransactionService {
  create(): Promise<Project>;
  clone(project: Project): Promise<Project>;
  save(project: Project): Promise<Project>;
  delete(id: Identifier): Promise<void>;
  generateContent(project: Project): Promise<ProjectContent>;
}

export interface ProjectService extends EntityService<Project> {
  empty(): Project;
  findByName(name: string): Promise<Project[]>;
}

export interface ProjectContentService extends EntityService<ProjectContent> {
  empty(): ProjectContent;
  export(projectContent: ProjectContent): Promise<void>;
}

export interface ContentGenerationServices {
  aiService: AiService;
  projectService: ProjectService;
  projectTransactionService: ProjectTransactionService;
  projectContentService: ProjectContentService;
}

let services: ContentGenerationServices;

export function setContentGenerationServices(s: ContentGenerationServices) {
  services = s;
}

export function getContentGenerationServices() {
  return services;
}