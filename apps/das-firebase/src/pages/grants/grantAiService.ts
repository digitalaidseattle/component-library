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



import { firebaseClient } from "@digitalaidseattle/firebase";
import { getAI, getGenerativeModel, GoogleAIBackend, Schema } from "firebase/ai";

class GrantAiService {

    ai = getAI(firebaseClient, { backend: new GoogleAIBackend() });

    // Provide a JSON schema object using a standard format.
    // Later, pass this schema object into `responseSchema` in the generation config.
    jsonSchema = Schema.object({
        properties: {
            characters: Schema.array({
                items: Schema.object({
                    properties: {
                        name: Schema.string(),
                        description: Schema.string(),
                        email: Schema.number(),
                        phone: Schema.string(),
                        address: Schema.string(),
                        contact: Schema.string(),
                    }
                }),
            }),
        }
    });

    // Create a `GenerativeModel` instance with a model that supports your use case
    model = getGenerativeModel(this.ai, {
        model: "gemini-2.5-flash"
    });


    // Wrap in an async function so you can use await
    query(prompt: string): Promise<any> {
        // To generate text output, call generateContent with the text input
        console.log("Querying AI with prompt: ", prompt, this.model);
        return this.model.generateContent(prompt)
            .then(result => result.response.text())
            .catch(error => {
                console.error("Error querying AI: ", error);
                throw new Error("Failed to query AI: " + error.message);
            });
    }

}

const grantAiService = new GrantAiService();
export { grantAiService };

