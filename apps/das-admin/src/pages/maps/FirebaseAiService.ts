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

import { AI, getAI, getGenerativeModel, GoogleAIBackend, Part } from "firebase/ai";
import { Configuration as FirebaseConfiguration} from "@digitalaidseattle/firebase";

export type ProjectOutput = {
    name: string;
    maxWords?: number;
    unit?: 'words' | 'characters';
}

export type ProjectContext = {
    value: string;
}

export type Project = {
    prompt: string;
    modelType?: string;
    contexts: ProjectContext[];
};

export class FirebaseAiService {

    private static instance: FirebaseAiService;

    static getInstance() {
        if (!FirebaseAiService.instance) {
            FirebaseAiService.instance = new FirebaseAiService();
        }
        return FirebaseAiService.instance;
    }

    ai: AI;
    models: { label: string, value: string }[] | undefined = undefined;
    storageFolder = "";

    constructor() {
        const firebaseClient = FirebaseConfiguration.getInstance().getClient();

        console.log('Initializing Firebase AI client with config', FirebaseConfiguration.getInstance());
        this.ai = getAI(firebaseClient, { backend: new GoogleAIBackend() });
    }

    createParts(project: Project): Part[] {
        const parts: Part[] = [];
        project.contexts.forEach(async (gc) => {
            parts.push({ text: gc.value });
        });
        return parts;
    }

    async getModels(): Promise<{ label: string, value: string }[]> {
        throw new Error("not implemented")
    }

    /**
     * Sends a prompt to the AI and tells it which fields to return.
     * 
     * You give it a list of field names (like ["Summary", "Budget"]),
     * and the AI will return a JSON object with those fields filled in.
     */
    async parameterizedQuery(
        project: Project,
        schema: { [key: string]: unknown },
        modelType?: string
    ): Promise<any> {
        const parts = this.createParts(project);
        const model = getGenerativeModel(this.ai, {
            model: modelType ?? project.modelType ?? 'gemini-2.5-flash',
            generationConfig: {
                responseMimeType: "application/json",
                responseJsonSchema: schema
            }
        });
        return model.generateContent([project.prompt, ...parts])
    }

}
