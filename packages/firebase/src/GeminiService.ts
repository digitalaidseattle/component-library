/**
 * Institution AI Service
 * 
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



import { AiService } from "@digitalaidseattle/core";
import { firebaseClient } from "@digitalaidseattle/firebase";
import { AI, getAI, getGenerativeModel, GoogleAIBackend, Schema } from "firebase/ai";

class GeminiService implements AiService {

    ai: AI

    constructor(modelType?: string) {
        this.ai = getAI(firebaseClient, { backend: new GoogleAIBackend() });
    }

    getModels(): string[] {
        return ["gemini-2.5-flash", "gemini-2.5-pro", "gemini-2.5-flash-lite"];
    }


    calcTokenCount(model: string, prompt: string): Promise<number> {
        return getGenerativeModel(this.ai, { model: model })
            .countTokens(prompt)
            .then(response => response.totalTokens)
    }

    // Wrap in an async function so you can use await
    generateContent(model: string, prompt: string): Promise<any> {
        // To generate text output, call generateContent with the text input
        console.log('generateContent', model, prompt)
        return getGenerativeModel(this.ai, { model: model })
            .generateContent(prompt)
            .then(result => result.response.text())
            .catch(error => {
                console.error("Error querying AI: ", error);
                throw new Error("Failed to query AI: " + error.message);
            });
    }

    // Wrap in an async function so you can use await
    generateParameterizedContent(model: string, prompt: string, schemaParams: string[]): Promise<any> {
        // Provide a JSON schema object using a standard format.
        // Later, pass this schema object into `responseSchema` in the generation config.
        const schema = Schema.object({
            properties: {
                characters: Schema.array({
                    items: Schema.object({
                        properties: Object.fromEntries(schemaParams.map(field => [field, Schema.string()]))
                    }),
                }),
            }
        });

        // Create a `GenerativeModel` instance with a model that supports your use case
        const jModel = getGenerativeModel(this.ai, {
            model: model,
            // In the generation config, set the `responseMimeType` to `application/json`
            // and pass the JSON schema object into `responseSchema`.
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: schema
            },
        });

        // To generate text output, call generateContent with the text input
        return jModel.generateContent(prompt)
            .then(result => {
                const content = result.response.text();
                return JSON.parse(content).characters[0]
            })
            .catch(error => {
                console.error("Error querying AI: ", error);
                throw new Error("Failed to query AI: " + error.message);
            });
    }

}

export { GeminiService };

