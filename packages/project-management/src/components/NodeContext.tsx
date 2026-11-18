/**
 *  ProgramContext.ts
 *  * 
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import React from 'react';
import { Node } from '../types';

interface NodeContextType {
    node: Node,
    setNode: (node: Node) => void
}

export const NodeContext = React.createContext<NodeContextType>({
    node: {} as Node,
    setNode: () => { }
});

