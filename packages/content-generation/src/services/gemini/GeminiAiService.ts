/**
 * Institution AI Service
 * This service interacts with the AI backend to generate content related to institutions.
 * It uses the Firebase AI SDK to create a generative model that can respond to prompts
 * about institutions, such as listing philanthropic organizations in a specific area.  
 * 
 * Provision Firebase application  in Google Cloud
 * <ol>
 * <li>Go to the Google Cloud Console.</li>
 * <li>Select an existing project.</li>
 * <li>Navigate to the "APIs & Services" page.</li>
 * <li>Click on "Credential".</li>
 * <li>Edit API (the key should match the API key in the .env file).</li>
 * <li>Enable the "Generative Language API" and "Firebase AI Logic API" restrictions.</li>
 * </ol>
 */

import { getCoreServices, StorageFile } from "@digitalaidseattle/core";
import { createPartFromText, createPartFromUri, createUserContent, GoogleGenAI, Part } from "@google/genai";
import Handlebars from "handlebars";
import { AiService } from "../contentGenerationServices";
import { Project } from "../types";
import { getGeminiConfiguration } from "./GeminiConfiguration";

class GeminiAiService implements AiService {

    private static instance: GeminiAiService;

    static getInstance() {
        if (!GeminiAiService.instance) {
            GeminiAiService.instance = new GeminiAiService();
        }
        return GeminiAiService.instance;
    }

    ai: GoogleGenAI;
    storageFolder: string;
    models: { label: string, value: string }[] | undefined = undefined;

    constructor() {
        const config = getGeminiConfiguration();
        this.ai = new GoogleGenAI({ apiKey: config.firebase_options.apiKey });
        this.storageFolder = config.storage_folder;
    }

    async getModels(): Promise<{ label: string, value: string }[]> {
        if (!this.models) {
            let gemModels = await this.ai.models.list();
            const items: { label: string, value: string }[] = [];
            let done = false;
            do {
                for (let i = 0; i < gemModels.pageSize; i++) {
                    const mm = gemModels.getItem(i);
                    if (mm.name && mm.name.startsWith('models/gemini')) {
                        items.push({
                            label: mm.displayName!,
                            value: mm.name!
                        });
                    }
                }
                if (gemModels.hasNextPage()) {
                    gemModels.nextPage();
                } else {
                    done = true;
                }
            } while (!done)
            this.models = items.sort((mm1, mm2) => mm1.label.localeCompare(mm2.label));
        }
        return this.models;
    }

    /**
     * Runs a basic text generation request.
     * This is for prompts where we just want the model to return a text response.
     */
    async query(project: Project, modelType?: string): Promise<any> {
        const parts = this.createParts(project);
        return await this.ai.models.generateContent({
            model: modelType ?? (this.models ? this.models[0].value : ''),
            contents: createUserContent([
                project.prompt, ...parts
            ]),
        });
    }

    createParts(project: Project): Part[] {
        const parts: Part[] = [];
        project.contexts.forEach(async (gc, idx) => {
            if (gc.type === 'text') {
                parts.push(createPartFromText(gc.value!));
            } else {
                const uri = await getCoreServices().storageService!.getUrlAsync(`${this.storageFolder}/${project.id}/${gc.name}`);
                parts.push(createPartFromUri(uri, project.contexts[idx].type));
            }
        });
        return parts;
    }

    createSchema(schemaParams: string[]): any {
        return {
            type: 'object',
            properties: Object.fromEntries(
                schemaParams.map(field => [field, { type: "string" }])
            ),
            required: schemaParams
        };
    }

    /**
     * Sends a prompt to the AI and tells it which fields to return.
     * 
     * You give it a list of field names (like ["Summary", "Budget"]),
     * and the AI will return a JSON object with those fields filled in.
     */
    async parameterizedQuery(
        project: Project,
        modelType?: string
    ): Promise<any> {
        const parts = this.createParts(project);
        const schemaParams = project.outputs.map((o) => o.name);
        const responseSchema = this.createSchema(schemaParams);
        return await this.ai.models.generateContent({
            model: modelType ?? (this.models ? this.models[0].value : ''),
            contents: [project.prompt, ...parts],
            config: {
                responseMimeType: "application/json",
                responseJsonSchema: responseSchema,
            },
        });
    }

    async calcTokenCount(model: string, content: string): Promise<number> {
        return this.ai.models
            .countTokens({
                model: model,
                contents: ["Count tokens for this document", content]
            })
            .then(response => response.totalTokens ?? 0);
    }

    async calcFileTokenCount(model: string, file: File): Promise<number> {
        // const bytes = await fileToBase64(file);
        const uploaded = await this.ai.files.upload({
            file: file,
            config: { mimeType: file.type },
        });

        return this.ai.models
            .countTokens(
                {
                    model: model,
                    contents: createUserContent([
                        "Count tokens for this document",
                        createPartFromUri(uploaded.uri!, uploaded.mimeType!),
                    ])
                })
            .then(response => response.totalTokens ?? 0)
            .catch(err => {
                console.error("Error calculating token count for file", err);
                return 0;
            })
    }

    async calcStorageFileTokenCount(model: string, file: StorageFile): Promise<number> {
        try {
            const uri = await getCoreServices().storageService!.getUrlAsync(file.fullPath);
            return this.ai.models
                .countTokens({
                    model: model,
                    contents: createUserContent([
                        "Count tokens for this document",
                        createPartFromUri(uri, file.type ?? "application/octet-stream"),
                    ])
                })
                .then(response => response.totalTokens ?? 0);
        } catch (err) {
            console.error("Error calculating token count for FirebaseStorageFile", err);
            return 0;
        }
    }

    generatePrompt(project: Project): string {
        if (project.outputs.length > 0) {
            const compiled = Handlebars.compile(project.template + `.  Where {{#each outputs}}{{#unless @first}} and{{/unless}} the output "{{name}}" cannot have more than {{maxWords}} of {{unit}} {{/each}}.`);
            return compiled({
                outputs: project.outputs,
            });
        } else {
            return project.template;
        }
    }

}

export { GeminiAiService };
