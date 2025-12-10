/**
 *  AiService.ts
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
export interface AiService {

    calcTokenCount(request: string): Promise<number>;

    generateContent(prompt: string): Promise<string>;

    generateParameterizedContent(prompt: string, schemaParams: string[]): Promise<any>;

}