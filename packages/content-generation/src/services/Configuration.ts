

import { EntityService, Identifier, StorageFile } from "@digitalaidseattle/core";
import { Project, ProjectContent } from "./types";

export interface AiService {
    getModels(): Promise<{ label: string, value: string }[]>;
    query(project: Project, modelType?: string): Promise<any>;
    parameterizedQuery(project: Project, modelType?: string,): Promise<any>;
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
    exporContent(content: ProjectContent): Promise<void>;
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

export class Configuration {
    private static instance: Configuration;

    public static getInstance(): Configuration {
        if (!Configuration.instance) {
            throw new Error('Maps System needs to be configured.');
        }
        return Configuration.instance;
    }

    static props(props: {
        aiService: AiService,
        projectService: ProjectService,
        projectTransactionService: ProjectTransactionService,
        projectContentService: ProjectContentService
    }) {
        Configuration.instance = new Configuration(props);
    }

    aiService: AiService;
    projectService: ProjectService;
    projectTransactionService: ProjectTransactionService;
    projectContentService: ProjectContentService;

    private constructor(props: {
        aiService: AiService,
        projectService: ProjectService,
        projectTransactionService: ProjectTransactionService,
        projectContentService: ProjectContentService
    }) {
        this.aiService = props.aiService;
        this.projectService = props.projectService;
        this.projectTransactionService = props.projectTransactionService;
        this.projectContentService = props.projectContentService;
    }
}