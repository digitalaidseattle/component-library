export interface AiService {
    calcTokenCount(request: string): Promise<number>;

    // Wrap in an async function so you can use await
    generateContent(prompt: string): Promise<string>;
    // Wrap in an async function so you can use await
    generateParameterizedContent(prompt: string, schemaParams: string[]): Promise<any>;

}