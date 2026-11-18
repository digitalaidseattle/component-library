/**
 *  ProgramContext.ts
 *  * 
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import React from 'react';
import { Program } from '../types';

interface ProgramContextType {
    program: Program,
    setProgram: (program: Program) => void
}

export const ProgramContext = React.createContext<ProgramContextType>({
    program: {} as Program,
    setProgram: () => { }
});

