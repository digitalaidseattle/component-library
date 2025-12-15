/**
 *  AiServiceContext.ts
 * 
 *  DI for ai service context
 * 
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import React, { ReactNode, createContext, useContext } from 'react';
import { AiService } from '../api';

class DefaultService implements AiService {
    getModels(): string[] {
        throw new Error('No service provided.');
    }
    calcTokenCount(_model: string, _request: string): Promise<number> {
        throw new Error('No service provided.');
    }
    generateContent(_model: string, _prompt: string): Promise<string> {
        throw new Error('No service provided.');
    }
    generateParameterizedContent(_model: string, _prompt: string, _schemaParams: string[]): Promise<any> {
        throw new Error('No service provided.');
    }

}

// Create a context for the dependency
const AiServiceContext = createContext<AiService>(new DefaultService());

export const AiServiceContextProvider: React.FC<{ aiService: AiService, children: ReactNode }> = ({ aiService, children }) => (
    <AiServiceContext.Provider value={aiService}>
        {children}
    </AiServiceContext.Provider>
);

// Hook to use the dependency
export const useAiService = () => {
    return useContext(AiServiceContext);
};