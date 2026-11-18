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



import { Configuration as FirebaseConfiguration } from "@digitalaidseattle/firebase";
import { AI, GenerativeModel, getAI, getGenerativeModel, GoogleAIBackend, Schema } from "firebase/ai";

export class FunderResearchService {

    private static instance: FunderResearchService;

    static getInstance() {
        if (!FunderResearchService.instance) {
            FunderResearchService.instance = new FunderResearchService();
        }
        return FunderResearchService.instance;
    }

    ai: AI;
    constructor() {
        this.ai = getAI(FirebaseConfiguration.getInstance().client, { backend: new GoogleAIBackend() });
    }

    // Provide a JSON schema object using a standard format.
    // Later, pass this schema object into `responseSchema` in the generation config.
    jsonSchema = Schema.object({
        properties: {
            characters: Schema.array({
                items: Schema.object({
                    properties: {
                        name: Schema.string(),
                        description: Schema.string(),
                        email: Schema.string(),
                        phone: Schema.string(),
                        address: Schema.string(),
                        contact: Schema.string(),
                        website: Schema.string()
                    }
                }),
            }),
        }
    });

    createModel(modelType?: string): GenerativeModel {
        return getGenerativeModel(this.ai, {
            model: modelType ?? "gemini-2.5-flash",
            // In the generation config, set the `responseMimeType` to `application/json`
            // and pass the JSON schema object into `responseSchema`.
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: this.jsonSchema
            },
        });
    }
    // Create a `GenerativeModel` instance with a model that supports your use case


    // Wrap in an async function so you can use await
    query(prompt: string): Promise<any> {
        // To generate text output, call generateContent with the text input
        return this.createModel().generateContent(prompt)
            .then(result => JSON.parse(result.response.text()))
            .catch(error => {
                console.error("Error querying AI: ", error);
                throw new Error("Failed to query AI: " + error.message);
            });
    }

}