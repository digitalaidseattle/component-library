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

import { createPartFromText, createPartFromUri, createUserContent, GoogleGenAI, Part } from "@google/genai";
import Handlebars from "handlebars";
import { Project, ProjectContext } from "../types";
import { getCoreServices, StorageFile } from "@digitalaidseattle/core";
import { AiService } from "../contentGenerationServices";

const CLOUD_FOLDER = import.meta.env.VITE_FIREBASE_STORAGE_FOLDER;


class GeminiAiService implements AiService {

    static models = ["gemini-2.5-flash", "gemini-2.5-pro", "gemini-2.5-flash-lite"];
    private static instance: GeminiAiService;

    static getInstance() {
        if (!GeminiAiService.instance) {
            GeminiAiService.instance = new GeminiAiService();
        }
        return GeminiAiService.instance;
    }

    //ai = getAI(firebaseClient, { backend: new GoogleAIBackend() });
    ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

    getModels() {
        return GeminiAiService.models;
    }
    /**
     * Runs a basic text generation request.
     * This is for prompts where we just want the model to return a text response.
     */
    async query(prompt: string, modelType?: string, contexts?: ProjectContext[]): Promise<any> {
        const parts = this.createParts(contexts ?? []);
        return await this.ai.models.generateContent({
            model: modelType ?? GeminiAiService.models[0],
            contents: createUserContent([
                prompt, ...parts
            ]),
        });
    }

    createParts(contexts: ProjectContext[]): Part[] {
        const parts: Part[] = [];
        contexts.forEach(async (gc, idx) => {
            if (gc.type === 'text') {
                parts.push(createPartFromText(gc.value!));
            } else {
                const uri = await getCoreServices().storageService!.getUrlAsync(`${CLOUD_FOLDER}/${gc.name}`);
                parts.push(createPartFromUri(uri, contexts[idx].type));
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
        prompt: string,
        schemaParams: string[],
        modelType?: string,
        contexts?: ProjectContext[],
    ): Promise<any> {
        const parts = this.createParts(contexts ?? []);
        const responseSchema = this.createSchema(schemaParams);
        return await this.ai.models.generateContent({
            model: modelType ?? GeminiAiService.models[0],
            contents: [prompt, ...parts],
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
