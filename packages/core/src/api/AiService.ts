/**
 *  AiService.ts
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
export interface AiService {

    getModels(): string[];

    calcTokenCount(model: string, request: string): Promise<number>;

    generateContent(model: string, prompt: string): Promise<string>;

    generateParameterizedContent(model: string, prompt: string, schemaParams: string[]): Promise<any>;

}